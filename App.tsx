import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Copy, Home, Settings, Users } from 'lucide-react-native';
import { View, Text } from 'react-native';

import CirclesScreen from './screens/Circles';
import HomeScreen from './screens/Home';
import SettingsScreen from './screens/Settings';
import SOSScreen from './screens/SOS';
import StatusScreen from './screens/Status';

import './global.css';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#1F2937',
            borderTopColor: '#374151',
            paddingVertical: 10,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconColor = focused ? '#F97316' : '#6B7280';

            const icons: Record<string, JSX.Element> = {
              Home: <Home color={iconColor} size={size} />,
              Circles: <Copy color={iconColor} size={size} />,
              SOS: (
                <View className="bg-red-600 w-14 h-14 mb-3 rounded-full justify-center items-center">
                  <Text className="text-white font-semibold text-base">SOS</Text>
                </View>
              ),
              Status: <Users color={iconColor} size={size} />,
              Settings: <Settings color={iconColor} size={size} />,
            };

            return icons[route.name] || <Home color={iconColor} size={size} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Circles" component={CirclesScreen} />
        <Tab.Screen name="SOS" component={SOSScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
