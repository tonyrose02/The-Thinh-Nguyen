import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer'

const CustomDrawer = (props: any) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Image source={require('../../assets/images/FoS_Logo.png')}
          style={styles.logo} />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
logo:{
    width: 150, height: 150, alignSelf: 'center', marginTop: 20
}
})
