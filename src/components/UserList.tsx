import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { UserData } from '../db/database';

interface ListProps {
  users: UserData[];
  onBack: () => void;
}

export const UserList: React.FC<ListProps> = ({ users, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← Назад до форми</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Збережені записи ({users.length})</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.photoUri ? (
              <Image source={{ uri: item.photoUri }} style={styles.cardPhoto} />
            ) : (
              <View style={[styles.cardPhoto, styles.noPhoto]}>
                <Text style={{ fontSize: 24 }}>👤</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
              <Text>📅 Дата н.: {item.birthDate}</Text>
              <Text>📞 Тел: {item.phone}</Text>
              <Text>✉️ Email: {item.email}</Text>
              <Text>🏙️ Місто: {item.city}</Text>
              <Text>👤 Стать: {item.gender}</Text>
              <Text>🎯 Мета: {item.purpose}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  backBtn: { paddingVertical: 8, marginBottom: 10 },
  backBtnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardPhoto: { width: 70, height: 70, borderRadius: 35, marginRight: 12 },
  noPhoto: { backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
});