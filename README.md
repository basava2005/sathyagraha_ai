# ⚖️ DocuManage — AI-Powered Legal Document Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)

> **Create, manage, and analyze legal documents in seconds.** DocuManage combines secure cloud storage, dynamic templates, and AI-driven insights—tailored for Indian legal workflows.

## 🚀 What’s New

- **🔍 FIR Analyzer** – Upload or paste any FIR text and receive an instant AI report: key facts, relevant IPC/CrPC sections, missing details, and next-step recommendations.
- **📄 One-Click PDFs** – Generate polished, ready-to-file documents from smart templates.
- **💬 AI Legal Chat** – Ask follow-up questions; connect your own LLM (Ollama, LM Studio, OpenAI, etc.).
- **🛡️ Bullet-proof RBAC** – Granular user & admin roles with row-level security.
- **⚡ Modern Stack** – React 18 + TypeScript + Tailwind on the front-end, Node/Express + PostgreSQL + Drizzle ORM on the back-end.

## 🚀 Quick Start (60 seconds)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/documanage.git
cd documanage
npm install              # installs root + client deps in one go
```

### 2. DB & Env
```bash
# Create PostgreSQL DB (once)
createdb documanage

# Copy example env & fill DB credentials
cp .env.example .env
# edit .env → DATABASE_URL & SESSION_SECRET
```

### 3. Migrate & Seed
```bash
npm run migrate          # creates tables
npm run seed             # optional sample templates
```

### 4. Run
```bash
npm run dev              # starts Vite + Express concurrently
```
Open <http://localhost:5173> — that’s it! 🎉

## 🧑‍⚖️ Create an Admin User

1. Register any user via the UI.  
2. Promote to admin:
```sql
UPDATE users SET is_admin = true WHERE username = 'your_username';
```
3. Refresh — Admin menu appears instantly.

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Tailwind CSS, TanStack Query, Wouter |
| Backend | Node.js, Express, Passport JWT, Multer |
| Database | PostgreSQL 15, Drizzle ORM, automatic migrations |
| AI/LLM | OpenAI, Ollama, LM-Studio — swap endpoints via UI |
| Tooling | Vite, ESLint, Prettier, Husky, Conventional Commits |

## 📸 Screenshots

| Dashboard | FIR Analyzer | Template Builder |
|-----------|--------------|------------------|
| ![Dashboard](docs/ss-dash.png) | ![FIR Analyzer](docs/ss-fir.png) | ![Templates](docs/ss-tmpl.png) |

> More in [`/docs`](docs/).

## 🤝 Contributing

We use [Conventional Commits](https://conventionalcommits.org).  
1. Fork → Feature branch → PR.  
2. `npm run lint` passes.  
3. One feature per PR, please.

## 📄 License

MIT © [Your Name](LICENSE.md).


## ✨ Core Features

| Feature | Description |
|---------|-------------|
| **🔐 Secure Auth & RBAC** | Password hashing, JWT sessions, role-based views for users/admins. |
| **📑 Smart Templates** | Drag-and-drop fields, conditional logic, instant PDF export. |
| **🤖 AI Legal Consult** | Chat interface—plug in any LLM endpoint (OpenAI, Ollama, LM-Studio). |
| **🔍 FIR Analyzer** | Upload `.txt`/`.pdf`/`.docx` FIR → AI highlights IPC/CrPC sections, issues, next steps. |
| **📊 Admin Dashboard** | Manage users, templates, documents, audits—real-time KPIs. |
| **🌍 Indian Law Ready** | Pre-loaded with IPC, CrPC, IT Act, Dowry Prohibition Act references. |
| **📱 Responsive UI** | Dark/light mode, keyboard shortcuts, mobile-first Tailwind design. |
