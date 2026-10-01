# 🛍️ I Love Shopping — MERN E-Commerce Web Application

A full-stack **MERN Stack e-commerce web application** that provides a complete online shopping experience with user authentication, product browsing, shopping cart, order management, admin controls, and Razorpay payment integration.

## 🚀 Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Protected routes
* Browse products
* Search products
* Filter products by category
* View detailed product information
* Add products to cart
* Update cart quantities
* Checkout and place orders
* View order history
* View individual order details
* Responsive user interface

### 🔐 Admin Features

* Secure admin authentication
* Admin dashboard
* Add new products
* Edit product information
* Delete products
* Manage product catalog
* View customer orders
* Update order status

### 💳 Payment Integration

* Razorpay payment gateway integration
* Server-side payment verification
* Test-mode payment support
* Secure handling of payment credentials through environment variables

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* React Router
* Axios
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Payment

* Razorpay

### Development Tools

* Git
* GitHub
* VS Code
* Postman

## 📂 Project Structure

```text
I-Love-Shopping/
│
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/                 # Node.js + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   └── server.js
│
├── src/
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Make sure you have the following installed:

* Node.js 18 or later
* npm
* MongoDB or MongoDB Atlas
* Git

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Swati23216/I-Love-Shopping-MERN-Ecommerce-Web-Application.git
```

```bash
cd I-Love-Shopping-MERN-Ecommerce-Web-Application
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

You can use the provided `.env.example` as a reference.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=mern_ecommerce
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ Never commit your actual `.env` file or API secrets to GitHub.

### 4. Start the backend

From the `server` folder:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## 🗄️ Database

The application uses **MongoDB** to store:

* Users
* Products
* Orders

MongoDB can be configured using either a local MongoDB installation or MongoDB Atlas.

## 👨‍💼 Admin Setup

The project includes an admin dashboard for managing products and orders.

Admin functionality includes:

* Product creation
* Product editing
* Product deletion
* Product management
* Order status updates

For local development, sample data can be created using:

```bash
cd server
npm run seed
```

> Change any sample/default admin credentials before using the application outside local development.

## 💳 Razorpay Setup

The application supports Razorpay checkout.

For development:

1. Create a Razorpay account.
2. Generate test API credentials.
3. Add the credentials to `server/.env`.
4. Restart the backend server.

Use **test keys** during development.

Never expose the Razorpay secret key in the frontend or commit it to GitHub.

## 📱 Application Modules

| Module         | Description                                     |
| -------------- | ----------------------------------------------- |
| Authentication | User registration and JWT login                 |
| Products       | Product browsing, search and category filtering |
| Cart           | Add, remove and update products                 |
| Checkout       | Order checkout and Razorpay payment             |
| Orders         | Order history and order details                 |
| Admin          | Product and order management                    |
| Database       | MongoDB-based data storage                      |

## 🔒 Security

The project follows basic security practices including:

* JWT-based authentication
* Protected routes
* Environment variables for secrets
* Server-side payment verification
* `.gitignore` configuration to prevent sensitive files from being committed

## 🎯 Learning Outcomes

Through this project, I worked with:

* MERN Stack application development
* REST API development
* React component-based architecture
* Authentication and authorization
* MongoDB database operations
* CRUD operations
* API integration using Axios
* State management using React Context
* Payment gateway integration
* Admin dashboard development
* Git and GitHub version control

## 🔮 Future Enhancements

* Product reviews and ratings
* Wishlist functionality
* Advanced product filtering
* Pagination
* Email notifications
* Improved admin analytics
* Deployment to cloud platforms
* Automated testing

## 👩‍💻 Developer

**Swati Janawade**

MCA Graduate | MERN Stack | Python | Full-Stack Development

GitHub:
https://github.com/Swati23216

LinkedIn:
https://www.linkedin.com/in/swati-janawade-4a983a37b/

## ⭐ Project

If you find this project useful, feel free to explore the repository and provide feedback.

**I Love Shopping — A MERN Stack E-Commerce Web Application**
