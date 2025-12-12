import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ReminderToggle from '../../../components/ReminderToggle';
import { useUser } from '../../../stores/UserContext';
import { useSheetActions } from './_layout';

export default function PlansScreen() {
  const router = useRouter();
  const { reminders, toggleComplete, deleteReminder, groups } = useUser();
  const { openAddReminderSheet } = useSheetActions();
  const [showCompleted, setShowCompleted] = useState(false);

  const upcomingReminders = reminders
    .filter(r => !r.isCompleted)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (a.time || '').localeCompare(b.time || '');
    });

  const completedReminders = reminders.filter(reminder => reminder.isCompleted);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const todayReminders = upcomingReminders.filter(r => {
    const rDate = new Date(r.date);
    rDate.setHours(0, 0, 0, 0);
    return rDate.getTime() <= now.getTime();
  });

  const futureReminders = upcomingReminders.filter(r => {
    const rDate = new Date(r.date);
    rDate.setHours(0, 0, 0, 0);
    return rDate.getTime() > now.getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#FF9429';
      case 'low': return '#22c55e';
      default: return '#FF9429';
    }
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
          
          {/* Group Indicator */}
          {reminder.groupId && (() => {
            const group = groups.find(g => g.id === reminder.groupId);
            if (group) {
              return (
                <View className="flex-row items-center ml-5 mb-1">
                  <Ionicons name={group.icon as any} size={12} color="#94a3b8" />
                  <Text className="text-slate-400 text-xs ml-1">{group.name}</Text>
                </View>
              );
            }
            return null;
          })()}

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
    <View className='bg-[#0B1825] pt-20 px-4 flex-1'>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white">Upcoming plans</Text>
        <Text className="text-gray-400 text-lg">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
      </View>

      <ReminderToggle showCompleted={showCompleted} onChange={setShowCompleted} />

      <ScrollView className="flex-1">
        {(showCompleted ? completedReminders : upcomingReminders).length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#64748b" />
            <Text className="text-gray-400 text-lg mt-4">
              {showCompleted ? 'No completed reminders' : 'No upcoming reminders'}
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              {showCompleted ? 'Complete some reminders to see them here' : 'Tap the + button to create your first reminder'}
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
              {futureReminders.length > 0 && (
                <View>
                  <Text className="text-gray-400 text-sm font-medium mb-3 mt-4 uppercase tracking-wider">Upcoming</Text>
                  {futureReminders.map(renderReminderItem)}
                </View>
              )}
            </>
          ) : (
            completedReminders.map(renderReminderItem)
          )
        )}
      </ScrollView>
    </View>
  );
}