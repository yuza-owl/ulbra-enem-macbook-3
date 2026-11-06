const form = document.querySelector('#enrollment-form');
const phone = document.querySelector('#telefone');
const steps = [...form.querySelectorAll('.form-step')];
const progress = document.querySelector('.form-progress span');
const heading = document.querySelector('.form-card-heading');
const success = document.querySelector('.form-success');
const status = form.querySelector('.form-status');
let currentStep = 0;

phone.addEventListener('input', (event) => {
  const value = event.target.value.replace(/\D/g, '').slice(0, 11);
  event.target.value = value
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
});

function validateStep(index) {
  const input = steps[index].querySelector('input, textarea');
  input.setCustomValidity('');

  if (input === phone) {
    const digits = input.value.replace(/\D/g, '');
    if (digits.length < 10) input.setCustomValidity('Digite um telefone válido.');
  }

  if (!input.checkValidity()) {
    input.reportValidity();
    return false;
  }
  return true;
}

function showStep(index) {
  currentStep = index;
  steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index; });
  progress.style.width = `${((index + 1) / steps.length) * 100}%`;
  status.textContent = '';
  requestAnimationFrame(() => steps[index].querySelector('input, textarea').focus());
}

form.querySelectorAll('[data-next]').forEach((button) => {
  button.addEventListener('click', () => {
    if (validateStep(currentStep)) showStep(currentStep + 1);
  });
});

form.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => showStep(currentStep - 1));
});

form.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  if (event.target.matches('textarea') && event.shiftKey) return;
  event.preventDefault();
  if (!validateStep(currentStep)) return;
  if (currentStep < steps.length - 1) showStep(currentStep + 1);
  else form.requestSubmit();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateStep(currentStep)) return;
  heading.hidden = true;
  form.hidden = true;
  document.querySelector('.form-progress').hidden = true;
  success.hidden = false;
  success.focus();
});

showStep(0);
