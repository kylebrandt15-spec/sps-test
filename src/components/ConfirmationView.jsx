import { motion } from 'framer-motion'

export default function ConfirmationView() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        marginTop: '1.5rem',
        maxWidth: '520px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
      }}
    >
      {/* Check circle */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#e8f5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '24px',
        }}
        aria-hidden="true"
      >
        ✓
      </div>

      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>
        You&apos;re all set.
      </h2>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Your personalized cost analysis is on its way. While you wait — here&apos;s the one stat worth sharing with your CFO:
      </p>

      {/* Highlighted stat */}
      <div
        style={{
          background: '#EBF3FF',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#0C447C',
            lineHeight: 1.4,
            marginBottom: '0.5rem',
          }}
        >
          &ldquo;One missing EDI field can mean the difference between a $140K recall and a $1.8M one.&rdquo;
        </p>
        <p style={{ fontSize: '12px', color: '#185FA5', fontStyle: 'italic' }}>
          — SPS Commerce FSMA 204 Traceability Readiness Report, 2026
        </p>
      </div>

      <a
        href="https://www.spscommerce.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#0C447C',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          borderBottom: '1px solid #0C447C',
          paddingBottom: '1px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#185FA5')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#0C447C')}
      >
        Read the full FSMA 204 Traceability Readiness Report →
      </a>
    </motion.div>
  )
}
