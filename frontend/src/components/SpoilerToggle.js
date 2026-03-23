import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpoilerToggle = ({ children, isSpoiler }) => {
  const [revealed, setRevealed] = useState(false);
  const [settings, setSettings] = useState({ hide_spoilers: true });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/misc/spoiler-settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isSpoiler || !settings.hide_spoilers) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {!revealed ? (
        <div className="bg-gray-900 text-white p-4 rounded cursor-pointer" onClick={() => setRevealed(true)}>
          <div className="text-center">
            <span className="text-yellow-500">⚠️ SPOILER WARNING</span>
            <p className="text-sm mt-2">Click to reveal</p>
          </div>
        </div>
      ) : (
        <div className="border-l-4 border-yellow-500 pl-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default SpoilerToggle;
