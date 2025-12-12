import { Ionicons, AntDesign } from '@expo/vector-icons';
import React, { useCallback, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSheetActions } from './_layout';
import { useUser } from '../../../stores/UserContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { openCreateGroupSheet } = useSheetActions();
  const { groups, reminders } = useUser();
  const router = useRouter();

  return (
    <View className='bg-[#0B1825] pt-20 px-4 flex-1'>
      <View className="mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-white">Dashboard</Text>
          <Text className="text-gray-400 text-lg">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
      </View>

      {groups.length === 0 ? (
        <TouchableOpacity onPress={openCreateGroupSheet} className="items-center mt-36" activeOpacity={0.7}>
          <View className="bg-slate-900 text-white p-4 rounded-full border border-slate-700 mb-6">
            <Ionicons name="add" size={48} color="#FF9429" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Click to start</Text>
          <Text className="text-gray-400 text-center">Create your first task group to get started</Text>
        </TouchableOpacity>
      ) : (
        <>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between">
              {groups.map((group) => {
                const taskCount = reminders.filter(r => r.groupId === group.id && !r.isCompleted).length;
                
                return (
                  <TouchableOpacity 
                    key={group.id} 
                    className="bg-slate-800 w-[48%] p-4 rounded-xl mb-4 border border-slate-700"
                    activeOpacity={0.7}
                    onPress={() => router.push(`/group/${group.id}`)}
                  >
                    <View className="bg-slate-900 w-10 h-10 rounded-full items-center justify-center mb-3">
                      <Ionicons name={group.icon as any} size={20} color="#FF9429" />
                    </View>
                    <Text className="text-white font-bold text-lg mb-1" numberOfLines={1}>{group.name}</Text>
                    <Text className="text-gray-400 text-xs">{taskCount} tasks</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity
            className="absolute bottom-8 right-6 bg-[#FF9429] p-3 rounded-full shadow-lg"
            onPress={openCreateGroupSheet}
          >
            <AntDesign name="folder-add" size={32} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}