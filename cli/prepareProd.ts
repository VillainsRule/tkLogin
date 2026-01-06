import fs from 'node:fs';
import path from 'node:path';

const clientHTML = fs.readFileSync(path.resolve('./dist/client/index.html'), 'utf-8');

const catchallPath = path.resolve('./functions/[[catchall]].js');
const catchallFunction = fs.readFileSync(catchallPath, 'utf-8');

const newFunction = catchallFunction.replace(/\<\!doctype html\>(.*?)\<\/html\>/gs, clientHTML);
fs.writeFileSync(catchallPath, newFunction);

const ssrPath = path.join(import.meta.dirname, '../dist/server/y/ssr.js');
const ssrContent = fs.readFileSync(ssrPath, 'utf-8');
const newContent = ssrContent.replace(/import\.meta\.url/g, '"file:///"');
fs.writeFileSync(ssrPath, newContent);

console.log(`\n\x1b[32m✓ ran extra production preparation\x1b[0m\n`);