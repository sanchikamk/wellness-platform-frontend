Project Description
Features
User authentication (JWT-based)
Counselor profile management
Appointment booking, updating, and cancellation
Payment integration with Stripe
Email notifications
Role-based access for clients and counselors
Tech Stack
Node.js, Express.js, MongoDB + Mongoose, JWT, Nodemailer, Stripe, Zoom
Installation Instructions
Clone the repository
Install dependencies
Set up environment variables
Start the server
Project Structure
Contributing
To add similar information to the wellness-platform-frontend README file, we can update it with the following content:

Markdown
# Wellness Platform Frontend

This project is the frontend part of the Wellness Platform, an online counseling platform.

---

## 🚀 Features

- 🏠 User-friendly interface for clients and counselors
- 🗓️ Appointment scheduling and management
- 💬 Real-time video sessions
- 🔔 Notifications for appointment reminders and updates(Email and Zoom)
- 📊 Dashboard for counselors to manage their profiles and sessions

---

## ⚙️ Tech Stack

- React.js
- Vite
- Redux for state management
- Axios for API calls
- Tailwind CSS for styling
- Stripe Integration
- Zoom meetings

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/sanchikamk/wellness-platform-frontend.git
cd wellness-platform-frontend
2. Install Dependencies
bash
npm install
3. Set up Environment Variables
Create a .env file in the root directory and add the following variables:

env
VITE_API_URL=your_backend_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
4. Start the Development Server
bash
npm run dev
```

🗂️ Project Structure
plaintext
wellness-platform-frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── redux/           # Redux setup
│   ├── services/        # API service calls
│   ├── styles/          # CSS and style files
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
├── .gitignore           # Git ignore file
├── package.json         # Project metadata and dependencies
├── vite.config.js       # Vite configuration


## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

##  WIP

- SSO using google, apple and facebook
- User Tour
- Intuitive UX for landing screen and appointment bookings
- Skeleton loaders
- Forget Password
- Chatbot

🤝 Contributing
Contributions are welcome! Please create an issue or submit a pull request with your changes.

© 2025 Wellness Platform. All rights reserved. Built by @sanchikamk@gmail.com
