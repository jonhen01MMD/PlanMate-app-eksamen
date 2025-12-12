import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Switch, Text, TouchableOpacity, View, Image } from 'react-native';
import { useUser } from '../../../stores/UserContext';

export default function SettingsScreen() {
  const { settings, updateSetting } = useUser();
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <ScrollView className='bg-[#0B1825] pt-10'>
      <View className="px-4 mb-8">
        <Text className="text-gray-400 mb-3 text-sm uppercase font-semibold">Account</Text>
        <TouchableOpacity
          className="flex-row items-center bg-slate-800 rounded-3xl px-4 py-4 mb-2"
          onPress={() => router.push('../settings/profile')}
        >
          <View className="w-12 h-12 rounded-full bg-[#FF9429] items-center justify-center mr-4 overflow-hidden">
            {settings?.profileImage ? (
              <Image
                source={{ uri: settings.profileImage }}
                className="w-full h-full rounded-full"
                style={{ width: 38, height: 38 }}
              />
            ) : (
              <Ionicons name="person" size={24} color="white" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white text-base">{settings?.name || 'Profile'}</Text>
            <Text className="text-gray-400 text-xs">View and edit your profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View className="px-4 mb-8">
        <Text className="text-gray-400 mb-3 text-sm uppercase font-semibold">Privacy and security</Text>
        <TouchableOpacity
          className="flex-row items-center bg-slate-800 rounded-3xl px-4 py-4 mb-2"
          onPress={() => router.push('../settings/privacy')}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#FF9429" className="mr-4" />
          <View className="flex-1">
            <Text className="text-white text-base">Privacy and security</Text>
            <Text className="text-gray-400 text-xs">Manage your privacy and security settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View className="px-4 mb-8">
        <Text className="text-gray-400 mb-3 text-sm uppercase font-semibold">About</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-slate-800 rounded-3xl px-4 py-4 mb-2"
          onPress={() => setShowAboutModal(true)}
        >
          <Ionicons name="information-circle-outline" size={24} color="#FF9429" className="mr-4" />
          <View className="flex-1">
            <Text className="text-white text-base">About PlanMate</Text>
            <Text className="text-gray-400 text-xs">Version 1.0.0</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showAboutModal}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-slate-800 rounded-3xl mx-6 p-6 max-w-sm border border-slate-700">
            <View className="items-center mb-4">
              <Ionicons name="information-circle" size={48} color="#FF9429" />
              <Text className="text-white text-xl font-bold mt-2">About PlanMate</Text>
            </View>
            
            <Text className="text-gray-300 text-center mb-4">
              PlanMate is a simple and intuitive reminder app designed to help you stay organized. made for a school project.
            </Text>
            
            <View className="items-center mb-4">
              <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
              <Text className="text-gray-400 text-sm">Made by Jonas Schøn Henriksen</Text>
            </View>
            
            <TouchableOpacity
              className="bg-[#FF9429] rounded-3xl py-3 px-6"
              onPress={() => setShowAboutModal(false)}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}