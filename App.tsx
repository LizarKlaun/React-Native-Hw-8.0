import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { initDatabase, saveUser, getUsers, UserData } from './src/db/database';
import { UserForm } from './src/components/UserForm';
import { UserList } from './src/components/UserList';

export default function App() {
  const [screen, setScreen] = useState<'form' | 'list'>('form');
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    initDatabase();
  }, []);

  const handleSave = (data: UserData) => {
    saveUser(data);
    const updated = getUsers();
    setUsers(updated);
    setScreen('list');
  };

  const handleOpenList = () => {
    setUsers(getUsers());
    setScreen('list');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {screen === 'form' ? (
        <UserForm onSubmit={handleSave} onViewList={handleOpenList} />
      ) : (
        <UserList users={users} onBack={() => setScreen('form')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});