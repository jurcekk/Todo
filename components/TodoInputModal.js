import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Colors from './styles/Colors';
import Toast from 'react-native-toast-message';

export default function TodoInputModal({
  visible,
  onClose,
  onSave,
  editingTask,
}) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDetails(editingTask.details || '');
      setDueDate(editingTask.dueDate || null);
      setBullets(editingTask.bullets || []);
    } else {
      setTitle('');
      setDetails('');
      setDueDate(null);
      setBullets([]);
    }
  }, [editingTask]);

  const handleSave = () => {
    const taskData = {
      title,
      details,
      dueDate,
      bullets,
    };
    if (title.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Task title is required!',
      });
      return;
    }

    onSave(taskData, editingTask?.id || null);
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {editingTask ? 'Edit Task' : 'New Task'}
          </Text>

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder='Task title'
            value={title}
            onChangeText={setTitle}
          />

          {/* Details */}
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            multiline
            placeholder='Additional details'
            value={details}
            onChangeText={setDetails}
          />

          {/* DateTime Picker */}
          <View style={styles.dateRow}>
            <Text style={styles.label}>
              Due Date:{' '}
              {dueDate
                ? new Date(dueDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : 'Not set'}
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                DateTimePickerAndroid.open({
                  mode: 'date',
                  value: dueDate ? new Date(dueDate) : new Date(),
                  onChange: (event, selectedDate) => {
                    if (selectedDate) {
                      setDueDate(selectedDate);
                      DateTimePickerAndroid.dismiss();
                    }
                  },
                });
              }}
            >
              <Text style={styles.dateButtonText}>Set Date/Time</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bulletButton: {
    width: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bulletMark: {
    fontSize: 18,
    marginRight: 5,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
  },
  removeBulletText: {
    color: 'red',
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  dateButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 5,
  },
  dateButtonText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
});
