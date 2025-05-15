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
const Templates = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Templates</ThemedText>
    </ThemedView>
  )
}

export default Templates

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
})