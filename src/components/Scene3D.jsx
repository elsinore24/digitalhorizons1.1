import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './Scene3D.module.scss'

export default function Scene3D({ dataPerceptionMode }) {
  const containerRef = useRef(null)
  const [hasWebGL, setHasWebGL] = useState(true)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)

  useEffect(() => {
    try {
      // Check WebGL support
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGL(false)
        return
      }

      // Scene setup
      sceneRef.current = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )

      // Renderer setup with error handling
      try {
        rendererRef.current = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "default"
        })
      } catch (error) {
        console.error('WebGL Renderer creation failed:', error)
        setHasWebGL(false)
        return
      }

      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      containerRef.current.appendChild(rendererRef.current.domElement)

      // Basic scene setup
      const geometry = new THREE.PlaneGeometry(100, 100, 20, 20)
      const material = new THREE.MeshStandardMaterial({
        color: 0x333333,
        wireframe: dataPerceptionMode,
        roughness: 0.8,
        metalness: 0.2
      })
      const plane = new THREE.Mesh(geometry, material)
      plane.rotation.x = -Math.PI / 2
      sceneRef.current.add(plane)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      sceneRef.current.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(0, 10, 5)
      sceneRef.current.add(directionalLight)

      camera.position.set(0, 5, 10)
      camera.lookAt(0, 0, 0)

      // Animation loop
      const animate = () => {
        if (!rendererRef.current) return
        requestAnimationFrame(animate)
        rendererRef.current.render(sceneRef.current, camera)
      }
      animate()

      // Cleanup
      return () => {
        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        if (geometry) geometry.dispose()
        if (material) material.dispose()
      }
    } catch (error) {
      console.error('Scene3D setup failed:', error)
      setHasWebGL(false)
    }
  }, [dataPerceptionMode])

  // Fallback content when WebGL is not available
  if (!hasWebGL) {
    return (
      <div className={styles.fallback}>
        <div className={styles.lunarSurfaceFallback}>
          <div className={styles.stars} />
          <div className={styles.ground} />
        </div>
      </div>
    )
  }

  return <div ref={containerRef} className={styles.scene3d} />
}
