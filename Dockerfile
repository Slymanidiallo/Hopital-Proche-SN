FROM python:3.10-slim

# Créer un utilisateur non-root (obligatoire pour Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONPATH="/app:$PYTHONPATH"

WORKDIR /app

# Copier et installer les dépendances backend
COPY --chown=user backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copier tout le code
COPY --chown=user backend/ ./backend/
COPY --chown=user frontend/ ./frontend/

# Exposer le port (obligatoire pour Hugging Face)
EXPOSE 7860

# Port obligatoire : 7860 pour Hugging Face Spaces
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]