# Setup troubleshooting checklist

- **`could not find driver`**: enable `pdo_mysql` in the `php.ini` used by the PHP CLI, then restart the terminal. Run `php -m` and confirm `pdo_mysql` appears.
- **MySQL access denied**: check `DB_USERNAME` and `DB_PASSWORD` in `backend/.env`.
- **Unknown database**: create `restaurant_management_system` in phpMyAdmin first.
- **Missing app key**: run `php artisan key:generate` inside `backend`.
- **API connection error**: make sure `php artisan serve` is still running and `frontend/.env` uses `http://127.0.0.1:8000/api`.
- **CORS error**: verify `FRONTEND_URL=http://localhost:5173` in backend `.env`; restart the Laravel server after editing.
- **No tables / login fails**: run `php artisan migrate:fresh --seed` (WARNING: deletes existing tables/data in this database).
- **NPM command missing**: install Node.js LTS, close and reopen PowerShell, then verify `node -v` and `npm -v`.
