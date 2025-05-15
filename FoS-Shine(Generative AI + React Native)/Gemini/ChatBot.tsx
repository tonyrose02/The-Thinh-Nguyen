import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { auth } from '../firebase';
import { saveChat, getPastChats, getCompanyByCompanyId, getGeminiKey } from '../firebase';
import { chrisAIInstructions } from '../constants/AIconstants';
import { comedySettingOptions } from '../constants/AIconstants';// Assuming comedy settings are in this file
import * as GoogleGenerativeAI from '@google/generative-ai';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Message {
  sender: 'User' | 'ChrisAI';
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [geminiChatId] = useState<string>(uuidv4());
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [company, setCompany] = useState<{ id?: string; name?: string } | null>(null);
  const [isIntroduced, setIsIntroduced] = useState<boolean>(false);
  const [comedySetting, setComedySetting] = useState<number>(5); // Default to neutral
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
      setUserName(user.displayName || 'User');
    }
  }, []);

  useEffect(() => {
    const fetchGeminiKey = async () => {
      try {
        const key = await getGeminiKey();
        setGeminiApiKey(key as string);
      } catch (error) {
        console.error('Error fetching Gemini API key:', error);
      }
    };
    fetchGeminiKey();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        try {
          const companyData = await getCompanyByCompanyId(uid);
          setCompany(companyData || null);

          const chats = await getPastChats({ userId: uid });
          const chatArray = Array.isArray(chats) ? chats : [];

          if (chatArray.length > 0) {
            const welcomeBackMessage: Message = {
              sender: 'ChrisAI',
              text: `Welcome back, ${userName}! Let me know how I can assist you further.`,
            };

            setMessages([welcomeBackMessage]);
            setIsIntroduced(true);
          } else {
            startChat();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [uid, userName]);

  const startChat = async () => {
    if (!geminiApiKey) {
      console.error('Gemini API key is not available.');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: chrisAIInstructions,
      });

      const result = await model.generateContent(`Introduce yourself to ${userName}`);
      const initialMessage: Message = {
        sender: 'ChrisAI',
        text: `Hello ${userName}! How can I assist you today?`,
      };

      setMessages([initialMessage]);
      setIsIntroduced(true);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    if (!geminiApiKey) {
      console.error('Gemini API key is not available.');
      return;
    }

    setLoading(true);

    const userMessage: Message = { sender: 'User', text: userInput };
    const updatedChat = [...messages, userMessage];

    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `${chrisAIInstructions} Comedy setting: ${comedySetting}/10.`,
      });

      const result = await model.generateContent(userInput);
      const aiMessage: Message = {
        sender: 'ChrisAI',
        text: result?.response?.text?.() || 'I’m sorry, I didn’t understand that.',
      };

      const newChat = [...updatedChat, aiMessage];
      setMessages(newChat);

      await saveChat(geminiChatId, newChat, company?.id, company?.name);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      setUserInput('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const profileImageUrl = auth.currentUser?.photoURL;

    return (
      <View style={styles.messageContainer}>
        <Image
          source={
            item.sender === 'User'
              ? profileImageUrl
                ? { uri: profileImageUrl }
                : require('../assets/images/default_pfp.png')
              : require('../assets/images/chrisai.png')
          }
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.senderTag}>
            {item.sender === 'User' ? userName : item.sender}
          </Text>
        </View>
      </View>
    );
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const selectComedySetting = (index: number) => {
    setComedySetting(index + 1); // Comedy settings are 1-based
    toggleDrawer();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <MaterialIcons
          name="arrow-circle-up"
          size={32}
          onPress={sendMessage}
          style={styles.sendIcon}
        />
        <MaterialIcons
          name="settings-suggest"
          size={32}
          onPress={toggleDrawer}
          style={styles.settingsIcon}
        />
      </View>

      {/* Drawer for Comedy Setting */}
      <Modal visible={drawerVisible} animationType="slide" transparent>
        <View style={styles.drawerContainer}>
          <ScrollView>
            <Text style={styles.drawerTitle}>Comedy Setting</Text>
            {comedySettingOptions.map((option, index) => (
              <TouchableOpacity
                key={index as number}
                style={styles.settingOption}
                onPress={() => selectComedySetting(index as number)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 5,
  },
  textContainer: {
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  senderTag: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    textAlign: 'left',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 5,
  },
  sendIcon: {
 
  },
  settingsIcon: {
    marginLeft: 10,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 'auto',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});

export default ChatBot;
