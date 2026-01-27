# SPHERE System Analysis

## Executive Summary

**SPHERE** (Sanoh Portal for Hybrid Enterprise Resource Environment) adalah sistem **Super App Portal** yang berfungsi sebagai **Single Sign-On (SSO)** gateway untuk mengintegrasikan tiga aplikasi utama di lingkungan Sanoh:

1. **AMS** (Arrival Monitoring System)
2. **SCOPE** (Sanoh Central Operation for Production Evaluation)  
3. **Finish Good Store**

## Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SPHERE Portal                          │
│                   (SSO Authentication)                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │   Sign In    │  │  Dashboard   │     │
│  │     Page     │→ │     Page     │→ │   (Main Menu)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                              │              │
│                          ┌───────────────────┼──────────────┤
│                          │                   │              │
│                          ▼                   ▼              │
│                    JWT Token          SSO Token             │
│                    Generation         Generation            │
└─────────────────────────┬───────────────────┬───────────────┘
                          │                   │
          ┌───────────────┼───────────────────┼───────────────┐
          │               │                   │               │
          ▼               ▼                   ▼               ▼
    ┌─────────┐     ┌─────────┐       ┌─────────┐     ┌──────────┐
    │   AMS   │     │  SCOPE  │       │ Finish  │     │  Future  │
    │         │     │         │       │  Good   │     │   Apps   │
    │ Arrival │     │ Central │       │  Store  │     │          │
    │Monitor  │     │Operation│       │         │     │          │
    └─────────┘     └─────────┘       └─────────┘     └──────────┘
```

### Technology Stack

**Frontend:**
- React.js 19 + TypeScript
- Tailwind CSS v4
- React Router
- Axios (HTTP Client)
- ApexCharts (Data Visualization)

**Authentication:**
- JWT (JSON Web Token)
- Bearer Token Authentication
- LocalStorage for token persistence
- Automatic token refresh mechanism

**Backend Integration:**
- RESTful API
- SSO Token generation per application
- Role-based access control (RBAC)

## Core Features

### 1. Authentication & Authorization

#### Single Sign-On (SSO)
- **Centralized Authentication**: User login sekali di SPHERE, dapat akses semua aplikasi
- **JWT-based**: Menggunakan access token dan refresh token
- **Secure Token Storage**: Token disimpan di localStorage dengan auto-cleanup on logout
- **Auto Token Verification**: Setiap page load, token diverifikasi
- **Token Expiration Handling**: Auto-redirect ke login jika token expired

#### Role-Based Access Control (RBAC)

| Role | Department | Access Rights |
|------|-----------|---------------|
| **Superadmin** | All | Full access ke semua aplikasi + advanced features |
| **Warehouse Employee** | Warehouse | AMS only |
| **Logistics Employee** | Logistics | Finish Good + SCOPE (Logistics module) |
| **Finance Employee** | Finance | SCOPE (Financial Analysis module) |
| **HR Employee** | HR | SCOPE (HR Management module) |
| **Planning Employee** | Planning | SCOPE (Production Planning module) |

### 2. Dashboard & Navigation

#### Main Menu Dashboard
- **Profile Card**: Menampilkan informasi user (nama, role, department, avatar)
- **Application Cards**: Grid aplikasi yang dapat diakses sesuai role
- **Dynamic Content**: Konten berubah sesuai permission user
- **Responsive Design**: Optimal di desktop, tablet, dan mobile

#### Profile Management
- View profile information
- Update profile data
- View role and department
- View last login information

### 3. SSO Integration

#### Flow SSO ke Aplikasi
1. User klik aplikasi di dashboard
2. SPHERE request project URL ke backend
3. Backend generate SSO token khusus untuk aplikasi tersebut
4. Token di-append ke URL aplikasi
5. Aplikasi dibuka di tab baru
6. Aplikasi target validasi SSO token
7. User dapat menggunakan aplikasi tanpa login ulang

#### Security Measures
- **Token Encryption**: SSO token ter-enkripsi
- **Time-limited Token**: Token memiliki expiration time
- **One-time Use**: SSO token hanya valid untuk satu session
- **Application-specific**: Token berbeda untuk setiap aplikasi

## Integrated Applications

### 1. AMS (Arrival Monitoring System)

**Purpose**: Sistem monitoring kedatangan barang/material ke warehouse

**Target Users**: Warehouse Employee, Superadmin

**Key Features**:
- Monitor real-time arrivals
- Track shipment status
- Generate arrival reports
- Manage warehouse data
- Advanced analytics (Superadmin only)

**Icon**: Warehouse/Arrival imagery

### 2. SCOPE (Sanoh Central Operation for Production Evaluation)

**Purpose**: Sistem central operation untuk evaluasi produksi dan operasional

**Target Users**: Finance, HR, Logistics, Planning Employee, Superadmin

**Modules**:
- **Financial Analysis** (Finance Employee)
  - Budget tracking
  - Cost analysis
  - Financial reporting
  
- **HR Management** (HR Employee)
  - Employee data management
  - Attendance tracking
  - Performance evaluation
  
- **Logistics Planning** (Logistics Employee)
  - Distribution planning
  - Route optimization
  - Delivery tracking
  
- **Production Planning** (Planning Employee)
  - Production scheduling
  - Capacity planning
  - Material requirement planning
  
- **Production Data** (All SCOPE users)
  - View production metrics
  - Dashboard analytics
  - Report generation

**Icon**: Central operation/analytics imagery

### 3. Finish Good Store

**Purpose**: Sistem manajemen gudang barang jadi (store/pull operations)

**Target Users**: Logistics Employee, Superadmin

**Key Features**:
- Inventory management
- Store operations
- Pull request handling
- Logistics tracking
- Stock level monitoring
- Advanced warehouse features (Superadmin only)

**Icon**: Logistics/truck imagery

## User Flows

### Flow 1: First-time User Login

```
Landing Page → Click "Get Started" → Sign In Page → 
Input Credentials → Validate → Generate JWT Token → 
Store Token → Load Dashboard → Show Available Apps
```

### Flow 2: Returning User

```
Auto-check Token → Verify Token → Load Dashboard → 
Show Available Apps
```

### Flow 3: Access Application via SSO

```
Dashboard → Click App Card → Request Project URL → 
Generate SSO Token → Append to URL → Open in New Tab → 
App Validates Token → Grant Access
```

### Flow 4: Logout

```
Click Logout → Confirm → Call Logout API → 
Clear Tokens → Clear User Data → Redirect to Landing
```

## Data Models

### User Model
```typescript
interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  nik?: string;
  phone_number?: string;
  avatar?: string;
  role: {
    id: number;
    name: string;
    slug: string;
    level: number;
  };
  department?: {
    id: number;
    name: string;
    code: string;
  };
  created_by?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
}
```

### Project Model
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  permissions: string[];
}
```

