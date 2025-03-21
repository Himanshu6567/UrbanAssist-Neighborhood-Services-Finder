# UrbanAssist: Neighborhood Services Finder

## 🚀 Overview

UrbanAssist is a **web application** designed to connect local service providers with users in real time. Whether you need a **Machanic, Plumber, electrician, tutor, Driver or any local service**, UrbanAssist helps you find and book verified professionals easily. The platform features authentication, real-time location-based service discovery, bookings, reviews, real-time notifications, and email notifications for booking updates.

## 🌟 Features

### 1️⃣ User Authentication

- Secure **login & signup** using JWT authentication.
- Different user roles: **Customers & Service Providers**.

### 2️⃣ Service Discovery

- **Real-time location-based search** for nearby service providers.
- Integration with **Google Maps API** to display services in a specific area.

### 3️⃣ Booking System

- Users can book a service provider and select a **preferred date & time**.
- Service providers can accept or reject bookings.
- **Email notifications** are sent to users and service providers for booking updates.

### 4️⃣ Reviews & Ratings

- Users can rate and review service providers.
- Average ratings help users make informed decisions.

### 5️⃣ Real-time Notifications

- **Socket.IO integration** for real-time notifications on bookings and status updates.
- Email notifications keep users updated about booking confirmations, cancellations, and other changes.

### 6️⃣ Service Provider Map View

- Service providers can view the **real-time path** between their location and the user's location on a map.
- Integration with **Google Maps API** for navigation assistance.

## 🛠️ Tech Stack

### 🌐 Frontend

- **React.js** – UI development
- **Tailwind CSS** – Styling & responsiveness

### 🔧 Backend

- **Node.js & Express.js** – Server-side logic
- **MongoDB & Mongoose** – Database & ORM
- **Socket.IO** – Real-time updates
- **npm Resend** – Email Notification

### 🗺️ APIs & Libraries

- **Google Maps API** – Location services
- **Cloudinary** – Image upload

## 🚀 Getting Started

### 📌 Prerequisites

- Install **Node.js** & **MongoDB**
- Get API keys for **Google Maps**

### 📥 Installation

1.  **Clone the repository**:

```sh
git clone https://github.com/Himanshu6567/UrbanAssist-Neighborhood-Services-Finder

cd UrbanAssist-Neighborhood-Services-Finder

```

2.  **Install dependencies**:

```sh
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install

```

3.  **Configure environment variables**:

- Write the following data in the existing `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
PORT=8000
cloudinary_cloud_name="cloud_name"
cloudinary_api_key="api_key"
cloudinary_api_secret="api_secret"
clientOrigin="http://localhost:5173/"
jwt_secretKay= "secret_key"

```

4.  **Run the application**:

```sh
# Start backend server
cd backend
nodemon index.js

# Start frontend server
cd ../frontend
npm run dev

```

5.  **Open in Browser**:

```sh
http://localhost:5173

```

## 🔥 Future Enhancements

- **Multilingual support** for global users.

## 📄 License

This project is licensed under the **MIT License**.

## 🤝 Contributing

Contributions are welcome! Feel free to submit **pull requests**.

## 📩 Contact

For queries, email **[himanshuchandola48@gmai.com](mailto:himanshuchandola48@gmai.com)**.

---

Made with ❤️ by **Himanshu Chandola**
