import React, { useState, useEffect } from 'react';
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
import { useAuth } from './AuthContext'; // Importer useAuth pour récupérer le token

const ProduitDataCollection = ({ navigation }) => {
  const { accessToken } = useAuth(); // Récupérer accessToken depuis AuthContext
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    frequence: '',
    image: null,
    stock: '',
    reorder_frequency: '',
    supplier: '',
  });

  const typeFrequence = [
    'Journalière',
    'Hebdomadaire',
    'Mensuelle',
    'Annuelle',
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const categoriesProduits = [
    'Alimentation',
    'Vêtements',
    'Électronique',
    'Cosmétique',
    'Mobilier',
    'Construction',
    'Autre',
  ];

  useEffect(() => {
    // Définition de la fonction pour demander les permissions
    const requestMediaLibraryPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie.');
      }
    };
  
    // Récupération de la liste des fournisseurs
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('https://supply-3.onrender.com/api/suppliername/');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des fournisseurs');
        }
        const data = await response.json();
        setSuppliers(data);
        
        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            supplier: data[0].id,
          }));
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger la liste des fournisseurs');
        console.error(error);
      } finally {
        setLoadingSuppliers(false);
      }
    };
  
    fetchSuppliers();
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
          image: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.reorder_frequency) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('frequence_appr', formData.frequence);
      formDataToSend.append('reorder_frequency', formData.reorder_frequency);
      
      console.log('Supplier ID being sent:', formData.supplier);
      console.log('Type of supplier ID:', typeof formData.supplier);
      formDataToSend.append('supplier', formData.supplier.toString());

      if (formData.image) {
        const imageUri = formData.image;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formDataToSend.append('image', {
          uri: imageUri,
          name: filename,
          type,
        });
      }

      const response = await fetch('https://supply-3.onrender.com/api/productscollecte/', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`, // Ajouter le token ici
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', errorData);
        
        if (errorData && errorData.supplier) {
          throw new Error(`Erreur avec le fournisseur : ${errorData.supplier.join(', ')}`);
        }
        
        throw new Error('Erreur lors de l\'envoi des données');
      }

      const data = await response.json();
      Alert.alert('Succès', 'Le produit a été enregistré avec succès');
      navigation.navigate("HomeDashboard");
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsLoading(false);
    }
  };

  const ImageSelector = ({ image }) => (
    <View style={styles.imageContainer}>
      <Text style={styles.inputLabel}>Image du produit</Text>
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

  const handleSupplierChange = (supplierId) => {
    const id = typeof supplierId === 'string' ? parseInt(supplierId, 10) : supplierId;
    
    console.log('Selected supplier ID:', id);
    console.log('Type after conversion:', typeof id);
    
    setFormData(prev => ({
      ...prev,
      supplier: id,
    }));
  };

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
          <Text style={styles.headerTitle}>Nouveau Produit</Text>
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
            <Text style={styles.sectionTitle}>Informations du produit</Text>
            
            <ImageSelector image={formData.image} />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom du produit</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Entrez le nom du produit"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Catégorie</Text>
              <Picker
                selectedValue={formData.category}
                style={styles.picker}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <Picker.Item label="Sélectionnez la catégorie" value="" />
                {categoriesProduits.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Fournisseur</Text>
              {loadingSuppliers ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#1E3A8A" />
                  <Text style={styles.loadingText}>Chargement des fournisseurs...</Text>
                </View>
              ) : (
                <Picker
                  selectedValue={formData.supplier}
                  style={styles.picker}
                  onValueChange={handleSupplierChange}
                >
                  {suppliers.map((supplier) => (
                    <Picker.Item 
                      key={supplier.id} 
                      label={supplier.name || supplier.nom || `Fournisseur ${supplier.id}`} 
                      value={supplier.id}
                    />
                  ))}
                </Picker>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Prix actuel (FCFA)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                placeholder="Prix du produit"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quantité en stock</Text>
              <TextInput
                style={styles.input}
                value={formData.stock}
                onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
                placeholder="Quantité disponible"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fréquence de réapprovisionnement (jours)</Text>
              <TextInput
                style={styles.input}
                value={formData.reorder_frequency}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  reorder_frequency: text 
                }))}
                placeholder="Nombre de jours entre les approvisionnements"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Fréquence d'approvisionnement</Text>
              <Picker
                selectedValue={formData.frequence}
                style={styles.picker}
                onValueChange={(value) => setFormData(prev => ({ ...prev, frequence: value }))}
              >
                <Picker.Item label="Sélectionnez la fréquence" value="" />
                {typeFrequence.map((frequence) => (
                  <Picker.Item key={frequence} label={frequence} value={frequence} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer le produit</Text>
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
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
});

export default ProduitDataCollection;