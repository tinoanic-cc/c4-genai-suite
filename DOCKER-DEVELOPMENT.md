# Docker Development Guide

## 🚨 Docker-Cache-Problem vermeiden

Dieses Dokument beschreibt, wie Sie das Docker-Cache-Problem vermeiden, das wir heute erlebt haben, bei dem Änderungen am Frontend-Code nicht im Browser ankamen.

## 📋 Problem-Zusammenfassung

**Was ist passiert:**
- Änderungen an React-Komponenten wurden gemacht
- Docker-Container wurde neu gestartet
- Änderungen waren nicht im Browser sichtbar
- Das lag daran, dass Docker das alte Image gecacht hatte

## 🛠️ Lösungsstrategien

### **1. Development-Script verwenden (Empfohlen)**

Verwenden Sie das bereitgestellte Script für alle Docker-Operationen:

```bash
# Hilfe anzeigen
./scripts/docker-dev.sh help

# Development-Umgebung mit Hot-Reload starten
./scripts/docker-dev.sh start-dev

# Production-Umgebung starten
./scripts/docker-dev.sh start-prod

# Frontend force rebuild (bei Cache-Problemen)
./scripts/docker-dev.sh rebuild

# Alles komplett bereinigen
./scripts/docker-dev.sh clean
```

### **2. Hot-Reload Development Setup**

Für die tägliche Entwicklung verwenden Sie:

```bash
# Startet Frontend mit Volume-Mounting für sofortige Änderungen
./scripts/docker-dev.sh start-dev
```

**Vorteile:**
- ✅ Änderungen werden sofort im Browser sichtbar
- ✅ Kein Docker-Rebuild nötig
- ✅ Schnellere Entwicklung

### **3. Manuelle Docker-Befehle (falls nötig)**

Falls das Script nicht verfügbar ist:

```bash
# Bei Cache-Problemen: Kompletter Rebuild
docker-compose -f docker-compose-dev.yml down c4-frontend
docker rmi c4-genai-suite-c4-frontend
docker-compose -f docker-compose-dev.yml build c4-frontend --no-cache
docker-compose -f docker-compose-dev.yml up c4-frontend -d
```

## 🔍 Problem-Diagnose

### **Wie erkenne ich Cache-Probleme?**

1. **Symptome:**
   - Code-Änderungen sind nicht sichtbar
   - Alte UI-Elemente werden noch angezeigt
   - Browser-Refresh hilft nicht

2. **Überprüfung:**
   ```bash
   # Prüfen, ob Änderungen im Container angekommen sind
   docker exec c4-genai-suite-c4-frontend-1 grep -r "MeinNeuerCode" /srv/
   
   # Container-Logs prüfen
   ./scripts/docker-dev.sh logs
   ```

### **Browser-Cache vs. Docker-Cache**

- **Browser-Cache:** `Ctrl+F5` oder `Cmd+Shift+R`
- **Docker-Cache:** `./scripts/docker-dev.sh rebuild`

## 📁 Datei-Struktur

```
├── docker-compose-dev.yml              # Production-ähnliches Setup
├── docker-compose-dev-hotreload.yml    # Development mit Hot-Reload
├── frontend/
│   ├── Dockerfile                      # Production Build
│   ├── Dockerfile.dev                  # Development Build
│   └── src/                           # Source Code (Hot-Reload mounted)
└── scripts/
    └── docker-dev.sh                   # Helper Script
```

## 🚀 Empfohlener Workflow

### **Tägliche Entwicklung:**
```bash
# 1. Development-Umgebung starten
./scripts/docker-dev.sh start-dev

# 2. Code ändern in frontend/src/
# 3. Änderungen sind sofort im Browser sichtbar
```

### **Bei Cache-Problemen:**
```bash
# 1. Force Rebuild
./scripts/docker-dev.sh rebuild

# 2. Browser-Cache leeren (Ctrl+F5)
```

### **Bei größeren Problemen:**
```bash
# 1. Alles bereinigen
./scripts/docker-dev.sh clean

# 2. Neu starten
./scripts/docker-dev.sh start-dev
```

## ⚠️ Wichtige Hinweise

1. **Immer das Script verwenden:** Vermeidet manuelle Docker-Befehle
2. **Development vs. Production:** Unterschiedliche Setups für verschiedene Zwecke
3. **Browser-Cache:** Nach Docker-Rebuild immer Browser-Cache leeren
4. **Volume-Mounting:** Im Development-Modus werden Dateien direkt gemountet

## 🔧 Troubleshooting

### **Problem: Änderungen nicht sichtbar**
```bash
# Lösung 1: Force Rebuild
./scripts/docker-dev.sh rebuild

# Lösung 2: Komplett bereinigen
./scripts/docker-dev.sh clean
./scripts/docker-dev.sh start-dev
```

### **Problem: Container startet nicht**
```bash
# Logs prüfen
./scripts/docker-dev.sh logs

# Shell öffnen für Debugging
./scripts/docker-dev.sh shell
```

### **Problem: Port bereits belegt**
```bash
# Alle Container stoppen
docker-compose -f docker-compose-dev.yml down
docker-compose -f docker-compose-dev-hotreload.yml down
```

## 📚 Weitere Ressourcen

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Vite Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement)
- [React Fast Refresh](https://www.npmjs.com/package/react-refresh)

---

**Fazit:** Mit diesem Setup und den bereitgestellten Tools sollten Docker-Cache-Probleme der Vergangenheit angehören! 🎉
