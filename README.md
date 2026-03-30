# Event Nest System

Event Nest System is a full-stack event booking platform built as a final year project. It allows customers to book events, select food packages and dishes, choose decoration preferences, pay online through Stripe, track their bookings, request cancellations, and chat with the admin in real time. On the admin side, it provides a dashboard for booking management, cancellation handling, booking details, and customer communication.

## Project Overview

This project is divided into two main parts:

- `client/` - React + Vite frontend
- `server/` - Node.js + Express + MongoDB backend

The system is designed around a practical booking workflow:

1. A user registers or logs in.
2. The user creates an event booking.
3. The user selects a food package (`silver`, `gold`, or `custom`) and dishes.
4. The system calculates total cost based on guest count, package rules, and decoration.
5. The user can pay immediately or later through Stripe.
6. The customer can view bookings, request cancellation, and receive refund updates.
7. The admin can monitor bookings, manage cancel requests, and reply to customer messages.

## Main Functionalities

### Customer Features

- User registration and login with JWT-based authentication
- Event booking form with:
  - customer details
  - event type
  - date and time
  - guest count
  - food package selection
  - dish selection by category
  - decoration/theme selection
- Hall availability check for overlapping booking slots
- Dynamic pricing based on:
  - package type
  - number of guests
  - selected dishes
  - decoration choice
- Booking summary page before payment
- Stripe card payment integration
- Customer dashboard to:
  - view all own bookings
  - see payment status
  - open food details for a booking
  - edit unpaid bookings
  - cancel unpaid bookings directly
  - request admin approval for paid booking cancellation
- Refund flow after admin accepts cancellation
- Real-time messaging/chat with admin using Socket.IO
- Public menu exploration page for food items

### Admin Features

- Default admin seeding on backend startup
- Admin dashboard with:
  - total bookings count
  - pending cancellation requests count
  - recent bookings list
- View all customer bookings
- View single booking with populated customer and food details
- Accept or reject booking cancellation requests
- Access customer message list
- Open one-to-one chat with customers

### Backend/API Features

- Modular Express routing
- MongoDB models for users, bookings, foods, messages, payments, notifications, events, and modifications
- JWT route protection and role-based admin authorization
- Stripe PaymentIntent creation and payment confirmation
- Stripe refund processing for approved cancellations
- Socket.IO authentication using JWT token

## Booking and Pricing Logic

The booking module includes practical business rules:

- Each booking blocks a 6-hour time slot.
- New bookings are checked against existing bookings on the same date.
- `silver` and `gold` packages enforce per-category item limits.
- `custom` package calculates per-guest food cost from selected dishes.
- Decoration cost is added separately to the total amount.
- Paid bookings cannot be edited.
- Paid bookings require admin approval before cancellation/refund.

## Food Categories in the System

The menu and booking flow currently support these food categories:

- starters
- salads
- mainCourse
- desserts
- drinks
- beverages

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Stripe React SDK
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Stripe
- Socket.IO
- dotenv

## Folder Structure

```text
Event nest system/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- assets/
|   |   |-- config/
|   |   `-- utils/
|   |-- public/
|   `-- package.json
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- data/
|   |-- database/
|   |-- middleware/
|   |-- models/
|   |-- router/
|   |-- seeders/
|   |-- utils/
|   |-- app.js
|   |-- server.js
|   `-- package.json
|-- package.json
`-- README.md
```

## Important Frontend Pages

- `/` - Home page
- `/booking` - Event booking form
- `/summary-booking` - Booking summary before payment
- `/payment` - Stripe payment checkout
- `/my-bookings` - Customer dashboard
- `/messages` - Customer chat with admin
- `/menu` - Public food menu
- `/admin` - Admin dashboard
- `/admin/all-bookings` - Admin bookings list
- `/admin/booking/:id` - Booking details
- `/admin/cancel-req` - Cancellation management
- `/admin/messages` - Admin customer message list
- `/admin/messages/:id` - Admin chat screen

## Main API Modules

Base backend URL pattern:

```text
/api/v1
```

Available route groups:

- `/auth` - register and login
- `/bookings` - booking creation, availability, user bookings
- `/customers` - customer booking updates and cancellation actions
- `/payment` - Stripe payment flow
- `/refund` - refund processing
- `/admin` - admin booking management and dashboard stats
- `/messages` - customer/admin messaging
- `/foods` - food list and category filters
- `/event` - event records
- `/notification` - notifications
- `/modification` - modification request handling

## Environment Variables

Create a backend environment file for the server and add values similar to the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123!
```

Create a frontend environment file inside `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Installation and Setup

### 1. Clone the project

```bash
git clone <your-repository-url>
cd "Event nest system"
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Install frontend dependencies

```bash
cd ../client
npm install
```

## Run the Project Locally

Open two terminals.

### Terminal 1: Start backend

```bash
cd server
npm run dev
```

### Terminal 2: Start frontend

```bash
cd client
npm run dev
```

Frontend usually runs on:

```text
http://localhost:5173
```

Backend usually runs on:

```text
http://localhost:5000
```

## Seeded Admin

On server startup, the backend checks whether an admin already exists. If not, it creates a default admin user using:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

This makes admin access easier during development and demo setup.

## Current Data Models

The backend currently includes models for:

- User
- Booking
- Payment
- Food
- Message
- Notification
- Event
- Modification

## Notes

- Authentication is token-based using JWT.
- Real-time chat uses authenticated Socket.IO connections.
- Booking/payment/refund flow is already connected across frontend and backend modules.
- There is no dedicated automated test suite configured yet in the root project.

## Author

**Ayesha Naz**

Final Year Project
