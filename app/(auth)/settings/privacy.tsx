import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../../stores/UserContext';

export default function PrivacyScreen() {
  const { clearAllAppData } = useUser();

  const handleDeleteData = () => {
    Alert.alert(
      "Delete All Data",
      "Are you sure you want to delete all your data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllAppData();
              Alert.alert("Data Deleted", "All your data has been deleted successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete data. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView className='bg-[#0B1825] pt-10'>

      <View className="px-4 mb-8">
        <Text className="text-white text-2xl font-bold mb-4">Privacy and Security</Text>
        <Text className="text-gray-400 text-base mb-2">
          Control your privacy settings and manage your personal data securely.
        </Text>
      </View>

      <View className="px-4 mb-8">
        <Text className="text-gray-400 text-xs mb-2">Data Management</Text>
        <TouchableOpacity
          className="flex-row items-center bg-red-900/20 border border-red-600/30 rounded-3xl px-4 py-4"
          onPress={handleDeleteData}
        >
          <Ionicons name="trash-outline" size={24} color="#ef4444" className="mr-4" />
          <View className="flex-1">
            <Text className="text-red-400 text-base">Delete All Data</Text>
            <Text className="text-red-400/60 text-xs">Permanently delete all your data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}
