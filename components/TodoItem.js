import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Colors from './styles/Colors';

export default function TodoItem({ task, onDelete, onComplete, onEdit }) {
  const getBackgroundColor = () => {
    if (task.completed) {
      return Colors.done;
    }

    if (!task.dueDate) {
      return Colors.noDueDate;
    }
    const dueTime = new Date(task.dueDate).getTime();
    const now = Date.now();

    if (dueTime < now) {
      return Colors.overdue;
    }
    if (dueTime - now < 24 * 60 * 60 * 1000) {
      return Colors.soon;
    }
    return Colors.future;
  };

  const textStyle = task.completed
    ? [styles.text, styles.completedText]
    : styles.text;

  return (
    <View
      style={[styles.itemContainer, { backgroundColor: getBackgroundColor() }]}
    >
      {/* Checkbox area */}
      <TouchableOpacity
        onPress={() => onComplete(task.id)}
        style={styles.checkboxContainer}
      >
        <View
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => onEdit(task)}
      >
        <Text style={textStyle}>{task.title}</Text>
        {task.dueDate && (
          <Text style={styles.dueDateText}>
            Due:{' '}
            {new Date(task.dueDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Text>
        )}
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this item?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', onPress: () => onDelete(task.id) },
            ],
            { cancelable: true }
          )
        }
      >
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    padding: 10,
  },
  checkboxContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 4,
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary,
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#7E7E7E',
  },
  dueDateText: {
    fontSize: 12,
    color: '#555',
    marginTop: 3,
  },
  deleteText: {
    color: 'red',
    marginLeft: 10,
    fontWeight: '600',
  },
});
