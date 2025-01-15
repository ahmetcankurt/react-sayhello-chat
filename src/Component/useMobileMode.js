import { useState, useEffect } from 'react';

const useMobileMode = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobileMode = () => {
      setIsMobile(window.innerWidth <= 768); // 768px ve altı mobil olarak kabul edilir
    };

    // İlk kontrol
    checkMobileMode();

    // Pencere boyutu değiştiğinde kontrol et
    window.addEventListener('resize', checkMobileMode);

    // Component unmount olduğunda event listener'ı temizle
    return () => {
      window.removeEventListener('resize', checkMobileMode);
    };
  }, []);

  return isMobile;
};

export default useMobileMode;
