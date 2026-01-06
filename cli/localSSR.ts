import fs from 'node:fs'

const port = Number(process.env.PORT) || 4471;

Bun.serve({
    port,
    async fetch(req) {
        const url = new URL(req.url, `http://localhost:${port}`);
        const filePath = `./dist/client${url.pathname}`;

        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.isFile()) return new Response(Bun.file(filePath));
        }

        const { render } = await import('../dist/server/y/ssr.js?' + Date.now());
        const { renderHTML } = await import('../functions/[[catchall]].js');

        const templatePath = './dist/client/index.html';
        if (!fs.existsSync(templatePath))
            return new Response('no client built yet', { status: 500, headers: { 'Content-Type': 'text/plain' } });

        const templateHtml = fs.readFileSync(templatePath, 'utf-8');
        return renderHTML(render, req, templateHtml);
    }
});

let isUpdating = false;

import { execSync } from 'node:child_process';
import path from 'node:path';

function watchDirRecursive(dir: string, ignored: string[], onChange: (path?: string) => void) {
    if (ignored.includes(dir)) return;

    const watcher = fs.watch(dir, { persistent: true }, function (_event: string, filename: string | null) {
        if (filename !== null) {
            const fullPath = path.join(dir, filename);

            fs.stat(fullPath, function (err: NodeJS.ErrnoException | null, stats: fs.Stats) {
                if (!err && stats.isDirectory()) {
                    watchDirRecursive(fullPath, ignored, onChange);
                }
            });

            onChange(fullPath);
        }
    });

    fs.readdir(dir, { withFileTypes: true }, (err: NodeJS.ErrnoException | null, files: fs.Dirent[]) => {
        if (err) return;
        for (const file of files) {
            if (file.isDirectory()) watchDirRecursive(path.join(dir, file.name), ignored, onChange);
        }
    });

    return watcher;
}

const baseDir = path.join(import.meta.dirname, '..');

const ignore = [
    `${baseDir}/.git`,
    `${baseDir}/.wrangler`,
    `${baseDir}/dist`,
    `${baseDir}/node_modules`,
    `${baseDir}/bun.lock`
];

const update = (changedPath?: string) => {
    if (isUpdating || changedPath?.includes('.DS_Store')) return;
    isUpdating = true;

    if (changedPath) {
        console.log(`\x1b[33mdetected changes, rebuilding app...\x1b[0m`);
        console.log(`\x1b[33mchanged file: ${changedPath}\n\x1b[0m`);
    } else console.log(`\x1b[34mperforming initial build of the app...\n\x1b[0m`);

    try {
        execSync(`cd ${baseDir} && bun run build`, { stdio: 'inherit' });
        console.log('');
        console.log(`\x1b[34mapp is ready! http://localhost:${port}\n\x1b[0m`);
        isUpdating = false;
    } catch {
        console.error(`\x1b[31merror during build process.\n\x1b[0m`);
    }
}

update();
watchDirRecursive(baseDir, ignore, update);