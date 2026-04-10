// ===== SANTE SENEGAL — APP.JS (version backend) =====
const BACKEND_URL = 'http://localhost:8000';

let currentHospitals = [];
let selectedHospital = null;

const regionSel      = document.getElementById('region');
const symptomIn      = document.getElementById('symptom-input');
const btnSearch      = document.getElementById('btn-search');
const resultsSection = document.getElementById('results-section');
const resultsList    = document.getElementById('results-list');
const resultsCount   = document.getElementById('results-count');
const urgenceBanner  = document.getElementById('urgence-banner');
const rdvModal       = document.getElementById('rdv-modal');
const rdvForm        = document.getElementById('rdv-form');
const rdvSuccess     = document.getElementById('rdv-success');

document.querySelectorAll('.pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    const val = currentLang === 'wo' ? (p.dataset.wo || p.dataset.fr) : p.dataset.fr;
    symptomIn.value = val || p.textContent;
    checkReady();
  });
});

symptomIn.addEventListener('input', () => {
  document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
  checkReady();
});
regionSel.addEventListener('change', checkReady);

function checkReady() {
  btnSearch.disabled = !(symptomIn.value.trim().length > 1 && regionSel.value);
}

btnSearch.addEventListener('click', doSearch);

function doSearch() {
  const disease    = symptomIn.value.trim();
  const regionCode = regionSel.value;
  const regionName = regionSel.options[regionSel.selectedIndex].text;
  if (!disease || !regionCode) return;

  const isUrgence = /urgence|trauma|accident|fracture|chute|crise|convuls/i.test(disease);
  urgenceBanner.style.display = isUrgence ? 'flex' : 'none';

  btnSearch.disabled = true;
  btnSearch.innerHTML = `<div class="spinner"></div><span>${i18n[currentLang].btnSearching}</span>`;
  resultsSection.style.display = 'block';
  resultsList.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><div class="loading-text">${currentLang === 'wo' ? 'Di seet dëkk yi...' : 'Recherche des hôpitaux en cours...'}</div></div>`;
  resultsCount.textContent = '';

  callBackend(disease, regionName, regionCode, isUrgence);
}

async function callBackend(disease, regionName, regionCode, isUrgence) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disease, region: regionName, region_code: regionCode, is_urgence: isUrgence, lang: currentLang }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Erreur serveur'); }
    const data = await res.json();
    currentHospitals = data.hospitals;
    renderResults(data.hospitals, disease, regionName);
  } catch (err) {
    console.error(err);
    resultsList.innerHTML = `<div class="empty-state"><p>${currentLang === 'wo' ? 'Xam-xam bu baax. Seet rekk.' : 'Erreur de connexion au serveur.'}</p><p style="font-size:12px;color:#999;margin-top:8px;">Vérifiez que le backend tourne sur <code>${BACKEND_URL}</code></p></div>`;
  } finally {
    btnSearch.disabled = false;
    btnSearch.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span id="btn-search-text">${i18n[currentLang].btnSearch}</span>`;
    checkReady();
  }
}

function renderResults(hospitals, disease, region) {
  const t = i18n[currentLang];
  resultsCount.innerHTML = t.resultsFound(hospitals.length, disease, region);
  resultsList.innerHTML = hospitals.map((h, i) => renderCard(h, i, t)).join('');
}

