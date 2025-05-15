import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { ThemedText } from './components/ThemedText'
import { ThemedView } from './components/ThemedView'
import { useThemeColor } from './hooks/useThemeColor'
import React from 'react'

// Icons for drawers
import { Entypo } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Screens imports
import ChrisAI from './screens/ChrisAI';
import Templates from './screens/Templates';
import SkinData from './screens/SkinData';
import Products from './screens/Products';
import Ingredients from './screens/Ingredients';
import Orders from './screens/Orders';
import Account from './screens/Account';
import Login from './screens/Login';
import CompanySelector from './screens/CompanySelector';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import CustomDrawer from './screens/Drawer/CustomDrawer';

// Define the navigation types
export type RootStackParamList = {
  Login: undefined;
  AccountScreen: undefined;
  CompanySelector: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companySelected, setCompanySelected] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Authentication state changed:', user);
      setIsAuthenticated(!!user);
      if (!user) {
        setCompanySelected(null);
      }
    });

    return unsubscribe;
  }, []);

  const DrawerNavigation = () => {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        initialRouteName="ChrisAI"
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            backgroundColor: backgroundColor,
          },
          drawerLabelStyle: {
            color: textColor,
          },
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: textColor,
        }}
      >
        <Drawer.Screen
          name="Orders"
          component={Orders}
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <Entypo name="shopping-cart" size={24} color={textColor} />
                <ThemedText style={styles.text}>Orders</ThemedText>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Ingredients"
          component={Ingredients}
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <MaterialIcons name="menu-book" size={24} color={textColor} />
                <ThemedText style={styles.text}>Ingredients</ThemedText>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Products"
          component={Products}
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <MaterialIcons name="inventory" size={24} color={textColor} />
                <ThemedText style={styles.text}>Products</ThemedText>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="SkinData"
          component={SkinData}
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <MaterialCommunityIcons name="face-man-shimmer" size={24} color={textColor} />
                <ThemedText style={styles.text}>Skin Data</ThemedText>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Templates"
          component={Templates}
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color={textColor} />
                <ThemedText style={styles.text}>Templates</ThemedText>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="ChrisAI"
          component={(ChrisAI)}
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <MaterialIcons name="auto-awesome" size={24} color={textColor} />
                <ThemedText style={styles.text}>Chris AI</ThemedText>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Account"
          options={{
            drawerLabel: () => (
              <View style={styles.drawerItem}>
                <MaterialIcons name="group" size={24} color={textColor} />
                <ThemedText style={styles.text}>Account</ThemedText>
              </View>
            ),
          }}
        >
          {() => <Account selectedCompany={companySelected || "No company selected"} />}
        </Drawer.Screen>


      </Drawer.Navigator>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          ) : !companySelected ? (
              <Stack.Screen
                name="CompanySelector"
                options={{ title: "Select Your Company", headerShown: false }}
              >
                {() => (
                  <CompanySelector
                    onCompanySelected={(companyName: string) => setCompanySelected(companyName)}
                  />
                )}
              </Stack.Screen>

          ) : (
            <Stack.Screen
              name="AccountScreen"
              component={DrawerNavigation}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    paddingHorizontal: 16,
  },
  text: {
    marginLeft: 40,
    textAlign: 'center',
  },
});
