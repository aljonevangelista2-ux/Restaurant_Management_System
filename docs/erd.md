# Restaurant Management System ERD

```mermaid
erDiagram
    USERS ||--o{ ORDERS : creates
    ORDERS ||--|{ ORDER_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : appears_in

    USERS {
      bigint id PK
      string name
      string email UK
      string password
      enum role
    }
    MENU_ITEMS {
      bigint id PK
      string name
      string category
      decimal price
      boolean is_available
    }
    ORDERS {
      bigint id PK
      bigint user_id FK
      string customer_name
      string table_number
      enum status
      decimal total
    }
    ORDER_ITEMS {
      bigint id PK
      bigint order_id FK
      bigint menu_item_id FK
      integer quantity
      decimal unit_price
      decimal subtotal
    }
```

`users` creates many `orders`. Each `order` contains one or more `order_items`. Each `order_item` refers to one `menu_item`; a menu item can be used in many order items. `order_items` stores the unit price at time of sale so later menu price changes do not alter old order totals.
