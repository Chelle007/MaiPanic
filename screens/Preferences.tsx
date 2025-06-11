
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';

const Preferences = () => {
  const [prefs, setPrefs] = useState({
    critical: true,
    weather: true,
    safety: true,
    community: false,
    push: true,
    sound: true,
    vibration: true,
    volume: 0.7,
    dndOverride: true,
    locationBased: true,
    radius: '5km',
    shareLocation: true,
  });

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.title}>Preferences</Text>

      {/* Emergency Alerts */}
      <Text style={styles.section}>🎗️ Emergency Alerts</Text>
      <DescriptionToggle label="Critical Emergency Alerts" desc="Life-threatening emergencies (earthquakes, tsunamis, terrorist attacks)" level="CRITICAL" value={prefs.critical} onToggle={() => toggle('critical')} />
      <DescriptionToggle label="Severe Weather Alerts" desc="Typhoons, flash floods, extreme weather" level="HIGH" value={prefs.weather} onToggle={() => toggle('weather')} />
      <DescriptionToggle label="Public Safety Alerts" desc="Public transport disruptions, road closures" level="MEDIUM" value={prefs.safety} onToggle={() => toggle('safety')} />
      <DescriptionToggle label="Community Alerts" desc="Local incidents, community safety info" level="MEDIUM" value={prefs.community} onToggle={() => toggle('community')} />

      {/* Notification Settings */}
      <Text style={styles.section}>🔔 Notification Settings</Text>
      <SimpleToggle label="Push Notifications" desc="Receive alerts even when app is closed" value={prefs.push} onToggle={() => toggle('push')} />
      <SimpleToggle label="Sound Alerts" desc="Play alert sound for emergency notifications" value={prefs.sound} onToggle={() => toggle('sound')} />
      <SimpleToggle label="Vibration" desc="Vibrate device for emergency alerts" value={prefs.vibration} onToggle={() => toggle('vibration')} />

      <Text style={styles.subLabel}>Alert Volume</Text>
      <Slider
        style={{ width: '100%' }}
        value={prefs.volume}
        onValueChange={(value) => setPrefs({ ...prefs, volume: value })}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="#FF8000"
        minimumTrackTintColor="#FF8000"
      />

      <SimpleToggle label="Do Not Disturb Override" desc="Emergency alerts bypass Do Not Disturb mode" value={prefs.dndOverride} onToggle={() => toggle('dndOverride')} />

      {/* Location Services */}
      <Text style={styles.section}>📍 Location Services</Text>
      <SimpleToggle label="Location-Based Alerts" desc="Receive alerts relevant to your current location" value={prefs.locationBased} onToggle={() => toggle('locationBased')} />

      <Text style={styles.subLabel}>Alert Radius</Text>
      <TextInput
        style={styles.input}
        value={prefs.radius}
        onChangeText={(v) => setPrefs({ ...prefs, radius: v })}
        placeholder="5km"
        placeholderTextColor="#9CA3AF"
      />

      <SimpleToggle label="Share Location in Emergency" desc="Automatically share location with emergency contacts" value={prefs.shareLocation} onToggle={() => toggle('shareLocation')} />

      {/* Language */}
      <Text style={styles.section}>🌐 Language</Text>
      <Text style={styles.subLabel}>App Language</Text>
      <TextInput
        style={styles.input}
        placeholder="English"
        placeholderTextColor="#9CA3AF"
        editable={false}
      />
    </ScrollView>
  );
};

const DescriptionToggle = ({ label, desc, level, value, onToggle }) => (
  <View style={styles.block}>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{level}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#4B5563', true: '#FF8000' }}
      thumbColor={Platform.OS === 'android' ? 'white' : undefined}
    />
  </View>
);

const SimpleToggle = ({ label, desc, value, onToggle }) => (
  <View style={styles.block}>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#4B5563', true: '#FF8000' }}
      thumbColor={Platform.OS === 'android' ? 'white' : undefined}
    />
  </View>
);

export default Preferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: '#FF8000',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  section: {
    color: '#FF8000',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  subLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  desc: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  levelBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#1F2937',
    borderColor: '#FF8000',
    borderWidth: 1,
  },
  levelText: {
    color: '#FF8000',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    color: 'white',
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
});
