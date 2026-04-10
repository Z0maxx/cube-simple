import cubeTextureUrl from './images/metal.jpg'
import cubeMapNormalUrl from './images/metal_normal.png'
import cubeRoughnessMapUrl from './images/metal_roughness.jpg'
import cubeAlphaMapUrl from './images/cube_alpha.png'
import cubeCenterTextureUrl from './images/metal_center.jpg'
import cubeCenterNormalMapUrl from './images/metal_center_normal.png'
import cubeCenterRoughnessMapUrl from './images/metal_center_roughness.jpg'
import edgeTextureUrl from './images/metal_edge.jpg'
import edgeRoughnessMapUrl from './images/metal_edge_roughness.jpg'
import edgeNormalMapUrl from './images/metal_edge_normal.png'
import * as THREE from 'three'
//@ts-ignore
import fragment from './shaders/fragment.glsl'
//@ts-ignore
import vertex from './shaders/vertex.glsl'
//@ts-ignore
import redKtx2 from './textures/red_cube.ktx2'
//@ts-ignore
import whiteKtx2 from './textures/white_cube.ktx2'
//@ts-ignore
import blueKtx2 from './textures/blue_cube.ktx2'
//@ts-ignore
import orangeKtx2 from './textures/orange_cube.ktx2'
//@ts-ignore
import yellowKtx2 from './textures/yellow_cube.ktx2'
//@ts-ignore
import greenKtx2 from './textures/green_cube.ktx2'
//@ts-ignore
import blackKtx2 from './textures/black_cube.ktx2'
import transcoderJs from 'three/examples/jsm/libs/basis/basis_transcoder.js?url'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { renderer } from './cube-constants'

export const cubeAlphaMap = new THREE.TextureLoader().load(cubeAlphaMapUrl)

const cubeCenterTexture = new THREE.TextureLoader().load(cubeCenterTextureUrl)
const cubeCenterNormalMap = new THREE.TextureLoader().load(cubeCenterNormalMapUrl)
const cubeCenterRougnessMap = new THREE.TextureLoader().load(cubeCenterRoughnessMapUrl)
const cubeNormalMaterial = new THREE.MeshStandardMaterial({ transparent: true, alphaMap: cubeAlphaMap, alphaToCoverage: true, vertexColors: true, map: cubeCenterTexture, normalMap: cubeCenterNormalMap, roughnessMap: cubeCenterRougnessMap, precision: 'highp' })

const cubeTexture1 = new THREE.TextureLoader().load(cubeTextureUrl)
const cubeNormalMap1 = new THREE.TextureLoader().load(cubeMapNormalUrl)
const cubeRoughnessMap1 = new THREE.TextureLoader().load(cubeRoughnessMapUrl)
const cubeMaterial1 = new THREE.MeshStandardMaterial({ transparent: true, alphaMap: cubeAlphaMap, alphaToCoverage: true, vertexColors: true, map: cubeTexture1, normalMap: cubeNormalMap1, roughnessMap: cubeRoughnessMap1, precision: 'highp' })

const cubeTexture2 = new THREE.TextureLoader().load(cubeTextureUrl)
cubeTexture2.center.set(0.5, 0.5)
cubeTexture2.rotation = -Math.PI / 2
const cubeNormalMap2 = new THREE.TextureLoader().load(cubeMapNormalUrl)
cubeNormalMap2.center.set(0.5, 0.5)
cubeNormalMap2.rotation = -Math.PI / 2
const cubeRoughnessMap2 = new THREE.TextureLoader().load(cubeRoughnessMapUrl)
cubeRoughnessMap2.center.set(0.5, 0.5)
cubeRoughnessMap2.rotation = -Math.PI / 2
const cubeMaterial2 = new THREE.MeshStandardMaterial({ transparent: true, alphaMap: cubeAlphaMap, alphaToCoverage: true, vertexColors: true, map: cubeTexture2, normalMap: cubeNormalMap2, roughnessMap: cubeRoughnessMap2, precision: 'highp' })

const cubeTexture3 = new THREE.TextureLoader().load(cubeTextureUrl)
cubeTexture3.center.set(0.5, 0.5)
cubeTexture3.rotation = - Math.PI
const cubeNormalMap3 = new THREE.TextureLoader().load(cubeMapNormalUrl)
cubeNormalMap3.center.set(0.5, 0.5)
cubeNormalMap3.rotation = -Math.PI
const cubeRoughnessMap3 = new THREE.TextureLoader().load(cubeRoughnessMapUrl)
cubeRoughnessMap3.center.set(0.5, 0.5)
cubeRoughnessMap3.rotation = -Math.PI
const cubeMaterial3 = new THREE.MeshStandardMaterial({ transparent: true, alphaMap: cubeAlphaMap, alphaToCoverage: true, vertexColors: true, map: cubeTexture3, normalMap: cubeNormalMap3, roughnessMap: cubeRoughnessMap3, precision: 'highp' })

const cubeTexture4 = new THREE.TextureLoader().load(cubeTextureUrl)
cubeTexture4.center.set(0.5, 0.5)
cubeTexture4.rotation = -Math.PI * 1.5
const cubeNormalMap4 = new THREE.TextureLoader().load(cubeMapNormalUrl)
cubeNormalMap4.center.set(0.5, 0.5)
cubeNormalMap4.rotation = -Math.PI * 1.5
const cubeRoughnessMap4 = new THREE.TextureLoader().load(cubeRoughnessMapUrl)
cubeRoughnessMap4.center.set(0.5, 0.5)
cubeRoughnessMap4.rotation = -Math.PI * 1.5
const cubeMaterial4 = new THREE.MeshStandardMaterial({ transparent: true, alphaMap: cubeAlphaMap, alphaToCoverage: true, vertexColors: true, map: cubeTexture4, normalMap: cubeNormalMap4, roughnessMap: cubeRoughnessMap4, precision: 'highp' })

