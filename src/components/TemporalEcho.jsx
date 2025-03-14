import { useState, useEffect } from 'react'
import useGameState from '../hooks/useGameState'
import useAudio from '../hooks/useAudio'
import styles from './TemporalEcho.module.scss'

export default function TemporalEcho({ videoSrc, position, echoId, narrationId }) {
  const { gameState, setGameState } = useGameState()
  const { playNarration } = useAudio()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const shouldBeVisible = gameState.dataPerceptionMode && 
      !gameState.discoveredEchoes.includes(echoId)
    setIsVisible(shouldBeVisible)
  }, [gameState.dataPerceptionMode, gameState.discoveredEchoes, echoId])
  
  const handleEchoDiscovery = () => {
    setGameState({
      discoveredEchoes: [...gameState.discoveredEchoes, echoId]
    })
    if (narrationId) {
      playNarration(narrationId)
    }
  }
  
  if (!isVisible) return null
  
  return (
    <div 
      className={styles.echoContainer} 
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={handleEchoDiscovery}
    >
      <video 
        className={styles.echoVideo}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.echoGlitch}></div>
      <div className={styles.echoInteract}>
        <span className={styles.interactPrompt}>Analyze Echo</span>
      </div>
    </div>
  )
}
