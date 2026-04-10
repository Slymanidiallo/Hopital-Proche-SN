// ===== TRADUCTIONS FR / WOLOF =====
const i18n = {
  fr: {
    logoSub: "Trouvez votre hôpital rapidement",
    heroBadge: "🏥 Sénégal — 14 régions couvertes",
    heroTitle: "Trouvez l'hôpital<br><em>le plus adapté</em><br>près de vous",
    heroDesc: "Renseignez votre maladie ou symptôme et votre localisation. Notre IA vous propose les meilleurs établissements avec médecins disponibles, tarifs et itinéraire.",
    labelRegion: "Votre région",
    labelDisease: "Maladie ou symptôme",
    pillsLabel: "Catégories fréquentes",
    optPlaceholder: "Choisir une région...",
    inputPlaceholder: "Ex: paludisme, diabète, fracture...",
    btnSearch: "Rechercher les hôpitaux",
    btnSearching: "Recherche en cours...",
    urgenceText: "Urgence détectée — établissements 24h/24 prioritaires",
    tarifsTitle: "Tarifs indicatifs",
    specialtiesTitle: "Spécialités",
    doctorsTitle: "Médecins",
    available: "Disponible",
    absent: "Absent",
    btnMap: "Voir sur la carte",
    btnGo: "Y aller →",
    btnRDV: "Prendre RDV",
    modalTitle: "Prendre rendez-vous",
    rdvName: "Votre nom complet",
    rdvPhone: "Numéro de téléphone",
    rdvDate: "Date souhaitée",
    rdvDoctor: "Médecin préféré (optionnel)",
    rdvMotif: "Motif de consultation",
    rdvNoPreference: "Pas de préférence",
    rdvCancel: "Annuler",
    rdvConfirm: "Confirmer le rendez-vous",
    successTitle: "Demande envoyée !",
    successDesc: "L'hôpital vous contactera dans les 24h pour confirmer votre rendez-vous.",
    footerText: "SantéSénégal — Pour une santé accessible à tous · SAMU:",
    pillLabels: ["Paludisme","Urgence","Maternité","Diabète","Cardiologie","Ophtalmologie","Pédiatrie","VIH / Infectiologie","Neurologie","Oncologie","Tuberculose","Dialyse"],
    pillValues: ["Paludisme","Urgence / trauma","Accouchement / maternité","Diabète","Cardiologie","Ophtalmologie","Pédiatrie","VIH / infectiologie","Neurologie","Cancer / oncologie","Tuberculose","Dialyse / rein"],
    resultsFound: (n, disease, region) => `${n} établissement(s) trouvé(s) pour <strong>${disease}</strong> à ${region}`,
    h24: "24h/24",
    consultation: "Consultation",
    call: "Appeler",
    urgence24: "Urgence 24h",
    tarif_consultation: "Consultation",
    tarif_hospitalisation: "Hospitalisation/j",
    tarif_urgence: "Urgences",
  },
  wo: {
    logoSub: "Dem ci dëkk bi ci kanam",
    heroBadge: "🏥 Senegaal — 14 région yi",
    heroTitle: "Seet <em>dëkk bu gëna mel</em><br>ci kër-gi ci sa thiés",
    heroDesc: "Bind sa xam-xam bi ak sa dëkk. AI bi lay seet dëkk yi gëna mel, tabib yi, prix yi ak yoon bi.",
    labelRegion: "Sa région",
    labelDisease: "Xam-xam bi moo ko",
    pillsLabel: "Xam-xam yi bañ",
    optPlaceholder: "Tann région...",
    inputPlaceholder: "Lëkk: sunu simb, sukkar, jaaxle...",
    btnSearch: "Seet dëkk yi",
    btnSearching: "Di seet...",
    urgenceText: "Xam-xam bu yomb — dëkk yi moo am 24/24 ji rey",
    tarifsTitle: "Prix yi",
    specialtiesTitle: "Xam-xam yi",
    doctorsTitle: "Tabib yi",
    available: "Am na",
    absent: "Amul fi",
    btnMap: "Xool ci kaart",
    btnGo: "Dem →",
    btnRDV: "Jël rendez-vous",
    modalTitle: "Jël rendez-vous",
    rdvName: "Sa turando",
    rdvPhone: "Sa numéro téléphone",
    rdvDate: "Bés bu nekk",
    rdvDoctor: "Tabib bi (yëgëlal)",
    rdvMotif: "Loolu moo tax nga dem",
    rdvNoPreference: "Amul choix",
    rdvCancel: "Baal ma",
    rdvConfirm: "Dawal rendez-vous",
    successTitle: "Yónnent naa !",
    successDesc: "Dëkk bi dina la wax ci 24h bi ci kanam.",
    footerText: "SantéSénégal — Défar sante ci kooku yépp · SAMU:",
    pillLabels: ["Sunu simb","Xam-xam bu yomb","Jëkkër/jabar","Sukkar bu bari","Xol bi","Bët yi","Xale yi","VIH","Bopp bi","Ruum","Tuberculose","Reñ bi"],
    pillValues: ["Paludisme","Urgence / trauma","Accouchement / maternité","Diabète","Cardiologie","Ophtalmologie","Pédiatrie","VIH / infectiologie","Neurologie","Cancer / oncologie","Tuberculose","Dialyse / rein"],
    resultsFound: (n, disease, region) => `${n} dëkk (yi) seet nañu ci <strong>${disease}</strong> ci ${region}`,
    h24: "24/24",
    consultation: "Consultation",
    call: "Wax ak",
    urgence24: "Xam-xam 24h",
    tarif_consultation: "Consultation",
    tarif_hospitalisation: "Wax ak/bés",
    tarif_urgence: "Xam-xam bu yomb",
  }
};

let currentLang = 'fr';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  applyTranslations();
  // Update pills
  const pills = document.querySelectorAll('.pill');
  const t = i18n[lang];
  pills.forEach((p, i) => {
    p.textContent = t.pillLabels[i] || p.textContent;
    p.dataset[lang === 'fr' ? 'fr' : 'wo'] = t.pillValues[i];
  });
}

function applyTranslations() {
  const t = i18n[currentLang];
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const setPlaceholder = (id, val) => { const el = document.getElementById(id); if (el) el.placeholder = val; };
  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el[attr] = val; };

  set('logo-sub', t.logoSub);
  set('hero-badge', t.heroBadge);
  set('hero-title', t.heroTitle);
  set('hero-desc', t.heroDesc);
  set('label-region', t.labelRegion);
  set('label-disease', t.labelDisease);
  set('pills-label', t.pillsLabel);
  set('btn-search-text', document.getElementById('btn-search')?.disabled === false ? t.btnSearch : t.btnSearching);
  set('urgence-text', t.urgenceText);
  set('modal-title', t.modalTitle);
  set('rdv-label-name', t.rdvName);
  set('rdv-label-phone', t.rdvPhone);
  set('rdv-label-date', t.rdvDate);
  set('rdv-label-doctor', t.rdvDoctor);
  set('rdv-label-motif', t.rdvMotif);
  set('btn-cancel-rdv', t.rdvCancel);
  set('btn-confirm-rdv', t.rdvConfirm);
  set('success-title', t.successTitle);
  set('success-desc', t.successDesc);
  set('footer-text', `${t.footerText} <a href="tel:15">15</a> (SAMU)`);

  setPlaceholder('symptom-input', t.inputPlaceholder);
  const optEl = document.getElementById('opt-placeholder');
  if (optEl) optEl.textContent = t.optPlaceholder;
}
