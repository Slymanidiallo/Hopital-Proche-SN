# SantéSénégal — Hospital Finder | Recherche d'établissements de santé

> **EN:** Full-stack prototype for helping users find healthcare facilities in Senegal, with a web frontend and a FastAPI backend.  
> **FR :** Prototype full-stack destiné à aider les utilisateurs à rechercher des établissements de santé au Sénégal, avec une interface web et un backend FastAPI.

## 🇬🇧 English

### Overview
SantéSénégal combines a static web frontend with a **FastAPI** backend. The API exposes health-check endpoints, a hospital-search endpoint that calls the Groq chat-completions API, and a basic appointment-request endpoint that can send email through SMTP.

### Main API routes
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| GET | `/api/health` | API health check |
| POST | `/api/search` | Generate hospital suggestions from a disease/region request |
| POST | `/api/rdv` | Process an appointment request |

Interactive API documentation is available at `/docs` when the backend is running.

### Stack
- Backend: Python, FastAPI, Pydantic, HTTPX
- AI integration: Groq API (configured through `GROQ_API_KEY`)
- Email: SMTP configuration
- Frontend: HTML, CSS and JavaScript (see `frontend/`)
- Containerization: Dockerfile at the repository root

### Backend setup
```bash
git clone https://github.com/Slymanidiallo/Hopital-Proche-SN.git
cd Hopital-Proche-SN/backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Create a local `.env` file (do not commit it) with the required configuration, for example:

```env
GROQ_API_KEY=your_groq_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
FROM_EMAIL=your_email
```

Run the API:

```bash
uvicorn main:app --reload --port 8000
```

Open `http://localhost:8000/docs` to inspect the API. The backend serves the frontend at the root URL when the frontend directory is available.

### Safety and data quality
AI-generated hospital names, addresses, phone numbers, doctors, prices, availability and emergency-care information must be independently verified against authoritative sources. Do not treat generated responses as verified medical or emergency information. Appointment confirmation currently depends on SMTP configuration and should be tested before use. Restrict CORS origins and review data-protection practices before public deployment.

## 🇫🇷 Français

### Présentation
SantéSénégal associe une interface web statique à un backend **FastAPI**. L'API expose des routes de vérification de disponibilité du service, une recherche d'hôpitaux utilisant l'API Groq et un endpoint de demande de rendez-vous pouvant envoyer un e-mail via SMTP.

### Principales routes API
| Méthode | Endpoint | Rôle |
|---|---|---|
| GET | `/health` | Vérification du service |
| GET | `/api/health` | Vérification de l'API |
| POST | `/api/search` | Génération de suggestions d'établissements à partir d'une maladie et d'une région |
| POST | `/api/rdv` | Traitement d'une demande de rendez-vous |

La documentation interactive est disponible sur `/docs` lorsque le backend est lancé.

### Technologies
- Backend : Python, FastAPI, Pydantic, HTTPX
- IA : API Groq (clé `GROQ_API_KEY`)
- E-mail : configuration SMTP
- Frontend : HTML, CSS et JavaScript (dossier `frontend/`)
- Conteneurisation : Dockerfile à la racine

### Installation du backend
```bash
git clone https://github.com/Slymanidiallo/Hopital-Proche-SN.git
cd Hopital-Proche-SN/backend
python -m venv .venv
# Windows : .venv\Scripts\activate
# macOS/Linux : source .venv/bin/activate
pip install -r requirements.txt
```

Créez un fichier local `.env` sans le publier :

```env
GROQ_API_KEY=votre_cle_groq
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email
SMTP_PASS=votre_mot_de_passe_application
FROM_EMAIL=votre_email
```

Lancez l'API :

```bash
uvicorn main:app --reload --port 8000
```

Consultez `http://localhost:8000/docs`. Le backend sert également le frontend à la racine si le dossier correspondant est présent.

### Sécurité et fiabilité
Les noms d'hôpitaux, adresses, numéros, médecins, tarifs, disponibilités et informations d'urgence générés par IA doivent être vérifiés auprès de sources officielles. Ne les considérez pas comme des informations médicales ou d'urgence validées. La confirmation des rendez-vous dépend de la configuration SMTP. Avant une mise en production, restreignez les origines CORS et renforcez la protection des données personnelles.
