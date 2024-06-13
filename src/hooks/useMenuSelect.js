// useMenuSelect.js

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useMenuSelect = () => {
  const location = useLocation();
  const [menuSelect, setMenuSelect] = useState('accueil');

  useEffect(() => {
    switch (location.pathname) {
      case '/accueil':
        setMenuSelect('accueil');
        break;
      case '/connexion':
        setMenuSelect('connexion');
        break;
      case '/profil':
        setMenuSelect('profil');
        break;
      case '/livret':
        setMenuSelect('livret');
        break;
      default:
        setMenuSelect('');
    }
  }, [location.pathname]);

  return { menuSelect, setMenuSelect };
};

export default useMenuSelect;
