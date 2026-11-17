import { useCallback, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getRecentTransactions, type Transaction } from '@/db/database';
import { formatRupiah, formatDate } from '@/components/format';
import { theme } from '@/constants/theme';

export default function TransactionsScreen() {
  const db = useSQLiteContext();
  const [items, setItems] = useState<Transaction[]>([]);
  const load = useCallback(async () => setItems(await getRecentTransactions(db, 500)), [db]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  return <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 28, gap: 16 }}>
    <View style={{ gap: 4 }}><Text style={{ color: theme.colors.muted, fontSize: 13 }}>RIWAYAT</Text><Text style={{ color: theme.colors.text, fontSize: 27, fontWeight: '800' }}>Semua transaksi</Text><Text style={{ color: theme.colors.muted }}>{items.length} catatan tersimpan</Text></View>
    <Link href="/add" asChild><Pressable style={{ backgroundColor: theme.colors.primary, borderRadius: 15, padding: 15, alignItems: 'center' }}><Text style={{ color: 'white', fontWeight: '700' }}>＋ Catat transaksi</Text></Pressable></Link>
    {items.length === 0 ? <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 18, alignItems: 'center' }}><Text style={{ color: theme.colors.muted }}>Belum ada transaksi.</Text></View> : items.map(item => <View key={item.id} style={{ backgroundColor: 'white', borderRadius: 16, padding: 15, gap: 6 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.text, fontWeight: '700' }}>{item.category}</Text><Text style={{ color: item.type === 'income' ? theme.colors.income : theme.colors.expense, fontWeight: '800' }}>{item.type === 'income' ? '+' : '−'}{formatRupiah(item.amount)}</Text></View><Text style={{ color: theme.colors.muted, fontSize: 12 }}>{formatDate(item.transaction_date)}{item.note ? ` · ${item.note}` : ''}</Text></View>)}
  </ScrollView>;
}