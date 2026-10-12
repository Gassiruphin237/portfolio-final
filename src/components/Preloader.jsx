import { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 3000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" role="status" aria-label="Chargement du portfolio">
      <div className="preloader-content">
        {/* <span className="preloader-mark">RG</span> <br /> */}
        <span className="preloader-spinner" aria-hidden="true" />
      </div>
    </div>
  );
}