### Auth Token Model
```typescript
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/user-info` - Get current user info
- `GET /auth/verify-token` - Verify token validity

### Dashboard
- `GET /dashboard` - Get dashboard data (user + projects)
- `GET /dashboard/project/{id}/url` - Get SSO URL for specific project

## Security Features

### 1. Authentication Security
- Password hashing (backend)
- JWT token with expiration
- Refresh token mechanism
- Secure token storage

### 2. Authorization Security
- Role-based access control
- Permission-based feature access
- API endpoint protection
- Frontend route guards

### 3. SSO Security
- Encrypted SSO tokens
- Time-limited tokens
- Application-specific tokens
- Token validation on target apps

### 4. Session Management
- Auto logout on token expiration
- Token refresh mechanism
- Secure token cleanup on logout
- Session timeout handling

## Benefits

### For Users
✅ **Single Login**: Login sekali untuk akses semua aplikasi  
✅ **Unified Interface**: Satu portal untuk semua kebutuhan  
✅ **Role-based Access**: Hanya melihat aplikasi yang relevan  
✅ **Seamless Navigation**: Mudah berpindah antar aplikasi  

### For Organization
✅ **Centralized Authentication**: Satu sistem autentikasi untuk semua apps  
✅ **Better Security**: Kontrol akses terpusat  
✅ **Easier Maintenance**: Update user access di satu tempat  
✅ **Scalability**: Mudah menambah aplikasi baru  
✅ **Audit Trail**: Tracking user access terpusat  

### For Developers
✅ **Reusable Auth**: Tidak perlu implement auth di setiap app  
✅ **Standard Integration**: SSO pattern yang konsisten  
✅ **Easier Testing**: Centralized user management  
✅ **Better UX**: Consistent user experience  

## Future Enhancements

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] Social login integration
- [ ] Mobile app version
- [ ] Notification system
- [ ] Activity logs & audit trail
- [ ] User preference settings
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting

### Potential Integrations
- [ ] Email notification service
- [ ] SMS notification
- [ ] Slack/Teams integration
- [ ] Calendar integration
- [ ] Document management system
- [ ] Reporting & BI tools

## Conclusion

SPHERE berhasil mengimplementasikan konsep **Super App Portal** dengan **SSO** yang efektif untuk mengintegrasikan tiga sistem utama (AMS, SCOPE, Finish Good Store). Sistem ini memberikan:

1. **Unified Access Point** untuk semua aplikasi internal
2. **Secure Authentication** dengan JWT dan SSO
3. **Role-based Authorization** untuk kontrol akses yang granular
4. **Seamless User Experience** dengan single login
5. **Scalable Architecture** untuk penambahan aplikasi di masa depan

Dengan arsitektur yang modular dan secure, SPHERE siap untuk dikembangkan lebih lanjut dengan fitur-fitur tambahan dan integrasi aplikasi baru.

---

**Dokumentasi dibuat**: 2025-12-30  
**Versi**: 1.0  
**Status**: Production Ready
