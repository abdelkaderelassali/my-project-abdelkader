import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const bmiImages = {
  maigreur: require('./assets/underweight.jpg'),
  normal: require('./assets/normal.jpg'),
  surpoids: require('./assets/overweight.jpg'),
  obesite: require('./assets/obese.jpg'),
  obesiteExtreme: require('./assets/extreme_obesity.jpg'),
};

const BMI_CATEGORIES = [
  {
    id: 'maigreur',
    label: 'Insuffisance pondérale',
    advice: 'Ajoutez quelques calories et demandez conseil à un spécialiste.',
    max: 18.5,
    image: bmiImages.maigreur,
  },
  {
    id: 'normal',
    label: 'Corpulence normale',
    advice: 'Continuez vos bonnes habitudes sportives et alimentaires.',
    min: 18.5,
    max: 25,
    image: bmiImages.normal,
  },
  {
    id: 'surpoids',
    label: 'Surpoids',
    advice: 'Bougez un peu plus et évitez les excès de sucre.',
    min: 25,
    max: 30,
    image: bmiImages.surpoids,
  },
  {
    id: 'obesite',
    label: 'Obésité',
    advice: 'Planifiez un suivi médical pour retrouver le bon rythme.',
    min: 30,
    max: 40,
    image: bmiImages.obesite,
  },
  {
    id: 'obesiteExtreme',
    label: 'Obésité extrême',
    advice: 'Consultez rapidement un professionnel de santé.',
    min: 40,
    image: bmiImages.obesiteExtreme,
  },
];

const sanitizeNumber = (value) => parseFloat((value || '').replace(',', '.'));
const formatBmi = (value) => value.toFixed(2).replace('.', ',');

const findCategory = (bmi) => {
  for (const category of BMI_CATEGORIES) {
    if (category.max && bmi < category.max) {
      return category;
    }
    if (!category.max && bmi >= category.min) {
      return category;
    }
  }
  return BMI_CATEGORIES[0];
};

export default function App() {
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [imc, setImc] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [message, setMessage] = useState('Votre IMC est:');

  const calculerIMC = () => {
    const poidsNum = sanitizeNumber(poids);
    const tailleNum = sanitizeNumber(taille);

    if (Number.isNaN(poidsNum) || Number.isNaN(tailleNum) || poidsNum <= 0 || tailleNum <= 0) {
      Alert.alert('Valeurs manquantes', 'Veuillez entrer un poids et une taille valides.');
      setImc(null);
      setCategorie(null);
      setMessage('Votre IMC est:');
      return;
    }

    const tailleEnMetres = tailleNum / 100;
    const bmiValue = poidsNum / (tailleEnMetres * tailleEnMetres);
    const formattedBmi = formatBmi(bmiValue);
    const currentCategory = findCategory(bmiValue);

    setImc(formattedBmi);
    setCategorie(currentCategory);
    setMessage('Votre IMC est:');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>IMC For II-Master BDCC 1</Text>
          <Image source={require('./assets/imc.jpg')} style={styles.banner} />
          <Text style={styles.subtitle}>Quel est votre IMC ?</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Poids</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre poids"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={poids}
              onChangeText={setPoids}
            />
            <Text style={styles.unit}>Kg</Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Taille</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre taille"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={taille}
              onChangeText={setTaille}
            />
            <Text style={styles.unit}>Cm</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={calculerIMC}>
            <Text style={styles.buttonText}>Calculer IMC</Text>
          </TouchableOpacity>

          <View style={styles.resultContainer}>
            <Text style={styles.resultMessage}>{message}</Text>
            {imc && <Text style={styles.resultImc}>{imc}</Text>}
            {categorie && (
              <>
                <Text style={styles.advice}>{categorie.label}</Text>
                <Text style={styles.smallAdvice}>{categorie.advice}</Text>
                <Image source={categorie.image} style={styles.resultImage} />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f0ff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 24,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4c3b63',
    textAlign: 'center',
    marginBottom: 8,
  },
  banner: {
    width: 110,
    height: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 16,
    color: '#867b92',
    textAlign: 'center',
    marginBottom: 36,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#cdbfe3',
    paddingBottom: 8,
  },
  label: {
    fontSize: 18,
    color: '#4c3b63',
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 60,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#2c2c2c',
    textAlign: 'center',
    paddingVertical: 4,
  },
  unit: {
    fontSize: 18,
    color: '#4c3b63',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  button: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resultMessage: {
    fontSize: 20,
    color: '#4c3b63',
    fontWeight: 'bold',
  },
  resultImc: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6a1b9a',
    marginTop: 8,
  },
  advice: {
    fontSize: 18,
    color: '#4c3b63',
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallAdvice: {
    fontSize: 14,
    color: '#6d6478',
    textAlign: 'center',
    marginTop: 4,
  },
  resultImage: {
    width: 110,
    height: 260,
    marginTop: 16,
    resizeMode: 'contain',
  },
});