# Panduan Setup OIDC untuk Sphere, AMS, dan SCOPE

Dokumen ini menjelaskan langkah-langkah lengkap untuk menginstall dan setup OIDC (OpenID Connect) authentication system.

## 📋 Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Setup Sphere (Authorization Server)](#setup-sphere-authorization-server)
3. [Setup AMS (Client Application)](#setup-ams-client-application)
4. [Setup SCOPE (Client Application)](#setup-scope-client-application)
5. [Testing OIDC Flow](#testing-oidc-flow)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Software yang Diperlukan

1. **PHP 8.2+** dengan extensions:
   - `openssl`
   - `pdo`
   - `mbstring`
   - `tokenizer`
   - `xml`
   - `ctype`
   - `json`
   - `bcmath`

2. **Composer** (PHP package manager)
3. **Node.js 18+** dan **npm/yarn**
4. **MySQL/MariaDB** database
5. **Git** (untuk clone repository)

### Port yang Digunakan

- **Sphere Backend**: `127.0.0.1:8000`
- **Sphere Frontend**: `localhost:5173`
- **AMS Backend**: `127.0.0.1:8001`
- **AMS Frontend**: `localhost:5174`
- **SCOPE Backend**: `127.0.0.1:8002`
- **SCOPE Frontend**: `localhost:5175`

---

## Setup Sphere (Authorization Server)

Sphere berfungsi sebagai **Authorization Server** yang mengeluarkan token untuk aplikasi client (AMS dan SCOPE).

### 1. Install Dependencies

```bash
cd Sphere/be-sphere
composer install
```

**Dependencies penting yang sudah terinstall:**
- `league/oauth2-server: ^8.3` - OAuth2/OIDC server implementation
- `lcobucci/jwt: ^4.0` - JWT token handling
- `tymon/jwt-auth: ^2.2` - JWT authentication (legacy)

### 2. Setup Database

#### a. Buat file `.env` (jika belum ada)

```bash
cp .env.example .env
php artisan key:generate
```

#### b. Konfigurasi Database di `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_sphere
DB_USERNAME=username_db
DB_PASSWORD=password_db
```

#### c. Jalankan Migration

```bash
php artisan migrate
```

Migration ini akan membuat tabel `oauth_clients` dengan struktur:
- `id` (bigint, primary key)
- `client_id` (varchar, unique identifier)
- `client_secret` (varchar, nullable)
- `name` (varchar)
- `redirect_uris` (text, JSON array)
- `scopes` (text, JSON array, nullable)
- `is_confidential` (boolean)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamps)

### 3. Seed OAuth Clients

Jalankan seeder untuk membuat OAuth clients (AMS dan SCOPE):

```bash
php artisan db:seed --class=OAuthClientSeeder
```

**Output yang akan muncul:**
```
Created OAuth Client: SCOPE Application
  Client ID: scope-client (Database ID: 1)
  Client Secret: [random 80 character string]
  Redirect URIs: http://localhost:5175/#/callback
  Is Confidential: Yes

Created OAuth Client: AMS (Arrival Management System)
  Client ID: ams-client (Database ID: 2)
  Client Secret: [random 80 character string]
  Redirect URIs: http://localhost:5174/#/callback
  Is Confidential: Yes
```

**⚠️ PENTING:** Simpan `Client Secret` yang muncul! Secret ini tidak akan ditampilkan lagi.

**Setelah seeder, tambahkan ke file `.env` Sphere (opsional, untuk referensi):**
```env
# OAuth Client Credentials (dari seeder output)
SCOPE_APPLICATION_CLIENT_ID=1
SCOPE_APPLICATION_CLIENT_SECRET=[secret dari output seeder]
AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_ID=2
AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_SECRET=[secret dari output seeder]
```

**Catatan:** Variabel ini di `.env` Sphere hanya untuk referensi. Yang penting adalah:
- **Database ID** (1 untuk SCOPE, 2 untuk AMS) digunakan sebagai `VITE_OIDC_CLIENT_ID` di frontend
- **Client Secret** digunakan sebagai `VITE_OIDC_CLIENT_SECRET` di frontend

### 4. Generate RSA Keys untuk JWT (jika belum ada)

OAuth2 server memerlukan RSA keys untuk menandatangani JWT tokens. Path keys sudah hardcoded di `config/oauth2.php`:
- Private key: `storage/oauth/private.key`
- Public key: `storage/oauth/public.key`

**Generate keys dengan salah satu cara berikut:**

**Cara 1: Menggunakan OpenSSL (Manual)**
```bash
# Buat direktori jika belum ada
mkdir -p storage/oauth

# Generate private key
openssl genrsa -out storage/oauth/private.key 2048

# Generate public key
openssl rsa -in storage/oauth/private.key -pubout -out storage/oauth/public.key

# Set permissions (Linux/Mac)
chmod 600 storage/oauth/private.key
chmod 644 storage/oauth/public.key
```

**Cara 2: Menggunakan Artisan Command (jika tersedia)**
```bash
php artisan oauth:keys
# atau
php artisan generate:oauth-keys
```

**Cara 3: Menggunakan PHP Script**
Jika ada file `generate-oauth-keys.php` di root project:
```bash
php generate-oauth-keys.php
```

**Verifikasi keys sudah ada:**
```bash
# Check jika file exists
ls -la storage/oauth/private.key
ls -la storage/oauth/public.key
```

**⚠️ PENTING:**
- Keys harus ada sebelum OAuth2 server bisa berfungsi
- Jangan commit keys ke Git (tambahkan ke `.gitignore`)
- Di production, generate keys yang berbeda dan aman

### 5. Konfigurasi Environment Variables

Pastikan file `.env` Sphere memiliki konfigurasi berikut:

```env
# Application URLs
APP_URL=http://127.0.0.1:8000
APP_ENV=local
APP_DEBUG=true

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_sphere
DB_USERNAME=username_db
DB_PASSWORD=password_db

# OAuth2/OIDC Configuration (Opsional)
# Encryption key untuk token encryption (ada default value di config/oauth2.php)
# OAUTH_ENCRYPTION_KEY=base64:[random 32-byte key]

# RSA Keys Path (HARDCODED di config/oauth2.php, tidak perlu di .env)
# Private key: storage/oauth/private.key
# Public key: storage/oauth/public.key

# Callback URLs untuk client applications
AMS_CALLBACK_URL=http://localhost:5174/#/callback
SCOPE_CALLBACK_URL=http://localhost:5175/#/callback

# SSO Configuration (untuk legacy JWT support)
SSO_MODE=jwt
FE_SPHERE_LOGIN_URL=http://localhost:5173/#/signin

# OAuth Client Credentials (akan di-generate oleh seeder)
# Format: [APP_NAME]_CLIENT_ID dan [APP_NAME]_CLIENT_SECRET
# Contoh setelah seeder:
# SCOPE_APPLICATION_CLIENT_ID=1
# SCOPE_APPLICATION_CLIENT_SECRET=[secret dari seeder]
# AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_ID=2
# AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_SECRET=[secret dari seeder]
```

**Catatan Penting:**
- **RSA Keys**: Path sudah hardcoded di `config/oauth2.php` sebagai `storage/oauth/private.key` dan `storage/oauth/public.key`. **TIDAK PERLU** dikonfigurasi di `.env`.
- **Encryption Key**: Ada default value di `config/oauth2.php`, jadi `OAUTH_ENCRYPTION_KEY` di `.env` adalah **opsional**. Jika ingin custom, generate dengan:
  ```bash
  php artisan key:generate --show
  # Copy output dan tambahkan prefix "base64:"
  ```
- **Client Credentials**: Akan otomatis di-generate oleh seeder dan muncul di console. Format di `.env` mengikuti nama aplikasi dari seeder:
  - `SCOPE_APPLICATION_CLIENT_ID` dan `SCOPE_APPLICATION_CLIENT_SECRET`
  - `AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_ID` dan `AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_SECRET`
  - Format ini adalah **output dari seeder** dan hanya untuk referensi. Yang penting adalah **Database ID** (1 atau 2) dan **Client Secret** yang digunakan di frontend.

**Contoh `.env` Sphere yang benar (sesuai setup Anda):**
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=be_sphere_2
DB_USERNAME=root
DB_PASSWORD=

# SSO Configuration (untuk legacy JWT)
SSO_MODE=jwt
FE_SPHERE_LOGIN_URL=http://localhost:5173/#/signin

# OAuth Client Callback URLs
SCOPE_CALLBACK_URL=http://localhost:5175/#/callback
AMS_CALLBACK_URL=http://localhost:5174/#/callback

# OAuth Client Credentials (dari seeder output)
SCOPE_APPLICATION_CLIENT_ID=1
SCOPE_APPLICATION_CLIENT_SECRET=[secret dari seeder]
AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_ID=2
AMS_ARRIVAL_MANAGEMENT_SYSTEM_CLIENT_SECRET=[secret dari seeder]

# JWT Secret (untuk legacy JWT authentication)
JWT_SECRET=...
```

**Yang TIDAK perlu di `.env`:**
- ❌ `OAUTH_PRIVATE_KEY_PATH` (hardcoded di `config/oauth2.php`)
- ❌ `OAUTH_PUBLIC_KEY_PATH` (hardcoded di `config/oauth2.php`)
- ❌ `OAUTH_ENCRYPTION_KEY` (ada default value, opsional)
- ❌ `FRONTEND_URL` (tidak digunakan di code)

### 6. Verifikasi Setup

Pastikan endpoint berikut dapat diakses:

- **Authorization Endpoint**: `http://127.0.0.1:8000/api/oauth/authorize`
- **Token Endpoint**: `http://127.0.0.1:8000/api/oauth/token`
- **JWKS Endpoint**: `http://127.0.0.1:8000/api/.well-known/jwks.json`
- **Userinfo Endpoint**: `http://127.0.0.1:8000/api/oauth/userinfo`
- **Token Verification**: `http://127.0.0.1:8000/api/oauth/verify-token`

### 7. Jalankan Server

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

---

## Setup AMS (Client Application)

AMS adalah **client application** yang menggunakan OIDC untuk authentication.

### 1. Backend Setup (AMS/be-ams)

#### a. Install Dependencies

```bash
cd AMS/be-ams
composer install
```

#### b. Konfigurasi Database

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_ams
DB_USERNAME=username_db
DB_PASSWORD=password_db

# Sphere OAuth2 Server URL
SPHERE_API_URL=http://127.0.0.1:8000/api
```

#### c. Jalankan Migration

```bash
php artisan migrate
```

#### d. Verifikasi AuthService

Pastikan `app/Services/AuthService.php` sudah dikonfigurasi untuk:
- Validasi OIDC token via endpoint `/api/oauth/verify-token` di Sphere
- Fallback ke JWT legacy endpoint jika diperlukan

#### e. Jalankan Server

```bash
php artisan serve --host=127.0.0.1 --port=8001
```

### 2. Frontend Setup (AMS/fe-ams)

#### a. Install Dependencies

```bash
cd AMS/fe-ams
npm install
```

**Dependencies penting:**
- `oidc-client-ts: ^3.4.1` - OIDC client library untuk React

#### b. Konfigurasi Environment Variables

Buat atau edit file `.env` (atau `.env.local`):

```env
# API Configuration
VITE_API_URL=http://127.0.0.1:8001

# Be-Sphere URL for JWT validation (Legacy)
VITE_BE_SPHERE_URL=http://127.0.0.1:8000

# Sphere SSO login entry (Legacy)
VITE_SPHERE_SSO_URL=http://127.0.0.1:8000/sso/login

# OIDC Configuration
VITE_OIDC_AUTHORITY=http://127.0.0.1:8000/api
VITE_OIDC_CLIENT_ID=2
VITE_OIDC_CLIENT_SECRET=[CLIENT_SECRET_DARI_SPHERE_SEEDER]

# Application Configuration
VITE_APP_NAME=AMS
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=debug

# SSO Configuration
VITE_SSO_ENABLED=true
VITE_OIDC_CLIENT_SECRET=ltJeOVUz7vbVm3KDwXrN1HMRtMoZGrofr7W5Bc2t
```

**⚠️ PENTING:**
- `VITE_OIDC_CLIENT_ID` harus sesuai dengan **Database ID** dari tabel `oauth_clients` di Sphere (biasanya `2` untuk AMS)
- `VITE_OIDC_CLIENT_SECRET` harus sesuai dengan `client_secret` yang di-generate oleh seeder Sphere

**Cara mendapatkan Client Secret:**
1. Jalankan seeder di Sphere: `php artisan db:seed --class=OAuthClientSeeder`
2. Copy `Client Secret` yang muncul untuk AMS
3. Atau query langsung ke database:
   ```sql
   SELECT client_secret FROM oauth_clients WHERE name LIKE '%AMS%';
   ```

#### c. Verifikasi Konfigurasi OIDC

Pastikan file `src/auth/oidcConfig.ts` sudah benar:

```typescript
const authority = import.meta.env.VITE_OIDC_AUTHORITY || 'http://127.0.0.1:8000/api';
const client_id = import.meta.env.VITE_OIDC_CLIENT_ID || '2';
const client_secret = import.meta.env.VITE_OIDC_CLIENT_SECRET;

const oidcConfig = {
  authority: authority,
  client_id: client_id,
  client_secret: client_secret,
  redirect_uri: `${window.location.origin}/#/callback`,
  response_type: 'code',
  scope: 'openid profile email',
  response_mode: 'query', // Penting untuk hash routing
  // ... lainnya
};
```

#### d. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5174`

---

## Setup SCOPE (Client Application)

SCOPE adalah **client application** yang menggunakan OIDC untuk authentication (mirip AMS). SCOPE juga mendukung **legacy JWT** bila Sphere mengirim `?token=...` di callback (hash).

### 1. Backend Setup (SCOPE/be-scope)

#### a. Install Dependencies

```bash
cd SCOPE/be-scope
composer install
```

#### b. Konfigurasi Database

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_scope
DB_USERNAME=username_db
DB_PASSWORD=password_db

# Sphere OAuth2 Server URL (untuk validasi token)
BE_SPHERE_URL=http://127.0.0.1:8000
```

#### c. Jalankan Migration

```bash
php artisan migrate
```

#### d. Verifikasi AuthService

Pastikan `app/Services/AuthService.php` sudah mendukung:
- Validasi **OIDC token** via endpoint `/api/oauth/verify-token` di Sphere
- Fallback ke **JWT legacy** endpoint `/api/auth/verify-token` jika OIDC gagal
- `getUserFromSphere($userId, $userData)` menerima `$userData` dari token validation agar tidak query DB (menghindari error kolom `is_active` jika tidak ada)

#### e. Jalankan Server

```bash
php artisan serve --host=127.0.0.1 --port=8002
```

### 2. Frontend Setup (SCOPE/fe-scope)

#### a. Install Dependencies

```bash
cd SCOPE/fe-scope
npm install
```

**Dependencies penting:**
- `oidc-client-ts: ^3.4.1` - OIDC client library untuk React

#### b. Konfigurasi Environment Variables

Buat atau edit file `.env` (atau `.env.local`):

```env
# API Configuration
VITE_API_URL=http://127.0.0.1:8002

# Sphere SSO login entry (Legacy JWT)
VITE_SPHERE_SSO_URL=http://127.0.0.1:8000/sso/login

# OIDC Configuration
VITE_OIDC_AUTHORITY=http://127.0.0.1:8000/api
VITE_OIDC_CLIENT_ID=1
VITE_OIDC_CLIENT_SECRET=[CLIENT_SECRET_DARI_SPHERE_SEEDER]

# Application Configuration
VITE_APP_NAME=SCOPE

# SSO Configuration (OIDC + legacy JWT)
VITE_SSO_ENABLED=true
VITE_ENABLE_SSO=true
```

**⚠️ PENTING:**
- `VITE_OIDC_CLIENT_ID` harus **1** (Database ID untuk SCOPE di tabel `oauth_clients`)
- `VITE_OIDC_CLIENT_SECRET` harus sama dengan `client_secret` SCOPE dari seeder Sphere

**Cara mendapatkan Client Secret SCOPE:**
1. Jalankan seeder di Sphere: `php artisan db:seed --class=OAuthClientSeeder`
2. Copy **Client Secret** untuk **SCOPE Application** (biasanya output pertama)
3. Atau query ke database Sphere:
   ```sql
   SELECT id, client_id, client_secret FROM oauth_clients WHERE name LIKE '%SCOPE%';
   ```

#### c. Verifikasi Konfigurasi OIDC

Pastikan file `src/auth/oidcConfig.ts` ada dan isinya seperti:

```typescript
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const authority = import.meta.env.VITE_OIDC_AUTHORITY || 'http://127.0.0.1:8000/api';
const client_id = import.meta.env.VITE_OIDC_CLIENT_ID || '1';  // SCOPE = 1
const client_secret = import.meta.env.VITE_OIDC_CLIENT_SECRET;

const oidcConfig = {
  authority,
  client_id,
  client_secret,
  redirect_uri: `${window.location.origin}/#/callback`,
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: `${window.location.origin}/`,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  loadUserInfo: true,
  response_mode: 'query',  // Penting untuk hash routing
};

export const userManager = new UserManager(oidcConfig);
export const OIDC_CONFIG = oidcConfig;
```

#### d. Route Callback

Pastikan di `App.tsx` ada route untuk OIDC callback **dan** legacy callback:

- `/callback` → OIDC (code + state di query string)
- `/sso/callback` → Legacy JWT (`?token=...` di hash)

Contoh:

```tsx
<Route path="/sso/callback" element={<SSOCallback />} />
<Route path="/callback" element={<SSOCallback />} />
```

#### e. SSOCallback – OIDC + Legacy JWT

Halaman callback SCOPE harus menangani **dua alur**:

1. **OIDC**: URL berisi `?code=...&state=...` (biasanya di query string setelah redirect dari Sphere).
2. **Legacy JWT**: URL berisi `#/sso/callback?token=...` (token di hash). Bila tidak ada `code` tapi ada `token` di hash, panggil `login(token)` lalu redirect ke dashboard.

Dengan begitu, baik flow OIDC maupun legacy dari Sphere tetap berfungsi.

#### f. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5175`.

### 3. Ringkasan Perbedaan SCOPE vs AMS

| Item              | SCOPE                    | AMS                      |
|-------------------|--------------------------|--------------------------|
| Port frontend     | 5175                     | 5174                     |
| Port backend      | 8002                     | 8001                     |
| `VITE_OIDC_CLIENT_ID` | 1                    | 2                        |
| Callback path     | `/#/callback` atau `/#/sso/callback` | `/#/callback` atau `/#/sso/callback` |
| Legacy callback   | `#/sso/callback?token=...` (didukung) | Idem (didukung)          |

### 4. Checklist Setup SCOPE

**Backend (SCOPE/be-scope):**
- [ ] `composer install` sudah dijalankan
- [ ] `.env` berisi `BE_SPHERE_URL=http://127.0.0.1:8000`
- [ ] Migration sudah dijalankan
- [ ] AuthService support OIDC + fallback JWT dan `getUserFromSphere($id, $userData)`
- [ ] Server backend jalan di `http://127.0.0.1:8002`

**Frontend (SCOPE/fe-scope):**
- [ ] `npm install` sudah dijalankan
- [ ] `.env` berisi `VITE_OIDC_CLIENT_ID=1` dan `VITE_OIDC_CLIENT_SECRET`
- [ ] Ada file `src/auth/oidcConfig.ts`
- [ ] Route `/callback` dan `/sso/callback` mengarah ke `SSOCallback`
- [ ] AuthContext support OIDC (userManager, event `oidc-user-loaded`) dan legacy `login(token)`
- [ ] SSOCallback handle legacy token di hash (`#/sso/callback?token=...`)
- [ ] Server frontend jalan di `http://localhost:5175`

---

## Testing OIDC Flow

### Flow Authentication

1. **User membuka AMS/SCOPE** → Belum login
2. **User klik "Login via Sphere"** → Redirect ke Sphere
3. **User login di Sphere** → Sphere mengeluarkan authorization code
4. **Sphere redirect ke AMS/SCOPE** → Dengan `code` dan `state` di query string
5. **AMS/SCOPE exchange code untuk token** → POST ke `/api/oauth/token`
6. **AMS/SCOPE mendapatkan access_token, id_token, refresh_token**
7. **User ter-authenticated** → Dapat mengakses aplikasi

### Test Manual

#### 1. Test Authorization Endpoint

Buka browser dan akses:
```
http://127.0.0.1:8000/api/oauth/authorize?client_id=2&redirect_uri=http://localhost:5174/#/callback&response_type=code&scope=openid%20profile%20email&state=test123
```

Harus redirect ke login page Sphere (jika belum login) atau langsung approve dan redirect ke AMS.

#### 2. Test Token Endpoint

```bash
curl -X POST http://127.0.0.1:8000/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=2" \
  -d "client_secret=[CLIENT_SECRET]" \
  -d "code=[AUTHORIZATION_CODE]" \
  -d "redirect_uri=http://localhost:5174/#/callback"
```

#### 3. Test JWKS Endpoint

```bash
curl http://127.0.0.1:8000/api/.well-known/jwks.json
```

Harus return JSON dengan public keys.

#### 4. Test Token Verification

```bash
curl -X GET "http://127.0.0.1:8000/api/oauth/verify-token?token=[ACCESS_TOKEN]"
```

Harus return user data dalam format JSON.

### Test End-to-End

1. Buka `http://localhost:5174` (AMS frontend)
2. Klik "Login via Sphere" atau akses protected route
3. Login di Sphere
4. Pilih aplikasi AMS
5. Harus redirect kembali ke AMS dan ter-authenticated
6. Cek Network tab di browser DevTools untuk melihat:
   - Authorization request
   - Token exchange request
   - API calls dengan `Authorization: Bearer [token]` header

---

## Troubleshooting

### Error: "invalid_client" / "Client authentication failed"

**Penyebab:**
- `client_secret` tidak sesuai
- `client_id` tidak ditemukan di database
- Client tidak aktif (`is_active = false`)

**Solusi:**
1. Cek `VITE_OIDC_CLIENT_SECRET` di `.env` frontend
2. Verifikasi client di database:
   ```sql
   SELECT id, client_id, name, is_active, is_confidential 
   FROM oauth_clients 
   WHERE id = 2; -- untuk AMS
   ```
3. Pastikan `is_active = 1` dan `is_confidential = 1`
4. Re-run seeder jika perlu: `php artisan db:seed --class=OAuthClientSeeder`

### Error: "No state in response"

**Penyebab:**
- Query parameters (`code`, `state`) terpotong oleh hash routing
- `response_mode` tidak di-set ke `'query'`

**Solusi:**
1. Pastikan `response_mode: 'query'` di `oidcConfig.ts`
2. Pastikan backend Sphere memformat redirect URL dengan benar (query params sebelum hash)

### Error: "No matching state found in storage"

**Penyebab:**
- State tidak tersimpan di localStorage (karena redirect external)
- Browser clear localStorage

**Solusi:**
- Code sudah handle dengan fallback manual token exchange di `SSOCallback.tsx`
- Pastikan tidak ada multiple processing (ada `processingRef` flag)

### Error: "Invalid or expired token"

**Penyebab:**
- Token tidak valid atau sudah expired
- Backend AMS tidak bisa validate token dengan Sphere

**Solusi:**
1. Cek `SPHERE_API_URL` di AMS backend `.env`
2. Test endpoint `/api/oauth/verify-token` di Sphere secara manual
3. Pastikan RSA keys sudah di-generate dan accessible

### Error: "User not found or inactive"

**Penyebab:**
- User tidak ada di database Sphere
- Query mencari kolom `is_active` yang tidak ada

**Solusi:**
- Code sudah di-update untuk menggunakan `$userData` dari token validation response
- Pastikan user ada di tabel `users` di database Sphere

### Blank Page Setelah Login

**Penyebab:**
- `AuthContext` tidak detect user setelah redirect
- Token tidak tersimpan dengan benar

**Solusi:**
1. Cek `localStorage` di browser DevTools:
   - Harus ada key `oidc.user:http://127.0.0.1:8000/api:2`
   - Value harus berisi user object dengan `access_token`
2. Pastikan `apiService.setToken()` dipanggil setelah token exchange
3. Pastikan `window.location.href = '/#/'` digunakan untuk full page redirect

### Redirect Loop ke Sphere

**Penyebab:**
- Protected route selalu redirect ke login
- Token tidak terdeteksi oleh `AuthContext`

**Solusi:**
1. Cek `AuthContext.tsx` - pastikan `initializeAuth()` dipanggil
2. Pastikan retry logic ada untuk handle race condition
3. Cek `ProtectedRoute.tsx` - pastikan logic redirect benar

---

## Checklist Setup

### Sphere Backend
- [ ] Dependencies terinstall (`composer install`)
- [ ] Database dikonfigurasi dan migration dijalankan
- [ ] OAuth clients di-seed (`php artisan db:seed --class=OAuthClientSeeder`)
- [ ] RSA keys di-generate (private & public key)
- [ ] Environment variables dikonfigurasi
- [ ] Server berjalan di `http://127.0.0.1:8000`

### AMS Backend
- [ ] Dependencies terinstall
- [ ] Database dikonfigurasi
- [ ] `SPHERE_API_URL` dikonfigurasi di `.env`
- [ ] Server berjalan di `http://127.0.0.1:8001`

### AMS Frontend
- [ ] Dependencies terinstall (`npm install`)
- [ ] Environment variables dikonfigurasi (`.env`)
- [ ] `VITE_OIDC_CLIENT_ID` dan `VITE_OIDC_CLIENT_SECRET` sudah benar
- [ ] `oidcConfig.ts` sudah benar
- [ ] Server berjalan di `http://localhost:5174`

### SCOPE (jika diperlukan)
- [ ] Backend setup sama seperti AMS
- [ ] Frontend setup dengan `VITE_OIDC_CLIENT_ID=1`
- [ ] Server berjalan di `http://localhost:5175`

---

## Production Deployment

### Security Considerations

1. **Client Secret:**
   - Jangan commit `client_secret` ke Git
   - Gunakan environment variables atau secret management
   - Rotate secrets secara berkala

2. **HTTPS:**
   - Gunakan HTTPS di production
   - Update semua URL di `.env` ke HTTPS

3. **CORS:**
   - Konfigurasi CORS dengan benar di Sphere backend
   - Hanya allow origin yang diperlukan

4. **Rate Limiting:**
   - Implement rate limiting untuk token endpoint
   - Prevent brute force attacks

5. **Token Expiration:**
   - Set expiration time yang reasonable
   - Implement refresh token rotation

### Environment Variables untuk Production

**Sphere Backend:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sphere.example.com

AMS_CALLBACK_URL=https://ams.example.com/#/callback
SCOPE_CALLBACK_URL=https://scope.example.com/#/callback
```

**AMS Frontend:**
```env
VITE_API_URL=https://api.ams.example.com
VITE_OIDC_AUTHORITY=https://sphere.example.com/api
VITE_OIDC_CLIENT_ID=2
VITE_OIDC_CLIENT_SECRET=[PRODUCTION_SECRET]
```

---

## Referensi

- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [League OAuth2 Server Documentation](https://oauth2.thephpleague.com/)
- [oidc-client-ts Documentation](https://github.com/authts/oidc-client-ts)

---

**Last Updated:** 2026-02-04
**Version:** 1.0
