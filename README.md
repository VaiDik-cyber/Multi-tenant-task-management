# Multi-Tenant Task Management System

A production-ready, scalable backend with a premium React Kanban frontend.

## 🚀 Quick Start

### 1. Start Infrastructure (Database)
The database is containerized for easy setup.
```bash
docker-compose up -d
```
This will start a MySQL 8.0 instance on port `3306` and auto-initialize the schema using `init.sql`.

### 2. Start Backend API
```bash
# Install dependencies
npm install

# Setup Environment
cp .env.example .env
# (Default values in .env.example are compatible with the Docker DB)

# Run Server
node index.js
```
The backend API runs on `http://localhost:3000`.

### 3. Start Frontend (Client)
```bash
cd client
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

## 🔑 Login Credentials
-   **Email**: `admin@testorg.com`
-   **Password**: `password123`

## 📚 Documentation
-   [DECISIONS.md](./DECISIONS.md): Why we chose MySQL (ACID) over MongoDB and Optimistic Locking vs Table Locking.
-   [LIMITATIONS.md](./LIMITATIONS.md): Known limitations (Email Notifications, Refresh Tokens) and future roadmap.

## 🛠️ Architecture
-   **Backend**: Node.js + Express + MySQL (Normalized 3NF Schema).
-   **Frontend**: React + Redux Toolkit + Framer Motion + Dnd Kit.
-   **Security**: JWT Auth, RBAC, Tenant Isolation (Organization ID).
-   **Concurrency**: Optimistic Locking avoids race conditions.
