import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native';

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    Alert.alert('Error setting item:', error);
  }
};

export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    Alert.alert('Error getting item:', error);
    return null;
  }
};
