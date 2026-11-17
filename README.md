# Catat Uang Pribadi

Starter aplikasi Android pencatatan keuangan pribadi memakai Expo, React Native, TypeScript, Expo Router, dan SQLite lokal.

## Status fitur
- Dashboard ringkasan pemasukan, pengeluaran, dan selisih bulan berjalan.
- Tambah transaksi pemasukan/pengeluaran dengan kategori, tanggal, catatan.
- Riwayat transaksi.
- Penyimpanan SQLite di perangkat; dapat digunakan offline.
- Laporan dan pengaturan masih berupa kerangka.

## Persiapan
```bash
npm install
npx expo install --fix
npx expo start
```

## Build APK melalui EAS
```bash
npx eas-cli@latest build --platform android --profile preview
```

Build profile `preview` menghasilkan APK. Database lokal tersimpan dalam aplikasi; uninstall aplikasi dapat menghapus data. Backup/impor belum tersedia.
