# 🚀 PANDUAN TESTING EVENTBMS UNTUK REKAN

## 📋 **OVERVIEW**
Dokumen ini berisi panduan lengkap untuk melakukan testing aplikasi EventBMS (Dolan Banyumas). Aplikasi ini adalah platform wisata komprehensif yang mencakup destinasi wisata, kuliner, penginapan, oleh-oleh, desa wisata, biro perjalanan, dan sistem event management.

---

## 🛠️ **PERSIAPAN TESTING**

### **1. Setup Environment**
```bash
# Pastikan aplikasi sudah running
npm run dev
# atau
yarn dev

# Akses aplikasi di browser
http://localhost:3000
```

### **2. Browser yang Disarankan**
- Chrome (versi terbaru)
- Firefox (versi terbaru)
- Safari (untuk testing mobile)
- Edge (versi terbaru)

### **3. Tools yang Dibutuhkan**
- Browser Developer Tools (F12)
- Mobile Device Simulator
- Screenshot tool
- Notepad untuk catatan

---

## 🎯 **PRIORITAS TESTING**

### **🔥 CRITICAL (Must Test First)**
1. **Homepage Loading** - Pastikan aplikasi bisa diakses
2. **User Registration/Login** - Sistem autentikasi dasar
3. **Destinasi Wisata** - Fitur utama aplikasi
4. **Admin Panel Access** - Untuk manajemen konten
5. **Mobile Responsive** - Kompatibilitas mobile

### **⚡ IMPORTANT (Test After Critical)**
1. **Kuliner System** - Order dan pembayaran
2. **Event Management** - Pembelian tiket
3. **Payment System** - Proses pembayaran
4. **Search & Filter** - Fungsi pencarian
5. **User Profile** - Manajemen akun

### **✨ NICE TO HAVE (Test Last)**
1. **Advanced Admin Features** - Fitur admin lanjutan
2. **Social Features** - Sharing dan review
3. **Email Notifications** - Notifikasi email
4. **Performance** - Loading speed

---

## 📝 **CARA MENGGUNAKAN LEMBAR TESTING**

### **Step 1: Download Files**
- `LEMBAR_TESTING_EVENTBMS.md` - Form testing utama
- `DATA_TESTING_EVENTBMS.md` - Data untuk testing

### **Step 2: Print atau Buka di Device**
- Print lembar testing untuk mencatat manual
- Atau buka di device terpisah untuk referensi

### **Step 3: Follow Test Cases**
- Ikuti setiap test case step by step
- Centang ✅ untuk Pass, ❌ untuk Fail
- Isi catatan untuk setiap issue

### **Step 4: Document Bugs**
- Gunakan format bug report yang sudah disediakan
- Screenshot setiap bug yang ditemukan
- Kategorikan severity (Critical/High/Medium/Low)

---

## 🔍 **TESTING WORKFLOW**

### **Phase 1: Smoke Testing (30 menit)**
```
1. Buka homepage ✅/❌
2. Login sebagai user ✅/❌
3. Login sebagai admin ✅/❌
4. Navigasi menu utama ✅/❌
5. Test mobile view ✅/❌
```

### **Phase 2: Functional Testing (2-3 jam)**
```
1. Test semua fitur utama
2. Test CRUD operations
3. Test payment system
4. Test search & filter
5. Test responsive design
```

### **Phase 3: Integration Testing (1 jam)**
```
1. Test complete user journey
2. Test admin workflow
3. Test error handling
4. Test edge cases
```

### **Phase 4: Final Review (30 menit)**
```
1. Review semua bug yang ditemukan
2. Prioritize bug fixes
3. Write summary report
4. Provide recommendations
```

---

## 🐛 **BUG REPORTING GUIDELINES**

### **Bug Severity Levels**
- **Critical**: Aplikasi crash, tidak bisa login, data hilang
- **High**: Fitur utama tidak berfungsi, UI rusak parah
- **Medium**: Fitur minor tidak berfungsi, UI issue kecil
- **Low**: Typo, warna tidak sesuai, enhancement

### **Bug Report Template**
```
Bug ID: BUG-001
Title: [Brief description]
Severity: Critical/High/Medium/Low
Module: [Which feature/module]
Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3
Expected Result: [What should happen]
Actual Result: [What actually happens]
Screenshot: [Attach screenshot]
Browser: [Chrome/Firefox/Safari/Edge]
OS: [Windows/Mac/Linux]
Additional Notes: [Any other relevant info]
```

---

## 📊 **TESTING METRICS**

