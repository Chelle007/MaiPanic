import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { PhoneCall, Edit, Trash2, UserPlus, User } from 'lucide-react-native';

type Contact = {
  id: string;
  name: string;
  phone: string;
};

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Mom', phone: '+6591234567' },
    { id: '2', name: 'Dr Lim', phone: '+6562345678' },
  ]);

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <User color="white" size={20} style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => Alert.alert('Calling', item.phone)} style={styles.iconCircle}>
          <PhoneCall color="white" size={16} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Edit', `Edit ${item.name}`)} style={styles.iconCircle}>
          <Edit color="white" size={16} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconCircle}>
          <Trash2 color="white" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>
      <Text style={styles.subheading}>QUICK ACCESS</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        onPress={() => Alert.alert('Add Contact')}
        style={styles.addButton}
      >
        <UserPlus color="#FF8000" size={18} />
        <Text style={styles.addButtonText}>Add Emergency Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF8000',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  contactPhone: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#FF8000',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addButtonText: {
    color: '#FF8000',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
