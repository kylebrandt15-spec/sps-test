import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { costLines, computeCost, computeTotal } from '../data/costs'

const TICKER_DURATION = 800

function useTicker(targetValue, animate) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!animate || hasAnimated.current) {
      setDisplay(targetValue)
      return
    }
    hasAnimated.current = true

    cancelAnimationFrame(rafRef.current)
    startRef.current = null
    const startVal = 0
    const endVal = targetValue

    function step(ts) {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / TICKER_DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(startVal + (endVal - startVal) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  // Update instantly on slider change after initial animation
  useEffect(() => {
    if (hasAnimated.current) {
      setDisplay(targetValue)
    }
  }, [targetValue])

  return display
}

function CostRow({ label, base, supplierCount, animate, delay }) {
  const value = computeCost(base, supplierCount)
  const displayed = useTicker(value, animate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-between items-center py-2"
      style={{ borderBottom: '1px solid #f0f0f0' }}
    >
      <span style={{ fontSize: '13px', color: '#666' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
        ${displayed.toLocaleString()}
      </span>
    </motion.div>
  )
}

function TotalRow({ supplierCount, animate }) {
  const total = computeTotal(supplierCount)
  const displayed = useTicker(total, animate)

  return (
    <div
      className="flex justify-between items-center pt-3 mt-1"
      style={{ borderTop: '2px solid #0C447C' }}
    >
      <span style={{ fontSize: '15px', fontWeight: 700, color: '#0C447C' }}>
        Total annual hidden cost:
      </span>
      <span style={{ fontSize: '18px', fontWeight: 700, color: '#0C447C' }}>
        ${displayed.toLocaleString()}
      </span>
    </div>
  )
}

export default function CostBreakdown({ supplierCount }) {
  const [animate, setAnimate] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true
      const t = setTimeout(() => setAnimate(true), 100)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        marginTop: '1.5rem',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#666',
          marginBottom: '1rem',
        }}
      >
        Your Annual Hidden Cost Breakdown
      </p>

      <div>
        {costLines.map((line, i) => (
          <CostRow
            key={line.id}
            label={line.label}
            base={line.base}
            supplierCount={supplierCount}
            animate={animate}
            delay={i * 0.04}
          />
        ))}
        <TotalRow supplierCount={supplierCount} animate={animate} />
      </div>

      {/* Stat chips */}
      <div
        className="flex flex-wrap gap-2 mt-5"
        style={{ justifyContent: 'flex-start' }}
      >
        <StatChip type="red">
          Only 31.7% of grocers send ASNs — SPS Network 2026
        </StatChip>
        <StatChip type="amber">
          DIY FSMA 204 compliance: $415K–$845K Year 1 — SPS Readiness Report 2026
        </StatChip>
        <StatChip type="blue">
          One missing EDI field (lot code) = $1.66M recall cost difference — FDA + SPS 2026
        </StatChip>
      </div>
    </motion.div>
  )
}

const chipStyles = {
  red:   { bg: '#FFF0F0', text: '#A32D2D', icon: '⚠' },
  amber: { bg: '#FFF8E5', text: '#BA7517', icon: '⚠' },
  blue:  { bg: '#EBF3FF', text: '#185FA5', icon: 'ℹ' },
}

function StatChip({ type, children }) {
  const s = chipStyles[type]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '5px',
        background: s.bg,
        color: s.text,
        borderRadius: '99px',
        padding: '5px 12px',
        fontSize: '11px',
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: '11px', flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
        {s.icon}
      </span>
      {children}
    </span>
  )
}
