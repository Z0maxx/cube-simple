import * as THREE from 'three'
import { assertExists } from './assertions'
import { canvas, Color, cubeColors, innerCubeMaterials, layers, renderer } from './cube-constants'
import { initCubeSolver } from './solver'
import { cubeAlphaMap, CubeEdge, cubeMaterials, innerCubeBlackMaterial, innerCubeBlueMaterial, innerCubeGreenMaterial, innerCubeOrangeMaterial, innerCubeRedMaterial, innerCubeWhiteMaterial, innerCubeYellowMaterial } from './materials'
import { turn, turnCube, turnEnabled, turnTime } from './rotations'
import './tw.css'
import { TCubeLayer, TDirection } from './types'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getHTMLElement } from './element-getter'

let width = Math.min(document.body.clientWidth, window.innerWidth)
let mobile = width < 640
let smMd = width >= 640 && width < 1024
function minSmMdWidth() {
    return width / 2
}

function mobileMinHeight() {
    return window.innerHeight / 3
}

let smMdWidth = minSmMdWidth()
function getSceneWidth() {
    if (smMd) {
        return smMdWidth
    }

    return width
}

let mobileHeight = mobileMinHeight()
const style = window.getComputedStyle(document.body)
const canvasMarginTop =
    parseInt(canvas.className.split(' ').find(c => c.startsWith('mt-'))?.split('mt-')[1] ?? '0') *
    parseFloat(style.getPropertyValue('--spacing').split(' ')[0]) *
    parseInt(style.fontSize.replace('px', ''))

function getSceneHeight() {
    if (mobile) {
        return mobileHeight
    }
    else if (smMd) {
        return Math.min(window.innerHeight, width * 0.65) - canvasMarginTop
    }

    return window.innerHeight
}

const camera = new THREE.PerspectiveCamera(mobile ? 40 : 50, getSceneWidth() / getSceneHeight(), 0.1, 1000)

function setCameraPosition() {
    camera.position.x = -3
    camera.position.y = 3
    camera.lookAt(0, 0, 0)

    if (mobile || smMd) {
        camera.position.setZ(6.5)
    }
    else {
        camera.position.setZ(7.5)
    }
}

setCameraPosition()
window.addEventListener('resize', () => {
    width = Math.min(document.body.clientWidth, window.innerWidth)
    mobileHeight = mobileMinHeight()
    smMdWidth = minSmMdWidth()
    updateSceneSize()
    setCameraPosition()
    touchEnd()
})

const canvasDrag = getHTMLElement('#canvas-drag')
const canvasDragLine = getHTMLElement('#canvas-drag-line')
function touchMove(e: TouchEvent) {
    e.preventDefault()
    if (mobile) {
        const clientY = e.touches[0].clientY - canvasDrag.clientHeight / 2
        if (clientY <= mobileMinHeight() + canvasMarginTop || clientY >= window.innerHeight - 40) {
            return
        }

        mobileHeight = clientY - canvasMarginTop
    }
    else if (smMd) {
        const clientX = e.touches[0].clientX
        if (clientX >= minSmMdWidth() || clientX <= 5) {
            return
        }

        smMdWidth = window.innerWidth - clientX
    }
    
    updateSceneSize()
}

function touchEnd() {
    window.removeEventListener('touchmove', touchMove)
    window.removeEventListener('touchend', touchEnd)
}

canvasDrag.addEventListener('touchstart', (e: Event) => {
    const touch = e as TouchEvent
    if (touch.touches.length > 1) return

    e.preventDefault()
    window.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('touchend', touchEnd)
}, { passive: false })

const controlsWrapper = getHTMLElement('#controls')
function updateSceneSize() {
    mobile = width < 640
    smMd = width >= 640 && width < 1024
    const sceneHeight = getSceneHeight()
    const sceneWidth = getSceneWidth()
    camera.aspect = sceneWidth / sceneHeight
    renderer.setSize(sceneWidth, sceneHeight)
    camera.updateProjectionMatrix()
    if (mobile) {
        const dragStyle = `top: ${sceneHeight + canvasMarginTop}px`
        canvasDragLine.setAttribute('style', dragStyle)
        controlsWrapper.setAttribute('style', `--canvasHeight: ${sceneHeight}px`)
    }
    else if (smMd) {
        const dragStyle = `right: ${sceneWidth - 5}px`
        canvasDragLine.setAttribute('style', dragStyle)
    }
}

