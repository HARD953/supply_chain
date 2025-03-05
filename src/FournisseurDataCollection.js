import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = 'https://supply-3.onrender.com/api/fournisseurs';

const FournisseurDataCollection = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    image: null,
    coordonnees: {
      telephone: '',
      email: '',
      adresse: ''
    },
    delaiLivraison: '',
    frequenceCommandes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const typesFournisseur = [
    { label: 'Grossiste', value: 'WHOLESALER' },
    { label: 'Fabricant', value: 'MANUFACTURER' },
    { label: 'Importateur', value: 'IMPORTER' },
    { label: 'Distributeur local', value: 'LOCAL_DISTRIBUTOR' },
    { label: 'Producteur agricole', value: 'AGRICULTURAL_PRODUCER' }
  ];

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie.');
    }
  };

  React.useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          image: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  const validateForm = () => {
    if (!formData.nom) {
      Alert.alert('Erreur', 'Le nom du fournisseur est requis');
      return false;
    }
    if (!formData.type) {
      Alert.alert('Erreur', 'Le type de fournisseur est requis');
      return false;
    }
    if (!formData.coordonnees.telephone) {
      Alert.alert('Erreur', 'Le numéro de téléphone est requis');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Préparer les données pour l'API
      const formDataToSend = new FormData();
      
      if (formData.image) {
        const imageFileName = formData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(imageFileName);
        const imageType = match ? `image/${match[1]}` : 'image';
        
        formDataToSend.append('image', {
          uri: formData.image,
          name: imageFileName,
          type: imageType
        });
      }

      const apiData = {
        name: formData.nom,
        type: formData.type,
        delivery_time: parseInt(formData.delaiLivraison) || 0,
        order_frequency: formData.frequenceCommandes,
        contact: {
          phone: formData.coordonnees.telephone,
          email: formData.coordonnees.email,
          address: formData.coordonnees.adresse
        }
      };

      // Ajouter les données JSON à FormData
      formDataToSend.append('data', JSON.stringify(apiData));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      Alert.alert(
        'Succès',
        'Le fournisseur a été enregistré avec succès',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate("CommercialDataRecap") 
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'enregistrement du fournisseur'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ImageSelector = ({ image }) => (
    <View style={styles.imageContainer}>
      <Text style={styles.inputLabel}>Logo ou image du fournisseur</Text>
      <TouchableOpacity 
        style={styles.imageSelector} 
        onPress={pickImage}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
            <Text style={styles.imagePlaceholderText}>Ajouter une image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouveau Fournisseur</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formSection}>
          <LinearGradient
            colors={['#ffffff', '#f8f8f8']}
            style={styles.gradientCard}
          >
            <Text style={styles.sectionTitle}>Informations du fournisseur</Text>
            
            <ImageSelector image={formData.image} />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom du fournisseur</Text>
              <TextInput
                style={styles.input}
                value={formData.nom}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
                placeholder="Entrez le nom du fournisseur"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Type de fournisseur</Text>
              <Picker
                selectedValue={formData.type}
                style={styles.picker}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <Picker.Item label="Sélectionnez le type" value="" />
                {typesFournisseur.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.subSectionTitle}>Coordonnées</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={formData.coordonnees.telephone}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  coordonnees: { ...prev.coordonnees, telephone: text }
                }))}
                placeholder="Numéro de téléphone"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.coordonnees.email}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  coordonnees: { ...prev.coordonnees, email: text }
                }))}
                placeholder="Adresse email"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Adresse</Text>
              <TextInput
                style={styles.input}
                value={formData.coordonnees.adresse}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  coordonnees: { ...prev.coordonnees, adresse: text }
                }))}
                placeholder="Adresse complète"
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Délai de livraison moyen (jours)</Text>
              <TextInput
                style={styles.input}
                value={formData.delaiLivraison}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  delaiLivraison: text 
                }))}
                placeholder="Nombre de jours"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fréquence des commandes</Text>
              <TextInput
                style={styles.input}
                value={formData.frequenceCommandes}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  frequenceCommandes: text 
                }))}
                placeholder="Ex: Hebdomadaire, Mensuelle..."
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer le fournisseur</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  gradientCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#444',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageSelector: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default FournisseurDataCollection;