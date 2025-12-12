import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ReminderToggle({
  showCompleted,
  onChange,
}: {
  showCompleted: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row bg-slate-800 rounded-full p-1 mb-6 border border-slate-700">
      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-full ${!showCompleted ? 'bg-[#FF9429]' : 'bg-transparent'}`}
        onPress={() => onChange(false)}
      >
        <Text className={`text-center font-medium ${!showCompleted ? 'text-white' : 'text-gray-400'}`}>
          Upcoming
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-full ${showCompleted ? 'bg-[#FF9429]' : 'bg-transparent'}`}
        onPress={() => onChange(true)}
      >
        <Text className={`text-center font-medium ${showCompleted ? 'text-white' : 'text-gray-400'}`}>
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}