updateSceneSize()

const ambientLight = new THREE.AmbientLight('white')

const light1 = new THREE.PointLight('white')
light1.intensity = 500
light1.position.set(5, 5, 5)

const light2 = new THREE.PointLight('white')
light2.intensity = 50
light2.position.set(-5, 0, -1)

const light3 = new THREE.PointLight('lightpink')
light3.intensity = 50
light3.position.set(0, -3, -3)

const scene = new THREE.Scene()
scene.background = new THREE.Color().setColorName('mediumslateblue')
scene.add(ambientLight, light1, light2, light3)

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(getSceneWidth(), getSceneHeight())

let hold: number | undefined
export function setHold(func: number) {
    hold = func
}
export function clearHold() {
    clearInterval(hold)
}

for (let i = 0; i < 3; i++) {
    const layerColors = []
    const innerLayerMaterials = []
    for (let j = 0; j < 9; j++) {
        let right: [number, number, number] = Color.BLACK
        let left: [number, number, number] = Color.BLACK
        let top: [number, number, number] = Color.BLACK
        let bottom: [number, number, number] = Color.BLACK
        let front: [number, number, number] = Color.BLACK
        let back: [number, number, number] = Color.BLACK

        let innerRight = innerCubeBlackMaterial
        let innerLeft = innerCubeBlackMaterial
        let innerTop = innerCubeBlackMaterial
        let innerBottom = innerCubeBlackMaterial
        let innerFront = innerCubeBlackMaterial
        let innerBack = innerCubeBlackMaterial

        if (j < 3) {
            top = Color.YELLOW
            innerTop = innerCubeYellowMaterial
        }
        if (j > 5) {
            bottom = Color.WHITE
            innerBottom = innerCubeWhiteMaterial
        }
        if (j % 3 == 0) {
            left = Color.BLUE
            innerLeft = innerCubeBlueMaterial
        }
        if (j % 3 == 2) {
            right = Color.GREEN
            innerRight = innerCubeGreenMaterial
        }
        if (i == 0) {
            front = Color.RED
            innerFront = innerCubeRedMaterial
        }
        if (i == 2) {
            back = Color.ORANGE
            innerBack = innerCubeOrangeMaterial
        }

        layerColors.push([right, left, top, bottom, front, back])
        innerLayerMaterials.push([innerRight, innerLeft, innerTop, innerBottom, innerFront, innerBack])
    }
    cubeColors.push(layerColors)
    innerCubeMaterials.push(innerLayerMaterials)
}


const edgeWidth = 0.05
const edgeOffset = 0.4851 - 2 * edgeWidth / 10

const innerCubes: Array<THREE.Mesh> = []

