import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { addTransaction, type TransactionType } from '@/db/database';
import { theme } from '@/constants/theme';
import { localDateKey } from '@/components/format';

const categories = {
  income: ['Gaji', 'Bisnis', 'Bonus', 'Investasi', 'Lainnya'],
  expense: ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Lainnya']
};

export default function AddTransactionScreen() {
  const db = useSQLiteContext();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(localDateKey());
  const [saving, setSaving] = useState(false);
  const options = categories[type];

  async function save() {
    const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) { Alert.alert('Nominal belum benar', 'Masukkan nominal lebih dari nol.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { Alert.alert('Tanggal belum benar', 'Gunakan format YYYY-MM-DD.'); return; }
    setSaving(true);
    try {
      await addTransaction(db, { type, amount: numericAmount, category, note: note.trim() || null, transaction_date: date });
      router.back();
    } catch { Alert.alert('Gagal menyimpan', 'Transaksi belum tersimpan. Silakan coba lagi.'); }
    finally { setSaving(false); }
  }

  return <><Stack.Screen options={{ title: 'Tambah Transaksi', headerShown: true, headerBackTitle: 'Kembali', headerTintColor: theme.colors.primary }} /><KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 18 }}>
    <View style={{ flexDirection: 'row', backgroundColor: '#E9EEEA', borderRadius: 14, padding: 4 }}>
      {(['expense', 'income'] as const).map(value => <Pressable key={value} onPress={() => { setType(value); setCategory(categories[value][0]); }} style={{ flex: 1, padding: 13, borderRadius: 11, alignItems: 'center', backgroundColor: type === value ? 'white' : 'transparent' }}><Text style={{ color: type === value ? theme.colors.text : theme.colors.muted, fontWeight: '700' }}>{value === 'income' ? 'Pemasukan' : 'Pengeluaran'}</Text></Pressable>)}
    </View>
    <View style={{ gap: 8 }}><Text style={{ color: theme.colors.text, fontWeight: '700' }}>Nominal (Rp)</Text><TextInput value={amount} onChangeText={setAmount} keyboardType="number-pad" placeholder="Contoh: 50000" placeholderTextColor="#9AA49D" style={{ backgroundColor: 'white', borderRadius: 15, padding: 17, fontSize: 22, fontWeight: '800', color: theme.colors.text }} /></View>
    <View style={{ gap: 10 }}><Text style={{ color: theme.colors.text, fontWeight: '700' }}>Kategori</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{options.map(value => <Pressable key={value} onPress={() => setCategory(value)} style={{ borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: category === value ? theme.colors.primarySoft : 'white', borderWidth: 1, borderColor: category === value ? theme.colors.primary : theme.colors.border }}><Text style={{ color: category === value ? theme.colors.primary : theme.colors.text, fontWeight: '600' }}>{value}</Text></Pressable>)}</View></View>
    <View style={{ gap: 8 }}><Text style={{ color: theme.colors.text, fontWeight: '700' }}>Tanggal (YYYY-MM-DD)</Text><TextInput value={date} onChangeText={setDate} placeholder="2026-11-16" style={{ backgroundColor: 'white', borderRadius: 14, padding: 15, color: theme.colors.text }} /></View>
    <View style={{ gap: 8 }}><Text style={{ color: theme.colors.text, fontWeight: '700' }}>Catatan (opsional)</Text><TextInput value={note} onChangeText={setNote} placeholder="Tambahkan keterangan..." multiline style={{ backgroundColor: 'white', borderRadius: 14, padding: 15, minHeight: 88, textAlignVertical: 'top', color: theme.colors.text }} /></View>
    <Pressable disabled={saving} onPress={save} style={{ backgroundColor: saving ? '#8BAE9A' : theme.colors.primary, borderRadius: 15, padding: 17, alignItems: 'center', marginTop: 4 }}><Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>{saving ? 'Menyimpan...' : 'Simpan transaksi'}</Text></Pressable>
  </ScrollView></KeyboardAvoidingView></>;
}