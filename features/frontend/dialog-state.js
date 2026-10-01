export function syncDialogState() {
  document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
}
