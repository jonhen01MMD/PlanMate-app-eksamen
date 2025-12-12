import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router, Tabs, useSegments } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AddReminderBottomSheet from '../../../components/AddReminderBottomSheet';
import CreateGroupBottomSheet from '../../../components/CreateGroupBottomSheet';
import { Group, Reminder, useUser } from '../../../stores/UserContext';

const SheetActionsContext = React.createContext({
  openReminderSheet: () => {},
  openAddReminderSheet: (_reminder?: Reminder) => {},
  openCreateGroupSheet: () => {},
  openEditGroupSheet: (_group: Group) => {},
});

export const useSheetActions = () => React.useContext(SheetActionsContext);

export default function TabLayout() {
  const reminderBottomSheetRef = useRef<BottomSheet>(null);
  const createGroupBottomSheetRef = useRef<BottomSheet>(null);
  const { settings, addGroup, updateGroup, deleteGroup } = useUser();
  const segments = useSegments();
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const openReminderSheet = useCallback(() => {
    setEditingReminder(null);
    reminderBottomSheetRef.current?.expand();
  }, []);

  const openAddReminderSheet = useCallback((reminder?: Reminder) => {
    setEditingReminder(reminder ?? null);
    reminderBottomSheetRef.current?.expand();
  }, []);

  const openCreateGroupSheet = useCallback(() => {
    setEditingGroup(null);
    createGroupBottomSheetRef.current?.expand();
  }, []);

  const openEditGroupSheet = useCallback((group: Group) => {
    setEditingGroup(group);
    createGroupBottomSheetRef.current?.expand();
  }, []);

  const handleGroupSubmit = useCallback(
    async ({ name, icon }: { name: string; icon: string }) => {
      if (editingGroup) {
        await updateGroup(editingGroup.id, { name, icon });
      } else {
        await addGroup(name, icon);
      }
      setEditingGroup(null);
    },
    [editingGroup, addGroup, updateGroup]
  );

  const handleGroupDelete = useCallback(async () => {
    if (!editingGroup) return;
    await deleteGroup(editingGroup.id);
    setEditingGroup(null);
    router.replace('/(auth)/(tabs)');
  }, [editingGroup, deleteGroup]);

  const isGroupDetail =
    segments.length >= 2 &&
    segments[segments.length - 2] === 'group' &&
    segments[segments.length - 1] === '[id]';

  return (
    <BottomSheetModalProvider>
      <SheetActionsContext.Provider
        value={{ openReminderSheet, openAddReminderSheet, openCreateGroupSheet, openEditGroupSheet }}
      >
        <View className="relative flex-1">
          <Tabs
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: '#FF9429',
              headerShown: true,
              tabBarButton: HapticTab,
              headerTransparent: true,
              headerTitle: '',
              tabBarStyle: {
                backgroundColor: '#1F2937',
                height: 85,
                paddingTop: 12,
              },
              headerRight: () => (
                <TouchableOpacity
                  className="absolute bg-[#FF9429] p-1 rounded-full right-4 top-4 w-12 h-12 items-center justify-center overflow-hidden"
                  onPress={() => router.push('/(auth)/settings')}
                >
                  {settings.profileImage ? (
                    <Image 
                      source={{ uri: settings.profileImage }} 
                      className="w-full h-full rounded-full"
                      style={{ width: 38, height: 38 }}
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={24}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
            })}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ color }) => (
                  <View style={{ alignItems: 'center' }}>
                    <Ionicons name="home" size={24} color={color} />
                    <View style={{ height: 10 }} />
                  </View>
                ),
                tabBarLabelStyle: { marginTop: 0, fontSize: 12 },
              }}
            />
            <Tabs.Screen
              name="plans"
              options={{
                title: 'Upcoming Plans',
                tabBarIcon: ({ color }) => (
                  <View style={{ alignItems: 'center' }}>
                    <Ionicons name="calendar-outline" size={24} color={color} />
                    <View style={{ height: 10 }} />
                  </View>
                ),
                tabBarLabelStyle: { marginTop: 0, fontSize: 12 },
              }}
            />
            <Tabs.Screen
              name="group/[id]"
              options={{
                href: null,
                headerShown: true,
              }}
            />
          </Tabs>

          {isGroupDetail && (
            <TouchableOpacity
              className="absolute bottom-32 right-6 bg-[#FF9429] p-3 rounded-full shadow-lg"
              onPress={openReminderSheet}
            >
              <Ionicons name="alarm-outline" size={32} color="white" />
            </TouchableOpacity>
          )}

          <AddReminderBottomSheet
            ref={reminderBottomSheetRef}
            reminderToEdit={editingReminder}
            onClose={() => setEditingReminder(null)}
          />

          <CreateGroupBottomSheet
            ref={createGroupBottomSheetRef}
            mode={editingGroup ? 'edit' : 'create'}
            initialGroup={editingGroup}
            onSubmit={handleGroupSubmit}
            onDelete={editingGroup ? handleGroupDelete : undefined}
          />
        </View>
      </SheetActionsContext.Provider>
    </BottomSheetModalProvider>
  );
}