for (let i = 0; i < 3; i++) {
    const layer = new THREE.Group()
    const layerColors = cubeColors[i]
    for (let j = 0; j < 9; j++) {
        const cubeColors = layerColors[j]
        const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed()
        const colors: Array<number> = []
        for (let k = 0; k < 6; k++) {
            for (let l = 0; l < 6; l++) {
                colors.push(...cubeColors[k])
            }
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        const group = new THREE.Group()
        const cube = new THREE.Mesh(geometry, cubeMaterials[i][j])
        const innerGeometry = new THREE.BoxGeometry(0.999, 0.999, 0.999)
        innerGeometry.computeTangents()
        const innerCube = new THREE.Mesh(innerGeometry, assertExists(innerCubeMaterials[i][j]))
        group.add(cube, innerCube)
        innerCube.visible = false
        innerCubes.push(innerCube)
        const edges = new THREE.Group()
        for (let k = 0; k < 12; k++) {
            const edge = new CubeEdge(0.05)
            if (k < 4) {
                edge.position.y += edgeOffset
                if (k == 0) {
                    edge.rotation.y += Math.PI
                }
                edge.meshes.splice(2, 2)
                edge.meshes.splice(4, 2)
            }
            if (k >= 4 && k < 8) {
                edge.position.y -= edgeOffset
                if (k == 5) {
                    edge.rotation.y += Math.PI
                }
                edge.meshes.splice(0, 2)
                edge.meshes.splice(2, 2)
            }
            if (k == 0 || k == 4 || k == 8 || k == 10) {
                edge.position.x -= edgeOffset
            }
            if (k == 1 || k == 5 || k == 9 || k == 11) {
                edge.position.x += edgeOffset
            }
            if (k == 2 || k == 6 || k == 8 || k == 9) {
                edge.position.z -= edgeOffset
            }
            if (k == 3 || k == 7 || k == 10 || k == 11) {
                edge.position.z += edgeOffset
            }
            if (k == 6 || k == 3) {
                edge.rotation.y -= Math.PI / 2
            }
            if (k == 2 || k == 7) {
                edge.rotation.y += Math.PI / 2
            }
            if (k == 9 || k == 10) {
                edge.rotation.x -= Math.PI / 2
                if (k == 9) {
                    edge.meshes.splice(2, 2)
                    edge.meshes.splice(4, 2)
                }
                else {
                    edge.meshes.splice(0, 2)
                    edge.meshes.splice(2, 2)
                }
            }
            if (k == 8 || k == 11) {
                edge.rotation.x += Math.PI / 2
                if (k == 8) {
                    edge.meshes.splice(0, 2)
                    edge.meshes.splice(2, 2)
                }
                else {
                    edge.meshes.splice(2, 2)
                    edge.meshes.splice(4, 2)
                }
            }
            edges.add(edge)
        }
        group.add(edges)
        if (j % 3 == 0) {
            group.position.x = -1
        }
        if (j % 3 == 2) {
            group.position.x = 1
        }
        if (j < 3) {
            group.position.y = 1
        }
        if (j > 5) {
            group.position.y = -1
        }
        layer.add(group)
    }
    if (i == 0) {
        layer.position.z = 1
    }
    else if (i == 2) {
        layer.position.z = -1
    }
    layers.add(layer)
}

scene.add(layers)

const controls = new OrbitControls(camera, renderer.domElement)
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

animate()

document.querySelectorAll('input[type=range]').forEach(range => {
    range.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement
        const min = parseInt(target.min)
        const max = parseInt(target.max)
        const val = parseInt(target.value)
        const percentage = (val - min) * 100 / (max - min)
        target.style.backgroundSize = percentage + '% 100%'
    })
})

const size = 1024 * 1024
const opacityData = new Uint8Array(size * 4)
const opacityDataTexture = new THREE.DataTexture(opacityData, 1024, 1024)
const position = new THREE.Vector2(0, 0)
function setOpacity(opacity: number) {
    const data = opacityDataTexture.image.data
    const value = Math.floor(opacity / 10 * 255)
    for (let i = 0; i < size; i++) {
        const stride = i * 4;
        data[stride] = value
        data[stride + 1] = value
        data[stride + 2] = value
        data[stride + 3] = 1
    }

    renderer.copyTextureToTexture(position, opacityDataTexture, cubeAlphaMap)
}

let parallax = false
function setParallax() {
    if (parallax) {
        setOpacity(100)
    }
    else {
        setOpacity(0)
    }

    parallax = !parallax
    innerCubes.forEach(c => {
        c.visible = !c.visible
    });
}

const cubeControls = getHTMLElement('#cube-controls')
for (const controlWrap of cubeControls.children) {
    for (const control of controlWrap.children) {
        control.addEventListener('mousedown', () => {
            const twice = control.id.endsWith('-2')
            const direction = control.id.replace('-2', '')
            turnCube(direction as TDirection, twice)
            setHold(window.setInterval(() => {
                turnCube(direction as TDirection, twice)
            }, 2 * turnTime * 1000))
        })

        control.addEventListener('mouseup', () => {
            clearHold()
        })

        control.addEventListener('mouseleave', () => {
            clearHold()
        })
    }
}

const layerControls = getHTMLElement('#layer-controls')
for (const controlWrap of layerControls.children) {
    for (const control of controlWrap.children) {
        let names = control.id.split('-')
        control.addEventListener('click', () => {
            if (turnEnabled) turn(names[0] as TCubeLayer, names[1] as TDirection, names[2] === '2')
        })
    }
}

getHTMLElement('#parallax').addEventListener('click', setParallax)
setOpacity(100)

initCubeSolver()
getHTMLElement('#canvas-loader').remove()