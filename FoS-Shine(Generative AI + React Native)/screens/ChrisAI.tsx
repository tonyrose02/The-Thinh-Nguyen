// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
// import { Drawer } from 'react-native-drawer-layout';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { comedySettingOptions } from '../constants/AIconstants'; // Import the options
// import { ThemedView } from '../components/ThemedView';
// import {
//   saveChat,
//   getPastChats,
//   getCompanyByCompanyId,
//   getGeminiKey,
// } from '../firebase'; // Import the cloud functions
// import { v4 as uuidv4 } from 'uuid';
// import ChatBot from '../Gemini/ChatBot';
 
// interface Chat {
//   chatId: string;
//   sender: string;
//   text: string;
//   // You can add more fields if needed
// }
 
// const ChrisAI = ({ companyId }: { companyId: string }) => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(comedySettingOptions[4]);
//   const [pastChats, setPastChats] = useState<Chat[]>([]); // Store the past chat history
//   const [company, setCompany] = useState<any | null>(null);
//   const [userInput, setUserInput] = useState<string>(''); // User input for chat
//   const [aiResponse, setAiResponse] = useState<string>(''); // AI's response
//   const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null); // Gemini API key
//   // const [geminiChatId, setGeminiChatId] = useState(uuidv4());
//   // Fetch company details based on companyId
//   useEffect(() => {
//     if (companyId) {
//       getCompanyByCompanyId(companyId).then((companyData) => setCompany(companyData));
//     }
//   }, [companyId]);
 
//   // Fetch past chats for the company
//   useEffect(() => {
//     if (companyId) {
//       getPastChats(companyId).then((chats) => {
//         setPastChats(chats as Chat[]); // Type assertion
//       });
//     }
//   }, [companyId]);
 
//   // Fetch Gemini API key
//   useEffect(() => {
//     getGeminiKey().then((key) => setGeminiApiKey(key as string | null));
//   }, []);
 
 
//   // Handle sending a chat to the AI
//   const handleSendChat = async () => {
//     if (!userInput.trim()) {
//       return; // Don't send if the input is empty
//     }
 
//     // Assuming we have an AI function that gives us a response (mocking this for now)
//     const aiGeneratedResponse = `AI Response to: "${userInput}"`; // Replace with actual AI call
 
//     setAiResponse(aiGeneratedResponse); // Update with AI response
 
//     // Save the chat
//     if (company && geminiApiKey) {
//       const chatId = `${new Date().getTime()}`; // Generate a unique chat ID
//       const userMessage = { sender: 'user', text: userInput}
//       const chatContent =  [...aiGeneratedResponse , userMessage]; // Combine user input and AI response
//       try {
//         console.log('Sending message to AI...');
//         const result = await saveChat(chatId, chatContent, companyId, company.name);
//         console.log('Chat saved:', result);
//       }catch(error)
//       {
//         console.error('Error saving', error);
//       }
     
//     }
//     // Clear input after sending
//     setUserInput('');
//   };
 
//   // Handle saving a previous chat
//   const handleSaveChat = async (chatId: string, chatContent: string) => {
//     if (company) {
//       try{
//         const result = await saveChat(chatId, chatContent, companyId, company.name);
//         console.log('Chat saved', result);
//       }catch(error)
//       {
//         console.error('Error handle saving',error)
//       }
 
//     }
//   };
 
//   return (
//     <Drawer
//       open={drawerOpen}
//       onOpen={() => setDrawerOpen(true)}
//       onClose={() => setDrawerOpen(false)}
//       drawerStyle={styles.drawer}
//       drawerPosition="right"
//       renderDrawerContent={() => (
//         <SafeAreaView style={styles.drawerContent}>
//           <Text style={styles.drawerText}>ChrisAI Settings</Text>
//           <Text style={styles.label}>Select Comedy Setting:</Text>
//           <TouchableOpacity
//             style={styles.selectButton}
//             onPress={() => setModalVisible(true)}
//           >
//             <Text>{selectedOption}</Text>
//           </TouchableOpacity>
 
