import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
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
  const stackNavigation = useNavigation(); // This gets the stack navigator

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={({ state, descriptors, navigation }) => (
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
        )}
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
      </Tab.Navigator>

      <SOSModal
        visible={isSOSModalVisible}
        onClose={() => setIsSOSModalVisible(false)}
        navigation={stackNavigation} // Pass the stack navigation object
      />
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}