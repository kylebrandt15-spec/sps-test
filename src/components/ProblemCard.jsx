import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { computeCost } from '../data/costs'

export default function ProblemCard({ problem, found, onReveal, locked, supplierCount }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timerRef = useRef(null)

  function handleActivate() {
    if (locked || found) return
    onReveal(problem.id)
    setShowTooltip(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShowTooltip(false), 1800)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleActivate()
    }
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const cost = computeCost(problem.baseCost, supplierCount)

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              lineHeight: 1.5,
              boxShadow: '0 4px 16px rgba(0,0,0,0.20)',
              zIndex: 50,
              width: '220px',
              pointerEvents: 'none',
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: '4px', color: '#1D9E75' }}>
              {problem.label}
            </p>
            <p style={{ color: '#a0e4c5', fontWeight: 600, marginBottom: '6px' }}>
              ${cost.toLocaleString()} / yr
            </p>
            <p style={{ color: 'rgba(255,255,255,0.80)' }}>{problem.tooltip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        tabIndex={locked ? -1 : 0}
        role="button"
        aria-pressed={found}
        aria-label={`${problem.label}: ${problem.description}`}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        whileTap={!found && !locked ? { scale: 1.06 } : {}}
        animate={found ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          background: found ? '#e8f5e9' : '#f9f9f9',
          border: `1px solid ${found ? '#1D9E75' : '#ddd'}`,
          borderRadius: '8px',
          padding: '1rem',
          cursor: locked ? 'default' : found ? 'default' : 'pointer',
          position: 'relative',
          outline: 'none',
          transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.15s ease',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
        className={!found && !locked ? 'problem-card-hover' : ''}
        onFocus={(e) => {
          if (!found && !locked) {
            e.currentTarget.style.boxShadow = '0 0 0 2px #0C447C'
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none'
        }}
        onMouseEnter={(e) => {
          if (!found && !locked) {
            e.currentTarget.style.background = '#f0f5ff'
            e.currentTarget.style.borderColor = '#0C447C'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(12,68,124,0.15)'
          }
        }}
        onMouseLeave={(e) => {
          if (!found && !locked) {
            e.currentTarget.style.background = '#f9f9f9'
            e.currentTarget.style.borderColor = '#ddd'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        {/* Found checkmark */}
        {found && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: '#1D9E75',
              fontWeight: 700,
              fontSize: '14px',
            }}
            aria-hidden="true"
          >
            ✓
          </div>
        )}

        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: found ? '#1D9E75' : '#1a1a1a',
            lineHeight: 1.3,
            transition: 'color 0.2s ease',
          }}
        >
          {problem.label}
        </p>
        <p style={{ fontSize: '11px', color: '#888', lineHeight: 1.4 }}>
          {problem.description}
        </p>

        {/* Category badge */}
        <CategoryBadge category={problem.category} />
      </motion.div>
    </div>
  )
}

const categoryColors = {
  labor:      { bg: '#EBF3FF', text: '#185FA5' },
  operations: { bg: '#FFF4E5', text: '#BA7517' },
  compliance: { bg: '#FFF0F0', text: '#A32D2D' },
  data:       { bg: '#F3F0FF', text: '#5B3FA5' },
  inventory:  { bg: '#E5F9F4', text: '#1D9E75' },
  risk:       { bg: '#FFE5E5', text: '#A32D2D' },
}

function CategoryBadge({ category }) {
  const colors = categoryColors[category] || { bg: '#f0f0f0', text: '#666' }
  return (
    <span
      style={{
        display: 'inline-block',
        marginTop: '6px',
        background: colors.bg,
        color: colors.text,
        fontSize: '10px',
        fontWeight: 600,
        borderRadius: '99px',
        padding: '2px 8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        alignSelf: 'flex-start',
      }}
    >
      {category}
    </span>
  )
}
