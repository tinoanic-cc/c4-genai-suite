# Cline Project Context - c4 GenAI Suite

> **WICHTIG:** Diese Datei sollte bei jedem neuen Cline Task gelesen werden, um wichtige Projekt-Konventionen und bekannte Probleme zu verstehen.

## 🏗️ **Projekt-Architektur**

### **Tech Stack:**
- **Frontend:** React + TypeScript + Vite + Mantine UI
- **Backend:** NestJS + TypeScript + PostgreSQL
- **Deployment:** Docker + Docker Compose
- **Development:** Hot-Reload Setup verfügbar

### **Wichtige Verzeichnisse:**
```
├── frontend/src/
│   ├── pages/chat/           # Chat-Interface
│   ├── pages/admin/          # Admin-Interface  
│   ├── components/           # Wiederverwendbare Komponenten
│   └── api/                  # API-Client Code
├── backend/src/
│   ├── controllers/          # REST API Endpoints
│   ├── domain/               # Business Logic
│   └── migrations/           # Datenbank-Migrationen
└── scripts/                  # Helper Scripts
```

## 🚨 **KRITISCHE DOCKER-ENTWICKLUNGSREGELN**

### **⚠️ IMMER BEACHTEN: Docker-Cache-Problem**

**Problem:** Änderungen am Frontend-Code werden oft nicht im Browser sichtbar, weil Docker alte Images cached.

**LÖSUNG - Verwende IMMER diese Scripts:**

```bash
# Development mit Hot-Reload (EMPFOHLEN für tägliche Arbeit)
./scripts/docker-dev.sh start-dev

# Bei Cache-Problemen (wenn Änderungen nicht sichtbar sind)
./scripts/docker-dev.sh rebuild

# Bei größeren Problemen
./scripts/docker-dev.sh clean
```

**NIEMALS manuell `docker-compose up` verwenden ohne das Script!**

### **Verfügbare Docker-Setups:**
1. **Development (Hot-Reload):** `docker-compose-dev-hotreload.yml`
2. **Production-like:** `docker-compose-dev.yml`

## 🎨 **Frontend-Entwicklung**

### **Layout-System:**
- **Chat-Modus:** 3 Bereiche (Sidebar + Chat + Rechte Sidebar)
- **Prompts-Modus:** 2 Bereiche (PromptSidebar + PromptLibrary)
- **Navigation:** Tabs in oberster Leiste (nicht in Sidebar!)

### **Wichtige Komponenten:**
- `ChatPage.tsx` - Hauptchat-Interface
- `PromptLibrary.tsx` - Prompt-Bibliothek (2-Spalten-Layout!)
- `NavigationBar.tsx` - Oberste Navigation mit Tabs

### **Styling:**
- **Mantine UI** für Komponenten
- **Tailwind CSS** für Custom-Styling
- **Responsive Design** beachten

## 🔧 **Backend-Entwicklung**

### **Architektur-Pattern:**
- **Domain-Driven Design** in `backend/src/domain/`
- **Controller-Service-Repository** Pattern
- **TypeORM** für Datenbank-Zugriff

### **Wichtige Services:**
- `prompts.service.ts` - Prompt-Management
- `prompt-categories.service.ts` - Kategorien
- `tasks.service.ts` - Task-System

### **API-Konventionen:**
- REST-Endpoints in `controllers/`
- DTOs für Request/Response
- Swagger-Dokumentation

## 📝 **Code-Konventionen**

### **TypeScript:**
- **Strict Mode** aktiviert
- **Interfaces** für alle Datenstrukturen
- **Proper Error Handling**

### **React:**
- **Functional Components** mit Hooks
- **TypeScript Props** definieren
- **Mantine UI** Komponenten bevorzugen

### **Naming:**
- **camelCase** für Variablen/Funktionen
- **PascalCase** für Komponenten/Interfaces
- **kebab-case** für Dateien

## 🐛 **Bekannte Probleme & Lösungen**

### **1. Docker-Cache-Problem**
- **Symptom:** Frontend-Änderungen nicht sichtbar
- **Lösung:** `./scripts/docker-dev.sh rebuild`

### **2. Layout-Probleme**
- **Prompt Library:** Muss 2-Spalten-Layout haben (nicht 3!)
- **Navigation:** Tabs gehören in oberste Leiste
- **Panel-Logik:** `rightPanelVisible` nur im Chat-Modus

### **3. API-Probleme**
- **CORS:** Backend läuft auf Port 3000, Frontend auf 3333
- **Proxy:** Vite-Proxy für API-Calls konfiguriert

## 🚀 **Entwicklungs-Workflows**

### **Neue Features entwickeln:**
```bash
# 1. Development-Umgebung starten
./scripts/docker-dev.sh start-dev

# 2. Code ändern
# 3. Änderungen sind sofort sichtbar (Hot-Reload)

# 4. Bei Problemen: Force Rebuild
./scripts/docker-dev.sh rebuild
```

### **Frontend-Komponenten ändern:**
- Immer TypeScript-Interfaces definieren
- Mantine UI Komponenten verwenden
- Responsive Design beachten
- Layout-System respektieren

### **Backend-APIs ändern:**
- Controller → Service → Repository Pattern
- DTOs für Request/Response
- Proper Error Handling
- Swagger-Docs aktualisieren

## 📚 **Wichtige Dateien**

### **Konfiguration:**
- `docker-compose-dev-hotreload.yml` - Development Setup
- `frontend/vite.config.ts` - Frontend Build Config
- `backend/src/app.module.ts` - Backend Module Config

### **Dokumentation:**
- `DOCKER-DEVELOPMENT.md` - Docker-Entwicklung
- `README.md` - Projekt-Übersicht
- `DEVELOPERS.md` - Entwickler-Guide

### **Scripts:**
- `scripts/docker-dev.sh` - Docker Helper (IMMER VERWENDEN!)

## 🎯 **Häufige Aufgaben**

### **Frontend-Layout ändern:**
1. Komponente in `frontend/src/pages/` oder `frontend/src/components/`
2. TypeScript-Interfaces definieren
3. Mantine UI + Tailwind CSS verwenden
4. Hot-Reload testet automatisch

### **Neue API-Endpoints:**
1. Controller in `backend/src/controllers/`
2. Service in `backend/src/domain/`
3. DTOs definieren
4. Frontend API-Client in `frontend/src/api/`

### **Datenbank-Änderungen:**
1. Entity in `backend/src/domain/database/entities/`
2. Migration erstellen
3. Service-Layer anpassen

## ⚡ **Quick Reference**

```bash
# Development starten
./scripts/docker-dev.sh start-dev

# Bei Problemen
./scripts/docker-dev.sh rebuild

# Logs anzeigen
./scripts/docker-dev.sh logs

# Container-Shell
./scripts/docker-dev.sh shell

# Alles bereinigen
./scripts/docker-dev.sh clean
```

---

**🔥 WICHTIG:** Diese Datei bei jedem neuen Cline Task lesen, um Projekt-Konventionen und bekannte Probleme zu verstehen!
