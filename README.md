# SantéSénégal 🏥 — Full Stack

Application web complète (Frontend + Backend FastAPI) pour trouver rapidement un hôpital au Sénégal.

## Structure

```
sante-senegal/
├── index.html              → Frontend
├── css/style.css           → Styles
├── js/i18n.js              → Traductions FR / Wolof
├── js/app.js               → Logique frontend
├── backend/
│   ├── main.py             → Serveur FastAPI
│   ├── requirements.txt    → Dépendances Python
│   └── .env.example        → Variables d'environnement
└── .vscode/launch.json     → Config lancement VS Code
```

## Installation dans VS Code

### 1. Ouvrir le projet
Fichier → Ouvrir le dossier → sélectionnez ce dossier

### 2. Installer le backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Configurer les variables
```bash
cp .env.example .env
# Éditez .env avec votre clé Anthropic et config SMTP Gmail
```

### 4. Lancer le backend
Appuyez sur F5 dans VS Code  — ou :
```bash
cd backend && uvicorn main:app --reload --port 8000
```
API dispo : http://localhost:8000  |  Docs : http://localhost:8000/docs

### 5. Lancer le frontend
Clic droit sur index.html → "Open with Live Server"  — ou :
```bash
python -m http.server 5500
```

## Urgences Sénégal 🇸🇳
SAMU: 15 | Pompiers: 18 | Police: 17
