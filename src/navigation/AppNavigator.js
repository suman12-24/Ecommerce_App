import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductsScreen from '../screens/ProductsScreen';
import BagScreen from '../screens/BagScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F5F5F7' },
        }}
      >
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Bag" component={BagScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
