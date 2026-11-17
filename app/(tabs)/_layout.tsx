import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { theme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarStyle: { height: 66, paddingTop: 8, paddingBottom: 8, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Beranda', tabBarLabel: 'Beranda', tabBarIcon: ({ color }) => <TabIcon symbol="⌂" color={color} /> }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transaksi', tabBarLabel: 'Transaksi', tabBarIcon: ({ color }) => <TabIcon symbol="↕" color={color} /> }} />
      <Tabs.Screen name="reports" options={{ title: 'Laporan', tabBarLabel: 'Laporan', tabBarIcon: ({ color }) => <TabIcon symbol="▥" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Pengaturan', tabBarLabel: 'Pengaturan', tabBarIcon: ({ color }) => <TabIcon symbol="⚙" color={color} /> }} />
    </Tabs>
  );
}

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return <Text style={{ color, fontSize: 21, fontWeight: '700' }}>{symbol}</Text>;
}