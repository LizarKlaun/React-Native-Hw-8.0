import * as SQLite from 'expo-sqlite';

export interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  city: string;
  password?: string;
  gender: string;
  purpose: string;
  agreedToTerms: boolean;
  photoUri: string | null;
}

const db = SQLite.openDatabaseSync('app_data.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      birthDate TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      city TEXT NOT NULL,
      password TEXT NOT NULL,
      gender TEXT NOT NULL,
      purpose TEXT NOT NULL,
      agreedToTerms INTEGER NOT NULL,
      photoUri TEXT
    );
  `);
};

export const saveUser = (user: UserData) => {
  const result = db.runSync(
    `INSERT INTO users (firstName, lastName, birthDate, phone, email, city, password, gender, purpose, agreedToTerms, photoUri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.firstName,
      user.lastName,
      user.birthDate,
      user.phone,
      user.email,
      user.city,
      user.password || '',
      user.gender,
      user.purpose,
      user.agreedToTerms ? 1 : 0,
      user.photoUri || '',
    ]
  );
  return result.lastInsertRowId;
};

export const getUsers = (): UserData[] => {
  const rows = db.getAllSync<any>('SELECT * FROM users ORDER BY id DESC');
  return rows.map((row) => ({
    ...row,
    agreedToTerms: Boolean(row.agreedToTerms),
  }));
};