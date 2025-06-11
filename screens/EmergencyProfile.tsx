import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EmergencyProfile = () => {
  const [selectedBlood, setSelectedBlood] = useState('');
  const [fullName, setFullName] = useState('');
  const [nric, setNric] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>Emergency Profile</Text>

      {/* Personal Info */}
      <Text style={styles.sectionTitle}>🧍 Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#9CA3AF"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="S1234567A"
        placeholderTextColor="#9CA3AF"
        value={nric}
        onChangeText={setNric}
      />
      <Text style={styles.label}>Blood Type</Text>
      <View style={styles.bloodTypeGrid}>
        {bloodTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.bloodTypeButton, selectedBlood === type && styles.selectedBloodType]}
            onPress={() => setSelectedBlood(type)}
          >
            <Text style={{ color: selectedBlood === type ? '#101827' : 'white' }}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Medical Info */}
      <Text style={styles.sectionTitle}>🧾 Medical Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Type allergy and press Enter"
        placeholderTextColor="#9CA3AF"
        value={allergies}
        onChangeText={setAllergies}
      />
      <TextInput
        style={styles.input}
        placeholder="Type condition and press Enter"
        placeholderTextColor="#9CA3AF"
        value={conditions}
        onChangeText={setConditions}
      />
      <TextInput
        style={styles.input}
        placeholder="Type medication and press Enter"
        placeholderTextColor="#9CA3AF"
        value={medications}
        onChangeText={setMedications}
      />

      {/* Emergency Notes */}
      <Text style={styles.sectionTitle}>📕 Emergency Notes</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="e.g., Has pacemaker, Uses wheelchair, Mandarin only..."
        placeholderTextColor="#9CA3AF"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      {/* File Upload (non-functional) */}
      <Text style={styles.sectionTitle}>📄 Medical Reports</Text>
      <TouchableOpacity style={styles.uploadBtn}>
        <Text style={styles.uploadText}>Choose File or Take Photo</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Recent medical reports, test results, or doctor's notes (PDF, JPG, PNG)</Text>
    </ScrollView>
  );
};

export default EmergencyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    color: '#FF8000',
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#FF8000',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  bloodTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  bloodTypeButton: {
    backgroundColor: '#374151',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedBloodType: {
    backgroundColor: '#FF8000',
  },
  uploadBtn: {
    marginTop: 10,
    backgroundColor: '#1F2937',
    borderColor: '#FF8000',
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadText: {
    color: '#FF8000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  note: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
  },
});
