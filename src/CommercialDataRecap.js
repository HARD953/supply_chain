import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const DataCard = ({ title, children }) => (
  <LinearGradient
    colors={['#ffffff', '#f8f8f8']}
    style={styles.card}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </LinearGradient>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'Non renseigné'}</Text>
  </View>
);

const ImagePreview = ({ uri, title }) => (
  <View style={styles.imageContainer}>
    <Text style={styles.imageTitle}>{title}</Text>
    {uri ? (
      <Image source={{ uri }} style={styles.image} />
    ) : (
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="image-not-supported" size={40} color="#666" />
        <Text style={styles.placeholderText}>Pas d'image</Text>
      </View>
    )}
  </View>
);

const CommercialDataRecap = ({ route, navigation }) => {
  // Dans un cas réel, ces données viendraient des props de navigation ou d'un store
  const data = {
    boutique: {
      nom: "Ma Boutique",
      type: "Supérette",
      adresse: "123 Rue du Commerce",
      latitude: "12.3456",
      longitude: "78.9012",
      image: null,
      proprietaire: {
        nom: "John Doe",
        genre: "Homme",
        telephone: "+221 77 123 45 67",
        email: "john@example.com"
      }
    },
    produits: [
      {
        nom: "Produit 1",
        categorie: "Alimentation",
        prix: "1000",
        quantiteStock: "50",
        image: null
      }
    ],
    fournisseurs: [
      {
        nom: "Fournisseur 1",
        type: "Grossiste",
        delaiLivraison: "3",
        image: null
      }
    ]
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Récapitulatif</Text>
      </View>
      </LinearGradient>
      <ScrollView style={styles.content}>
        <DataCard title="Informations de la boutique">
          <ImagePreview uri={data.boutique.image} title="Photo de la boutique" />
          <InfoRow label="Nom" value={data.boutique.nom} />
          <InfoRow label="Type" value={data.boutique.type} />
          <InfoRow label="Adresse" value={data.boutique.adresse} />
          <InfoRow label="Coordonnées GPS" value={`${data.boutique.latitude}, ${data.boutique.longitude}`} />
          
          <Text style={styles.subTitle}>Propriétaire</Text>
          <InfoRow label="Nom" value={data.boutique.proprietaire.nom} />
          <InfoRow label="Genre" value={data.boutique.proprietaire.genre} />
          <InfoRow label="Téléphone" value={data.boutique.proprietaire.telephone} />
          <InfoRow label="Email" value={data.boutique.proprietaire.email} />
        </DataCard>

        <DataCard title="Produits">
          {data.produits.map((produit, index) => (
            <View key={index} style={styles.subSection}>
              <ImagePreview uri={produit.image} title={`Photo du produit ${index + 1}`} />
              <InfoRow label="Nom" value={produit.nom} />
              <InfoRow label="Catégorie" value={produit.categorie} />
              <InfoRow label="Prix" value={`${produit.prix} FCFA`} />
              <InfoRow label="Stock" value={produit.quantiteStock} />
            </View>
          ))}
        </DataCard>

        <DataCard title="Fournisseurs">
          {data.fournisseurs.map((fournisseur, index) => (
            <View key={index} style={styles.subSection}>
              <ImagePreview uri={fournisseur.image} title={`Photo du fournisseur ${index + 1}`} />
              <InfoRow label="Nom" value={fournisseur.nom} />
              <InfoRow label="Type" value={fournisseur.type} />
              <InfoRow label="Délai de livraison" value={`${fournisseur.delaiLivraison} jours`} />
            </View>
          ))}
        </DataCard>

        <TouchableOpacity 
          style={styles.exportButton}
          onPress={() => {
            // Logique d'export à implémenter
            alert('Export des données en cours...');
          }}
        >
          <MaterialIcons name="file-download" size={24} color="#fff" />
          <Text style={styles.exportButtonText}>Exporter les données</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 8,
  },
  subSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exportButton: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  }
});

export default CommercialDataRecap;