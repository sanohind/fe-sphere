# SPHERE System Flowchart

## Deskripsi Sistem
SPHERE (Sanoh Portal for Hybrid Enterprise Resource Environment) adalah sistem superapp portal yang menghubungkan beberapa aplikasi internal Sanoh:
- **AMS** (Arrival Monitoring System) - untuk warehouse employee
- **SCOPE** (Sanoh Central Operation for Production Evaluation) - untuk finance, warehouse, logistics, HR, planning employee
- **Finish Good Store** - untuk logistics employee

Sistem menggunakan **Single Sign-On (SSO)** untuk autentikasi terpusat yang mengirimkan auth token ke setiap aplikasi.

## Flowchart Sistem SPHERE

```mermaid
flowchart TD
    Start([User Mengakses SPHERE]) --> CheckAuth{User Sudah Login?}
    
    CheckAuth -->|Tidak| Landing[/Tampilkan Landing Page/]
    Landing --> ClickSignIn[User Klik Get Started]
    ClickSignIn --> SignInPage[/Tampilkan Halaman Sign In/]
    
    SignInPage --> InputCred[/Input Email & Password/]
    InputCred --> SubmitLogin[User Submit Login]
    SubmitLogin --> ValidateCred{Validasi Kredensial}
    
    ValidateCred -->|Invalid| ErrorMsg[/Tampilkan Error Message/]
    ErrorMsg --> SignInPage
    
    ValidateCred -->|Valid| GenerateToken[Generate Access Token & Refresh Token]
    GenerateToken --> StoreToken[Simpan Token di LocalStorage]
    StoreToken --> LoadDashboard
    
    CheckAuth -->|Ya| VerifyToken{Verify Token Valid?}
    VerifyToken -->|Tidak Valid| ClearStorage[Clear LocalStorage]
    ClearStorage --> Landing
    
    VerifyToken -->|Valid| LoadDashboard[Load Dashboard Data]
    LoadDashboard --> GetUserInfo[Get User Info dari API]
    GetUserInfo --> GetProjects[Get Available Projects berdasarkan Role]
    
    GetProjects --> CheckRole{Check User Role}
    
    CheckRole -->|Superadmin| ShowAllApps[/Tampilkan Semua Aplikasi:<br/>AMS, SCOPE, Finish Good<br/>+ Fitur Advance/]
    CheckRole -->|Warehouse Employee| ShowAMS[/Tampilkan AMS Only/]
    CheckRole -->|Logistics Employee| ShowFG[/Tampilkan Finish Good Only/]
    CheckRole -->|Finance/HR/Planning| ShowSCOPE[/Tampilkan SCOPE Only/]
    CheckRole -->|Multi Role| ShowMulti[/Tampilkan Aplikasi<br/>Sesuai Permission/]
    
    ShowAllApps --> MainMenu[/Tampilkan Main Menu Dashboard/]
    ShowAMS --> MainMenu
    ShowFG --> MainMenu
    ShowSCOPE --> MainMenu
    ShowMulti --> MainMenu
    
    MainMenu --> UserAction{User Action}
    
    UserAction -->|Klik Profile| ProfilePage[/Tampilkan Profile Page/]
    ProfilePage --> MainMenu
    
    UserAction -->|Klik Logout| ConfirmLogout{Konfirmasi Logout?}
    ConfirmLogout -->|Batal| MainMenu
    ConfirmLogout -->|Ya| LogoutAPI[Call Logout API]
    LogoutAPI --> ClearToken[Clear Token & User Data]
    ClearToken --> RedirectSignIn[Redirect ke Sign In]
    RedirectSignIn --> End([Selesai])
    
    UserAction -->|Klik Aplikasi| GetProjectURL[Request Project URL dengan Token]
    GetProjectURL --> GenerateSSO[Generate SSO Token untuk Aplikasi]
    GenerateSSO --> AppendToken[Append Token ke URL Aplikasi]
    AppendToken --> OpenNewTab[/Buka Aplikasi di Tab Baru/]
    OpenNewTab --> EndApp([User Menggunakan Aplikasi])
    
    style Start fill:#4ade80
    style End fill:#f87171
    style EndApp fill:#f87171
    style CheckAuth fill:#fbbf24
    style ValidateCred fill:#fbbf24
    style VerifyToken fill:#fbbf24
    style CheckRole fill:#fbbf24
    style ConfirmLogout fill:#fbbf24
    style GenerateToken fill:#60a5fa
    style GenerateSSO fill:#60a5fa
    style MainMenu fill:#c084fc
```

## Penjelasan Alur

### 1. **Authentication Flow**
- User mengakses SPHERE dan diperiksa status autentikasinya
- Jika belum login, ditampilkan landing page dengan tombol "Get Started"
- User input email dan password untuk login
- Sistem validasi kredensial dan generate JWT token (access & refresh token)
- Token disimpan di localStorage untuk session management

### 2. **Authorization & Dashboard**
- Setelah login, sistem verify token validity
- Load user information dan available projects berdasarkan role
- Dashboard menampilkan aplikasi sesuai permission user:
  - **Superadmin**: Akses semua aplikasi + fitur advance
  - **Warehouse Employee**: AMS only
  - **Logistics Employee**: Finish Good only
  - **Finance/HR/Planning**: SCOPE only
  - **Multi-role**: Kombinasi sesuai permission

### 3. **SSO Integration**
- User klik aplikasi yang ingin diakses
- SPHERE request project URL dengan menyertakan token
- Backend generate SSO token khusus untuk aplikasi tersebut
- Token di-append ke URL dan aplikasi dibuka di tab baru
- **User dialihkan ke aplikasi target** (di luar scope SPHERE)

### 4. **Session Management**
- User dapat logout dari SPHERE (clear semua token)
- User dapat akses profile untuk melihat informasi akun
- Token auto-refresh untuk maintain session
- Jika token expired, user di-redirect ke sign in page

## Batasan Diagram

Flowchart ini **hanya mencakup scope aplikasi SPHERE Portal**, yaitu:
- ✅ Landing page
- ✅ Authentication (Sign In/Logout)
- ✅ Dashboard & Main Menu
- ✅ Profile Management
- ✅ SSO Token Generation
- ✅ Redirect ke aplikasi eksternal

**Tidak mencakup**:
- ❌ Detail fitur di dalam aplikasi AMS
- ❌ Detail fitur di dalam aplikasi SCOPE
- ❌ Detail fitur di dalam aplikasi Finish Good

Setelah user membuka aplikasi melalui SSO, alur keluar dari scope SPHERE dan masuk ke scope aplikasi masing-masing.

## Keamanan
- JWT-based authentication
- Token stored in localStorage
- Auto token verification on page load
- Secure SSO token generation per application
- Automatic logout on token expiration
