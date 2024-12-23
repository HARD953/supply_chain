import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SurfaceCollectionApp = () => {
  const [surfaces, setSurfaces] = useState([]);
  const [currentSurface, setCurrentSurface] = useState({
    nom: '',
    categorie: '',
    surface: '',
    localisation: '',
    prix: '',
    notes: ''
  });

  const categories = [
    'Alimentaire',
    'Vêtements',
    'Électronique',
    'Mobilier',
    'Autre'
  ];

  const ajouterSurface = () => {
    if (!currentSurface.nom || !currentSurface.surface || !currentSurface.categorie) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSurfaces([
      ...surfaces,
      {
        ...currentSurface,
        id: Date.now().toString(),
        dateCollecte: new Date().toISOString()
      }
    ]);

    setCurrentSurface({
      nom: '',
      categorie: '',
      surface: '',
      localisation: '',
      prix: '',
      notes: ''
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.surfaceItem}>
      <Text style={styles.itemTitle}>{item.nom}</Text>
      <Text>Catégorie: {item.categorie}</Text>
      <Text>Surface: {item.surface} m²</Text>
      <Text>Localisation: {item.localisation}</Text>
      <Text>Prix: {item.prix}€/m²</Text>
      <Text>Notes: {item.notes}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom de la surface"
          value={currentSurface.nom}
          onChangeText={(text) => setCurrentSurface({...currentSurface, nom: text})}
        />

        <Picker
          selectedValue={currentSurface.categorie}
          style={styles.picker}
          onValueChange={(value) => setCurrentSurface({...currentSurface, categorie: value})}
        >
          <Picker.Item label="Sélectionnez une catégorie" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Surface (m²)"
          value={currentSurface.surface}
          onChangeText={(text) => setCurrentSurface({...currentSurface, surface: text})}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Localisation"
          value={currentSurface.localisation}
          onChangeText={(text) => setCurrentSurface({...currentSurface, localisation: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="Prix au m²"
          value={currentSurface.prix}
          onChangeText={(text) => setCurrentSurface({...currentSurface, prix: text})}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Notes additionnelles"
          value={currentSurface.notes}
          onChangeText={(text) => setCurrentSurface({...currentSurface, notes: text})}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={ajouterSurface}>
          <Text style={styles.buttonText}>Ajouter la surface</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={surfaces}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#b937a8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  surfaceItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default SurfaceCollectionApp;