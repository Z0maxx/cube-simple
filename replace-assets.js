import fs from 'node:fs'
import path from 'node:path'

const distPath = path.join(import.meta.dirname, 'dist')
const assetsPath = path.join(distPath, 'assets')
const indexHtmlPath = path.join(distPath, 'index.html')
const textures = [
    'white_cube',
    'black_cube',
    'red_cube',
    'orange_cube',
    'green_cube',
    'blue_cube',
    'yellow_cube'
]
const images = [
    'metal',
    'metal_center',
    'metal_edge',
    'metal_normal',
    'metal_center_normal',
    'metal_edge_normal',
    'metal_roughness',
    'metal_center_roughness',
    'metal_edge_roughness',
    'cube_alpha',
]

const githubRawUrl = 'https://raw.githubusercontent.com/Z0maxx/cube-simple/main/src'

let indexHtml = fs.readFileSync(indexHtmlPath, { encoding: 'utf-8' })
const assetFiles = fs.readdirSync(assetsPath)

const jsFile = assetFiles.find(f => f.startsWith('index-') && path.extname(f) === '.js')
const jsPath = path.join(assetsPath, jsFile)
let js = fs.readFileSync(jsPath, { encoding: 'utf-8' })
assetFiles
    .filter(file => ['.png', '.jpg', '.ktx2'].includes(path.extname(file)))
    .forEach(file => {
        const ext = path.extname(file)
        if (['.png', '.jpg'].includes(ext)) {
            const image = images.find(i => file.includes(i + '-'))
            const url = `${githubRawUrl}/images/${image}${ext}`
            js = js.replaceAll('/assets/' + file, url)
            indexHtml = indexHtml.replaceAll('/assets/' + file, url)
        }
        else if (['.ktx2'].includes(ext)) {
            const texture = textures.find(t => file.includes(t + '-'))
            const url = `${githubRawUrl}/textures/${texture}${ext}`
            js = js.replaceAll('/assets/' + file, url)
            indexHtml = indexHtml.replaceAll('/assets/' + file, url)
        }
        
        fs.rm(path.join(assetsPath, file), () => {})
    })

const scriptTag = `<script type="module" crossorigin src="/assets/${jsFile}"></script>`
indexHtml = indexHtml.replace(scriptTag, '')

const cssFile = assetFiles.find(f => path.extname(f) === '.css')
const cssPath = path.join(assetsPath, cssFile)
const css = fs.readFileSync(cssPath)
indexHtml = indexHtml.replace(`<link rel="stylesheet" href="/assets/${cssFile}">`, `<style>${css}</style>`)
fs.rm(cssPath, () => {})
fs.rm(jsPath, () => {})
assetFiles
    .filter(file => !['.png', '.jpg', '.ktx2', '.js', '.css'].includes(path.extname(file)))
    .forEach(f => {
        const splitName = f.split('-')
        const name = splitName[0] + path.extname(f)
        indexHtml = indexHtml.replaceAll(f, name)
        js = js.replaceAll(f, name)
        fs.renameSync(path.join(assetsPath, f), path.join(assetsPath, name), () => {})
    })

indexHtml += '<script type="module">'
indexHtml += js
indexHtml += '</script>'

fs.writeFileSync(indexHtmlPath, indexHtml)