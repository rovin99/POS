import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from "react-bootstrap";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const emoticon = '\u{1F310}'; 
  let buttonText, buttonVariant;
  switch (theme) {
    case 'light':
      buttonText = <span>☀️</span>; // Sun icon for light mode
      buttonVariant = 'outline-dark'; // Dark text on light background
      break;
    case 'dark':
      buttonText = <span>🌙</span>; // Moon icon for dark mode
      buttonVariant = 'outline-light'; // Light text on dark background
      break;
    case 'auto':
      buttonText = <span>🌓</span>; // Gear icon for auto mode
      buttonVariant = 'secondary'; // Neutral appearance
      break;
    default:
      buttonText = <span>❓</span>; // Question mark for unknown mode
      buttonVariant = 'warning'; // Stand out appearance for error state
  }

  return (
    <Button variant={buttonVariant} onClick={toggleTheme}  size="2x">
      {buttonText}
    </Button>
  );
}

export default ThemeToggle;
