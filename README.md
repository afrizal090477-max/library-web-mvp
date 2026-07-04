# 📚 Booky - Enterprise Digital Library System

[![React](https://img.shields.io/badge/React-18.x-20232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-Latest-593d88.svg?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

**Booky** is a modern, scalable, and intuitive digital library management platform. Designed with an enterprise-grade architecture, it delivers a seamless experience for both library patrons and administrators through a high-performance User Interface and a comprehensive Management Backoffice.

**[View Live Demo](https://library-web-mvp-tau.vercel.app/)** • **[API Documentation](https://library-backend-production-b9cf.up.railway.app/api-swagger/#/)**

---

## 🏗️ System Architecture

The application implements a decoupled architecture, separating the client-side presentation layer from the backend API services.

```mermaid
graph LR
    A[Client Browser] -->|HTTPS| B(Vercel Edge Network)
    B --> C{React App}
    C -->|State| D[(Redux Toolkit)]
    C -->|REST API| E[Railway Backend]
    E --> F[(PostgreSQL Database)]

👤 Member Domain (Client Interface)
Secure Access: JWT-based authentication with strict protected routing.
Smart Catalog: Advanced book discovery featuring dynamic search, category filtering, and rating-based recommendations.
Cart & Checkout: Temporary cart state management for borrowing books with flexible duration options (3, 5, or 10 days).
Interactive Details: Comprehensive book metadata, real-time stock validation, and user review ecosystem.
Loan Tracking: Real-time monitoring of borrowed assets with precise Active, Returned, and Overdue status indicators.

👑 Admin Domain (Backoffice)
Executive Dashboard: High-level metrics overview including total users, asset inventory, and circulation statistics.
Inventory Control: Full CRUD capabilities for Books, Categories, and Authors, optimized with automated asset handling.
Circulation Management: Real-time tracking of all book loans, return approvals, and strict overdue monitoring.
User Management: Centralized control panel for monitoring and managing library members.

Tech Stack & Engineering Standards
Built with Clean Code principles and adopting Feature-Sliced Design (FSD) to ensure long-term scalability and maintainability.
Core: React 18, TypeScript, Vite
State Management: Redux Toolkit (RTK)
Routing: React Router v6 (Data Router Architecture)
Styling: Tailwind CSS (Utility-first), Lucide React (Iconography)
Feedback & UX: Sonner (Toast notifications)


📂 Directory Structure
Plaintext
src/
├── assets/       # Static media and brand assets
├── components/   # Reusable, stateless UI components (Buttons, Modals, Cards)
├── features/     # Domain-driven feature modules (Auth, Cart, Loans)
├── hooks/        # Reusable custom React Hooks
├── layouts/      # High-level layout wrappers (AdminLayout, MainLayout)
├── lib/          # API configurations, stores, and utility functions
├── pages/        # Route-level components mapped to specific URLs
└── router.tsx    # Centralized application

🔗 API Integration
The frontend client consumes a robust RESTful API developed by Henry Rivardo.
Explore the complete endpoints and payloads via the interactive Swagger interface:

👉 Booky REST API - Swagger UI

🚀 Local Development Guide
To run this project locally, follow these steps:

Prerequisites
Node.js (v18.x or later recommended)
Package manager (npm, yarn, or pnpm)
git clone [https://github.com/afrizal090477-max/library-web-mvp.git](https://github.com/afrizal090477-max/library-web-mvp.git)
cd library-web-mvp
npm install

VITE_API_URL=[https://library-backend-production-b9cf.up.railway.app/api](https://library-backend-production-b9cf.up.railway.app/api)

npm run dev
The application will be available at http://localhost:5173

🌐 Deployment & CI/CD
This application is configured for Continuous Integration and Continuous Deployment (CI/CD) via Vercel. Every push to the main branch automatically triggers a new production build, ensuring high availability and low latency via Vercel's Global Edge Network.

Booky Digital Library © 2026.
Developed with Clean Code and Agile Craftsmanship.