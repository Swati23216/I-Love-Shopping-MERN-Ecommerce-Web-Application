# I Love Shopping

A responsive MERN storefront with customer accounts, an admin product dashboard, order tracking, and Razorpay checkout.

## Features
- React + Vite frontend
- Express + MongoDB backend
- JWT authentication
- Product catalog, search, category filtering
- Cart and secure Razorpay checkout (INR)
- Customer orders
- Admin dashboard
- Product CRUD
- Order status management
- Responsive UI

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas

## Run

### Backend
```bash
cd server
npm install
npm run dev
```

The existing `server/.env` is used as-is. If you are setting up a fresh copy, make `server/.env` from `.env.example` and enter your own MongoDB URI and JWT secret. Do not replace an existing `.env` if it contains working credentials.

### Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Environment
Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=mern_ecommerce
JWT_SECRET=change_this_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Use Razorpay test keys while developing. Payment is verified on the server against the Razorpay order and signature before an order is saved or stock is reduced. Checkout is unavailable until both Razorpay credentials are configured. Never put the key secret in the client environment or commit it.

The server connects to the database named by `MONGO_DB_NAME`, which defaults to `mern_ecommerce`; this overrides a database name embedded in the URI. `/api/health` reports whether MongoDB is connected and the selected database. In MongoDB Compass, connect using the same MongoDB URI from `server/.env`, then open the `mern_ecommerce` database and its `users`, `products`, and `orders` collections. No database records are removed when changing the database name.

## Admin and sample products
From the `server` folder, run:
```bash
npm run seed
```
This safely creates or promotes `admin@example.com` with password `Admin@123`, and adds one sample product in each collection. Existing users and products are preserved; only those five sample products are skipped if already present. The seed command resets the seeded admin account password each time it runs. Change the admin password before using the site outside local development.

Sign in at `http://localhost:5173/login`. The admin dashboard is available from the navigation at `/admin`; create, edit, and delete products and update order status there. New registrations must log in before accessing the store.

## Collections
Products can be managed in Furniture, Home decor, Clothes, Electronics, and Beauty products.
