import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '../../../../stores/UserContext';
import { useSheetActions } from '../_layout';
import ReminderToggle from '../../../../components/ReminderToggle';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { groups, reminders, toggleComplete, deleteReminder } = useUser();
  const { openEditGroupSheet, openAddReminderSheet } = useSheetActions();
  const [showCompleted, setShowCompleted] = useState(false);

  const group = groups.find(g => g.id === id);
  const groupReminders = reminders.filter(r => r.groupId === id);
  const filteredReminders = groupReminders
    .filter(r => showCompleted ? r.isCompleted : !r.isCompleted)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (a.time || '').localeCompare(b.time || '');
    });

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const todayReminders = filteredReminders.filter(r => {
    const rDate = new Date(r.date);
    rDate.setHours(0, 0, 0, 0);
    return rDate.getTime() <= now.getTime();
  });

  const upcomingReminders = filteredReminders.filter(r => {
    const rDate = new Date(r.date);
    rDate.setHours(0, 0, 0, 0);
    return rDate.getTime() > now.getTime();
  });

  if (!group) {
    return (
      <View className="bg-[#0B1825] pt-20 px-4 flex-1">
        <TouchableOpacity onPress={router.back} className="mb-4 flex-row items-center">
          <Ionicons name="chevron-back" size={20} color="white" />
          <Text className="text-white ml-1">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl">Group not found</Text>
      </View>
    );
  }

  const handleEditGroup = () => {
    openEditGroupSheet(group);
  };

  const handleEditReminder = (reminder: any) => {
    openAddReminderSheet?.(reminder);
  };

  const renderReminderItem = (reminder: any) => (
    <TouchableOpacity
      key={reminder.id}
      onPress={() => handleEditReminder(reminder)}
      activeOpacity={0.8}
      className="bg-slate-800 rounded-xl p-4 mb-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className={`w-3 h-3 rounded-full mr-2 ${
              reminder.priority === 'high' ? 'bg-red-500' : 
              reminder.priority === 'medium' ? 'bg-yellow-500' : 
              'bg-green-500'
            }`} />
            <Text className={`text-lg font-semibold ${reminder.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
              {reminder.title}
            </Text>
          </View>
          {reminder.description && (
            <Text className={`text-gray-400 text-sm ml-5 mb-1 ${reminder.isCompleted ? 'line-through' : ''}`}>
              {reminder.description}
            </Text>
          )}
          <View className="flex-row items-center ml-5 mb-1">
            <Ionicons name="calendar-outline" size={16} color="#FF9429" />
            <Text className="text-[#FF9429] ml-1 mr-4">
              {new Date(reminder.date).toLocaleDateString()}
            </Text>
            <Ionicons name="time-outline" size={16} color="#FF9429" />
            <Text className="text-[#FF9429] ml-1">{reminder.time}</Text>
          </View>
        </View>
        <View className="flex-row items-center ml-3">
          <TouchableOpacity
            onPress={() => deleteReminder(reminder.id)}
            className="p-2 rounded-full bg-slate-700 mr-2"
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleComplete(reminder.id)}
            className={`p-2 rounded-full ${reminder.isCompleted ? 'bg-green-500/20' : 'bg-slate-700'}`}
          >
            <Ionicons 
              name={reminder.isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={32} 
              color={reminder.isCompleted ? "#22c55e" : "#64748b"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-[#0B1825] pt-20 px-4 flex-1">
      <View className="mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={router.back} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEditGroup}
            className="flex-row items-center flex-1"
            activeOpacity={0.7}
          >
            <View className="bg-slate-800 w-10 h-10 rounded-full items-center justify-center mr-3">
              <Ionicons name={group.icon as any} size={20} color="#FF9429" />
            </View>
            <View>
              <Text className="text-2xl font-bold text-white" numberOfLines={1}>
                {group.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-400 text-xs mr-1">Edit Group</Text>
                <Ionicons name="pencil" size={10} color="#9ca3af" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ReminderToggle showCompleted={showCompleted} onChange={setShowCompleted} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredReminders.length === 0 ? (
          <View className="items-center mt-36">
            <Ionicons name="calendar-outline" size={64} color="#64748b" />
            <Text className="text-gray-500 text-center mt-2">
              {showCompleted ? 'No completed reminders' : 'No upcoming reminders'}
            </Text>
          </View>
        ) : (
          !showCompleted ? (
            <>
              {todayReminders.length > 0 && (
                <View>
                  <Text className="text-gray-400 text-sm font-medium mb-3 mt-2 uppercase tracking-wider">Today</Text>
                  {todayReminders.map(renderReminderItem)}
                </View>
              )}
              {upcomingReminders.length > 0 && (
                <View>
                  <Text className="text-gray-400 text-sm font-medium mb-3 mt-4 uppercase tracking-wider">Upcoming</Text>
                  {upcomingReminders.map(renderReminderItem)}
                </View>
              )}
            </>
          ) : (
            filteredReminders.map(renderReminderItem)
          )
        )}
      </ScrollView>
    </View>
  );
}
