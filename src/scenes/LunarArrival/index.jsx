import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../../hooks/useGameState'
import useAudio from '../../hooks/useAudio'
import TemporalEcho from '../../components/TemporalEcho'
import Scene3D from '../../components/Scene3D'
import DialogueBox from '../../components/DialogueBox'
import styles from './LunarArrival.module.scss'

const INTRO_DIALOGUE = [
  {
    speaker: 'ALARA',
    text: 'Professor Thorne? Can you hear me? Your neural connection is stabilizing...',
    duration: 4000
  },
  {
    speaker: 'ALARA',
    text: 'The data patterns here... they\'re unlike anything in our records.',
    duration: 4000
  },
  {
    speaker: 'JULIAN',
    text: 'Where... where am I? This doesn\'t feel real.',
    duration: 3500
  }
]

export default function LunarArrival({ dataPerceptionMode }) {
  const { gameState, visitScene } = useGameState()
  const { playNarration } = useAudio()
  const [introStep, setIntroStep] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    const isFirstVisit = !gameState.scenesVisited.includes('lunar_arrival')
    if (isFirstVisit) {
      playIntroSequence()
      visitScene('lunar_arrival')
    }
  }, [])

  const playIntroSequence = async () => {
    playNarration('lunar_arrival_intro')
    
    for (let i = 0; i < INTRO_DIALOGUE.length; i++) {
      await new Promise(resolve => setTimeout(resolve, INTRO_DIALOGUE[i].duration))
      setIntroStep(i + 1)
    }
    
    setIntroComplete(true)
  }

  return (
    <div className={styles.sceneContainer}>
      <Scene3D dataPerceptionMode={dataPerceptionMode} />
      
      <div className={styles.environment}>
        {dataPerceptionMode && (
          <div className={styles.dataElements}>
            <TemporalEcho 
              videoSrc="/videos/apollo_landing_echo.mp4"
              position={{ x: 25, y: 40 }}
              echoId="apollo_landing"
              narrationId="echo_apollo_discovery"
            />
            <div className={styles.dataPatterns}>
              <motion.div 
                className={styles.pattern}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </div>
          </div>
        )}

        <AnimatePresence>
          {!introComplete && INTRO_DIALOGUE[introStep] && (
            <motion.div 
              className={styles.introSequence}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogueBox
                dialogue={INTRO_DIALOGUE[introStep]}
                onComplete={() => {
                  if (introStep < INTRO_DIALOGUE.length - 1) {
                    setIntroStep(prev => prev + 1)
                  } else {
                    setIntroComplete(true)
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
