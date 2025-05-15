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
const SkinData = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>SkinData</ThemedText>
    </ThemedView>
  )
}

export default SkinData

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
})
