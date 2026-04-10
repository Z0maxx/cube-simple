import fs from 'node:fs'
import path from 'node:path'

const distPath = path.join(import.meta.dirname, 'dist')
const assetsPath = path.join(distPath, 'assets')
const indexHtmlPath = path.join(distPath, 'index.html')
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
const assetFiles = fs.readdirSync(assetsPath)

const jsFile = assetFiles.find(f => f.startsWith('index-') && path.extname(f) === '.js')
console.log(jsFile)
const jsPath = path.join(assetsPath, jsFile)
let js = fs.readFileSync(jsPath, { encoding: 'utf-8' })
assetFiles
    .filter(file => path.extname(file) === '.png' || path.extname(file) === '.jpg')
    .forEach(file => {
        const image = images.find(i => file.includes(i.from))
        js = js.replaceAll('/assets/' + file, image.to)
        indexHtml = indexHtml.replaceAll('/assets/' + file, image.to)
        fs.rm(path.join(assetsPath, file), () => {})
    })

const scriptTag = `<script type="module" crossorigin src="/assets/${jsFile}"></script>`
indexHtml = indexHtml.replace(scriptTag, '')

const cssFile = assetFiles.find(f => path.extname(f) === '.css')
const cssPath = path.join(assetsPath, cssFile)
const css = fs.readFileSync(cssPath)
indexHtml = indexHtml.replace(`<link rel="stylesheet" href="/assets/${cssFile}">`, `<style>${css}</style>`)
console.log(cssPath)
fs.rm(cssPath, () => {})
indexHtml = indexHtml.replace('</body>', `${scriptTag}\r\n</body>`)
assetFiles
    .filter(file => path.extname(file) !== '.png' && path.extname(file) !== '.jpg')
    .forEach(f => {
        const splitName = f.split('-')
        const name = splitName[0] + path.extname(f)
        indexHtml = indexHtml.replaceAll(f, name)
        js = js.replaceAll(f, name)
        fs.renameSync(path.join(assetsPath, f), path.join(assetsPath, name), () => {})
    })

fs.writeFileSync(indexHtmlPath, indexHtml)
fs.writeFileSync(path.join(assetsPath, 'index.js'), js)