import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SelectionModal = ({ visible, onClose, navigation }) => {
  const options = [
    { id: 1, title: "Surface", icon: "store", route: "BoutiqueDataCollection" },
    { id: 2, title: "Produit", icon: "inventory", route: "ProduitDataCollection" },
    { id: 3, title: "Fournisseur", icon: "people", route: "FournisseurDataCollection" }
  ];

  const handleOptionSelect = (route) => {
    onClose();
    navigation.navigate(route);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choisir une option</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
          
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionButton}
              onPress={() => handleOptionSelect(option.route)}
            >
              <LinearGradient
                colors={['#1E3A8A', '#3B82F6']}
                style={styles.optionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name={option.icon} size={24} color="#fff" />
                <Text style={styles.optionText}>{option.title}</Text>
                <MaterialIcons name="chevron-right" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A'
  },
  optionButton: {
    marginBottom: 12
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12
  }
});

export default SelectionModal;