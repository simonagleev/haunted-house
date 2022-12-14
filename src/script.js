import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// FOG
const fog = new THREE.Fog(0x262837, 1, 26)
scene.fog = fog

/**
 * Textures
 */
const gltfLoader = new GLTFLoader()

let cat;
let mixer;
let mixer2
gltfLoader.load(
    'models/cat-animation4.gltf',
    (gltf) => {
        cat = gltf.scene
        cat.position.set(0, 0, 4)
        cat.rotation.y = - Math.PI / 2
        cat.scale.set(.5, .5, .5)
        scene.add(gltf.scene)

        mixer = new THREE.AnimationMixer(gltf.scene);
        mixer2 = new THREE.AnimationMixer(gltf.scene);
        const run = mixer.clipAction(gltf.animations[1])
        // console.log(action)
        const chill = mixer2.clipAction(gltf.animations[0])
        run.play()
        chill.play()
    },
)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTExture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTExture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTExture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTExture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTExture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTExture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTExture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTExture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTExture.repeat.set(8, 8)
grassAmbientOcclusionTExture.repeat.set(8, 8)
grassNormalTExture.repeat.set(8, 8)
grassRoughnessTExture.repeat.set(8, 8)

grassColorTExture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTExture.wrapS = THREE.RepeatWrapping
grassNormalTExture.wrapS = THREE.RepeatWrapping
grassRoughnessTExture.wrapS = THREE.RepeatWrapping

grassColorTExture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTExture.wrapT = THREE.RepeatWrapping
grassNormalTExture.wrapT = THREE.RepeatWrapping
grassRoughnessTExture.wrapT = THREE.RepeatWrapping

/**
 * House
 */

// GROUP
const house = new THREE.Group()
scene.add(house)

// WALLS
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTExture,
        aoMap: bricksAmbientOcclusionTExture,
        normalMap: bricksNormalTExture,
        roughnessMap: bricksRoughnessTExture
    })
)
walls.position.y = 2.5 / 2
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float16BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

house.add(walls)

// ROOF
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 2, 4),
    new THREE.MeshStandardMaterial({
        color: '#ff8e82'
    })
)
roof.position.y = walls.position.y * 2 + 2 / 2
roof.rotation.y = Math.PI / 4
house.add(roof)

// DOOR
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture

    })
)

door.geometry.setAttribute(
    'uv2',
    new THREE.Float16BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.y = 1
door.position.z = 2.01

house.add(door)

// BUSHES
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x89c854
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.9, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1.1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0xb2b6b1
})

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - .5) * .4;
    grave.rotation.z = (Math.random() - .5) * .4
    grave.castShadow = true
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTExture,
        aoMap: grassAmbientOcclusionTExture,
        normalMap: grassNormalTExture,
        roughnessMap: grassRoughnessTExture
    })
)

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float16BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)

scene.add(moonLight)

//  DOOR LIGHT
const doorlight = new THREE.PointLight('#ff7d31', 1, 7)
doorlight.position.set(0, 2.2, 2.7)
house.add(doorlight)


/**
 * GHOSTS
 */
const ghost1 = new THREE.PointLight('#8A101E', 2, 3)
const ghost2 = new THREE.PointLight('#1467AC', 2, 3)
const ghost3 = new THREE.PointLight('#dc7d02', 2, 3);

scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x262837)
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// SHADOWS
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorlight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

doorlight.shadow.mapSize.width = 256
doorlight.shadow.mapSize.height = 256
doorlight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

setTimeout(() => {
    gui.add(cat.rotation, 'y').min(0).max(360).step(1)

}, 3000)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // UPDATE GHOST
    const ghostAngle = elapsedTime / 2

    ghost1.position.x = Math.cos(ghostAngle) * 4
    ghost1.position.z = Math.sin(ghostAngle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = elapsedTime / 3
    ghost2.position.x = - Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 2) * Math.sin(elapsedTime * 0.5)

    const ghost3Angle = elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * 6.27
    ghost3.position.z = Math.sin(ghost3Angle) * 3.44 + 2.23
    ghost3.position.y = Math.sin(elapsedTime * 3 + 1.78) * 2.22
   

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const catMovement = (event) => {
    let keyCode = event.which;
    if (cat) {
      // forward
      if (keyCode == 87) {
        cat.rotation.y = 33
        if (cat) {
          mixer.update(clock.getDelta() * 3)
      
        } else {
          console.log('no cat to animate')
        }
        cat.position.z -= .1;

        // down
      } else if (keyCode == 83) {
        cat.rotation.y = 11
        if (cat) {
          mixer.update(clock.getDelta() * 3)
      
        } else {
          console.log('no cat to animate')
        }
        cat.position.z += .1;

        // left
      } else if (keyCode == 65) {
        cat.rotation.y = 179
        if (cat) {
          mixer.update(clock.getDelta() * 3)
      
        } else {
          console.log('no cat to animate')
        }
        cat.position.x -= .1;

        // right
      } else if (keyCode == 68) {
        cat.rotation.y = 0
  
        if (cat) {
          mixer.update(clock.getDelta() * 3)
      
        } else {
          console.log('no cat to animate')
        }
        cat.position.x += .1;
        // space
      } else if (keyCode == 32) {
        cat.position.x = 0.0;
        cat.position.y = 0.0;
      }
    }
  };
  document.addEventListener("keydown", catMovement, false);

 
const catChill = (event) => {
    if(cat) {
        mixer2.update(clock.getDelta())
    }
}

document.addEventListener("keyup", catChill, false);
