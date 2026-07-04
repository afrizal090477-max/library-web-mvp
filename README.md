# 📚 Booky - Enterprise Digital Library System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Booky** adalah platform manajemen perpustakaan digital terpadu berskala _enterprise_ yang dirancang untuk memberikan pengalaman peminjaman buku yang modern, cepat, dan intuitif. Sistem ini dilengkapi dengan antarmuka pengguna yang interaktif serta _dashboard_ manajemen penuh untuk administrator.

Aplikasi ini dibangun menggunakan arsitektur **Feature-Sliced Design (FSD)** pada _frontend_ untuk memastikan skalabilitas, kemudahan _maintenance_, dan performa yang optimal.

---

## ✨ Key Features

### 👤 Member Portal (User Interface)

- **Secure Authentication:** Sistem login dan registrasi berbasis JWT dengan implementasi _Protected Routes_.
- **Smart Catalog & Discovery:** Eksplorasi koleksi buku dengan fitur pencarian, filter kategori, buku rekomendasi (_rating-based_), dan _popular authors_.
- **Interactive Book Details:** Halaman detail komprehensif yang memuat pratinjau buku, metadata, dan ulasan (_reviews_) dari pembaca lain.
- **Cart & Checkout System:** Sistem _cart_ untuk menyimpan buku sementara sebelum melakukan proses konfirmasi peminjaman dengan opsi durasi fleksibel (3/5/10 hari).
- **Comprehensive Profile Management:**
  - **My Profile:** Pengelolaan data pribadi dan pembaruan avatar.
  - **Borrowed List:** Pelacakan status peminjaman secara _real-time_ (_Active, Late, Returned_) lengkap dengan perhitungan sisa durasi.
  - **Review System:** Ekosistem ulasan interaktif yang memungkinkan pengguna memberikan _rating_ dan komentar pada buku yang telah selesai dipinjam.

### 👑 Admin Control Panel (Backoffice)

- **Analytics Dashboard:** Ringkasan statistik perpustakaan, termasuk total buku, _active/overdue loans_, dan buku paling populer.
- **Inventory Management:** Modul CRUD (_Create, Read, Update, Delete_) lengkap untuk entitas Buku, Penulis (Author), dan Kategori.
- **Loan & Circulation Tracking:** Manajemen sirkulasi buku untuk memantau status peminjaman, menyetujui pengembalian, dan melacak daftar _overdue_.
- **User Management:** Pemantauan dan pengelolaan data anggota perpustakaan.

---

## 🛠️ Tech Stack & Architecture

Project ini mengadopsi teknologi _frontend_ paling modern dengan standar industri:

- **Framework:** React 18 dengan Vite untuk _HMR (Hot Module Replacement)_ yang super cepat.
- **Language:** TypeScript untuk _type-safety_ dan meminimalisir _runtime errors_.
- **State Management:** Redux Toolkit (RTK) untuk manajemen _state_ global yang terprediksi.
- **Routing:** React Router v6 dengan arsitektur _Data Router_ (Object-based routing).
- **Styling & UI:** Tailwind CSS untuk _utility-first styling_, dipadukan dengan Lucide React untuk ikonografi, dan Sonner untuk _toast notifications_.
- **Architecture Pattern:** Feature-Based Architecture (memisahkan _logic_ dan UI ke dalam folder `features/` untuk isolasi _domain_ yang lebih baik).

---

## 🔗 API Integration

Sistem _frontend_ ini terintegrasi penuh dengan RESTful API _backend_ yang dikembangkan oleh **Henry Rivardo**.
Dokumentasi interaktif API dapat diakses melalui Swagger UI:

👉 **[Booky REST API Documentation - Swagger UI](https://library-backend-production-b9cf.up.railway.app/apii-swagger/#/)**

---

## 🚀 Getting Started (Local Development)

Ikuti instruksi berikut untuk melakukan _setup environment_ dan menjalankan aplikasi di mesin lokal Anda:

### Prerequisites

- Node.js (v18.x atau terbaru)
- npm, yarn, atau pnpm

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/afrizal090477-max/library-web-mvp](https://github.com/afrizal090477-max/library-web-mvp)

   ```

2. cd library-web-mvp

3. npm install

   # or

   yarn install

4. npm run dev
5. Access the application:
   Buka http://localhost:5173 di browser pilihan Anda.

🌐 Deployment
Aplikasi ini telah dikonfigurasi untuk Continuous Integration/Continuous Deployment (CI/CD) dan di-host menggunakan infrastruktur Vercel untuk menjamin ketersediaan tinggi (high availability) dan latensi rendah melalui Global Edge Network.

© 2026 Booky Digital Library. Developed with Clean Code and Agile Craftsmanship.
