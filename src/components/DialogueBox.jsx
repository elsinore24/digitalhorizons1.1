import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './DialogueBox.module.scss'

export default function DialogueBox({ dialogue, onComplete }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!dialogue) return

    let index = 0
    setIsTyping(true)
    setDisplayText('')

    const interval = setInterval(() => {
      if (index < dialogue.text.length) {
        setDisplayText(prev => prev + dialogue.text[index])
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
        if (onComplete) {
          setTimeout(onComplete, 1000)
        }
      }
    }, 30)

    return () => clearInterval(interval)
  }, [dialogue])

  if (!dialogue) return null

  return (
    <motion.div 
      className={styles.dialogueBox}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    >
      <div className={styles.speaker}>{dialogue.speaker}</div>
      <div className={styles.text}>
        {displayText}
        {isTyping && <span className={styles.cursor}>_</span>}
      </div>
    </motion.div>
  )
}
