import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'child_process'

const texturesPath = path.join(import.meta.dirname, 'src', 'textures')
const dirs = fs.readdirSync(texturesPath).filter(f => fs.lstatSync(path.join(texturesPath, f)).isDirectory())
const inputOrder = [
    'px',
    'nx',
    'py',
    'ny',
    'pz',
    'nz'
]

dirs.forEach(dir => {
    const files = inputOrder.map(i => path.join(dir, `${i}.png`)).join(' ')
    execSync(`toktx --t2 --cubemap --uastc 3 --target_type RGB ${dir}.ktx2 ${files}`, {
        cwd: texturesPath
    })
})