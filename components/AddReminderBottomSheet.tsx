import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalSearchParams, useSegments } from 'expo-router';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Reminder, useUser } from '../stores/UserContext';

interface AddReminderBottomSheetProps {
  onClose?: () => void;
  reminderToEdit?: Reminder | null;
}

const initialReminderState = {
  title: '',
  description: '',
  date: new Date(),
  priority: 'medium' as const,
  category: '',
};

const AddReminderBottomSheet = forwardRef<BottomSheet, AddReminderBottomSheetProps>(
  ({ onClose, reminderToEdit }, ref) => {
    const { addReminder, updateReminder, groups } = useUser();
    const snapPoints = useMemo(() => ['75%'], []);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    
    const segments = useSegments();
    const params = useGlobalSearchParams();

    const [newReminder, setNewReminder] = useState(initialReminderState);
    const isEditMode = !!reminderToEdit;

    useEffect(() => {
      if (reminderToEdit) {
        const parsedDate = new Date(reminderToEdit.date);
        if (reminderToEdit.time) {
          const [h, m] = reminderToEdit.time.split(':');
          parsedDate.setHours(Number(h), Number(m || 0));
        }
        setNewReminder({
          title: reminderToEdit.title,
          description: reminderToEdit.description || '',
          date: parsedDate,
          priority: reminderToEdit.priority,
          category: reminderToEdit.category || '',
        });
      } else {
        setNewReminder(initialReminderState);
      }
    }, [reminderToEdit]);

    const handleSaveReminder = async () => {
      if (!newReminder.title.trim()) {
        Alert.alert('Error', 'Please enter a title for your reminder');
        return;
      }

      let groupId: string | undefined = reminderToEdit?.groupId;
      const isGroupRoute = segments.some(s => s === 'group');
      if (!isEditMode && isGroupRoute && params.id) {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (groups.some(g => g.id === id)) {
          groupId = id;
        }
      }

      const payload = {
        title: newReminder.title,
        description: newReminder.description,
        date: newReminder.date.toISOString(),
        time: newReminder.date.toTimeString().slice(0, 5),
        priority: newReminder.priority,
        category: newReminder.category,
        groupId,
      };

      if (isEditMode && reminderToEdit) {
        await updateReminder(reminderToEdit.id, payload);
      } else {
        await addReminder(payload);
      }

      setNewReminder(initialReminderState);
      if (ref && 'current' in ref) {
        ref.current?.close();
      }
      onClose?.();
    };

    const handleClose = () => {
      setNewReminder(initialReminderState);
      if (ref && 'current' in ref) {
        ref.current?.close();
      }
      onClose?.();
    };

    const toggleMoreOptions = () => {
      setShowMoreOptions(!showMoreOptions);
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#1e293b' }}
        handleIndicatorStyle={{ backgroundColor: '#FF9429' }}
        backdropComponent={BottomSheetBackdrop}
        onClose={Keyboard.dismiss}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BottomSheetScrollView className="flex-1 px-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">
                {isEditMode ? 'Edit Reminder' : 'New Reminder'}
              </Text>
              <TouchableOpacity 
                onPress={handleClose}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#FF9429" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 mb-4"
              placeholder="Reminder title"
              placeholderTextColor="#888"
              value={newReminder.title}
              onChangeText={(text) => setNewReminder({...newReminder, title: text})}
            />

            <TextInput
              className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 mb-4"
              placeholder="Description (optional)"
              placeholderTextColor="#888"
              value={newReminder.description}
              onChangeText={(text) => setNewReminder({...newReminder, description: text})}
              multiline
              numberOfLines={4}
            />

            <View className="mb-4">
              <Text className="text-gray-400 mb-3 text-sm font-semibold">Date and Time</Text>
              {Platform.OS === 'ios' ? (
                <View className="flex-row items-center">
                  <DateTimePicker
                    value={newReminder.date}
                    mode="date"
                    display="default"
                    accentColor="#FF9429"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setNewReminder({...newReminder, date: selectedDate});
                      }
                    }}
                  />

                  <DateTimePicker
                    value={newReminder.date}
                    mode="time"
                    display="default"
                    accentColor="#FF9429"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setNewReminder({...newReminder, date: selectedDate});
                      }
                    }}
                  />
                </View>
              ) : (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-slate-700 rounded-lg py-3 px-4"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className="text-white text-center">
                      {newReminder.date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="flex-1 bg-slate-700 rounded-lg py-3 px-4"
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text className="text-white text-center">
                      {newReminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  value={newReminder.date}
                  mode="date"
                  display="default"
                  accentColor="#FF9429"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setNewReminder({...newReminder, date: selectedDate});
                    }
                  }}
                />
              )}

              {Platform.OS === 'android' && showTimePicker && (
                <DateTimePicker
                  value={newReminder.date}
                  mode="time"
                  display="default"
                  accentColor="#FF9429"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) {
                      setNewReminder({...newReminder, date: selectedDate});
                    }
                  }}
                />
              )}
            </View>

            <View className="mb-10">
              <TouchableOpacity 
                className="flex-row items-center justify-between mb-3"
                onPress={toggleMoreOptions}
              >
                <Text className="text-gray-400 mb-3 text-sm uppercase font-semibold">More Options</Text>
                <Ionicons 
                  name={showMoreOptions ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#FF9429" 
                />
              </TouchableOpacity>

              {showMoreOptions && (
                <View className="mb-2">
                  <Text className="text-gray-400 mb-3 text-sm uppercase font-semibold">Priority</Text>
                  <View className="flex-row gap-3">
                    {(['low', 'medium', 'high'] as const).map((priority) => {
                      const isSelected = newReminder.priority === priority;
                      return (
                        <TouchableOpacity
                          key={priority}
                          className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                            isSelected 
                              ? 'bg-[#FF9429] border-[#FF9429]' 
                              : 'bg-slate-800 border-slate-700'
                          }`}
                          onPress={() => setNewReminder({...newReminder, priority})}
                        >
                          <Ionicons 
                            name={
                              priority === 'high' 
                                ? 'alert-circle' 
                                : priority === 'medium' 
                                  ? 'radio-button-on' 
                                  : 'arrow-down-circle'
                            } 
                            size={18} 
                            color={isSelected ? 'white' : '#94a3b8'} 
                            style={{ marginRight: 6 }}
                          />
                          <Text 
                            className={`text-center capitalize font-semibold ${
                              isSelected ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {priority}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSaveReminder}
              className="bg-[#FF9429] rounded-full py-4"
            >
              <Text className="text-white text-center font-semibold">
                {isEditMode ? 'Save Changes' : 'Add Reminder'}
              </Text>
            </TouchableOpacity>

          </BottomSheetScrollView>
        </TouchableWithoutFeedback>
      </BottomSheet>
    );
  }
);

AddReminderBottomSheet.displayName = 'AddReminderBottomSheet';

export default AddReminderBottomSheet;
