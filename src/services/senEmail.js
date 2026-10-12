const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

const requiredEnvironmentVariables = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
];

function getEmailJsConfiguration() {
  const configuration = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  };

  const missingVariable = requiredEnvironmentVariables.find(
    (variable) => !import.meta.env[variable],
  );

  if (missingVariable) {
    throw new Error(`Configuration EmailJS manquante : ${missingVariable}`);
  }

  return configuration;
}

export async function sendEmail({ name, email, subject, message, recaptchaToken }) {
  const { serviceId, templateId, publicKey } = getEmailJsConfiguration();
  const templateParams = {
    from_name: String(name ?? '')
      .trim()
      .slice(0, 100),
    reply_to: String(email ?? '')
      .trim()
      .slice(0, 160),
    subject: String(subject ?? '')
      .trim()
      .slice(0, 160),
    message: String(message ?? '')
      .trim()
      .slice(0, 5000),
  };

  // Ajout du jeton reCAPTCHA s'il est fourni (requis si reCAPTCHA est activé sur EmailJS)
  if (recaptchaToken) {
    templateParams['g-recaptcha-response'] = recaptchaToken;
  }

  if (Object.values(templateParams).some((value) => !value)) {
    throw new Error('Les champs du formulaire sont incomplets.');
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    throw new Error('EmailJS n’a pas pu envoyer le message.');
  }
}