import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import type { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { Home, Copy, Users, Settings } from 'lucide-react-native';
import { TouchableOpacity, View, Text } from 'react-native';

import SOSModal from './components/SOSModal'; // Make sure this path is correct
import HomeScreen from './screens/Home';
import CirclesScreen from './screens/Circles';
import StatusScreen from './screens/Status';
import SettingsScreen from './screens/Settings';
import ReportScreen from './screens/Report'; // Add your Report screen import

import './global.css'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a wrapper component for the Tab Navigator
function MainTabNavigator() {
  const [isSOSModalVisible, setIsSOSModalVisible] = useState(false);
  const [tabNavigation, setTabNavigation] = useState<NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> | null>(null);

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={({ state, descriptors, navigation }) => {
          // Store navigation reference
          if (!tabNavigation) {
            setTabNavigation(navigation);
          }

          return (
            <View className="flex-row h-20 bg-gray-900 border-t border-gray-700 px-4 justify-between items-center">
              {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const iconColor = isFocused ? '#F97316' : '#9CA3AF';
                const size = 28;

                const onPress = () => {
                  if (route.name === 'SOS') {
                    setIsSOSModalVisible(true);
                    return;
                  }
                  navigation.navigate(route.name);
                };

                let icon = null;
                switch (route.name) {
                  case 'Home':
                    icon = <Home color={iconColor} size={size} />;
                    break;
                  case 'Circles':
                    icon = <Copy color={iconColor} size={size} />;
                    break;
                  case 'Status':
                    icon = <Users color={iconColor} size={size} />;
                    break;
                  case 'Settings':
                    icon = <Settings color={iconColor} size={size} />;
                    break;
                  case 'SOS':
                    icon = (
                      <View className="bg-red-600 w-16 h-16 rounded-full justify-center items-center shadow-lg -mt-8">
                        <Text className="text-white font-bold text-lg">SOS</Text>
                      </View>
                    );
                    break;
                }

                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    className="flex-1 items-center justify-center"
                    activeOpacity={0.8}
                  >
                    {icon}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Circles" component={CirclesScreen} />
        <Tab.Screen
          name="SOS"
          component={HomeScreen}
          listeners={{
            tabPress: (e) => e.preventDefault(), // prevent default so tab doesn't navigate
          }}
        />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen
          name="Report"
          component={ReportScreen}
          options={{
            tabBarButton: () => null, // This hides it from the tab bar
          }}
        />
      </Tab.Navigator>

      <SOSModal
        visible={isSOSModalVisible}
        onClose={() => setIsSOSModalVisible(false)}
        navigation={tabNavigation} // Use the stored navigation reference
      />
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}