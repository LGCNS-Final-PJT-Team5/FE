import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import {SocialLoginContainer} from '../../containers/Register/SocialLoginContainer';
import RegisterContainer from '../../containers/Register/RegisterContainer';
import {NavigationContainer} from '@react-navigation/native';
import {useAuthStore} from '../../store/useAuthStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={SocialLoginContainer} />
            <Stack.Screen name="Register" component={RegisterContainer} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
