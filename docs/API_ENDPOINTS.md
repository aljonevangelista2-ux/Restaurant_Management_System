# API Endpoints
Base: `http://127.0.0.1:8000/api`. All endpoints except register/login require `Authorization: Bearer <token>`.

| Method | Endpoint | Role / access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register account (always staff role) |
| POST | `/login` | Public | Authenticate and return token |
| POST | `/logout` | Authenticated | Revoke current token |
| GET | `/user` | Authenticated | Current account |
| GET | `/dashboard` | Authenticated | Summary figures and recent orders |
| GET | `/categories` | Authenticated | Distinct menu categories |
| GET | `/menu-items?search=&category=&available=&page=1` | Authenticated | Search, filter, paginate menu |
| POST | `/menu-items` | Admin | Create menu item |
| GET | `/menu-items/{id}` | Authenticated | Show item |
| PUT | `/menu-items/{id}` | Admin | Update item |
| DELETE | `/menu-items/{id}` | Admin | Delete item if no order history references it |
| GET | `/orders?search=&status=&page=1` | Authenticated | Search/filter/paginate orders |
| POST | `/orders` | Authenticated | Create order with line items |
| GET | `/orders/{id}` | Authenticated | Show order |
| PUT | `/orders/{id}` | Authenticated | Edit pending/preparing order |
| DELETE | `/orders/{id}` | Admin | Delete order |
| PATCH | `/orders/{id}/status` | Authenticated | Change order status through allowed workflow |

Example create order JSON:
```json
{
  "customer_name": "Maria Santos",
  "table_number": "4",
  "notes": "No onions",
  "items": [
    {"menu_item_id": 1, "quantity": 2},
    {"menu_item_id": 7, "quantity": 1}
  ]
}
```
