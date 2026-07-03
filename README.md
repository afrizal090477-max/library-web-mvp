# 📚 Booky - Enterprise Digital Library System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Booky** adalah platform manajemen perpustakaan digital terpadu berskala *enterprise* yang dirancang untuk memberikan pengalaman peminjaman buku yang modern, cepat, dan intuitif. Sistem ini dilengkapi dengan antarmuka pengguna yang interaktif serta *dashboard* manajemen penuh untuk administrator.

Aplikasi ini dibangun menggunakan arsitektur **Feature-Sliced Design (FSD)** pada *frontend* untuk memastikan skalabilitas, kemudahan *maintenance*, dan performa yang optimal.

---

## ✨ Key Features

### 👤 Member Portal (User Interface)
* **Secure Authentication:** Sistem login dan registrasi berbasis JWT dengan implementasi *Protected Routes*.
* **Smart Catalog & Discovery:** Eksplorasi koleksi buku dengan fitur pencarian, filter kategori, buku rekomendasi (*rating-based*), dan *popular authors*.
* **Interactive Book Details:** Halaman detail komprehensif yang memuat pratinjau buku, metadata, dan ulasan (*reviews*) dari pembaca lain.
* **Cart & Checkout System:** Sistem *cart* untuk menyimpan buku sementara sebelum melakukan proses konfirmasi peminjaman dengan opsi durasi fleksibel (3/5/10 hari).
* **Comprehensive Profile Management:**
  * **My Profile:** Pengelolaan data pribadi dan pembaruan avatar.
  * **Borrowed List:** Pelacakan status peminjaman secara *real-time* (*Active, Late, Returned*) lengkap dengan perhitungan sisa durasi.
  * **Review System:** Ekosistem ulasan interaktif yang memungkinkan pengguna memberikan *rating* dan komentar pada buku yang telah selesai dipinjam.

### 👑 Admin Control Panel (Backoffice)
* **Analytics Dashboard:** Ringkasan statistik perpustakaan, termasuk total buku, *active/overdue loans*, dan buku paling populer.
* **Inventory Management:** Modul CRUD (*Create, Read, Update, Delete*) lengkap untuk entitas Buku, Penulis (Author), dan Kategori.
* **Loan & Circulation Tracking:** Manajemen sirkulasi buku untuk memantau status peminjaman, menyetujui pengembalian, dan melacak daftar *overdue*.
* **User Management:** Pemantauan dan pengelolaan data anggota perpustakaan.

---

## 🛠️ Tech Stack & Architecture

Project ini mengadopsi teknologi *frontend* paling modern dengan standar industri:

* **Framework:** React 18 dengan Vite untuk *HMR (Hot Module Replacement)* yang super cepat.
* **Language:** TypeScript untuk *type-safety* dan meminimalisir *runtime errors*.
* **State Management:** Redux Toolkit (RTK) untuk manajemen *state* global yang terprediksi.
* **Routing:** React Router v6 dengan arsitektur *Data Router* (Object-based routing).
* **Styling & UI:** Tailwind CSS untuk *utility-first styling*, dipadukan dengan Lucide React untuk ikonografi, dan Sonner untuk *toast notifications*.
* **Architecture Pattern:** Feature-Based Architecture (memisahkan *logic* dan UI ke dalam folder `features/` untuk isolasi *domain* yang lebih baik).

---

## 🔗 API Integration

Sistem *frontend* ini terintegrasi penuh dengan RESTful API *backend* yang dikembangkan oleh **Henry Rivardo**. 
Dokumentasi interaktif API dapat diakses melalui Swagger UI:

👉 **[Booky REST API Documentation - Swagger UI](https://library-backend-production-b9cf.up.railway.app/api-swagger/#/)**

---

## 🚀 Getting Started (Local Development)

Ikuti instruksi berikut untuk melakukan *setup environment* dan menjalankan aplikasi di mesin lokal Anda:

### Prerequisites
* Node.js (v18.x atau terbaru)
* npm, yarn, atau pnpm

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/afrizal090477-max/library-web-mvp](https://github.com/afrizal090477-max/library-web-mvp)

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