//           <Modal
//             visible={modalVisible}
//             transparent={true}
//             animationType="slide"
//             onRequestClose={() => setModalVisible(false)}
//           >
//             <View style={styles.modalBackground}>
//               <View style={styles.modalContent}>
//                 <FlatList
//                   data={comedySettingOptions} // Use comedySettingOptions here
//                   keyExtractor={(item) => item}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => {
//                         setSelectedOption(item);
//                         setModalVisible(false);
//                       }}
//                     >
//                       <Text style={styles.modalOption}>{item}</Text> {/* This is fine */}
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             </View>
//           </Modal>
 
//           {/* <Text style={styles.pastChatsLabel}>Past Chats</Text> */}
//           {/* {pastChats.length > 0 ? (
//             <FlatList
//               data={pastChats}
//               keyExtractor={(chat) => chat.chatId}
//               renderItem={({ item }) => (
//                 <View style={styles.chatItem}>
//                   <Text>{item.text}</Text> {/* Display chat text */}
//                   {/* <TouchableOpacity
//                     onPress={() => handleSaveChat(item.chatId, item.text)}
//                   >
//                     <Text style={styles.saveChatText}>Save Chat</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             />
//           ) : (
//             <Text>No past chats available.</Text>
//           )} } */}
 
//           {/* Chat input and send button */}
//           {/* <View style={styles.chatContainer}>
//             <TextInput
//               style={styles.chatInput}
//               placeholder="Type your message..."
//               value={userInput}
//               onChangeText={setUserInput}
//             />
//             <TouchableOpacity style={styles.sendButton} onPress={handleSendChat}>
//               <Text style={styles.sendButtonText}>Send</Text>
//             </TouchableOpacity>
//           </View>
 
//           {/* AI's response display */}
//           {/* {aiResponse && (
//             <View style={styles.aiResponseContainer}>
//               <Text style={styles.aiResponseText}>AI Response:</Text>
//               <Text>{aiResponse}</Text>
//             </View>
//           )} } */}
//         </SafeAreaView>
//       )}
//     >
//       <View style={{ flex: 1 }}>
//         <ThemedView style={[styles.container, { flex: 1 }]}>
//           <ChatBot/>
//           <View style={styles.iconContainer}>
//             <MaterialIcons
//               name="settings-suggest"
//               size={24}
//               onPress={() => setDrawerOpen((prevOpen) => !prevOpen)}
//             />
//           </View>
//         </ThemedView>
//       </View>
//     </Drawer>
//   );
// };
 
// export default ChrisAI;
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   iconContainer: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   drawer: {
//     width: 250,
//   },
//   drawerContent: {
//     flex: 1,
//     padding: 16,
//   },
//   drawerText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   selectButton: {
//     padding: 5,
//     borderWidth: 1,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: 200,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//   },
//   modalOption: {
//     padding: 10,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   pastChatsLabel: {
//     fontSize: 16,
//     marginTop: 20,
//   },
//   chatItem: {
//     marginBottom: 10,
//   },
//   saveChatText: {
//     color: 'blue',
//     marginTop: 5,
//   },
//   chatContainer: {
//     marginTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   chatInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: 'gray',
//     padding: 10,
//     borderRadius: 4,
//   },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 4,
//   },
//   sendButtonText: {
//     color: 'white',
//   },
//   aiResponseContainer: {
//     marginTop: 20,
//   },
//   aiResponseText: {
//     fontWeight: 'bold',
//   },
// });

import {
  Appearance,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native'
import React from 'react'
import { ThemedView } from '../components/ThemedView'
import { ThemedText } from '../components/ThemedText'
import { useThemeColor } from '../hooks/useThemeColor'
import ChatBot from '../Gemini/ChatBot'
// Navigation
import { RootStackParamList } from '../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
 
// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChrisAI'>
 
const ChrisAI = () => {
  return (
    <ThemedView style={styles.container}>
      <ChatBot/>
    </ThemedView>
  )
}
 
export default ChrisAI
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
 
 
 