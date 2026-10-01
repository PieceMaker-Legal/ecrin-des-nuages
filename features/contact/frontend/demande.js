import { syncDialogState } from '../../frontend/dialog-state.js';

const dialog = document.querySelector('[data-inquiry-dialog]');
const form = document.querySelector('[data-inquiry-form]');
const status = document.querySelector('[data-inquiry-status]');
const submit = document.querySelector('[data-inquiry-submit]');
const email = form.elements.email;
const phone = form.elements.phone;
const message = form.elements.message;
let pieces = '';
let returnFocus = null;
let sending = false;

function showStatus(message, type = 'error') {
  status.textContent = message;
  status.dataset.state = type;
  status.hidden = false;
}

function openInquiry(selection = '', opener = document.activeElement) {
  if (dialog.open) return;
  pieces = selection;
  returnFocus = opener;
  document.querySelector('[data-inquiry-selection]').hidden = !pieces;
  document.querySelector('[data-inquiry-pieces]').textContent = pieces;
  if (!sending) status.hidden = true;
  dialog.showModal();
  syncDialogState();
  form.elements.name.focus();
}

document.querySelectorAll('[data-open-inquiry]').forEach(button => {
  button.addEventListener('click', () => openInquiry('', button));
});
window.addEventListener('ecrin:inquiry', event => {
  openInquiry(event.detail?.pieces || '', event.detail?.returnFocus);
});
document.querySelector('[data-close-inquiry]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  syncDialogState();
  if (returnFocus?.isConnected) returnFocus.focus();
});
for (const input of [email, phone]) {
  input.addEventListener('input', () => {
    email.setCustomValidity('');
    phone.setCustomValidity('');
  });
}
message.addEventListener('input', () => message.setCustomValidity(''));

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  email.setCustomValidity('');
  phone.setCustomValidity('');
  message.setCustomValidity('');
  if (!email.value.trim() && !phone.value.trim()) {
    email.setCustomValidity('Renseignez votre adresse e-mail ou votre téléphone.');
  }
  const phoneDigits = phone.value.replace(/\D/g, '');
  if (phone.value.trim() && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
    phone.setCustomValidity('Indiquez un numéro de téléphone valide, avec son indicatif si nécessaire.');
  }
  if (!message.value.trim()) message.setCustomValidity('Écrivez quelques mots pour préciser votre demande.');
  if (!form.reportValidity()) return;
  if (form.elements.website.value) return;
  const recipient = window.ECRIN_CONFIG?.inquiryRecipient;
  if (typeof recipient !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    showStatus('Le formulaire est momentanément indisponible. Merci de réessayer plus tard.');
    return;
  }
  const payload = {
    name: form.elements.name.value.trim() || 'Non renseigné',
    téléphone: phone.value.trim() || 'Non renseigné',
    message: form.elements.message.value.trim(),
    sélection: pieces || 'Demande générale',
    _subject: 'Demande de devis — Écrin des Nuages',
    _template: 'table',
    _url: location.origin + location.pathname,
    _honey: ''
  };
  if (email.value.trim()) payload.email = email.value.trim();
  sending = true;
  const fields = [...form.querySelectorAll('input,textarea')];
  fields.forEach(field => { field.disabled = true; });
  submit.disabled = true;
  submit.textContent = 'Envoi en cours…';
  form.setAttribute('aria-busy', 'true');
  showStatus('Votre demande est en cours d’envoi.', 'pending');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || ![true, 'true'].includes(result.success) || /activat|confirm.*email/i.test(result.message || '')) {
      throw new Error('Submission not confirmed');
    }
    form.reset();
    showStatus('Votre demande a été envoyée. Merci, nous vous recontacterons avec les coordonnées indiquées.', 'success');
    status.focus();
  } catch {
    showStatus('L’envoi n’a pas pu être confirmé. Vos informations sont conservées dans ce formulaire ; merci de réessayer dans quelques instants.');
    status.focus();
  } finally {
    clearTimeout(timeout);
    sending = false;
    fields.forEach(field => { field.disabled = false; });
    submit.disabled = false;
    submit.innerHTML = 'Envoyer ma demande <span aria-hidden="true">↗</span>';
    form.removeAttribute('aria-busy');
  }
});
