import { hydrateRoot } from 'react-dom/client';

import App from './App';

const language = navigator.language.split('-')[0];

hydrateRoot(document.getElementById('root')!, <App language={language} />);