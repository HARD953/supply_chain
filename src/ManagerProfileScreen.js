import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  SafeAreaView
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const ManagerProfileScreen = ({ navigation }) => {
  const [managerInfo, setManagerInfo] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+225 07 00 00 00',
    boutiqueName: 'Épicerie du Centre',
    address: 'Rue des Commercants, Abidjan, Côte d\'Ivoire',
    registrationNumber: 'CI-AB-2023-1234',
    establishedDate: '15 Mars 2020',
    profileImage: 'https://via.placeholder.com/150'
  });

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil du Gérant</Text>
      </View>
    </LinearGradient>
  );

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileImageContainer}>
        <Image 
          source={{ uri: managerInfo.profileImage }} 
          style={styles.profileImage} 
        />
        <TouchableOpacity style={styles.editProfileButton}>
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.managerName}>{managerInfo.name}</Text>
      <Text style={styles.boutiqueName}>{managerInfo.boutiqueName}</Text>
    </View>
  );

  const renderInfoSection = () => {
    const infoItems = [
      { 
        icon: 'email', 
        title: 'Email', 
        value: managerInfo.email 
      },
      { 
        icon: 'phone', 
        title: 'Téléphone', 
        value: managerInfo.phone 
      },
      { 
        icon: 'map-marker', 
        title: 'Adresse', 
        value: managerInfo.address 
      },
      { 
        icon: 'certificate', 
        title: 'N° Registre Commerce', 
        value: managerInfo.registrationNumber 
      },
      { 
        icon: 'calendar', 
        title: 'Date de Création', 
        value: managerInfo.establishedDate 
      }
    ];

    return (
      <View style={styles.infoContainer}>
        {infoItems.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color="#b937a8" 
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {/* Modifier le profil */}}
      >
        <MaterialCommunityIcons name="account-edit" size={24} color="#b937a8" />
        <Text style={styles.actionButtonText}>Modifier le Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {/* Paramètres */}}
      >
        <MaterialCommunityIcons name="cog" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Paramètres</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileSection()}
        {renderInfoSection()}
        {renderActionButtons()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 20
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  scrollContainer: {
    flex: 1
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#b937a8'
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#b937a8',
    borderRadius: 20,
    padding: 8
  },
  managerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  boutiqueName: {
    fontSize: 16,
    color: '#666',
    marginTop: 5
  },
  infoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    elevation: 3
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  infoIconContainer: {
    marginRight: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10
  },
  infoTextContainer: {
    flex: 1
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    elevation: 3
  },
  actionButtonText: {
    marginLeft: 10,
    color: '#333',
    fontWeight: 'bold'
  }
});

export default ManagerProfileScreen;