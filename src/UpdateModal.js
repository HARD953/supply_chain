import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from './AuthContext'; // Importer useAuth pour récupérer le token

const UpdateModal = ({ visible, onClose, item, type, onUpdate, imageUri }) => {
  const { accessToken } = useAuth(); // Récupérer le token d'authentification
  const [updatedItem, setUpdatedItem] = useState({ ...item });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'shops' ? 'shops' : 'productscollecte';
      const response = await fetch(`https://supply-3.onrender.com/api/${endpoint}/${item.id}/`, {
        method: 'PUT', // ou PATCH selon votre API
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      const updatedData = await response.json();
      onUpdate(updatedData); // Mettre à jour les données localement avec la réponse du serveur
      Alert.alert('Succès', 'Les modifications ont été enregistrées.');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const renderDetails = () => {
    if (type === 'shops') {
      return (
        <>
          <Text style={styles.detailLabel}>Nom :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.name}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, name: text })}
          />
          <Text style={styles.detailLabel}>Type :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.type}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, type: text })}
          />
          <Text style={styles.detailLabel}>Type de commerce :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.typecommerce}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, typecommerce: text })}
          />
          <Text style={styles.detailLabel}>Catégorie :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.categorie}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, categorie: text })}
          />
          <Text style={styles.detailLabel}>Adresse :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.address}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, address: text })}
          />
          <Text style={styles.detailLabel}>Propriétaire :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.owner_name}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, owner_name: text })}
          />
          <Text style={styles.detailLabel}>Téléphone :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.owner_phone}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, owner_phone: text })}
          />
          <Text style={styles.detailLabel}>Email :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.owner_email}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, owner_email: text })}
          />
        </>
      );
    } else if (type === 'products') {
      return (
        <>
          <Text style={styles.detailLabel}>Nom :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.name}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, name: text })}
          />
          <Text style={styles.detailLabel}>Catégorie :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.category}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, category: text })}
          />
          <Text style={styles.detailLabel}>Prix :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.price}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, price: text })}
            keyboardType="numeric"
          />
          <Text style={styles.detailLabel}>Stock :</Text>
          <TextInput
            style={styles.detailInput}
            value={String(updatedItem.stock)}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, stock: parseInt(text) || 0 })}
            keyboardType="numeric"
          />
          <Text style={styles.detailLabel}>Fréquence d'approvisionnement :</Text>
          <TextInput
            style={styles.detailInput}
            value={updatedItem.frequence_appr}
            onChangeText={(text) => setUpdatedItem({ ...updatedItem, frequence_appr: text })}
          />
        </>
      );
    }
    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={loading}>
            <MaterialIcons name="close" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.modalImage}
                resizeMode="contain"
                onError={() => console.log('Erreur de chargement de l\'image dans le modal')}
              />
            )}
            <Text style={styles.modalTitle}>{updatedItem.name}</Text>
            {renderDetails()}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  detailInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdateModal;