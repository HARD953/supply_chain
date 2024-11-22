import { View, Text } from 'react-native';
import React, {useState,useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigue from './Navigate';

const Stack=createStackNavigator();

const Navigators = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Navigue" component={Navigue} options={{ headerShown:false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigators;