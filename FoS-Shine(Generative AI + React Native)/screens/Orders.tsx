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

const Orders = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Orders</ThemedText>
    </ThemedView>
  )
}


export default Orders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
})

