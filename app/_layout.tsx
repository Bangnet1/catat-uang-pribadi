import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { migrateDbIfNeeded } from '@/db/database';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="catat-uang-pribadi.db" onInit={migrateDbIfNeeded}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F7F5' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: true, title: 'Tambah Transaksi', headerBackTitle: 'Kembali' }} />
      </Stack>
    </SQLiteProvider>
  );
}