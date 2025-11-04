# DocuManage: AI-Powered Document & Legal Assistance

DocuManage is a full-stack, responsive web application designed to streamline document creation, management, and legal consultation. Powered by AI, it offers intelligent document generation from customizable templates, secure user authentication, and a built-in legal consultation module that can be integrated with your own local or cloud-based Large Language Models (LLMs).

## ✨ Features

- **Secure User Authentication**: Robust and secure user registration and login system with password encryption.
- **Role-Based Access Control**: Differentiated access for regular users and administrators, with a dedicated admin dashboard for system management.
- **Dynamic Template Management**: Create, edit, and manage document templates with custom fields, similar to Google Forms.
- **AI-Powered Document Generation**: Automatically generate documents from templates and user-provided data, with PDF export capabilities.
- **Legal Consultation Module**: An integrated chat interface for users to get legal guidance from an AI assistant.
- **Admin Dashboard**: A comprehensive dashboard for administrators to manage users, templates, documents, and system settings.
- **Custom LLM Integration**: Easily connect to your own local or cloud-based LLMs (like Ollama, LM Studio, or custom endpoints) for legal consultations.
- **Modern Tech Stack**: Built with React, TypeScript, Node.js, Express, and PostgreSQL for a fast, reliable, and scalable application.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/documanage.git
    cd documanage
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**
    - Create a PostgreSQL database for the project.
    - Create a `.env` file in the root of the project and add your database connection string and a session secret:

    ```env
    DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/your_database_name"
    SESSION_SECRET="your_super_secret_session_key"
    ```

4.  **Run database migrations:**

    ```bash
    npm run migrate
    ```

5.  **Seed the database with initial templates (optional):**

    ```bash
    npm run seed
    ```

6.  **Start the development server:**

    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## 🧑‍⚖️ Admin Access

To access the admin dashboard, you first need to create a user and then manually grant them admin privileges.

1.  **Register a new user** through the application's registration page.
2.  **Connect to your PostgreSQL database** and run the following SQL command to grant admin rights to the user:

    ```sql
    UPDATE users SET is_admin = true WHERE username = 'your_username';
    ```

3.  **Log in** with the user you just promoted to admin. You will now have access to the admin dashboard, where you can manage users, templates, and more.

## 🛠️ Built With

- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
