import { renderToString } from 'react-dom/server'

import App from './App.tsx'

export function render() {
    const html = renderToString(<App />);
    return { html }
}