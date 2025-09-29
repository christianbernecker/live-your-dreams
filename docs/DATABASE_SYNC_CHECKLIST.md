# 🎯 DATABASE SYNC CHECKLIST - Quick Reference

**Für jedes neue Feature mit CRUD-Operationen**

---

## ⚡ QUICK CHECK: Vor Implementation

```markdown
□ Field-Mapping zwischen Frontend ↔ Backend definiert
□ API Response enthält alle benötigten Frontend-Felder  
□ Database Refresh Strategy geplant
□ Debug Logging Points identifiziert
```

---

## 🔧 IMPLEMENTATION PATTERN

### **1. Field-Mapping dokumentieren**
```typescript
// In jeder neuen Feature-Datei:
/*
FIELD MAPPING:
Frontend → Backend → Database
isActive → isVerified → is_active
roleIds → roleIds → user_roles.role_id[]
displayName → name → name
*/
```

### **2. CRUD Success Handler (Standard Pattern)**
```typescript
const handleCRUDSuccess = async () => {
  // 1. Modal schließen (sofortiges Feedback)
  setShowModal(false);
  
  // 2. Success Toast
  showSuccess('Erfolgreich gespeichert');
  
  // 3. KRITISCH: Database Refresh
  await fetchFromDatabase();
};
```

### **3. API Response Kompatibilität**
```typescript
// Backend: Compatibility Aliases hinzufügen
const apiResponse = {
  ...entityData,
  // Legacy/Frontend Compatibility
  emailVerified: entity.isVerified,
  status: entity.isActive
};
```

---

## 🚨 HÄUFIGE FEHLER VERMEIDEN

| ❌ **FEHLER** | ✅ **LÖSUNG** |
|---------------|---------------|
| Verschiedene Felder für dasselbe Konzept | Ein logisches Feld = Ein physisches Feld |
| Lokale State Updates nach CRUD | Database Refresh nach erfolgreichen Operations |
| Keine Field-Mapping Dokumentation | Explizite Mapping-Kommentare im Code |
| Frontend zeigt Input-Daten | Frontend zeigt API-Response-Daten |
| Filter verwenden falsche Felder | Filter-Logic mit korrekten Field-Namen |

---

## 🔍 DEBUG WORKFLOW

```typescript
// Bei Sync-Problemen diese 6 Punkte prüfen:
console.log('1. 🔍 FRONTEND INPUT:', formData);
console.log('2. 📤 API PAYLOAD:', apiPayload); 
console.log('3. ⚙️  BACKEND PROCESSING:', processedData);
console.log('4. 💾 DATABASE RESULT:', dbResult);
console.log('5. 📡 API RESPONSE:', responseData);
console.log('6. 🔄 UI UPDATE:', newUIState);
```

---

## ✅ QUALITY GATES

**Vor Deployment prüfen:**
- [ ] Modal-Values = Table-Values nach Update?
- [ ] Page Reload zeigt korrekte Daten?
- [ ] Filter funktionieren mit neuen Feldern?
- [ ] Success/Error States implementiert?
- [ ] Database Refresh nach allen CRUD Operations?

---

**Quick Win:** Diese Checkliste als Kommentar in jede neue CRUD-Datei kopieren! 📋
