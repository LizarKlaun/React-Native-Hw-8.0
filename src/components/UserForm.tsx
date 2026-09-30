import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import * as ImagePicker from 'expo-image-picker';
import { UserData } from '../db/database';

interface FormProps {
  onSubmit: (data: UserData) => void;
  onViewList: () => void;
}

export const UserForm: React.FC<FormProps> = ({ onSubmit, onViewList }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // 3. Дата народження
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 4–6. Контактні дані
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // 7–10. Облікові дані та уподобання
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Чоловіча');
  const [purpose, setPurpose] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 11. Фото
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Помилка', 'Потрібен доступ до галереї');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Помилка', 'Заповніть обовʼязкові поля');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Увага', 'Необхідно погодитися з правилами сервісу');
      return;
    }

    const formattedDate = birthDate.toLocaleDateString('uk-UA');

    onSubmit({
      firstName,
      lastName,
      birthDate: formattedDate,
      phone,
      email,
      city,
      password,
      gender,
      purpose,
      agreedToTerms,
      photoUri,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Форма реєстрації</Text>

      {/* 1 & 2. Ім'я та Прізвище */}
      <Text style={styles.label}>Ім’я *</Text>
      <TextInput style={styles.input} placeholder="Іван" value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Прізвище *</Text>
      <TextInput style={styles.input} placeholder="Іванов" value={lastName} onChangeText={setLastName} />

      {/* 3. Дата народження */}
      <Text style={styles.label}>Дата народження</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
        <Text>{birthDate.toLocaleDateString('uk-UA')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setBirthDate(date);
          }}
        />
      )}

      {/* 4. Номер телефону */}
      <Text style={styles.label}>Номер телефону</Text>
      <TextInputMask
        type={'custom'}
        options={{ mask: '+380 (99) 999-99-99' }}
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        placeholder="+380 (__) ___-__-__"
        keyboardType="phone-pad"
      />

      {/* 5. Email */}
      <Text style={styles.label}>Електронна пошта *</Text>
      <TextInput style={styles.input} placeholder="example@mail.com" keyboardType="email-address" value={email} onChangeText={setEmail} />

      {/* 6. Місто */}
      <Text style={styles.label}>Місто проживання</Text>
      <TextInput style={styles.input} placeholder="Київ" value={city} onChangeText={setCity} />

      {/* 7. Пароль */}
      <Text style={styles.label}>Пароль *</Text>
      <TextInput style={styles.input} placeholder="******" secureTextEntry value={password} onChangeText={setPassword} />

      {/* 8. Стать */}
      <Text style={styles.label}>Стать</Text>
      <View style={styles.row}>
        {['Чоловіча', 'Жіноча'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, gender === g && styles.chipSelected]}
            onPress={() => setGender(g)}
          >
            <Text style={gender === g ? styles.chipTextSelected : styles.chipText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 9. Мета реєстрації */}
      <Text style={styles.label}>Основна мета реєстрації</Text>
      <TextInput style={styles.input} placeholder="Наприклад: Навчання" value={purpose} onChangeText={setPurpose} />

      {/* 10. Чекбокс */}
      <View style={styles.checkboxContainer}>
        <Switch value={agreedToTerms} onValueChange={setAgreedToTerms} />
        <Text style={styles.checkboxText}>Погоджуюсь із правилами сервісу та обробкою даних</Text>
      </View>

      {/* 11. Фото */}
      <Text style={styles.label}>Фото</Text>
      <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
        <Text style={styles.photoBtnText}>Обрати фото</Text>
      </TouchableOpacity>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.avatar} />}

      {/* Кнопки збереження та переходу */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Зберегти в БД</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={onViewList}>
        <Text style={styles.secondaryBtnText}>Переглянути збережені дані 📋</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  dateBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  chipSelected: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 10 },
  checkboxText: { flex: 1, fontSize: 13 },
  photoBtn: { backgroundColor: '#e2e8f0', padding: 10, borderRadius: 8, alignItems: 'center', marginVertical: 8 },
  photoBtnText: { color: '#334155', fontWeight: '600' },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginVertical: 8 },
  submitBtn: { backgroundColor: '#10b981', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { padding: 14, alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { color: '#2563eb', fontWeight: '600' },
});