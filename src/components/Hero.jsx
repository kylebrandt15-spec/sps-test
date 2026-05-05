export default function Hero() {
  return (
    <div style={{ background: '#0C447C' }} className="w-full px-6 py-10 md:py-14">
      <div className="max-w-4xl mx-auto">
        <h1
          style={{ fontSize: '32px', fontWeight: 600, color: '#fff', lineHeight: 1.25, marginBottom: '0.75rem' }}
        >
          What&apos;s your supplier data really costing?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: '16px', marginBottom: '1.25rem', maxWidth: '560px' }}>
          Find 12 hidden problems in your current operation. Each one has a dollar figure attached to it.
        </p>

        {/* Stat chip */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#185FA5',
            color: '#fff',
            borderRadius: '99px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          <InfoIcon />
          Industry avg: only 31.7% of shipments arrive with an ASN — SPS Commerce Network Data, 2026
        </span>
      </div>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
      <path d="M8 7v5M8 5.5v.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
