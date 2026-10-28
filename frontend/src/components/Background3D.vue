<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLElement | null>(null)
const imgEl = ref<HTMLImageElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let starsNear: THREE.Points | null = null
let starsFar: THREE.Points | null = null
let starField: THREE.Group | null = null
let planets: { mesh: THREE.Mesh; pivot: THREE.Group; speed: number }[] = []
let moons: THREE.Group[] = []
let sunGroup: THREE.Group | null = null
let frameId = 0

let targetX = 0
let targetY = 0
let smoothX = 0
let smoothY = 0
let scrollY = 0

const onMouseMove = (e: MouseEvent) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 2
  targetY = (e.clientY / window.innerHeight - 0.5) * 2
}

const onScroll = () => {
  scrollY = window.scrollY
}

const onResize = () => {
  if (!renderer || !camera) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const makeStars = (count: number, size: number, spread: number, color: number) => {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.8, depthWrite: false })
  )
}

onMounted(() => {
  if (!container.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 8, 22)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const sunLight = new THREE.PointLight(0xfff2cc, 2, 200)
  scene.add(sunLight)

  // Star layers (different depths = natural parallax)
  starField = new THREE.Group()
  starsFar = makeStars(700, 0.1, 140, 0x555555)
  starsFar.position.z = -40
  starsNear = makeStars(400, 0.16, 60, 0xaaaaaa)
  starsNear.position.z = -15
  starField.add(starsFar)
  starField.add(starsNear)
  scene.add(starField)

  // Sun group (so we can parallax it independently)
  sunGroup = new THREE.Group()
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffcc66, emissive: 0xff9900, emissiveIntensity: 1.2 })
  )
  sunGroup.add(sun)
  scene.add(sunGroup)

  // Real solar system — 8 planets
  const planetData = [
    { name: 'Mercury', radius: 0.18, distance: 2.6, speed: 0.032, color: 0x9c8e85, ring: false },
    { name: 'Venus',   radius: 0.3,  distance: 3.6, speed: 0.024, color: 0xe3c16f, ring: false },
    { name: 'Earth',   radius: 0.32, distance: 4.7, speed: 0.02,  color: 0x3b6ea5, ring: false, moon: true },
    { name: 'Mars',    radius: 0.24, distance: 5.8, speed: 0.016, color: 0xc1440e, ring: false },
    { name: 'Jupiter', radius: 0.85, distance: 8.0, speed: 0.01,  color: 0xd8a066, ring: false },
    { name: 'Saturn',  radius: 0.72, distance: 10.2, speed: 0.008, color: 0xe3c99a, ring: true },
    { name: 'Uranus',  radius: 0.5,  distance: 12.2, speed: 0.006, color: 0x7fd4d4, ring: false },
    { name: 'Neptune', radius: 0.48, distance: 14.0, speed: 0.0048, color: 0x3457d5, ring: false },
  ]

  planetData.forEach((p) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(p.distance - 0.015, p.distance + 0.015, 100),
      new THREE.MeshBasicMaterial({ color: 0x2a2a2a, side: THREE.DoubleSide })
    )
    ring.rotation.x = -Math.PI / 2
    scene!.add(ring)

    const pivot = new THREE.Group()
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.radius, 32, 32),
      new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.9, metalness: 0.1 })
    )
    mesh.position.x = p.distance
    pivot.add(mesh)

    // Saturn-style planetary ring
    if (p.ring) {
      const pring = new THREE.Mesh(
        new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.1, 48),
        new THREE.MeshBasicMaterial({ color: 0xcbb98a, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
      )
      pring.rotation.x = Math.PI / 2.4
      mesh.add(pring)
    }

    // Moon for Earth
    if ((p as any).moon) {
      const moonPivot = new THREE.Group()
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 1 })
      )
      moon.position.x = 0.55
      moonPivot.add(moon)
      mesh.add(moonPivot)
      moons.push(moonPivot)
    }

    pivot.rotation.x = 0.12
    scene!.add(pivot)
    planets.push({ mesh, pivot, speed: p.speed })
  })

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  const animate = () => {
    frameId = requestAnimationFrame(animate)

    // Smooth (lerped) mouse — this is what creates the silky parallax
    smoothX += (targetX - smoothX) * 0.05
    smoothY += (targetY - smoothY) * 0.05

    // Layers move at different rates depending on depth
    // Parallax the black hole image opposite to the 3D layers
    if (imgEl.value) {
      const tx = -smoothX * 20
      const ty = smoothY * 14 + scrollY * 0.02
      imgEl.value.style.transform = `translate(${tx}px, ${ty}px) scale(1.15)`
    }

    if (starsFar) {
      starsFar.rotation.y += 0.0002
      starsFar.position.x = smoothX * 0.8
      starsFar.position.y = -smoothY * 0.5
    }
    if (starsNear) {
      starsNear.rotation.y += 0.0005
      starsNear.position.x = smoothX * 2.2
      starsNear.position.y = -smoothY * 1.4
    }
    if (sunGroup) {
      sunGroup.position.x = smoothX * 0.6
      sunGroup.position.y = -smoothY * 0.4
    }

    planets.forEach((p) => {
      p.pivot.rotation.y += p.speed
      p.mesh.rotation.y += 0.01
    })
    moons.forEach((m) => (m.rotation.y += 0.03))

    if (camera) {
      // Camera pans + tilts with mouse, and drifts down as user scrolls
      camera.position.x += (smoothX * 3 - camera.position.x) * 0.04
      camera.position.y += (8 - smoothY * 2 - scrollY * 0.004 - camera.position.y) * 0.04
      camera.position.z = 22 - Math.min(scrollY * 0.002, 3)
      camera.lookAt(smoothX * 1.2, -smoothY * 0.8, 0)
    }

    renderer?.render(scene!, camera!)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
  if (container.value && renderer) {
    container.value.removeChild(renderer.domElement)
  }
})
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
    <img
      ref="imgEl"
      src="/blackhole.jpg"
      alt=""
      class="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-100 will-change-transform"
    />
    <div ref="container" class="absolute inset-0"></div>
  </div>
</template>
