import { useCallback, useState } from 'react';
import { ScrollView, Text, View, Pressable, RefreshControl } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getMonthSummary, getRecentTransactions, type Transaction } from '@/db/database';
import { formatRupiah, formatDate } from '@/components/format';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    const [s, t] = await Promise.all([getMonthSummary(db), getRecentTransactions(db, 5)]);
    setSummary(s); setRecent(t);
  }, [db]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const balance = summary.income - summary.expense;
  const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 28, gap: 20 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
      <View style={{ gap: 4 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 13 }}>CATAT UANG PRIBADI</Text>
        <Text style={{ color: theme.colors.text, fontSize: 27, fontWeight: '800' }}>Ringkasan keuangan</Text>
        <Text style={{ color: theme.colors.muted }}>{monthName}</Text>
      </View>
      <View style={{ backgroundColor: theme.colors.dark, borderRadius: 24, padding: 22, gap: 12 }}>
        <Text style={{ color: '#D3E7DA', fontSize: 13 }}>Saldo bersih bulan ini</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '800' }}>{formatRupiah(balance)}</Text>
        <View style={{ height: 1, backgroundColor: '#FFFFFF30' }} />
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <View style={{ flex: 1, gap: 5 }}><Text style={{ color: '#C8E7D2', fontSize: 12 }}>↗ Pemasukan</Text><Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>{formatRupiah(summary.income)}</Text></View>
          <View style={{ flex: 1, gap: 5 }}><Text style={{ color: '#FFD2D2', fontSize: 12 }}>↘ Pengeluaran</Text><Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>{formatRupiah(summary.expense)}</Text></View>
        </View>
      </View>
      <Link href="/add" asChild><Pressable style={{ backgroundColor: theme.colors.primary, borderRadius: 16, padding: 16, alignItems: 'center' }}><Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>＋ Tambah transaksi</Text></Pressable></Link>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.text }}>Transaksi terbaru</Text><Link href="/(tabs)/transactions" style={{ color: theme.colors.primary, fontWeight: '700' }}>Lihat semua</Link></View>
        {recent.length === 0 ? <View style={{ backgroundColor: theme.colors.surface, padding: 24, borderRadius: 18, alignItems: 'center', gap: 8 }}><Text style={{ fontSize: 28 }}>🧾</Text><Text style={{ fontWeight: '700', color: theme.colors.text }}>Belum ada transaksi</Text><Text style={{ color: theme.colors.muted, textAlign: 'center' }}>Mulai catat pemasukan atau pengeluaran pertamamu.</Text></View> : recent.map(item => <TransactionRow key={item.id} item={item} />)}
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 11, textAlign: 'center' }}>Data tersimpan di perangkat ini · Bisa digunakan offline</Text>
    </ScrollView>
  );
}

function TransactionRow({ item }: { item: Transaction }) {
  const income = item.type === 'income';
  return <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: income ? theme.colors.incomeSoft : theme.colors.expenseSoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 19, color: income ? theme.colors.income : theme.colors.expense }}>{income ? '↙' : '↗'}</Text></View>
    <View style={{ flex: 1, gap: 3 }}><Text style={{ color: theme.colors.text, fontWeight: '700' }}>{item.category}</Text><Text style={{ color: theme.colors.muted, fontSize: 12 }}>{item.note || formatDate(item.transaction_date)}</Text></View>
    <Text style={{ color: income ? theme.colors.income : theme.colors.expense, fontWeight: '800' }}>{income ? '+' : '−'}{formatRupiah(item.amount)}</Text>
  </View>;
}