function renderCard(h, i, t) {
  const isUrgence = h.urgence24h;
  const badge = isUrgence ? `<span class="badge badge-urgence">${t.urgence24}</span>` : `<span class="badge badge-closed">${t.consultation}</span>`;
  const specs = (h.specialites || []).map(s => `<span class="spec-tag">${s}</span>`).join('');
  const tarifs = h.tarifs ? `<div class="tarifs-section"><div class="tarifs-title">${t.tarifsTitle}</div><div class="tarifs-grid"><div class="tarif-pill"><span class="tarif-label">${t.tarif_consultation}</span><span class="tarif-price">${h.tarifs.consultation||'—'}</span></div><div class="tarif-pill"><span class="tarif-label">${t.tarif_hospitalisation}</span><span class="tarif-price">${h.tarifs.hospitalisation||'—'}</span></div><div class="tarif-pill"><span class="tarif-label">${t.tarif_urgence}</span><span class="tarif-price">${h.tarifs.urgences||'—'}</span></div></div></div>` : '';
  const doctors = (h.medecins||[]).map(m => `<div class="doctor-row"><div class="doc-avatar">${(m.prenom||'D')[0]}${(m.nom||'r')[0]}</div><div class="doc-info"><div class="doc-name">Dr. ${m.prenom||''} ${m.nom||''}</div><div class="doc-spec">${m.specialite||''}</div></div><span class="doc-avail ${m.disponible?'avail-yes':'avail-no'}">${m.disponible?t.available:t.absent}</span></div>`).join('');
  const mapsUrl = h.gps ? `https://www.google.com/maps/search/?api=1&query=${h.gps.lat},${h.gps.lng}` : `https://maps.google.com?q=${encodeURIComponent((h.nom||'')+' '+(h.adresse||'')+' Sénégal')}`;
  const navUrl  = h.gps ? `https://www.google.com/maps/dir/?api=1&destination=${h.gps.lat},${h.gps.lng}` : mapsUrl;

  return `<div class="result-card ${isUrgence?'urgence-card':''}">
    <div class="card-top"><div class="card-top-left"><div class="card-rank">${i+1}</div><div><div class="hospital-name">${h.nom}</div><div class="hospital-type">${h.type||''}</div></div></div>${badge}</div>
    ${h.pertinence?`<div class="card-pertinence">${h.pertinence}</div>`:''}
    <div class="card-meta">
      <span class="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>${h.adresse||''}</span>
      <span class="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>${h.distance||''}</span>
      ${h.telephone?`<span class="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>${h.telephone}</span>`:''}
    </div>
    ${tarifs}
    ${specs?`<div class="specialties">${specs}</div>`:''}
    ${doctors?`<div class="doctors-section"><div class="doctors-title">${t.doctorsTitle}</div>${doctors}</div>`:''}
    <div class="card-actions">
      <button class="btn-action btn-secondary" onclick="openLink('${mapsUrl}')">🗺 ${t.btnMap}</button>
      <button class="btn-action btn-primary" onclick="openLink('${navUrl}')">📍 ${t.btnGo}</button>
      <button class="btn-action btn-rdv" onclick="openRDV(${i})">📅 ${t.btnRDV}</button>
    </div>
  </div>`;
}

function openRDV(index) {
  selectedHospital = currentHospitals[index];
  if (!selectedHospital) return;
  const t = i18n[currentLang];
  document.getElementById('modal-hospital-name').textContent = selectedHospital.nom;
  document.getElementById('modal-title').textContent = t.modalTitle;
  const docSelect = document.getElementById('rdv-doctor');
  docSelect.innerHTML = `<option value="">${t.rdvNoPreference}</option>`;
  (selectedHospital.medecins||[]).forEach(m => {
    const opt = document.createElement('option');
    opt.value = `Dr. ${m.prenom} ${m.nom}`;
    opt.textContent = `Dr. ${m.prenom} ${m.nom} — ${m.specialite}${m.disponible?'':' ('+t.absent+')'}`;
    docSelect.appendChild(opt);
  });
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('rdv-date').min = today;
  ['rdv-date','rdv-name','rdv-phone','rdv-email','rdv-motif'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  rdvForm.style.display = 'block';
  rdvSuccess.style.display = 'none';
  rdvModal.style.display = 'flex';
}

function closeModal() { rdvModal.style.display = 'none'; }
rdvModal.addEventListener('click', e => { if (e.target === rdvModal) closeModal(); });

async function submitRDV(e) {
  e.preventDefault();
  const t = i18n[currentLang];
  const btnConfirm = document.getElementById('btn-confirm-rdv');
  btnConfirm.disabled = true;
  btnConfirm.textContent = currentLang === 'wo' ? 'Di yónnent...' : 'Envoi en cours...';
  try {
    const res = await fetch(`${BACKEND_URL}/api/rdv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hospital_name: selectedHospital?.nom||'', hospital_address: selectedHospital?.adresse||'',
        patient_name: document.getElementById('rdv-name').value,
        patient_email: document.getElementById('rdv-email').value,
        patient_phone: document.getElementById('rdv-phone').value,
        rdv_date: document.getElementById('rdv-date').value,
        doctor: document.getElementById('rdv-doctor').value||null,
        motif: document.getElementById('rdv-motif').value||null,
        lang: currentLang,
      }),
    });
    const data = await res.json();
    if (data.success) {
      rdvForm.style.display = 'none';
      document.getElementById('success-title').textContent = t.successTitle;
      document.getElementById('success-desc').textContent = t.successDesc;
      rdvSuccess.style.display = 'block';
    }
  } catch (err) {
    alert(currentLang === 'wo' ? 'Xam-xam bu baax.' : 'Erreur lors de l\'envoi.');
  } finally {
    btnConfirm.disabled = false;
    btnConfirm.textContent = t.rdvConfirm;
  }
}

function openLink(url) { window.open(url, '_blank'); }
document.addEventListener('DOMContentLoaded', () => { applyTranslations(); });
