import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import Colors from './components/styles/Colors';
import TodoItem from './components/TodoItem';
import TodoInputModal from './components/TodoInputModal';
import { loadTasks, saveTasks } from './utils/storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [sortByDueDate, setSortByDueDate] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    (async () => {
      const storedTasks = await loadTasks();
      setTasks(storedTasks);
    })();
  }, []);

  // Save tasks anytime they update
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Create new task
  const handleAddNewTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  // Save or update a task
  const handleSaveTask = (taskData, id = null) => {
    if (id) {
      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === id ? { ...item, ...taskData } : item
        )
      );
    } else {
      const newTask = {
        id: Date.now().toString(),
        title: taskData.title,
        details: taskData.details || '',
        dueDate: taskData.dueDate || null,
        completed: false,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }

    setModalVisible(false);
    setEditingTask(null);
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Toggle complete
  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Open modal for editing
  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  // Sorting logic
  const sortedTasks = () => {
    if (!sortByDueDate) {
      return tasks;
    }
    const withDates = tasks.filter((t) => t.dueDate);
    const noDates = tasks.filter((t) => !t.dueDate);

    withDates.sort((a, b) => {
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
      return aTime - bTime;
    });

    return [...withDates, ...noDates];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My To-Do List</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={[styles.header, { fontSize: 18, marginBottom: 0 }]}>
          {sortByDueDate ? 'Sorted by Due Date' : 'Unsorted List'}
        </Text>
        <TouchableOpacity
          style={[styles.sortButton, { paddingHorizontal: 20 }]}
          onPress={() => setSortByDueDate((prev) => !prev)}
        >
          <Text style={styles.sortButtonText}>Toggle Sort</Text>
        </TouchableOpacity>
      </View>
      {/* Task List */}
      <Animated.View style={{ flex: 1 }}>
        <FlatList
          data={sortedTasks()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View entering={ZoomIn} exiting={ZoomOut}>
              <TodoItem
                task={item}
                onDelete={handleDeleteTask}
                onComplete={handleToggleComplete}
                onEdit={handleEditTask}
              />
            </Animated.View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </Animated.View>
      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewTask}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
      {/* Modal for detail/edit */}
      <TodoInputModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  sortButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  sortButtonText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
