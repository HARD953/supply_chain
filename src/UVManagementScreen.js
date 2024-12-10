import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Button, Card, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ColorPalette = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#4CAF50',
  BACKGROUND: '#F0F4F0',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  ACCENT: '#81C784',
  DANGER: '#D32F2F'
};

const MobileOperators = [
  { id: 'wave', name: 'WAVE', logo: require('../assets/wave.png') },
  { id: 'orange', name: 'ORANGE', logo: require('../assets/orange.jpg') },
  { id: 'mtn', name: 'MTN', logo: require('../assets/mtn.png') },
  { id: 'moov', name: 'MOOV', logo: require('../assets/moov.png') }
];

const UVManagementScreen = () => {
  const [uvBalance, setUvBalance] = useState(5000);
  const [isAddUVModalVisible, setIsAddUVModalVisible] = useState(false);
  const [uvToAdd, setUvToAdd] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'Ajout', amount: 2000, date: '2024-03-15', operator: 'WAVE', icon: 'plus-circle' },
    { id: '2', type: 'Dépense', amount: -500, date: '2024-03-20', category: 'Fournitures', icon: 'minus-circle' },
  ]);

  const selectOperator = (operator) => {
    setSelectedOperator(operator);
  };

  const addUV = () => {
    const amount = parseFloat(uvToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    if (!selectedOperator) {
      Alert.alert('Erreur', 'Veuillez sélectionner un opérateur');
      return;
    }

    const newTransaction = {
      id: `${transactions.length + 1}`,
      type: 'Ajout',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      operator: selectedOperator.name,
      icon: 'plus-circle'
    };

    setTransactions([...transactions, newTransaction]);
    setUvBalance(uvBalance + amount);
    setUvToAdd('');
    setSelectedOperator(null);
    setIsAddUVModalVisible(false);
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionItemContent}>
        <Avatar.Icon 
          size={44} 
          icon={item.icon} 
          color={item.amount > 0 ? ColorPalette.SECONDARY : ColorPalette.DANGER} 
          style={styles.transactionIcon}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={styles.transactionDate}>
            {item.date} {item.operator && `(${item.operator})`}
          </Text>
        </View>
      </View>
      <Text 
        style={[
          styles.transactionAmount, 
          { color: item.amount > 0 ? ColorPalette.PRIMARY : ColorPalette.DANGER }
        ]}
      >
        {item.amount > 0 ? '+' : ''}{item.amount} UV
      </Text>
    </View>
  );

  const chartConfig = {
    backgroundColor: ColorPalette.CARD_BACKGROUND,
    backgroundGradientFrom: ColorPalette.CARD_BACKGROUND,
    backgroundGradientTo: ColorPalette.CARD_BACKGROUND,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 }
  };

  const lineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        data: [4500, 4700, 5000, 4800, 5200, 5500],
        color: () => ColorPalette.PRIMARY,
        strokeWidth: 3
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Card style={styles.balanceCard} elevation={4}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Solde UV</Text>
            <TouchableOpacity 
              onPress={() => setIsAddUVModalVisible(true)}
              style={styles.addButton}
            >
              <MaterialCommunityIcons 
                name="plus-circle" 
                size={28} 
                color={ColorPalette.PRIMARY} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceAmountContainer}>
            <Text style={styles.balanceAmount}>{uvBalance}</Text>
            <Text style={styles.balanceAmountUnit}>UV</Text>
          </View>
        </Card>

        <Card style={styles.sectionContainer} elevation={2}>
          <Text style={styles.sectionTitle}>Évolution du Solde UV</Text>
          <LineChart
            data={lineChartData}
            width={width * 0.85}
            height={height * 0.25}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        <Card style={styles.sectionContainer} elevation={2}>
          <Text style={styles.sectionTitle}>Historique des Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            style={styles.transactionList}
            contentContainerStyle={styles.transactionListContent}
          />
        </Card>

        <Modal
          visible={isAddUVModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsAddUVModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Recharger des UV</Text>
              
              <View style={styles.operatorsContainer}>
                {MobileOperators.map((operator) => (
                  <TouchableOpacity 
                    key={operator.id} 
                    style={[
                      styles.operatorButton,
                      selectedOperator?.id === operator.id && styles.selectedOperator
                    ]}
                    onPress={() => selectOperator(operator)}
                  >
                    <Image 
                      source={operator.logo} 
                      style={styles.operatorLogo} 
                      resizeMode="contain"
                    />
                    <Text style={styles.operatorName}>{operator.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Montant des UV à recharger"
                placeholderTextColor={ColorPalette.TEXT_SECONDARY}
                keyboardType="numeric"
                value={uvToAdd}
                onChangeText={setUvToAdd}
              />
              
              <View style={styles.modalButtons}>
                <Button 
                  mode="outlined" 
                  onPress={() => setIsAddUVModalVisible(false)}
                  color={ColorPalette.PRIMARY}
                >
                  Annuler
                </Button>
                <Button 
                  mode="contained" 
                  onPress={addUV}
                  color={ColorPalette.PRIMARY}
                  disabled={!selectedOperator || !uvToAdd}
                >
                  Recharger
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.BACKGROUND,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 100,
  },
  balanceCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: ColorPalette.CARD_BACKGROUND,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    color: ColorPalette.TEXT_SECONDARY,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ColorPalette.PRIMARY,
    marginTop: 8,
  },
  balanceAmountUnit: {
    fontSize: 16,
    color: ColorPalette.TEXT_SECONDARY,
    marginLeft: 8,
  },
  sectionContainer: {
    backgroundColor: ColorPalette.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: ColorPalette.TEXT_PRIMARY,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  transactionList: {
    maxHeight: height * 0.3,
  },
  transactionListContent: {
    paddingBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.BACKGROUND,
  },
  transactionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  transactionDetails: {
    flexDirection: 'column',
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: ColorPalette.TEXT_PRIMARY,
  },
  transactionDate: {
    fontSize: 12,
    color: ColorPalette.TEXT_SECONDARY,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: ColorPalette.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: ColorPalette.TEXT_PRIMARY,
  },
  operatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  operatorButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorPalette.ACCENT,
    width: '22%',
  },
  selectedOperator: {
    backgroundColor: ColorPalette.ACCENT,
  },
  operatorLogo: {
    width: 50,
    height: 50,
  },
  operatorName: {
    fontSize: 10,
    marginTop: 5,
    color: ColorPalette.TEXT_PRIMARY,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: ColorPalette.ACCENT,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
    color: ColorPalette.TEXT_PRIMARY,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  }
});

export default UVManagementScreen;