import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Copy, Home, Settings, Users, X, AlertTriangle } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { Modal, Text, TouchableOpacity, View, Alert, StyleSheet, Dimensions, ViewStyle } from 'react-native';

import CirclesScreen from './screens/Circles';
import HomeScreen from './screens/Home';
import SettingsScreen from './screens/Settings';
import StatusScreen from './screens/Status';

import './global.css';

type RootTabParamList = {
  Home: undefined;
  Circles: undefined;
  SOS: undefined;
  Status: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_WIDTH = SCREEN_WIDTH * 0.9;

// Custom tab bar component
function CustomTabBar({ state, descriptors, navigation }: any) {
  const [isSOSModalVisible, setIsSOSModalVisible] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);

  const toggleSOS = useCallback(() => {
    const newState = !isSOSActive;
    setIsSOSActive(newState);
    Alert.alert(
      newState ? 'SOS Activated' : 'SOS Deactivated',
      newState 
        ? 'Emergency services and your emergency contacts have been notified.'
        : 'SOS has been deactivated.'
    );
  }, [isSOSActive]);

  const handleReportIncident = useCallback(() => {
    Alert.alert('Report Incident', 'Incident reporting functionality will be implemented here.');
  }, []);

  return (
    <>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconColor = isFocused ? '#F97316' : '#6B7280';
          const size = 24;

          let icon: JSX.Element;
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
            default:
              icon = <Home color={iconColor} size={size} />;
          }

          const onPress = () => {
            if (route.name === 'SOS') {
              setIsSOSModalVisible(true);
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'SOS') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.sosTabButton}
                activeOpacity={0.8}
              >
                <View className="bg-red-600 w-14 h-14 mb-3 rounded-full justify-center items-center">
                  <Text className="text-white font-semibold text-base">SOS</Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SOS Modal */}
      <Modal
        visible={isSOSModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSOSModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setIsSOSModalVisible(false)}
        >
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsSOSModalVisible(false)}
              >
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={handleReportIncident}
              activeOpacity={0.8}
            >
              <AlertTriangle size={20} color="white" style={styles.reportIcon} />
              <Text style={styles.reportText}>Report incident</Text>
            </TouchableOpacity>

            <View style={styles.sosContainer}>
              <View style={styles.sosButton}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
              <TouchableOpacity 
                style={styles.toggleContainer}
                onPress={toggleSOS}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.toggleTrack,
                  isSOSActive && styles.toggleTrackActive
                ]}>
                  <View style={[
                    styles.toggleThumb,
                    isSOSActive && styles.toggleThumbActive
                  ]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Circles" component={CirclesScreen} />
        <Tab.Screen 
          name="SOS" 
          component={HomeScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
            },
          }}
        />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Add these styles to the existing styles object
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#1F2937',
    borderTopColor: '#374151',
    borderTopWidth: 1,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sosTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: MODAL_WIDTH,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reportIcon: {
    marginRight: 12,
  },
  reportText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
  },
  sosButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleContainer: {
    marginLeft: 'auto',
  },
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#6B7280',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: '#DC2626',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
});
