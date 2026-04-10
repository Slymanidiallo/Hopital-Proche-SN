
"""
SantéSénégal — Backend FastAPI avec GROQ API (gratuit)
"""

import os
import re
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SantéSénégal API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    disease: str
    region: str
    region_code: str
    is_urgence: bool = False
    lang: str = "fr"

class RDVRequest(BaseModel):
    hospital_name: str
    hospital_address: str
    patient_name: str
    patient_email: EmailStr
    patient_phone: str
    rdv_date: str
    doctor: str | None = None
    motif: str | None = None
    lang: str = "fr"

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "SantéSénégal API avec Groq 🇸🇳"}

@app.get("/api/health")
async def api_health_check():
    return {"status": "ok", "service": "SantéSénégal API with Groq"}

@app.post("/api/search")
async def search_hospitals(req: SearchRequest):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Clé API Groq manquante.")

    prompt = build_prompt(req.disease, req.region, req.is_urgence, req.lang)

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "Tu es un assistant médical expert du Sénégal. Retourne UNIQUEMENT du JSON valide."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 1500,
            },
        )

    if response.status_code != 200:
        error_detail = response.text
        print(f"Erreur Groq: {response.status_code} - {error_detail}")
        raise HTTPException(status_code=502, detail=f"Erreur API Groq: {response.status_code}")

    data = response.json()
    raw = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    match = re.search(r"\[[\s\S]*\]", raw)
    if not match:
        print(f"Réponse brute: {raw[:200]}")
        raise HTTPException(status_code=502, detail="Réponse Groq invalide.")

    try:
        hospitals = json.loads(match.group())
    except json.JSONDecodeError as e:
        print(f"Erreur JSON: {e}")
        raise HTTPException(status_code=502, detail="JSON Groq invalide.")

    return {"hospitals": hospitals}

@app.post("/api/rdv")
async def create_rdv(req: RDVRequest):
    try:
        send_confirmation_email(req)
        return {"success": True, "message": "Rendez-vous confirmé, email envoyé."}
    except Exception as e:
        print(f"Erreur email : {e}")
        return {"success": True, "message": "Rendez-vous enregistré."}

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")

if os.path.exists(frontend_path):
    css_path = os.path.join(frontend_path, "css")
    js_path = os.path.join(frontend_path, "js")
    assets_path = os.path.join(frontend_path, "assets")
    
    if os.path.exists(css_path):
        app.mount("/css", StaticFiles(directory=css_path), name="css")
    if os.path.exists(js_path):
        app.mount("/js", StaticFiles(directory=js_path), name="js")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/")
    async def serve_index():
        index_file = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend non trouvé"}

def build_prompt(disease: str, region: str, is_urgence: bool, lang: str) -> str:
    return f"""Tu es un assistant médical expert du système de santé sénégalais.
L'utilisateur cherche un hôpital dans la région "{region}", Sénégal, pour: "{disease}".

Retourne UNIQUEMENT un tableau JSON valide. Format EXACT:
[
  {{
    "nom": "Nom officiel",
    "type": "CHU / Hôpital régional / Centre de santé",
    "adresse": "Quartier, Ville",
    "distance": "X km",
    "urgence24h": true,
    "telephone": "numéro",
    "pertinence": "Pourquoi cet hôpital",
    "specialites": ["spécialité1", "spécialité2"],
    "tarifs": {{
      "consultation": "2000-5000 FCFA",
      "hospitalisation": "15000-30000 FCFA/jour",
      "urgences": "5000-10000 FCFA"
    }},
    "medecins": [
      {{
        "prenom": "Amadou",
        "nom": "Diallo",
        "specialite": "Médecin généraliste",
        "disponible": true
      }}
    ],
    "gps": {{ "lat": 14.69, "lng": -17.44 }}
  }}
]

Règles: 3 hôpitaux RÉELS du Sénégal, triés par pertinence.
{"PRIORITÉ aux hôpitaux avec urgence 24h." if is_urgence else ""}"""

def send_confirmation_email(req: RDVRequest):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("FROM_EMAIL", smtp_user)

    if not smtp_user or not smtp_pass:
        return

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px;">
      <div style="background: #013D26; padding: 24px; text-align: center;">
        <h1 style="color: white;">✅ Rendez-vous confirmé</h1>
      </div>
      <div style="padding: 28px;">
        <p>Bonjour <strong>{req.patient_name}</strong>,</p>
        <p>Votre rendez-vous à <strong>{req.hospital_name}</strong> le {req.rdv_date} a été enregistré.</p>
        <p>L'hôpital vous contactera pour confirmation.</p>
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Rendez-vous - {req.hospital_name}"
    msg["From"] = f"SantéSénégal <{from_email}>"
    msg["To"] = req.patient_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.ehlo()
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(from_email, req.patient_email, msg.as_string())

