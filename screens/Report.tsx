import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    SafeAreaView,
    StatusBar,
    ToastAndroid,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {
    Camera,
    MapPin,
    Users,
    Phone,
    Shield,
    Clock,
    ChevronRight,
    Heart,
    Flame,
    ShieldAlert,
    Car,
    AlertTriangle
} from 'lucide-react-native';

interface EmergencyType {
    id: string;
    icon: React.ComponentType<any>;
    label: string;
    color: string;
}

interface Notifications {
    nearbyUsers: boolean;
    trustedContacts: boolean;
    emergencyServices: boolean;
}

interface ReportProps {
    navigation?: any; // Add navigation prop
}

const Report: React.FC<ReportProps> = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [notifications, setNotifications] = useState<Notifications>({
        nearbyUsers: true,
        trustedContacts: false,
        emergencyServices: false
    });

    const emergencyTypes: EmergencyType[] = [
        { id: 'cardiac', icon: Heart, label: 'Cardiac Arrest', color: '#FF3B30' },
        { id: 'fire', icon: Flame, label: 'Fire', color: '#FF8000' },
        { id: 'robbery', icon: ShieldAlert, label: 'Robbery', color: '#FF3B30' },
        { id: 'accident', icon: Car, label: 'Accident', color: '#FF8000' },
        { id: 'other', icon: AlertTriangle, label: 'Other Emergency', color: '#FF8000' }
    ];

    // Function to show toast message
    const showToast = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            // For iOS, you can use Alert as fallback or implement a custom toast
            Alert.alert('Success', message);
        }
    };

    // Function to handle sending help request
    const handleSendHelpRequest = () => {
        // Show toast message
        showToast('Report submitted');

        // Reset form state
        setCurrentStep(1);
        setSelectedEmergency(null);
        setNotes('');
        setPhoto(null);
        setLocation(null);
        setNotifications({
            nearbyUsers: true,
            trustedContacts: false,
            emergencyServices: false
        });

        // Navigate back to home
        if (navigation) {
            navigation.navigate('Home');
        }
    };

    const handleEmergencySelect = (emergency: EmergencyType) => {
        setSelectedEmergency(emergency);
        setTimeout(() => setCurrentStep(2), 300);
    };

    const handleNotificationToggle = (type: keyof Notifications) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handlePhotoUpload = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission Required', 'Permission to access camera roll is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setPhoto(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleTakePhoto = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission Required', 'Permission to access camera is required!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setPhoto(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Permission to access location is required!');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        } catch (error) {
            Alert.alert('Error', 'Failed to get location');
        }
    };

    const getResponseTime = (type: keyof Notifications): string => {
        const times = {
            nearbyUsers: '2-5 min',
            trustedContacts: '5-10 min',
            emergencyServices: '8-15 min'
        };
        return times[type];
    };

    const showPhotoOptions = () => {
        Alert.alert(
            'Add Photo',
            'Choose an option',
            [
                { text: 'Camera', onPress: handleTakePhoto },
                { text: 'Gallery', onPress: handlePhotoUpload },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const renderStep1 = () => (
        <View className="space-y-6">
            <View className="text-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2">Choose Emergency Type</Text>
                <Text className="text-gray-400">Select the type of help you need</Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                {emergencyTypes.map((emergency) => {
                    const IconComponent = emergency.icon;
                    return (
                        <TouchableOpacity
                            key={emergency.id}
                            onPress={() => handleEmergencySelect(emergency)}
                            className={`w-[48%] p-6 rounded-2xl border-2 mb-4 ${selectedEmergency?.id === emergency.id
                                    ? 'border-orange-500 bg-orange-500 bg-opacity-20'
                                    : 'border-gray-600 bg-gray-800'
                                }`}
                        >
                            <IconComponent
                                size={40}
                                color={selectedEmergency?.id === emergency.id ? '#f97316' : '#ffffff'}
                                style={{ alignSelf: 'center', marginBottom: 12 }}
                            />
                            <Text className="text-white font-medium text-sm text-center">
                                {emergency.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View className="space-y-6">
            <View className="text-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2">Add Details</Text>
                <Text className="text-gray-400">Provide additional information (optional)</Text>
            </View>

            <View className="space-y-6">
                <View>
                    <Text className="text-white font-medium mb-3">What happened?</Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Describe the situation briefly..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white"
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>

                <View>
                    <Text className="text-white font-medium mb-3">Add Photo (Optional)</Text>
                    <TouchableOpacity
                        onPress={showPhotoOptions}
                        className="p-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl items-center justify-center"
                    >
                        {photo ? (
                            <Image source={{ uri: photo }} className="w-32 h-32 rounded-lg" />
                        ) : (
                            <View className="items-center">
                                <Camera size={32} color="#9CA3AF" style={{ marginBottom: 8 }} />
                                <Text className="text-gray-400">Tap to add photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={requestLocationPermission}
                    className="flex-row items-center p-4 bg-gray-800 rounded-xl"
                >
                    <MapPin size={20} color="#f97316" style={{ marginRight: 12 }} />
                    <View>
                        <Text className="text-white font-medium">Current Location</Text>
                        <Text className="text-gray-400 text-sm">
                            {location ? 'Location captured' : 'Tap to get GPS coordinates'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setCurrentStep(3)}
                    className="w-full bg-orange-500 py-4 rounded-xl items-center justify-center flex-row"
                >
                    <Text className="text-white font-semibold">Continue</Text>
                    <ChevronRight size={20} color="#ffffff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View className="space-y-6">
            <View className="text-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2">Who to Notify</Text>
                <Text className="text-gray-400">Choose who should receive your help request</Text>
            </View>

            <View className="space-y-4">
                <View className="p-4 bg-gray-800 rounded-xl">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1">
                            <Users size={24} color="#f97316" style={{ marginRight: 12 }} />
                            <View>
                                <Text className="text-white font-medium">Nearby Users</Text>
                                <Text className="text-gray-400 text-sm">App users within 2km radius</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNotificationToggle('nearbyUsers')}
                            className={`w-12 h-6 rounded-full justify-center ${notifications.nearbyUsers ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <View className={`w-4 h-4 bg-white rounded-full ${notifications.nearbyUsers ? 'self-end mr-1' : 'self-start ml-1'
                                }`} />
                        </TouchableOpacity>
                    </View>
                    {notifications.nearbyUsers && (
                        <View className="flex-row items-center mt-2">
                            <Clock size={16} color="#10B981" style={{ marginRight: 8 }} />
                            <Text className="text-green-500 text-sm">
                                Est. response: {getResponseTime('nearbyUsers')}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="p-4 bg-gray-800 rounded-xl">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1">
                            <Phone size={24} color="#f97316" style={{ marginRight: 12 }} />
                            <View>
                                <Text className="text-white font-medium">Trusted Contacts</Text>
                                <Text className="text-gray-400 text-sm">Your emergency contacts</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNotificationToggle('trustedContacts')}
                            className={`w-12 h-6 rounded-full justify-center ${notifications.trustedContacts ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <View className={`w-4 h-4 bg-white rounded-full ${notifications.trustedContacts ? 'self-end mr-1' : 'self-start ml-1'
                                }`} />
                        </TouchableOpacity>
                    </View>
                    {notifications.trustedContacts && (
                        <View className="flex-row items-center mt-2">
                            <Clock size={16} color="#10B981" style={{ marginRight: 8 }} />
                            <Text className="text-green-500 text-sm">
                                Est. response: {getResponseTime('trustedContacts')}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="p-4 bg-gray-800 rounded-xl">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1">
                            <Shield size={24} color="#f97316" style={{ marginRight: 12 }} />
                            <View>
                                <Text className="text-white font-medium">Emergency Services</Text>
                                <Text className="text-gray-400 text-sm">Police, Fire, Medical services</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNotificationToggle('emergencyServices')}
                            className={`w-12 h-6 rounded-full justify-center ${notifications.emergencyServices ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <View className={`w-4 h-4 bg-white rounded-full ${notifications.emergencyServices ? 'self-end mr-1' : 'self-start ml-1'
                                }`} />
                        </TouchableOpacity>
                    </View>
                    {notifications.emergencyServices && (
                        <View className="flex-row items-center mt-2">
                            <Clock size={16} color="#10B981" style={{ marginRight: 8 }} />
                            <Text className="text-green-500 text-sm">
                                Est. response: {getResponseTime('emergencyServices')}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                onPress={() => setCurrentStep(4)}
                className="w-full bg-orange-500 py-4 rounded-xl items-center justify-center flex-row"
            >
                <Text className="text-white font-semibold">Continue</Text>
                <ChevronRight size={20} color="#ffffff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
        </View>
    );

    const renderStep4 = () => (
        <View className="space-y-6">
            <View className="text-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2">Send Help Request</Text>
                <Text className="text-gray-400">Review and send your emergency request</Text>
            </View>

            <View className="space-y-4">
                <View className="p-4 bg-gray-800 rounded-xl">
                    <Text className="text-white font-medium mb-2">Emergency Type</Text>
                    <View className="flex-row items-center">
                        {selectedEmergency && (
                            <>
                                <selectedEmergency.icon size={20} color="#f97316" style={{ marginRight: 8 }} />
                                <Text className="text-gray-300">{selectedEmergency.label}</Text>
                            </>
                        )}
                    </View>
                </View>

                {notes ? (
                    <View className="p-4 bg-gray-800 rounded-xl">
                        <Text className="text-white font-medium mb-2">Additional Notes</Text>
                        <Text className="text-gray-300">{notes}</Text>
                    </View>
                ) : null}

                <View className="p-4 bg-gray-800 rounded-xl">
                    <Text className="text-white font-medium mb-2">Notifications</Text>
                    <View className="space-y-2">
                        {notifications.nearbyUsers && (
                            <View className="flex-row items-center">
                                <Users size={16} color="#D1D5DB" style={{ marginRight: 8 }} />
                                <Text className="text-gray-300">Nearby Users</Text>
                            </View>
                        )}
                        {notifications.trustedContacts && (
                            <View className="flex-row items-center">
                                <Phone size={16} color="#D1D5DB" style={{ marginRight: 8 }} />
                                <Text className="text-gray-300">Trusted Contacts</Text>
                            </View>
                        )}
                        {notifications.emergencyServices && (
                            <View className="flex-row items-center">
                                <Shield size={16} color="#D1D5DB" style={{ marginRight: 8 }} />
                                <Text className="text-gray-300">Emergency Services</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View className="space-y-3">
                <TouchableOpacity
                    onPress={handleSendHelpRequest}
                    className="w-full bg-red-500 py-4 rounded-xl items-center justify-center"
                >
                    <Text className="text-white font-bold text-lg">🚨 SEND HELP REQUEST</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCurrentStep(1)}
                    className="w-full bg-gray-700 py-3 rounded-xl items-center justify-center"
                >
                    <Text className="text-white font-medium">Start Over</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <StatusBar barStyle="light-content" backgroundColor="#111827" />
            <ScrollView className="flex-1 px-6 py-4">
                {/* Progress Indicator */}
                <View className="flex-row items-center justify-center mb-8">
                    {[1, 2, 3, 4].map((step) => (
                        <View key={step} className="flex-row items-center">
                            <View className={`w-8 h-8 rounded-full items-center justify-center ${currentStep >= step ? 'bg-orange-500' : 'bg-gray-700'
                                }`}>
                                <Text className={`text-sm font-bold ${currentStep >= step ? 'text-white' : 'text-gray-400'
                                    }`}>
                                    {step}
                                </Text>
                            </View>
                            {step < 4 && (
                                <View className={`w-12 h-1 mx-2 ${currentStep > step ? 'bg-orange-500' : 'bg-gray-700'
                                    }`} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Step Content */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}

                {/* Back Button */}
                {currentStep > 1 && currentStep < 4 && (
                    <TouchableOpacity
                        onPress={() => setCurrentStep(currentStep - 1)}
                        className="w-full mt-4 bg-gray-700 py-3 rounded-xl items-center justify-center"
                    >
                        <Text className="text-white font-medium">Back</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Report;