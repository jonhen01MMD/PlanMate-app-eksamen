import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Group } from '../stores/UserContext';

type CreateGroupBottomSheetProps = {
  mode?: 'create' | 'edit';
  initialGroup?: Group | null;
  onSubmit: (params: { name: string; icon: string }) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

const CreateGroupBottomSheet = forwardRef<BottomSheet, CreateGroupBottomSheetProps>(
  ({ mode = 'create', initialGroup, onSubmit, onDelete }, ref) => {
    const snapPoints = useMemo(() => ['75%'], []);
    const [groupName, setGroupName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('list');

    useEffect(() => {
      if (initialGroup) {
        setGroupName(initialGroup.name);
        setSelectedIcon(initialGroup.icon);
      } else {
        setGroupName('');
        setSelectedIcon('list');
      }
    }, [initialGroup]);

    const handleClose = () => {
      if (ref && 'current' in ref) {
        ref.current?.close();
      }
    };

    const handleSubmit = async () => {
      if (!groupName.trim()) {
        Alert.alert('Error', 'Please enter a group name');
        return;
      }

      await Promise.resolve(onSubmit({ name: groupName.trim(), icon: selectedIcon }));

      handleClose();

      if (mode === 'create' && !initialGroup) {
        setGroupName('');
        setSelectedIcon('list');
      }
    };

    const handleDelete = async () => {
      if (!onDelete) return;
      const confirmed = await new Promise<boolean>(resolve => {
        Alert.alert(
          'Delete group',
          'Are you sure you want to remove this group?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
          ],
          { cancelable: true }
        );
      });
      if (!confirmed) return;
      await Promise.resolve(onDelete());
      handleClose();
    };

    const title = mode === 'edit' ? 'Edit Group' : 'New Group';
    const buttonLabel = mode === 'edit' ? 'Save Changes' : 'Create Group';

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
              <Text className="text-white text-xl font-bold">{title}</Text>
              <TouchableOpacity onPress={handleClose} className="p-2">
                <Ionicons name="close" size={24} color="#FF9429" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-gray-400 mb-2 text-sm uppercase font-semibold">Group Name</Text>
              <TextInput
                className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700"
                placeholder="e.g., Work, Personal"
                placeholderTextColor="#64748b"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <View className="mb-8">
              <Text className="text-gray-400 mb-3 text-sm uppercase font-semibold">Icon</Text>
              <View className="flex-row flex-wrap" style={{ marginHorizontal: -6, marginVertical: -6 }}>
                {['list','briefcase','home','school','fitness','cart','airplane','book','car','planet','medkit','game-controller','paw','cafe',].map(icon => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    style={{ marginHorizontal: 6, marginVertical: 6 }}
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      selectedIcon === icon ? 'bg-[#FF9429]' : 'bg-slate-900 border border-slate-700'
                    }`}
                  >
                    <Ionicons
                      name={icon as any}
                      size={20}
                      color={selectedIcon === icon ? 'white' : '#94a3b8'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-[#FF9429] rounded-full py-4"
            >
              <Text className="text-white text-center font-semibold">{buttonLabel}</Text>
            </TouchableOpacity>

            {mode === 'edit' && onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                className="mt-4 rounded-full py-3 border bg-red-900/20 border-red-600/30"
              >
                <Text className=" text-center font-semibold text-red-400">Remove Group</Text>
              </TouchableOpacity>
            )}
          </BottomSheetScrollView>
        </TouchableWithoutFeedback>
      </BottomSheet>
    );
  }
);

export default CreateGroupBottomSheet;
