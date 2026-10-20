# Restaurant Management System
**Stack:** React + Vite frontend, Laravel 12 REST API, Laravel Sanctum token authentication, MySQL.

A student-friendly full-stack restaurant system for managing menu items, customer orders, order items, and order status. The React frontend and Laravel API are separate apps.

## Database
Create a MySQL database named **`restaurant_management_system`** (utf8mb4). Laravel migrations create the tables.

## Features
- Register, login, logout, and current-user endpoint using Sanctum bearer tokens
- Roles: `admin` and `staff`; admin-only menu management and user-role management endpoints
- Menu item CRUD; order CRUD; order items linked to menu items
- Search/filter menu items and orders
- API pagination displayed in React
- Dashboard summary figures: menu items, total orders, pending orders, and sales from completed orders
- Order status workflow: `pending → preparing → ready → completed` (staff/admin can update; cancel is allowed for admin)
- Frontend and backend validation, loading/error/success feedback, delete confirmation
- Seed data: admin, staff, menu items, and sample orders
- ERD and endpoint reference in `docs/`

## Requirements
- PHP 8.2+, Composer, MySQL/MariaDB, Node.js 20+, npm
- XAMPP users: start Apache and MySQL; Laravel itself runs with `php artisan serve`

## Setup (Windows / XAMPP)

### 1. Extract and create database
Extract this ZIP. Open phpMyAdmin at `http://localhost/phpmyadmin`, create database:
`restaurant_management_system`
Use `utf8mb4_unicode_ci` if asked.

### 2. Start backend
Open PowerShell in the extracted folder, then:

```powershell
cd backend
Copy-Item .env.example .env
composer install
php artisan key:generate
```

Edit `backend/.env` and set your MySQL credentials. For a typical XAMPP install:
```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_management_system
DB_USERNAME=root
DB_PASSWORD=
```
If your MySQL root account has a password, put it in `DB_PASSWORD`.

Then run:
```powershell
php artisan migrate --seed
php artisan serve
```
Backend URL: `http://127.0.0.1:8000`

Seeded accounts (change passwords before real use):
- Admin: `admin@restaurant.test` / `password`
- Staff: `staff@restaurant.test` / `password`

### 3. Start frontend (keep backend running)
Open a second PowerShell window:
```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```
Open the URL Vite prints, usually `http://localhost:5173`.

### 4. Test the app
Log in with either demo account. Admin can manage menu items. Both roles can view menu/orders and create/manage orders. Order status can be advanced from the order list.

## API quick reference
Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/register` | Public | Register staff account (role is forced to staff) |
| POST | `/login` | Public | Return bearer token |
| GET | `/user` | Auth | Current user |
| POST | `/logout` | Auth | Revoke current token |
| GET | `/dashboard` | Auth | Summary figures |
| GET/POST | `/menu-items` | Auth / Admin for create | List with search/category/pagination; create |
| GET/PUT/DELETE | `/menu-items/{id}` | Auth / Admin | Show/update/delete |
| GET/POST | `/orders` | Auth | List orders; create order |
| GET/PUT/DELETE | `/orders/{id}` | Auth / Admin delete | Show/update/delete |
| PATCH | `/orders/{id}/status` | Auth | Change order status with allowed workflow |
| GET | `/categories` | Auth | Menu categories |

## Notes
- API errors use standard HTTP status codes and Laravel validation responses (422).
- Sanctum tokens are sent as `Authorization: Bearer <token>`.
- This is a local learning project, not production-hardened. Configure HTTPS, rate limiting, backups, and stronger passwords before deployment.
- AI assistance was used to scaffold this project; review, test, and understand it before submitting. Follow your instructor's academic-integrity rules.
# Restaurant_Management_System
