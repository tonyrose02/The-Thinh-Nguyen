import { Appearance, StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { auth, doSignInWithEmailAndPassword } from '../firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputTextColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'text');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  // Google Sign-In with expo-auth-session
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({
      native: `com.fos.shine:/oauth2redirect/google`
    }),
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const { companyId } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          console.log('Google sign-in successful');
        })
        .catch((error) => {
          console.error('Google sign-in error:', error);
        });
    }
  }, [response]);


  
  const handleLogin = async () => {
    try {
      setError(null); // Clear any previous error
      const { result, error } = await doSignInWithEmailAndPassword(auth, email, password);

      if (result) {
        console.log('User logged in successfully');
        // Perform any additional logic after successful login (e.g., navigation, state updates)
      } else {
        setError(error || 'Failed to log in. Please check your email and password.');
        console.error('Login error:', error);
      }
    } catch (error) {
      setError('An unexpected error occurred during login.');
      console.error('Unexpected login error:', error);
    }
  };



  return (
    <ThemedView style={styles.container}>
      {/* FoS Logo */}
      <ThemedView style={styles.logoContainer}>
        <Image source={require('../assets/images/FoS_Logo.png')} style={styles.logo} />
      </ThemedView>
      {/* Email Input */}
      <ThemedView style={styles.inputContainer}>
        <TextInput
          placeholder="Email Address *"
          placeholderTextColor={placeholderColor}
          style={[styles.input, { color: inputTextColor }]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </ThemedView>
      {/* Password Input */}
      <ThemedView style={styles.inputContainer}>
        <TextInput
          placeholder="Password *"
          placeholderTextColor={placeholderColor}
          style={[styles.input, { color: inputTextColor }]}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <MaterialIcons
            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
            size={20}
            color="#436623"
            style={styles.icon}
          />
        </TouchableOpacity>
      </ThemedView>
      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          LOGIN
        </ThemedText>
      </TouchableOpacity>
      {error && <ThemedText style={{ color: 'red' }}>{error}</ThemedText>}
      {/* Dashed Line */}
      <View style={styles.dashedLine} />
      {/* Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        {/* Google logo */}
        <Image source={require('../assets/images/google_icon.png')} style={styles.googleButtonLogo}/>
        <ThemedText type="defaultSemiBold" style={styles.googleButtonText}>
          SIGN IN WITH GOOGLE
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    height: '30%',
  },
  logo: {
    resizeMode: 'contain',
    height: '100%',
    marginBottom: 100,
    aspectRatio: 1,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    flex: 1,
    height: 40,
  },
  icon: {
    padding: 5,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
  googleButtonLogo: {
    width: 25, 
    height: 25,
  },
  googleButtonText: {
    marginLeft: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  dashedLine: {
    borderStyle: 'solid',
    borderColor: '#aaa',
    borderWidth: 1,
    width: '100%',
    marginVertical: 10,
    marginTop: 20,
  },
});
