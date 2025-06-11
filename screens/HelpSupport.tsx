import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Phone, MessageCircle, Mail, BookOpen, FileText, HelpCircle } from 'lucide-react-native';

const HelpSupport = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* <Text style={styles.title}>Help & Support</Text> */}

      {/* Contact Support */}
      <Text style={styles.section}>CONTACT SUPPORT</Text>

      <SupportCard
        icon={<Phone color="white" size={20} />}
        title="Call Support"
        subtitle="1800-MAIPANIC (24/7)"
        onPress={() => Alert.alert('Dialing support...')}
        color="#FF8000"
      />
      <SupportCard
        icon={<MessageCircle color="white" size={20} />}
        title="Live Chat"
        subtitle="Average response: 2 mins"
        onPress={() => Alert.alert('Opening chat...')}
        color="#3B82F6"
      />
      <SupportCard
        icon={<Mail color="white" size={20} />}
        title="Email Support"
        subtitle="help@maipanic.gov.sg"
        onPress={() => Alert.alert('Composing email...')}
        color="#A855F7"
      />

      {/* Resources */}
      <Text style={styles.section}>RESOURCES</Text>
      <View style={styles.resourceRow}>
        <ResourceCard title="User Guide" subtitle="Step-by-step help" icon={<BookOpen color="#FF8000" size={20} />} />
        <ResourceCard title="Safety Tips" subtitle="Emergency prep" icon={<FileText color="#FF8000" size={20} />} />
      </View>

      {/* FAQs */}
      <Text style={styles.section}>FREQUENTLY ASKED</Text>
      {[
        'How do I report an emergency?',
        "What if I'm in a no-signal area?",
        'How do I add emergency contacts?',
        'Can I use MaiPanic overseas?',
      ].map((question, idx) => (
        <FAQCard key={idx} text={question} />
      ))}
    </ScrollView>
  );
};

const SupportCard = ({ icon, title, subtitle, onPress, color }) => (
  <TouchableOpacity style={[styles.supportCard, { backgroundColor: '#1F2937' }]} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: color }]}>{icon}</View>
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const ResourceCard = ({ icon, title, subtitle }) => (
  <TouchableOpacity style={styles.resourceCard}>
    {icon}
    <Text style={styles.resourceTitle}>{title}</Text>
    <Text style={styles.resourceSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const FAQCard = ({ text }) => (
  <TouchableOpacity style={styles.faqCard}>
    <HelpCircle color="#FF8000" size={18} style={{ marginRight: 10 }} />
    <Text style={styles.faqText}>{text}</Text>
  </TouchableOpacity>
);

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    color: '#FF8000',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  section: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 24,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 10,
    width: '48%',
    padding: 16,
    alignItems: 'flex-start',
  },
  resourceTitle: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  resourceSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  faqCard: {
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  faqText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
});
