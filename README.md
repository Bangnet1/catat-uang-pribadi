# Catat Uang Pribadi

Aplikasi pencatatan keuangan pribadi Android berbasis Expo, React Native, TypeScript, Expo Router, dan SQLite lokal.

## Fitur starter
- Dashboard ringkasan pemasukan, pengeluaran, dan saldo bersih bulan berjalan.
- Tambah transaksi pemasukan/pengeluaran dengan kategori, tanggal, dan catatan.
- Riwayat transaksi terbaru dan daftar transaksi.
- SQLite lokal; transaksi tetap tersedia tanpa internet.
- Tab laporan dan pengaturan sebagai kerangka pengembangan berikutnya.

## Menjalankan

```bash
npm install
npx expo install --fix
npx expo start
```

Buka Expo Go di Android dan pindai QR code dari terminal.

## Android APK (nanti)

```bash
npx eas-cli@latest build --platform android --profile preview
```

## Catatan penting
- Database lokal disimpan sebagai `catat-uang-pribadi.db` di penyimpanan privat aplikasi.
- Menghapus aplikasi dapat menghapus database lokal. Fitur ekspor/impor backup perlu diselesaikan sebelum penggunaan jangka panjang.
- Periksa versi Expo SDK dan kompatibilitas paket hasil `npx expo install --fix` sebelum build.
