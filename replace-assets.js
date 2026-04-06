import fs from 'node:fs'
import path from 'node:path'

const indexHtmlPath = path.join(import.meta.dirname, 'dist', 'index.html')
const images = [
    { from: 'metal-', to: 'https://static.wixstatic.com/media/675e5b_cc75ad99458c4621906da012caeba3b6~mv2.jpg' },
    { from: 'metal_center-', to: 'https://static.wixstatic.com/media/675e5b_76cc09bbfb2142dfa66a69db5120e204~mv2.jpg' },
    { from: 'metal_edge-', to: 'https://static.wixstatic.com/media/675e5b_8b00b47795a5452384055c93ec647906~mv2.jpg' },
    { from: 'metal_normal-', to: 'https://static.wixstatic.com/media/675e5b_26e2ee02e979471e8a40d4f59b9b8a5c~mv2.png' },
    { from: 'metal_center_normal-', to: 'https://static.wixstatic.com/media/675e5b_1101cbdb5231447d9db7aa6cdcc59212~mv2.png' },
    { from: 'metal_edge_normal-', to: 'https://static.wixstatic.com/media/675e5b_6a69f3c3aecd48038ca551af33be3f97~mv2.png' },
    { from: 'metal_roughness-', to: 'https://static.wixstatic.com/media/675e5b_010fcf626875495ea2324dabc6e71153~mv2.jpg' },
    { from: 'metal_center_roughness-', to: 'https://static.wixstatic.com/media/675e5b_729477c2a9b94d93ba8435155f16bad4~mv2.jpg' },
    { from: 'metal_edge_roughness-', to: 'https://static.wixstatic.com/media/675e5b_162a2b9d07844590a2763ec0287badce~mv2.jpg' },
    { from: 'cube_alpha-', to: 'https://static.wixstatic.com/media/675e5b_729477c2a9b94d93ba8435155f16bad4~mv2.jpg' }
]

let indexHtml = fs.readFileSync(indexHtmlPath, { encoding: 'utf-8' })
const assetFiles = fs.readdirSync(path.join(import.meta.dirname, 'dist', 'assets'))

const jsFile = assetFiles.find(f => path.extname(f) === '.js')
const jsPath = path.join(import.meta.dirname, 'dist', 'assets', jsFile)
let js = fs.readFileSync(jsPath, { encoding: 'utf-8' })
assetFiles
    .filter(file => path.extname(file) === '.png' || path.extname(file) === '.jpg')
    .forEach(file => {
        const image = images.find(i => file.includes(i.from))
        console.log('/assets/' + file, image?.from)
        js = js.replaceAll('/assets/' + file, image.to)
        indexHtml = indexHtml.replaceAll('/assets/' + file, image.to)
    })

indexHtml = indexHtml.replace(`<script type="module" crossorigin src="/assets/${jsFile}"></script>`, '')

const cssFile = assetFiles.find(f => path.extname(f) === '.css')
const cssPath = path.join(import.meta.dirname, 'dist', 'assets', cssFile)
const css = fs.readFileSync(cssPath)
indexHtml = indexHtml.replace(`<link rel="stylesheet" href="/assets/${cssFile}">`, `<style>${css}</style>`)
/*indexHtml = indexHtml.replace('</body>', `
    <script type="module" crossorigin></script>\r\n</body>`)*/

 fs.writeFileSync(indexHtmlPath, indexHtml)