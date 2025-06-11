import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsHome from '../screens/Settings';
import EmergencyProfile from '../screens/EmergencyProfile';
import EmergencyContacts from '../screens/EmergencyContacts';
import Preferences from '../screens/Preferences';
import HelpSupport from '../screens/HelpSupport';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  EmergencyProfile: undefined;
  EmergencyContacts: undefined;
  Preferences: undefined;
  HelpSupport: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="SettingsHome" component={SettingsHome} options={{ title: 'Settings' }} />
    <Stack.Screen name="EmergencyProfile" component={EmergencyProfile} />
    <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
    <Stack.Screen name="Preferences" component={Preferences} />
    <Stack.Screen name="HelpSupport" component={HelpSupport} />
  </Stack.Navigator>
);

export default SettingsStack;
