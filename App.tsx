import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Copy, Home, Settings, Users, X, AlertTriangle } from 'lucide-react-native';
import { useState, useCallback, useRef } from 'react';
import { 
  Modal, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert, 
  StyleSheet, 
  Dimensions, 
  ViewStyle, 
  PanResponder,
  LayoutChangeEvent 
} from 'react-native';

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

  const [sliderValue, setSliderValue] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [containerWidth, setContainerWidth] = useState(200);
  const sliderContainerRef = useRef<View>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSliding(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.min(100, Math.max(0, (gestureState.moveX / containerWidth) * 100));
        setSliderValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeDistance = gestureState.dx;
        const isActivated = swipeDistance > containerWidth * 0.6; // Require 60% of the width
        
        if (isActivated && !isSOSActive) {
          setIsSOSActive(true);
          setSliderValue(100);
          Alert.alert(
            'SOS Activated',
            'Emergency services and your emergency contacts have been notified.'
          );
        } else if (isSOSActive) {
          // Reset if already active
          setIsSOSActive(false);
          setSliderValue(0);
          Alert.alert(
            'SOS Deactivated',
            'SOS has been deactivated.'
          );
        } else {
          // Reset if not activated
          setSliderValue(0);
        }
        setIsSliding(false);
      },
      onPanResponderTerminate: () => {
        setSliderValue(0);
        setIsSliding(false);
      }
    })
  ).current;

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
              {/* <View style={styles.sosButton}>
                <Text style={styles.sosText}>SOS</Text>
              </View> */}
              <View style={styles.sliderContainer}>
                <View 
                  style={styles.sliderTrack}
                  onLayout={handleLayout}
                  ref={sliderContainerRef}
                  {...panResponder.panHandlers}
                >
                  <View style={styles.sliderFill} />
                  <View 
                    style={[
                      styles.sliderKnob,
                      {
                        transform: [
                          { translateX: Math.min(
                            containerWidth - 50, 
                            Math.max(0, (sliderValue / 100) * (containerWidth - 50))
                          )}
                        ]
                      }
                    ]}
                  >
                    <Text style={styles.sosIcon}>SOS</Text>
                  </View>
                  <Text style={styles.sliderLabel}>
                    {isSOSActive ? 'Release to confirm' : 'Slide to activate SOS'}
                  </Text>
                </View>
              </View>
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
    // backgroundColor: '#374151',
    // borderRadius: 12,
    // padding: 12,
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
  sliderContainer: {
    flex: 1,
    // marginLeft: 12,
    height: 64,
    justifyContent: 'center',
  },
  sliderLabel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  
    color: '#E5E7EB',
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '500',
    textAlign: 'center',
    zIndex: 1,
  },  
  sliderTrack: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 27,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sliderFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 27,
    width: '100%',
  },
  sliderKnob: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    left: 4,
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 2,
  },
  sosIcon: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 16,
  }
});
