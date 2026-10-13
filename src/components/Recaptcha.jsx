import { useEffect, useRef, useState } from 'react';

const RECAPTCHA_SCRIPT_SOURCES = [
  'https://www.google.com/recaptcha/api.js?render=explicit',
  'https://www.recaptcha.net/recaptcha/api.js?render=explicit',
];

let scriptPromise;

function loadScript(source) {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);

  const scriptId = `recaptcha-api-${source.includes('recaptcha.net') ? 'fallback' : 'google'}`;
  const existingScript = document.getElementById(scriptId);

  return new Promise((resolve, reject) => {
    const script = existingScript ?? document.createElement('script');

    const rejectLoad = () => {
      script.remove();
      reject(new Error(`Impossible de charger reCAPTCHA depuis ${new URL(source).hostname}.`));
    };

    script.addEventListener(
      'load',
      () => {
        if (window.grecaptcha?.render) {
          resolve(window.grecaptcha);
          return;
        }

        rejectLoad();
      },
      { once: true },
    );
    script.addEventListener('error', rejectLoad, { once: true });

    if (!existingScript) {
      script.id = scriptId;
      script.src = source;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}

function loadRecaptcha() {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);

  if (!scriptPromise) {
    const [primarySource, fallbackSource] = RECAPTCHA_SCRIPT_SOURCES;

    scriptPromise = loadScript(primarySource).catch((primaryError) => {
      console.warn(
        'Chargement reCAPTCHA via Google impossible, utilisation du secours.',
        primaryError,
      );
      return loadScript(fallbackSource);
    });
  }

  return scriptPromise.catch((error) => {
    scriptPromise = undefined;
    throw error;
  });
}

export default function Recaptcha({ siteKey, onToken, onError, loadingLabel }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const [loading, setLoading] = useState(true);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 420px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 420px)');
    const updateSize = () => setCompact(mediaQuery.matches);

    updateSize();
    mediaQuery.addEventListener('change', updateSize);

    return () => mediaQuery.removeEventListener('change', updateSize);
  }, []);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onError, onToken]);

  useEffect(() => {
    let cancelled = false;

    loadRecaptcha()
      .then((recaptcha) => {
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = '';
        widgetIdRef.current = recaptcha.render(containerRef.current, {
          sitekey: siteKey,
          size: compact ? 'compact' : 'normal',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () =>
            onErrorRef.current(new Error('La vérification reCAPTCHA a échoué.')),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur de chargement de reCAPTCHA.', error);

        if (!cancelled) {
          setLoading(false);
          onErrorRef.current(error);
        }
      });

    return () => {
      cancelled = true;

      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    };
  }, [compact, siteKey]);

  return (
    <div className="recaptcha-control" aria-live="polite">
      {loading && <span className="recaptcha-loading">{loadingLabel}</span>}
      <div ref={containerRef} />
    </div>
  );
}
