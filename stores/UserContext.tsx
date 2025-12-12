import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// --- Interfaces ---

export interface Group {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface SettingsData {
  name: string;
  profileImage: string | null;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  groupId?: string;
  createdAt: string;
}

// --- Context Type ---

interface UserContextType {
  // Group State & Methods
  groups: Group[];
  addGroup: (name: string, icon: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  clearAllGroups: () => Promise<void>;
  updateGroup: (id: string, updates: Partial<Pick<Group, 'name' | 'icon'>>) => Promise<void>;

  // Settings State & Methods
  settings: SettingsData;
  updateSetting: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => Promise<void>;
  updateMultipleSettings: (updates: Partial<SettingsData>) => Promise<void>;
  resetSettings: () => Promise<void>;

  // Reminder State & Methods
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  getUpcomingReminders: () => Reminder[];
  getTodaysReminders: () => Reminder[];
  clearAllReminders: () => Promise<void>;

  // Global
  isLoading: boolean;
  clearAllAppData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// --- Constants ---

const STORAGE_KEYS = {
  GROUPS: '@groups',
  SETTINGS: 'remindly_settings',
  REMINDERS: '@reminders',
};

const defaultSettings: SettingsData = {
  name: '',
  profileImage: null,
  notificationsEnabled: true,
  darkMode: false,
};

// --- Provider ---

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [groupsData, settingsData, remindersData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.GROUPS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.REMINDERS),
      ]);

      if (groupsData) setGroups(JSON.parse(groupsData));
      if (settingsData) setSettings({ ...defaultSettings, ...JSON.parse(settingsData) });
      if (remindersData) setReminders(JSON.parse(remindersData));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Group Logic ---

  const saveGroups = async (newGroups: Group[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(newGroups));
      setGroups(newGroups);
    } catch (error) {
      console.error('Error saving groups:', error);
    }
  };

  const addGroup = async (name: string, icon: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      icon,
      createdAt: new Date().toISOString(),
    };
    await saveGroups([...groups, newGroup]);
  };

  const deleteGroup = async (id: string) => {
    await saveGroups(groups.filter(g => g.id !== id));
  };

  const clearAllGroups = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GROUPS);
      setGroups([]);
    } catch (error) {
      console.error('Error clearing groups:', error);
    }
  };

  const updateGroup = async (
    id: string,
    updates: Partial<Pick<Group, 'name' | 'icon'>>
  ) => {
    const updatedGroups = groups.map(g =>
      g.id === id ? { ...g, ...updates } : g
    );
    await saveGroups(updatedGroups);
  };

  // --- Settings Logic ---

  const saveSettings = async (newSettings: SettingsData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = async <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  const updateMultipleSettings = async (updates: Partial<SettingsData>) => {
    const newSettings = { ...settings, ...updates };
    await saveSettings(newSettings);
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  // --- Reminder Logic ---

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const addReminder = async (data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newReminder: Reminder = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };
    await saveReminders([...reminders, newReminder]);
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const updatedReminders = reminders.map(r => (r.id === id ? { ...r, ...updates } : r));
    await saveReminders(updatedReminders);
  };

  const deleteReminder = async (id: string) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    await saveReminders(updatedReminders);
  };

  const toggleComplete = async (id: string) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    await saveReminders(updatedReminders);
  };

  const clearAllReminders = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REMINDERS);
      setReminders([]);
    } catch (error) {
      console.error('Error clearing reminders:', error);
    }
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return reminders
      .filter(r => {
        const d = new Date(r.date);
        return d >= now && d <= nextWeek && !r.isCompleted;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTodaysReminders = () => {
    const today = new Date().toDateString();
    return reminders
      .filter(r => new Date(r.date).toDateString() === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // --- Global Logic ---

  const clearAllAppData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.GROUPS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.REMINDERS
      ]);
      setGroups([]);
      setSettings(defaultSettings);
      setReminders([]);
    } catch (error) {
      console.error('Error clearing all app data:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        groups,
        addGroup,
        deleteGroup,
        clearAllGroups,
        updateGroup,
        settings,
        updateSetting,
        updateMultipleSettings,
        resetSettings,
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleComplete,
        getUpcomingReminders,
        getTodaysReminders,
        clearAllReminders,
        isLoading,
        clearAllAppData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
