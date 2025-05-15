import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { auth } from '../firebase';
import { RootStackParamList } from '../App';

// Assuming the selected company is passed as a prop or available in a global state/context
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AccountScreen'>;

type AccountProps = {
  selectedCompany: string;  // Changed to string to display company name
};

const Account = ({ selectedCompany }: AccountProps) => {
  const navigation = useNavigation<NavigationProp>();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => alert(error.message));
  };

  const profileImageUrl = auth.currentUser?.photoURL;

  return (
    <ThemedView style={styles.container}>
      {profileImageUrl && (
        <Image
          source={{ uri: profileImageUrl }}
          style={styles.profileImage}
        />
      )}
      <ThemedText>Email: {auth.currentUser?.email}</ThemedText>

      {/* Display the selected company name */}
      {selectedCompany && (
        <ThemedText>Company: {selectedCompany}</ThemedText>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <ThemedText style={styles.buttonText}>SIGN OUT</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#436623',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  companyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
