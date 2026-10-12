import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLanguage } from '../context/languageStore';
import { sendEmail } from '../services/senEmail';
import Recaptcha from './Recaptcha';

const MIN_FILL_DURATION_MS = 3500;
const SUBMISSION_COOLDOWN_MS = 60_000;
const LAST_SUBMISSION_KEY = 'portfolio-contact-last-submission';

const copy = {
  fr: {
    title: 'Vous avez un produit à construire ?',
    intro:
      'Parlons de votre besoin, de vos contraintes et de la meilleure façon de passer à l’action.',
    download: 'Télécharger mon CV',
    form: 'Parlez-moi de votre projet',
    name: 'Votre nom',
    email: 'Votre e-mail',
    subject: 'Sujet',
    message: 'Votre message',
    send: 'Envoyer le message',
    sending: 'Envoi en cours…',
    sent: 'Merci, votre message a bien été envoyé.',
    rateLimited: 'Veuillez patienter une minute avant d’envoyer un nouveau message.',
    captchaRequired: 'Validez la vérification anti-spam avant l’envoi.',
    captchaLoading: 'Chargement de la vérification…',
    captchaMissing: 'La vérification anti-spam doit encore être configurée.',
    captchaError: 'La vérification anti-spam n’a pas pu être chargée. Réessayez.',
    error: 'Impossible d’envoyer le message. Réessayez ou contactez-moi par e-mail.',
  },
  en: {
    title: 'Have a product to build?',
    intro: 'Let’s discuss your needs, constraints and the best path to execution.',
    download: 'Download my résumé',
    form: 'Tell me about your project',
    name: 'Your name',
    email: 'Your email',
    subject: 'Subject',
    message: 'Your message',
    send: 'Send message',
    sending: 'Sending…',
    sent: 'Thank you, your message has been sent.',
    rateLimited: 'Please wait one minute before sending another message.',
    captchaRequired: 'Please complete the anti-spam verification before sending.',
    captchaLoading: 'Loading verification…',
    captchaMissing: 'The anti-spam verification still needs to be configured.',
    captchaError: 'The anti-spam verification could not be loaded. Please try again.',
    error: 'Your message could not be sent. Please try again or contact me by email.',
  },
};

export default function ContactBanner() {
  const { lang } = useLanguage();
  const [status, setStatus] = useState('idle');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const openedAt = useRef(0);
  const t = copy[lang];
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const honeypotValue = String(data.get('website') ?? '').trim();
    const lastSubmission = Number(window.localStorage.getItem(LAST_SUBMISSION_KEY) ?? 0);

    if (honeypotValue || Date.now() - openedAt.current < MIN_FILL_DURATION_MS) {
      form.reset();
      setStatus('success');
      return;
    }

    if (Date.now() - lastSubmission < SUBMISSION_COOLDOWN_MS) {
      setStatus('rate-limited');
      return;
    }

    if (!recaptchaToken) {
      setStatus('captcha-required');
      return;
    }

    setStatus('sending');

    try {
      await sendEmail({
        name: data.get('name'),
        email: data.get('email'),
        subject: data.get('subject'),
        message: data.get('message'),
        recaptchaToken,
      });

      window.localStorage.setItem(LAST_SUBMISSION_KEY, String(Date.now()));
      form.reset();
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setRecaptchaToken('');
      setRecaptchaError(false);
      setRecaptchaKey((currentKey) => currentKey + 1);
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="contact-intro">
        <p className="eyebrow">CONTACT</p>
        <h2>{t.title}</h2>
        <p>{t.intro}</p>
        <div className="contact-details">
          <a href="mailto:gassiruphin@gmail.com">
            <Mail />
            gassiruphin@gmail.com
          </a>
          <a href="tel:+237697814134">
            <Phone />
            +237 697 814 134
          </a>
          <span>
            <MapPin />
            Douala, Cameroun
          </span>
        </div>
        <a className="cv-link" href="/CV_Ruphin_Gassi_Nguefack_2026_MAJ.pdf" download>
          <Download />
          {t.download}
        </a>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <h3>{t.form}</h3>
        <label className="contact-honeypot" aria-hidden="true">
          Website
          <input name="website" type="text" tabIndex="-1" autoComplete="off" />
        </label>
        <div className="form-row">
          <label>
            {t.name}
            <input
              name="name"
              autoComplete="name"
              maxLength="100"
              required
              disabled={status === 'sending'}
            />
          </label>
          <label>
            {t.email}
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength="160"
              required
              disabled={status === 'sending'}
            />
          </label>
        </div>
        <label>
          {t.subject}
          <input name="subject" maxLength="160" required disabled={status === 'sending'} />
        </label>
        <label>
          {t.message}
          <textarea
            name="message"
            rows="5"
            maxLength="5000"
            required
            disabled={status === 'sending'}
          />
        </label>
        {recaptchaSiteKey ? (
          <Recaptcha
            key={recaptchaKey}
            siteKey={recaptchaSiteKey}
            loadingLabel={t.captchaLoading}
            onToken={(token) => {
              setRecaptchaToken(token);
              setRecaptchaError(false);

              if (status === 'captcha-required') {
                setStatus('idle');
              }
            }}
            onError={() => {
              setRecaptchaToken('');
              setRecaptchaError(true);
            }}
          />
        ) : (
          <p className="form-error">{t.captchaMissing}</p>
        )}
        {recaptchaSiteKey &&
          !recaptchaToken &&
          !recaptchaError &&
          status !== 'captcha-required' && <p className="recaptcha-hint">{t.captchaRequired}</p>}
        {recaptchaError && <p className="form-error">{t.captchaError}</p>}
        <button
          className="button contact-button"
          type="submit"
          disabled={status === 'sending' || !recaptchaToken || recaptchaError}
        >
          {status === 'sending' ? t.sending : t.send}
          <Send />
        </button>
        {status === 'success' && (
          <p className="form-success">
            <CheckCircle2 />
            {t.sent}
          </p>
        )}
        {status === 'rate-limited' && <p className="form-error">{t.rateLimited}</p>}
        {status === 'captcha-required' && <p className="form-error">{t.captchaRequired}</p>}
        {status === 'error' && <p className="form-error">{t.error}</p>}
      </form>
    </section>
  );
}
