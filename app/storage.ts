import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (e) {
    console.error('Failed to load token from storage', e);
    return null;
  }
};

export const saveTokenToStorage = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (e) {
    console.error('Failed to save token to storage', e);
  }
};

export const removeTokenFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (e) {
    console.error('Failed to remove token from storage', e);
  }
};