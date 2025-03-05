import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const UpdateModal = ({ visible, onClose, item, type, onUpdate }) => {
  const [formData, setFormData] = useState(item);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://supply-3.onrender.com/api/${type}/${item.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const renderField = (key, label) => {
    if (key === 'id' || key === 'image') return null;
    
    return (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={formData[key]?.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier {item.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            {Object.keys(item).map(key => 
              renderField(key, key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '))
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
            >
              <Text style={[styles.buttonText, styles.updateButtonText]}>Mettre à jour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  formContainer: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E3A8A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  updateButton: {
    backgroundColor: '#1E3A8A',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  updateButtonText: {
    color: '#fff',
  },
});

export default UpdateModal;