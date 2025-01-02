import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeDashboard = ({ navigation }) => {
  // Données de démonstration
  const stats = {
    totalBoutiques: 156,
    totalProduits: 1234,
    totalFournisseurs: 45,
    collectesAujourdhui: 23
  };

  const recentesCollectes = [
    { id: 1, nom: "Boutique Aminata", type: "Boutique", date: "2024-03-23", statut: "complété" },
    { id: 2, nom: "Super Marché Express", type: "Supermarché", date: "2024-03-23", statut: "en cours" },
    { id: 3, nom: "Kiosque Mobile", type: "Boutique", date: "2024-03-22", statut: "complété" },
    { id: 4, nom: "Grossiste Central", type: "Grossiste", date: "2024-03-22", statut: "en attente" }
  ];

  const graphData = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        data: [15, 22, 18, 25, 20, 12, 23],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`  // Bleu pour le graphique
      }
    ]
  };

  const renderStatCard = (title, value, icon, colors) => (
    <LinearGradient
      colors={colors}
      style={styles.statCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statCardIcon}>
          <MaterialIcons name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Text style={styles.statCardValue}>{value}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tableau de Bord</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CommercialDataCollection')}
          style={styles.addButton}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Statistiques */}
        <View style={styles.statsGrid}>
          {renderStatCard("Boutiques", stats.totalBoutiques, "store", ["#4c669f", "#3b5998"])}
          {renderStatCard("Supèrette", stats.totalProduits, "inventory", ["#b937a8", "#8e2de2"])}
          {renderStatCard("SuperMarché", stats.totalBoutiques, "store", ["#4c669f", "#3b5998"])}
          {renderStatCard("Quincaillerie", stats.totalProduits, "inventory", ["#b937a8", "#8e2de2"])}
          {renderStatCard("Petit commerce", stats.totalFournisseurs, "people", ["#00b09b", "#96c93d"])}
          {renderStatCard("Aujourd'hui", stats.collectesAujourdhui, "today", ["#ff416c", "#ff4b2b"])}
        </View>

        {/* Graphique des collectes */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Collectes cette semaine</Text>
          <LineChart
            data={graphData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            style={styles.chart}
            bezier
          />
        </View>

        {/* Liste des collectes récentes */}
        <View style={styles.recentCollectes}>
          <Text style={styles.sectionTitle}>Collectes Récentes</Text>
          {recentesCollectes.map(collecte => (
            <TouchableOpacity 
              key={collecte.id}
              style={styles.collecteItem}
              onPress={() => navigation.navigate('CollecteDetails', { id: collecte.id })}
            >
              <View style={styles.collecteInfo}>
                <Text style={styles.collecteName}>{collecte.nom}</Text>
                <Text style={styles.collecteType}>{collecte.type}</Text>
              </View>
              <View style={styles.collecteStatus}>
                <Text style={[
                  styles.statusText,
                  { 
                    color: collecte.statut === 'complété' ? '#2563EB' : 
                           collecte.statut === 'en cours' ? '#60A5FA' : '#94A3B8'
                  }
                ]}>
                  {collecte.statut.toUpperCase()}
                </Text>
                <Text style={styles.collecteDate}>{collecte.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 40) / 2,
    height: height / 8,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statCardContent: {
    alignItems: 'flex-start',
  },
  statCardIcon: {
    marginBottom: 8,
  },
  statCardTitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  statCardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E3A8A',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recentCollectes: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E3A8A',
  },
  collecteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  collecteInfo: {
    flex: 1,
  },
  collecteName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  collecteType: {
    fontSize: 14,
    color: '#64748b',
  },
  collecteStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  collecteDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default HomeDashboard;