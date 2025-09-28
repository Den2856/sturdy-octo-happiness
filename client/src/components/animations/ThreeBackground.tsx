import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  className?: string
  density?: number
  speed?: number
  amplitude?: number
}

export default function ThreeBackground({
  className = '',
  density = 90,
  speed = 0.008,
  amplitude = 1.2,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = mountRef.current!
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Точки-волны
    const cols = Math.floor((density * container.clientWidth) / 1024)
    const rows = Math.floor((density * container.clientHeight) / 1024)
    const sep = 0.9

    const num = cols * rows
    const positions = new Float32Array(num * 3)
    let i = 0
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        positions[i++] = (x - cols / 2) * sep
        positions[i++] = (y - rows / 2) * sep
        positions[i++] = 0
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      color: new THREE.Color('#00E7F0'),
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let raf = 0
    let t = 0
    const pos = geometry.attributes.position as THREE.BufferAttribute

    const onResize = () => {
      const { clientWidth, clientHeight } = container
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    }
    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      camera.position.x = nx * 4
      camera.position.y = -ny * 2
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = () => {
      t += speed
      const arr = pos.array as unknown as number[]
      let k = 2
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++, k += 3) {
          const dx = x - cols / 2
          const dy = y - rows / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          arr[k] = Math.sin(dist * 0.25 + t * 6) * amplitude
        }
      }
      pos.needsUpdate = true
      points.rotation.z += reduceMotion ? 0 : 0.0008
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [density, speed, amplitude])

  return <div ref={mountRef} className={className} aria-hidden />
}
