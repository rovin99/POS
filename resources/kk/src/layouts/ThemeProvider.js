import React, { createContext, useContext, useState,useEffect } from 'react';
import Cookies from 'js-cookie'; // Import Cookies

const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  // Set initial theme based on cookie or default to 'light'
  const [theme, setTheme] = useState(() => {
      // Read the theme from the cookie, fallback to system preference or 'light'
      const cookieTheme = Cookies.get('theme');
      if (cookieTheme) return cookieTheme;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
      setTheme(currentTheme => {
          const newTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');
          // Save new theme to cookies
          Cookies.set('theme', newTheme, { expires: 365 }); // Expires in 1 year
          return newTheme;
      });
  };

  // Apply 'auto' theme based on system preference
  useEffect(() => {
      if (theme === 'auto') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
              const newTheme = mediaQuery.matches ? 'dark' : 'light';
              document.documentElement.setAttribute('data-bs-theme', newTheme);
              Cookies.set('theme', newTheme, { expires: 365 }); // Update the cookie as well
          };
          handleChange(); // Call it to set the initial value
          mediaQuery.addListener(handleChange);
          return () => mediaQuery.removeListener(handleChange);
      } else {
          document.documentElement.setAttribute('data-bs-theme', theme);
      }
  }, [theme]);

  return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
      </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);