### **Coverage Goals**
- **Functional Coverage**: 90%+ fitur utama
- **Browser Coverage**: Chrome, Firefox, Safari, Edge
- **Device Coverage**: Desktop, Tablet, Mobile
- **User Journey Coverage**: 100% critical paths

### **Quality Gates**
- **Critical Bugs**: 0 allowed
- **High Bugs**: Max 2 allowed
- **Medium Bugs**: Max 5 allowed
- **Low Bugs**: Max 10 allowed

---

## 🎨 **UI/UX TESTING CHECKLIST**

### **Visual Design**
- ⬜ Layout sesuai dengan design
- ⬜ Colors dan fonts konsisten
- ⬜ Images load dengan benar
- ⬜ Icons dan buttons terlihat jelas

### **User Experience**
- ⬜ Navigation intuitif
- ⬜ Forms mudah diisi
- ⬜ Error messages jelas
- ⬜ Loading states informatif

### **Accessibility**
- ⬜ Keyboard navigation works
- ⬜ Screen reader compatible
- ⬜ Color contrast adequate
- ⬜ Text readable at all sizes

---

## 🔒 **SECURITY TESTING**

### **Authentication**
- ⬜ Password requirements enforced
- ⬜ Session timeout works
- ⬜ Logout clears session
- ⬜ Admin access restricted

### **Data Protection**
- ⬜ Sensitive data encrypted
- ⬜ Input validation works
- ⬜ SQL injection protected
- ⬜ XSS protection active

---

## 📱 **MOBILE TESTING**

### **Device Testing**
- ⬜ iPhone (Safari)
- ⬜ Android (Chrome)
- ⬜ iPad (Safari)
- ⬜ Android Tablet (Chrome)

### **Mobile Features**
- ⬜ Touch interactions work
- ⬜ Swipe gestures work
- ⬜ Pinch to zoom works
- ⬜ Orientation change works

---

## ⚡ **PERFORMANCE TESTING**

### **Loading Speed**
- ⬜ Homepage loads < 3 seconds
- ⬜ Images load < 5 seconds
- ⬜ Forms submit < 2 seconds
- ⬜ Navigation < 1 second

### **Resource Usage**
- ⬜ Memory usage reasonable
- ⬜ CPU usage normal
- ⬜ Network requests optimized
- ⬜ Images compressed

---

## 🎯 **TESTING SCENARIOS**

### **Scenario A: New User Journey**
```
1. Visit homepage
2. Register new account
3. Verify email (if required)
4. Login
5. Browse destinations
6. View destination details
7. Order culinary menu
8. Complete payment
9. View order history
```

### **Scenario B: Returning User Journey**
```
1. Login with existing account
2. Search for specific destination
3. Filter results
4. Book accommodation
5. Buy event ticket
6. Update profile
7. Logout
```

### **Scenario C: Admin Journey**
```
1. Login as admin
2. View dashboard
3. Add new destination
4. Upload images
5. Manage events
6. View user reports
7. Update system settings
```

---

## 📋 **DAILY TESTING SCHEDULE**

### **Day 1: Setup & Critical Testing**
- Morning: Environment setup, smoke testing
- Afternoon: Critical features testing
- Evening: Bug documentation

### **Day 2: Functional Testing**
- Morning: User features testing
- Afternoon: Admin features testing
- Evening: Integration testing

### **Day 3: Final Testing & Reporting**
- Morning: Bug fixes verification
- Afternoon: Final review
- Evening: Report preparation

---

## 🚨 **EMERGENCY CONTACTS**

**Developer**: _______________
**Email**: _______________
**Phone**: _______________

**Project Manager**: _______________
**Email**: _______________
**Phone**: _______________

---

## 📝 **TESTING NOTES**

### **General Notes**
- Test dengan data yang berbeda untuk setiap test case
- Dokumentasikan setiap bug dengan detail
- Ambil screenshot untuk bug yang visual
- Test di berbagai browser dan device

### **Common Issues to Watch**
- Image upload failures
- Payment gateway timeouts
- Mobile layout issues
- Form validation problems
- Admin permission errors

---

## ✅ **TESTING COMPLETION CHECKLIST**

### **Before Submitting Report**
- ⬜ All test cases completed
- ⬜ All bugs documented
- ⬜ Screenshots attached
- ⬜ Summary report written
- ⬜ Recommendations provided
- ⬜ Report reviewed by team

### **Report Contents**
- ⬜ Executive summary
- ⬜ Test results overview
- ⬜ Bug list with priorities
- ⬜ Recommendations
- ⬜ Next steps

---

**Selamat Testing! 🚀**

Jika ada pertanyaan atau butuh bantuan, jangan ragu untuk menghubungi developer atau project manager.
