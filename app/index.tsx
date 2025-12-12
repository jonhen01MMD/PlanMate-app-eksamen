import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Keyboard, Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function loginScreen() {
  const dismissKeyboard = () => Keyboard.dismiss();
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-[#0B1825]">
        {/* Header Section */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          className="items-center pt-28 pb-14 px-8"
        >
          <View className="shadow-lg shadow-orange-500/20 pb-5">
            <Image source={require('../assets/images/icon.png')} className="w-24 h-24 rounded-2xl" />
          </View>
          <Text className="text-2xl font-medium text-gray-400 mb-1">Welcome to</Text>
          <Text className="text-5xl font-bold text-white tracking-tight">
            PlanMate<Text className="text-[#FF9429]">.</Text>
          </Text>
        </Animated.View>

        {/* Features List */}
        <View className="flex-1">
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          >
            {/* Feature 1 */}
            <Animated.View 
              entering={FadeInDown.delay(400).duration(1000).springify()}
              className="w-full bg-[#132435] p-5 rounded-3xl mb-4 border border-slate-800 flex-row items-center"
            >
                <View className="w-12 h-12 bg-[#FF9429]/10 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="checkmark-done-outline" size={24} color="#FF9429" />
                </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white mb-1">Very Simple</Text>
                <Text className="text-gray-400 text-sm leading-5">
                  An intuitive and user-friendly interface designed for effortless task management.
                </Text>
              </View>
            </Animated.View>
            
            {/* Feature 2 */}
            <Animated.View 
              entering={FadeInDown.delay(600).duration(1000).springify()}
              className="w-full bg-[#132435] p-5 rounded-3xl mb-4 border border-slate-800 flex-row items-center"
            >
              <View className="w-12 h-12 bg-[#FF9429]/10 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="person-outline" size={24} color="#FF9429" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white mb-1">Profile Management</Text>
                <Text className="text-gray-400 text-sm leading-5">
                  Easily update and manage your personal information, settings, and preferences.
                </Text>
              </View>
            </Animated.View>

            {/* Feature 3 */}
            <Animated.View 
              entering={FadeInDown.delay(800).duration(1000).springify()}
              className="w-full bg-[#132435] p-5 rounded-3xl mb-4 border border-slate-800 flex-row items-center"
            >
              <View className="w-12 h-12 bg-[#FF9429]/10 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="phone-portrait-outline" size={24} color="#FF9429" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white mb-1">Local Storage</Text>
                <Text className="text-gray-400 text-sm leading-5">
                  All your data is saved securely on your device, ensuring privacy and offline access.
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </View>

        {/* Footer Section */}
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(1000).springify()}
          className="px-8 pb-12 pt-2"
        >
          <TouchableOpacity 
            className="bg-[#FF9429] py-5 rounded-full shadow-lg shadow-orange-500/20 mb-6 flex-row justify-center items-center"
            onPress={() => router.replace('/(tabs)')} 
          >
            <Text className="text-center text-white text-lg font-bold mr-2">Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-xs text-gray-500 text-center leading-5 px-4">
            By pressing continue, you agree to our{' '}
            <Text className="text-[#FF9429]">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-[#FF9429]">Privacy Policy</Text>
          </Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}