import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TODO_TASKS';

export const saveTasks = async (tasks) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.log('Error saving tasks:', e);
  }
};

export const loadTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log('Error loading tasks:', e);
    return [];
  }
};
