import { useEffect, useState } from 'react';
import { LoaderIcon } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="preloader" role="status" aria-label="Chargement du portfolio">
      <LoaderIcon className="preloader-icon" aria-hidden="true" />
    </div>
  );
}
