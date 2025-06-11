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
    navigation?: any;
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

    const handleSendHelpRequest = () => {
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

        if (navigation) {
            navigation.navigate('Home', { showSuccessToast: true });
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
        <View className="gap-6">
            <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2 text-center">Choose Emergency Type</Text>
                <Text className="text-gray-400 text-center">Select the type of help you need</Text>
            </View>

            <View className="flex-row flex-wrap justify-between gap-4">
                {emergencyTypes.map((emergency) => {
                    const IconComponent = emergency.icon;
                    const isSelected = selectedEmergency?.id === emergency.id;
                    return (
                        <TouchableOpacity
                            key={emergency.id}
                            onPress={() => handleEmergencySelect(emergency)}
                            className={`w-[47%] p-6 rounded-2xl border-2 items-center ${isSelected
                                    ? 'border-orange-500 bg-orange-500/20'
                                    : 'border-gray-600 bg-gray-800'
                                }`}
                        >
                            <View className="mb-3">
                                <IconComponent
                                    size={40}
                                    color={isSelected ? '#f97316' : '#ffffff'}
                                />
                            </View>
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
        <View className="gap-6">
            <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2 text-center">Add Details</Text>
                <Text className="text-gray-400 text-center">Provide additional information (optional)</Text>
            </View>

            <View className="gap-6">
                <View className="gap-3">
                    <Text className="text-white font-medium text-base">What happened?</Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Describe the situation briefly..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white text-base"
                        style={{ textAlignVertical: 'top', minHeight: 100 }}
                    />
                </View>

                <View className="gap-3">
                    <Text className="text-white font-medium text-base">Add Photo (Optional)</Text>
                    <TouchableOpacity
                        onPress={showPhotoOptions}
                        className="p-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl items-center justify-center"
                        style={{ minHeight: 120 }}
                    >
                        {photo ? (
                            <Image source={{ uri: photo }} className="w-32 h-32 rounded-lg" />
                        ) : (
                            <View className="items-center gap-2">
                                <Camera size={32} color="#9CA3AF" />
                                <Text className="text-gray-400 text-base">Tap to add photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={requestLocationPermission}
                    className="flex-row items-center p-4 bg-gray-800 rounded-xl gap-3"
                >
                    <MapPin size={20} color="#f97316" />
                    <View className="flex-1 gap-1">
                        <Text className="text-white font-medium text-base">Current Location</Text>
                        <Text className="text-gray-400 text-sm">
                            {location ? 'Location captured' : 'Tap to get GPS coordinates'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setCurrentStep(3)}
                    className="w-full bg-orange-500 py-4 rounded-xl items-center justify-center flex-row gap-2"
                >
                    <Text className="text-white font-semibold text-base">Continue</Text>
                    <ChevronRight size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View className="gap-6">
            <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2 text-center">Who to Notify</Text>
                <Text className="text-gray-400 text-center">Choose who should receive your help request</Text>
            </View>

            <View className="gap-4">
                <View className="p-4 bg-gray-800 rounded-xl gap-2">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 gap-3">
                            <Users size={24} color="#f97316" />
                            <View className="flex-1 gap-1">
                                <Text className="text-white font-medium text-base">Nearby Users</Text>
                                <Text className="text-gray-400 text-sm">App users within 2km radius</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNotificationToggle('nearbyUsers')}
                            className={`w-12 h-6 rounded-full justify-center p-0.5 ${notifications.nearbyUsers ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <View className={`w-4 h-4 bg-white rounded-full ${notifications.nearbyUsers ? 'self-end' : 'self-start'
                                }`} />
                        </TouchableOpacity>
                    </View>
                    {notifications.nearbyUsers && (
                        <View className="flex-row items-center mt-2 gap-2">
                            <Clock size={16} color="#10B981" />
                            <Text className="text-green-500 text-sm">
                                Est. response: {getResponseTime('nearbyUsers')}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="p-4 bg-gray-800 rounded-xl gap-2">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 gap-3">
                            <Phone size={24} color="#f97316" />
                            <View className="flex-1 gap-1">
                                <Text className="text-white font-medium text-base">Trusted Contacts</Text>
                                <Text className="text-gray-400 text-sm">Your emergency contacts</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNotificationToggle('trustedContacts')}
                            className={`w-12 h-6 rounded-full justify-center p-0.5 ${notifications.trustedContacts ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <View className={`w-4 h-4 bg-white rounded-full ${notifications.trustedContacts ? 'self-end' : 'self-start'
                                }`} />
                        </TouchableOpacity>
                    </View>
                    {notifications.trustedContacts && (
                        <View className="flex-row items-center mt-2 gap-2">
                            <Clock size={16} color="#10B981" />
                            <Text className="text-green-500 text-sm">
                                Est. response: {getResponseTime('trustedContacts')}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="p-4 bg-gray-800 rounded-xl gap-2">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 gap-3">
                            <Shield size={24} color="#f97316" />
                            <View className="flex-1 gap-1">
                                <Text className="text-white font-medium text-base">Emergency Services</Text>
                                <Text className="text-gray-400 text-sm">Police, Fire, Medical services</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNotificationToggle('emergencyServices')}
                            className={`w-12 h-6 rounded-full justify-center p-0.5 ${notifications.emergencyServices ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        >
                            <View className={`w-4 h-4 bg-white rounded-full ${notifications.emergencyServices ? 'self-end' : 'self-start'
                                }`} />
                        </TouchableOpacity>
                    </View>
                    {notifications.emergencyServices && (
                        <View className="flex-row items-center mt-2 gap-2">
                            <Clock size={16} color="#10B981" />
                            <Text className="text-green-500 text-sm">
                                Est. response: {getResponseTime('emergencyServices')}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                onPress={() => setCurrentStep(4)}
                className="w-full bg-orange-500 py-4 rounded-xl items-center justify-center flex-row gap-2"
            >
                <Text className="text-white font-semibold text-base">Continue</Text>
                <ChevronRight size={20} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );

    const renderStep4 = () => (
        <View className="gap-6">
            <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2 text-center">Send Help Request</Text>
                <Text className="text-gray-400 text-center">Review and send your emergency request</Text>
            </View>

            <View className="gap-4">
                <View className="p-4 bg-gray-800 rounded-xl gap-2">
                    <Text className="text-white font-medium mb-2 text-base">Emergency Type</Text>
                    <View className="flex-row items-center gap-2">
                        {selectedEmergency && (
                            <>
                                <selectedEmergency.icon size={20} color="#f97316" />
                                <Text className="text-gray-300 text-base">{selectedEmergency.label}</Text>
                            </>
                        )}
                    </View>
                </View>

                {notes ? (
                    <View className="p-4 bg-gray-800 rounded-xl gap-2">
                        <Text className="text-white font-medium mb-2 text-base">Additional Notes</Text>
                        <Text className="text-gray-300 text-base">{notes}</Text>
                    </View>
                ) : null}

                <View className="p-4 bg-gray-800 rounded-xl gap-2">
                    <Text className="text-white font-medium mb-2 text-base">Notifications</Text>
                    <View className="gap-2">
                        {notifications.nearbyUsers && (
                            <View className="flex-row items-center gap-2">
                                <Users size={16} color="#D1D5DB" />
                                <Text className="text-gray-300 text-base">Nearby Users</Text>
                            </View>
                        )}
                        {notifications.trustedContacts && (
                            <View className="flex-row items-center gap-2">
                                <Phone size={16} color="#D1D5DB" />
                                <Text className="text-gray-300 text-base">Trusted Contacts</Text>
                            </View>
                        )}
                        {notifications.emergencyServices && (
                            <View className="flex-row items-center gap-2">
                                <Shield size={16} color="#D1D5DB" />
                                <Text className="text-gray-300 text-base">Emergency Services</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View className="gap-3 mt-2">
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
                    <Text className="text-white font-medium text-base">Start Over</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <StatusBar barStyle="light-content" backgroundColor="#111827" />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    paddingBottom: 32
                }}
            >
                {/* Progress Indicator */}
                <View className="flex-row items-center justify-center mb-8 gap-2">
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
                        <Text className="text-white font-medium text-base">Back</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Report;