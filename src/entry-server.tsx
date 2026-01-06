import { renderToString } from 'react-dom/server'

import App from './App.tsx'

export function render(_path: string, language: string) {
    const html = renderToString(<App language={language} />);
    return { html }
}