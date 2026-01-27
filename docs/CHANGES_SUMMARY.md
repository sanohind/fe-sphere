# SPHERE Documentation - Summary of Changes

## Perubahan yang Dilakukan

Berdasarkan permintaan untuk memfokuskan diagram hanya pada **scope aplikasi SPHERE** dan menggunakan **style default PlantUML**, berikut perubahan yang telah dilakukan:

---

## 1. SPHERE_FLOWCHART.md ✅

### Perubahan:
- ✅ **Batasan diagram hanya pada SPHERE Portal**
- ✅ Flowchart berakhir saat user membuka aplikasi via SSO
- ✅ Menghapus detail alur di dalam aplikasi AMS, SCOPE, dan Finish Good
- ✅ Tetap menggunakan **icon jajargenjang** untuk input/output

### Alur yang Dihapus:
- ❌ Validasi SSO token di aplikasi target
- ❌ User action di dalam aplikasi
- ❌ Fitur-fitur spesifik aplikasi
- ❌ Alur kembali ke SPHERE dari aplikasi

### Alur yang Dipertahankan:
- ✅ Landing Page
- ✅ Sign In / Logout
- ✅ Dashboard & Main Menu
- ✅ Profile Management
- ✅ Role-based App Display
- ✅ SSO Token Generation
- ✅ Redirect ke aplikasi (endpoint)

### Endpoint Baru:
```
OpenNewTab --> EndApp([User Menggunakan Aplikasi])
```

---

## 2. SPHERE_USE_CASE.md ✅

### Perubahan:
- ✅ **Menggunakan style default PlantUML** (tanpa dekorasi warna)
- ✅ **Batasan diagram hanya pada SPHERE Portal**
- ✅ Menghapus package AMS, SCOPE, dan Finish Good yang detail
- ✅ Mengganti dengan use case sederhana: Access AMS, Access SCOPE, Access Finish Good

### Style yang Dihapus:
```plantuml
❌ skinparam actorStyle awesome
❌ skinparam shadowing false
❌ skinparam defaultFontName Arial
❌ skinparam actor { BackgroundColor #4ade80 ... }
❌ skinparam usecase { BackgroundColor #dbeafe ... }
❌ skinparam package { BackgroundColor #f3f4f6 ... }
❌ actor "Guest User" as Guest #lightblue
```

### Style yang Dipertahankan:
```plantuml
✅ skinparam packageStyle rectangle
✅ actor "Guest User" as Guest (default style)
```

### Use Case yang Dihapus:
- ❌ Monitor Arrivals, Track Shipments, Generate Arrival Reports (AMS)
- ❌ View Production Data, Financial Analysis, HR Management (SCOPE)
- ❌ Manage Inventory, Store Operations, Pull Requests (Finish Good)
- ❌ Advanced Features untuk setiap aplikasi
- ❌ Validate SSO Token (UC12)

### Use Case yang Ditambahkan:
```plantuml
✅ Access AMS (APP1)
✅ Access SCOPE (APP2)
✅ Access Finish Good (APP3)
```

### Notes yang Ditambahkan:
```plantuml
note left of APP1
  Detail fitur AMS berada
  di luar scope SPHERE
end note

note left of APP2
  Detail fitur SCOPE berada
  di luar scope SPHERE
end note

note left of APP3
  Detail fitur Finish Good
  berada di luar scope SPHERE
end note
```

---

## 3. Dokumentasi Tambahan

### Batasan Diagram (ditambahkan di kedua file)

**SPHERE_FLOWCHART.md:**
```markdown
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

Setelah user membuka aplikasi melalui SSO, alur keluar dari scope SPHERE 
dan masuk ke scope aplikasi masing-masing.
```

**SPHERE_USE_CASE.md:**
```markdown
### **Batasan Diagram**

Use case diagram ini **hanya mencakup scope aplikasi SPHERE Portal**, yaitu:
- ✅ Authentication & Authorization
- ✅ Dashboard & Profile Management
- ✅ SSO Token Generation
- ✅ Akses ke aplikasi eksternal (AMS, SCOPE, Finish Good)

**Tidak mencakup**:
- ❌ Detail use case di dalam aplikasi AMS
- ❌ Detail use case di dalam aplikasi SCOPE
- ❌ Detail use case di dalam aplikasi Finish Good

Setelah user mengakses aplikasi melalui SSO (APP1, APP2, APP3), 
detail fitur dan use case berada di luar scope SPHERE dan menjadi 
tanggung jawab aplikasi masing-masing.
```

---

## Ringkasan Perubahan

### Flowchart (Mermaid)
| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Scope | SPHERE + Detail Aplikasi | **SPHERE Only** |
| Endpoint | User kembali ke SPHERE | **User menggunakan aplikasi** |
| Node Count | ~30 nodes | **~20 nodes** |
| Icon Input/Output | ✅ Jajargenjang | ✅ Jajargenjang (tetap) |

### Use Case (PlantUML)
| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Scope | SPHERE + Detail Aplikasi | **SPHERE Only** |
| Style | Custom colors & awesome | **Default PlantUML** |
| Actor Style | Colored (#lightblue, etc) | **Default** |
| Use Case Count | ~30 use cases | **~15 use cases** |
| Packages | 4 packages (SPHERE + 3 apps) | **2 packages** (SPHERE + Access) |

---

## File yang Diupdate

1. ✅ `docs/SPHERE_FLOWCHART.md`
2. ✅ `docs/SPHERE_USE_CASE.md`
3. ℹ️ `docs/SPHERE_SYSTEM_ANALYSIS.md` (tidak diubah, tetap lengkap)

---

## Cara Menggunakan

### Flowchart (Mermaid)
1. Buka file `SPHERE_FLOWCHART.md`
2. Copy kode Mermaid
3. Paste di:
   - [Mermaid Live Editor](https://mermaid.live)
   - VS Code dengan extension "Markdown Preview Mermaid Support"
   - GitHub/GitLab (auto-render)

### Use Case (PlantUML)
1. Buka file `SPHERE_USE_CASE.md`
2. Copy kode PlantUML
3. Paste di:
   - [PlantUML Online](https://www.plantuml.com/plantuml/uml/)
   - VS Code dengan extension "PlantUML"
   - IntelliJ IDEA dengan plugin PlantUML

---

## Kesimpulan

✅ **Flowchart** sekarang fokus pada alur SPHERE Portal saja  
✅ **Use Case** menggunakan style default PlantUML tanpa dekorasi  
✅ **Batasan scope** dijelaskan dengan jelas di dokumentasi  
✅ **Lebih sederhana** dan mudah dipahami  
✅ **Tetap lengkap** untuk menjelaskan fungsi SPHERE sebagai SSO Portal  

Diagram sekarang lebih fokus pada **tanggung jawab SPHERE** sebagai portal SSO, 
tanpa masuk ke detail implementasi aplikasi-aplikasi yang terhubung.

---

**Updated**: 2025-12-30  
**Version**: 2.0 (Simplified)
