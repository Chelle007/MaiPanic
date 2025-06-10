import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AlertTriangle, Copy, Home, Settings, Users } from 'lucide-react-native';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CirclesScreen from './screens/Circles';
import HomeScreen from './screens/Home';
import SettingsScreen from './screens/Settings';
import SOSScreen from './screens/SOS';
import StatusScreen from './screens/Status';

//For homepage screens
import BombSheltersScreen from './screens/Bombshelters';


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
                <View className="bg-red-600 w-12 h-12 rounded-full justify-center items-center">
                  <AlertTriangle color="white" size={20} />
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

//Root app with stack navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="BombShelters" component={BombSheltersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}