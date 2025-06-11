import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Copy, Users, Settings } from 'lucide-react-native';
import { TouchableOpacity, View, Text } from 'react-native';

import SOSModal from './components/SOSModal';
import HomeScreen from './screens/Home';
import CirclesScreen from './screens/Circles';
import StatusScreen from './screens/Status';
import SettingsStack from './navigation/SettingsStack';
import SOSScreen from './screens/SOS';
import ReportScreen from './screens/Report';
import BombSheltersScreen from './screens/BombShelters';

import './global.css'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create a wrapper component for the Tab Navigator
function MainTabNavigator() {
  const [isSOSModalVisible, setIsSOSModalVisible] = useState(false);
  const tabNavigationRef = useRef<any>(null);

  // Function to handle navigation from modal
  const handleNavigateFromModal = (screenName: string) => {
    setIsSOSModalVisible(false);

    // Use a more immediate approach
    if (tabNavigationRef.current) {
      tabNavigationRef.current.navigate(screenName);
    } else {
      setTimeout(() => {
        tabNavigationRef.current.navigate(screenName);
      }, 100);
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={({ state, descriptors, navigation }) => {
          // Capture the navigation object in ref
          tabNavigationRef.current = navigation;
          return (
            <View className="flex-row h-20 bg-gray-900 border-t border-gray-700 px-4 justify-between items-center">
              {state.routes
                .filter(route => route.name !== 'Report') // Filter out the hidden Report screen
                .map((route, index) => {
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
        <Tab.Screen name="SOS" component={SOSScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} />
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
        onNavigate={handleNavigateFromModal}
      />
    </>
  );
}

// Main App component with Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="BombShelters" component={BombSheltersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}