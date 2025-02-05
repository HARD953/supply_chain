import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const businessTypes = [
  {
    id: '1',
    name: 'Fabricant',
    icon: 'factory',
    description: 'Producteur de biens industriels',
    colors: ['#f97316', '#fdba74'],
    textColor: '#fff7ed'
  },
  {
    id: '2',
    name: 'Grossiste',
    icon: 'warehouse',
    description: 'Distribution en gros à grande échelle',
    colors: ['#22c55e', '#4ade80'],
    textColor: '#f0fdf4'
  },
  {
    id: '3',
    name: 'Semi-Grossiste',
    icon: 'store',
    description: 'Distribution intermédiaire spécialisée',
    colors: ['#a855f7', '#c084fc'],
    textColor: '#faf5ff'
  },

  {
    id: '5',
    name: 'Fabricant',
    icon: 'factory',
    description: 'Producteur de biens industriels',
    colors: ['#f97316', '#fdba74'],
    textColor: '#fff7ed'
  },
  {
    id: '6',
    name: 'Grossiste',
    icon: 'warehouse',
    description: 'Distribution en gros à grande échelle',
    colors: ['#22c55e', '#4ade80'],
    textColor: '#f0fdf4'
  },
  {
    id: '7',
    name: 'Semi-Grossiste',
    icon: 'store',
    description: 'Distribution intermédiaire spécialisée',
    colors: ['#a855f7', '#c084fc'],
    textColor: '#faf5ff'
  },
  {
    id: '8',
    name: 'Détaillant',
    icon: 'shopping-outline',
    description: 'Vente au détail direct aux consommateurs',
    colors: ['#3b82f6', '#60a5fa'],
    textColor: '#eff6ff'
  },
  {
    id: '4',
    name: 'Détaillant',
    icon: 'shopping-outline',
    description: 'Vente au détail direct aux consommateurs',
    colors: ['#3b82f6', '#60a5fa'],
    textColor: '#eff6ff'
  }
];

const BusinessTypeSelection = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    navigation.navigate('ProductCatalog', { businessType: type });
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Retour"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Type d'Entreprise</Text>
          <Text style={styles.headerSubtitle}>Sélectionnez votre catégorie</Text>
        </View>
        <View style={styles.placeholderView} />
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {businessTypes.map((type) => {
            const isSelected = selectedType === type;

            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleTypeSelection(type)}
                style={styles.typeButtonContainer}
                activeOpacity={0.7}
                accessibilityLabel={`Sélectionner ${type.name}`}
                accessibilityHint="Double-tap pour choisir ce type d'entreprise"
              >
                <BlurView 
                  intensity={isSelected ? 0 : 50} 
                  style={[
                    styles.blurBackground,
                    { 
                      backgroundColor: isSelected 
                        ? type.colors[0] 
                        : 'rgba(255,255,255,0.7)'
                    }
                  ]}
                >
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons
                      name={type.icon}
                      color={isSelected ? 'white' : type.colors[0]}
                      size={40}
                    />
                    <Text
                      style={[
                        styles.typeName,
                        { color: isSelected ? 'white' : 'black' }
                      ]}
                    >
                      {type.name}
                    </Text>
                    <Text
                      style={[
                        styles.typeDescription,
                        {
                          color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280',
                        }
                      ]}
                    >
                      {type.description}
                    </Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderView: {
    width: 40
  },
  contentContainer: {
    marginTop: -30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 40
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  typeButtonContainer: {
    width: width * 0.42,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    })
  },
  blurBackground: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'center'
  },
  typeDescription: {
    fontSize: 14,
    textAlign: 'center',
  }
});

export default BusinessTypeSelection;