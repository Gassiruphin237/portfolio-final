import { useEffect, useRef, useState } from 'react';

const RECAPTCHA_SCRIPT_URL = 'https://www.google.com/recaptcha/api.js?render=explicit';

let scriptPromise;

function loadRecaptcha() {
  if (window.grecaptcha) return Promise.resolve(window.grecaptcha);

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${RECAPTCHA_SCRIPT_URL}"]`);
      const script = existingScript ?? document.createElement('script');

      script.addEventListener('load', () => resolve(window.grecaptcha), { once: true });
      script.addEventListener(
        'error',
        () => reject(new Error('Impossible de charger reCAPTCHA.')),
        {
          once: true,
        },
      );

      if (!existingScript) {
        script.src = RECAPTCHA_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    });
  }

  return scriptPromise;
}

export default function Recaptcha({ siteKey, onToken, onError }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const [loading, setLoading] = useState(true);

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
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onErrorRef.current(),
        });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
          onErrorRef.current();
        }
      });

    return () => {
      cancelled = true;

      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  return (
    <div className="recaptcha-control" aria-live="polite">
      {loading && <span className="recaptcha-loading">Chargement de la vérification…</span>}
      <div ref={containerRef} />
    </div>
  );
}
