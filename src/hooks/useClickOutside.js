// hooks/useClickOutside.js
import { useEffect } from 'react';

const useClickOutside = (refs, callback) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (refs.every(ref => 
        ref.current && !ref.current.contains(e.target)
      )) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [refs, callback]);
};

export default useClickOutside;