import { Stack } from 'expo-router';
import { UserProvider } from '../../stores/UserContext';

export default function AuthLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          gestureEnabled: true,
          headerStyle: { backgroundColor: '#1F2937' },
          headerTitleStyle: { color: '#fff' },
          headerTintColor: '#FF9429',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
        <Stack.Screen name="settings/profile" options={{ title: 'Account' }} />
        <Stack.Screen name="settings/privacy" options={{ title: 'Privacy' }} />
      </Stack>
    </UserProvider>
  );
}