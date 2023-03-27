/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/* eslint-disable */


import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckPriceStatusComponent from './src/CheckPriceStatusComponent';
import SaveSettings from './src/SaveSettings';
import Login from './src/Login';
// import BarcodeScanner from './src/BarcodeScanner';
import { GoogleSignin,} from '@react-native-google-signin/google-signin';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createNativeStackNavigator();


GoogleSignin.configure({
  iosClientId:'24458523336-c42mlaot9da0oaakp6s54qhu5o8vbmao.apps.googleusercontent.com',
  hostedDomain: 'windsorstore.com', // specifies a hosted domain restriction
});

const App = () => {
  
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login',headerShown:false}}
        />
        <Stack.Screen
          name="Settings"
          component={SaveSettings}
          options={{title: 'Settings',headerShown:false}}
        />
                {/* <Stack.Screen
          name="Camera"
          component={BarcodeScanner}
          options={{title: 'Camera',headerShown:true,}}
        /> */}
        <Stack.Screen name="price" 
        options={{title: 'Check Product Price',headerShown:false}}
        component={CheckPriceStatusComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
