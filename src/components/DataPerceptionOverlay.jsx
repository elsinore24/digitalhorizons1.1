import styles from './DataPerceptionOverlay.module.scss'

export default function DataPerceptionOverlay({ active }) {
  if (!active) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.grid}></div>
      <div className={styles.dataStreams}></div>
    </div>
  )
}
