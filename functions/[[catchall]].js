import { render } from '../dist/server/y/ssr.js'

// if you contribute, this is added by "bun prod" and should not be manually edited (see index.html)
// this is required because cloudflare workers is jank
const templateHtml = `<!doctype html>
<html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>tkLogin - log in with access tokens</title>
        <meta name="og:title" content="tkLogin - log in with access tokens" />
        <meta name="description" content="log in with a minecraft accesstoken. simple and streamlined." />
        <meta name="og:description" content="log in with a minecraft accesstoken. simple and streamlined." />
        <meta name="keywords"
            content="minecraft, minecraft access token, accesstoken, minecraft auth token, token login, minecraft token login, minecraft access token login, access token mod, access token login mod, minecraft access token log" />
        <link rel="canonical" href="https://tklogin.villainsrule.xyz" />
        <meta name="robots" content="index,follow" />
        <meta name="language" content="EN" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light" />
        <link rel="preload" href="/y/tkl.css" as="style" crossorigin>
        <link rel="preload" href="/y/tkl.js" as="script" crossorigin>
        <link rel="stylesheet" crossorigin href="/y/tkl.css">
      <script type="module" crossorigin src="/y/tkl.js"></script>
      <link rel="stylesheet" crossorigin href="/y/tkl.css">
    </head>

    <body class="transition-all duration-300 min-h-screen font-sans antialiased">
        <div id="root"><!-- app-html --></div>
    </body>

</html>`;

export function renderHTML(renderFn, request, manualTemplate) {
    const url = new URL(request.url);

    const languageParam = url.searchParams.get('lang');
    const languageHeader = request.headers.get('Accept-Language');
    const computedLanguage = languageHeader ? languageHeader.split(',')[0].split('-')[0] : 'en';

    const rendered = renderFn(url.pathname, languageParam || computedLanguage);

    const html = (manualTemplate || templateHtml)
        .split('\n').map(line => line.trim()).join('')
        .replace(`<!-- app-html -->`, rendered.html ?? '')

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });;
}

export async function onRequest({ request }) {
    try {
        const pathname = new URL(request.url).pathname;

        if (pathname.includes('/api/login')) return new Response(JSON.stringify({ error: 'noAccount' }), { status: 401 });
        if (pathname.includes('/api/reportAbuse')) return new Response('OK', { headers: { 'Content-Type': 'application/json' } });

        return renderHTML(render, request);
    } catch (e) {
        return new Response(e.stack, { status: 500 });
    }
}