export const cubeMaterials = [
    [
        [
            cubeNormalMaterial,
            cubeMaterial2,
            cubeMaterial4,
            cubeNormalMaterial,
            cubeMaterial1,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial3,
            cubeNormalMaterial,
            cubeMaterial1,
            cubeNormalMaterial
        ],
        [
            cubeMaterial1,
            cubeNormalMaterial,
            cubeMaterial3,
            cubeNormalMaterial,
            cubeMaterial2,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeMaterial2,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial4,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeMaterial4,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial2,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeMaterial3,
            cubeNormalMaterial,
            cubeMaterial1,
            cubeMaterial4,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial1,
            cubeMaterial3,
            cubeNormalMaterial
        ],
        [
            cubeMaterial4,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial2,
            cubeMaterial3,
            cubeNormalMaterial
        ]
    ],
    [
        [
            cubeNormalMaterial,
            cubeMaterial1,
            cubeMaterial4,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [

            cubeMaterial1,
            cubeNormalMaterial,
            cubeMaterial2,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeMaterial3,
            cubeNormalMaterial,
            cubeMaterial4,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeMaterial3,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial2,
            cubeNormalMaterial,
            cubeNormalMaterial
        ]
    ],
    [
        [
            cubeNormalMaterial,
            cubeMaterial1,
            cubeMaterial1,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial2
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial1,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial1
        ],
        [
            cubeMaterial2,
            cubeNormalMaterial,
            cubeMaterial2,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial1
        ],
        [
            cubeNormalMaterial,
            cubeMaterial4,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial2
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial
        ],
        [
            cubeMaterial2,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial4
        ],
        [
            cubeNormalMaterial,
            cubeMaterial4,
            cubeNormalMaterial,
            cubeMaterial4,
            cubeNormalMaterial,
            cubeMaterial3
        ],
        [
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial3,
            cubeNormalMaterial,
            cubeMaterial3
        ],
        [
            cubeMaterial3,
            cubeNormalMaterial,
            cubeNormalMaterial,
            cubeMaterial3,
            cubeNormalMaterial,
            cubeMaterial4
        ]
    ]
]

const edgeColor = 'darkslategray'

const edgeTexture = new THREE.TextureLoader().load(edgeTextureUrl)
const edgeRoughnessMap = new THREE.TextureLoader().load(edgeRoughnessMapUrl)
const edgeNormalMap = new THREE.TextureLoader().load(edgeNormalMapUrl)
const edgeMaterial = new THREE.MeshStandardMaterial({ color: edgeColor, map: edgeTexture, normalMap: edgeNormalMap, roughnessMap: edgeRoughnessMap, precision: 'highp' })

export class CubeEdge extends THREE.Group {
    private static readonly edgeShape: THREE.Shape = new THREE.Shape().moveTo(-0.001, 0.05).lineTo(1.001, 0.05).lineTo(0.951, 0).lineTo(0.0499, 0)

    private readonly edge: THREE.Group
    public get meshes(): Array<THREE.Mesh> {
        return this.edge.children as Array<THREE.Mesh>
    }

    constructor(width: number) {
        const mesh1 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh2 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh3 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh4 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh5 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh6 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh7 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        const mesh8 = new THREE.Mesh(new THREE.ShapeGeometry(CubeEdge.edgeShape), edgeMaterial)
        mesh2.rotateY(Math.PI).position.setX(1)
        mesh3.rotateX(Math.PI / 2).position.setY(width).setZ(-width)
        mesh4.rotateX(Math.PI / 2).rotateY(Math.PI).position.setY(width).setZ(-width).setX(1)
        mesh5.rotateX(-Math.PI / 2)
        mesh6.rotateX(-Math.PI / 2).rotateY(Math.PI).position.setX(1)
        mesh7.rotateX(Math.PI).position.setY(width).setZ(-width)
        mesh8.rotateX(Math.PI).rotateY(Math.PI).position.set(1, width, -width)
        super()
        this.edge = new THREE.Group()
        this.edge.position.set(-0.5, -0.5 * width, 0.5 * width)
        this.edge.add(mesh1, mesh2, mesh7, mesh8, mesh3, mesh4, mesh5, mesh6)
        this.add(this.edge)
        this.rotation.y += Math.PI / 2
    }
}

const ktx2Loader = new KTX2Loader()
    .setTranscoderPath(transcoderJs.replace(/basis_transcoder\.js$/, ''))
    .detectSupport(renderer)

function loadKtx2(ktx2Url: string) {
    return ktx2Loader.loadAsync(ktx2Url)
}

const cubeMaps = await Promise.all([
    loadKtx2(whiteKtx2),
    loadKtx2(redKtx2),
    loadKtx2(orangeKtx2),
    loadKtx2(blueKtx2),
    loadKtx2(greenKtx2),
    loadKtx2(yellowKtx2),
    loadKtx2(blackKtx2)
])

export const innerCubeWhiteMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[0] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

export const innerCubeRedMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[1] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

export const innerCubeOrangeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[2] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

export const innerCubeBlueMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[3] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

export const innerCubeGreenMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[4] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

export const innerCubeYellowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[5] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

export const innerCubeBlackMaterial = new THREE.ShaderMaterial({
    uniforms: {
        cubeMap: { value: cubeMaps[6] }
    },
    vertexShader: vertex,
    fragmentShader: fragment
})