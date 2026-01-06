import { hydrateRoot } from 'react-dom/client';

import App from './App';

const calculatedLanguage = new URL(window.location.href).searchParams.get('lang');
const computedLanguage = navigator.language.split('-')[0];

hydrateRoot(document.getElementById('root')!, <App language={calculatedLanguage || computedLanguage} />);