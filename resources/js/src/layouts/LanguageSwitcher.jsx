import React, { useState, useEffect } from 'react';
import i18n from '../locales/i18nConfig';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie'; // Import the js-cookie library
import '../styles/App.module.css';

function LanguageSwitcher() {
  const emoticon = '\u{1F310}'; // Change this to the desired emoticon

  // Initialize state with the language from cookies or fallback to i18n's current language
  const [selectedLanguage, setSelectedLanguage] = useState(Cookies.get('language') || i18n.language);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    Cookies.set('language', selectedLanguage, { expires: 365 }); // Store language preference for 1 year
  }, [selectedLanguage]);

  // Function to toggle between English and Urdu
  const toggleLanguage = () => {
    setSelectedLanguage(currentLanguage => currentLanguage === 'en' ? 'ur' : 'en');
  };

  
  return (

    <Button onClick={toggleLanguage} variant={selectedLanguage === 'ur' ? 'btn btn-outline-secondary' : 'btn btn-outline-secondary'}  size="1x">
        {selectedLanguage === 'ur' ? `${emoticon}` : 'اردو'}
    </Button>


  );
}
export default LanguageSwitcher;

