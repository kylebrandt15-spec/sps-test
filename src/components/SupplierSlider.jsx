export default function SupplierSlider({ value, onChange }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        marginTop: '1.5rem',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <label
          htmlFor="supplier-slider"
          style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}
        >
          How many active suppliers do you work with?
        </label>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#0C447C',
            minWidth: '110px',
            textAlign: 'right',
          }}
        >
          {value} suppliers
        </span>
      </div>

      <input
        id="supplier-slider"
        type="range"
        min={25}
        max={500}
        step={25}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Number of active suppliers"
        style={{ display: 'block', width: '100%' }}
      />

      <div className="flex justify-between mt-1">
        <span style={{ fontSize: '11px', color: '#aaa' }}>25</span>
        <span style={{ fontSize: '11px', color: '#aaa' }}>500</span>
      </div>

      <p style={{ fontSize: '11px', color: '#999', marginTop: '0.75rem', lineHeight: 1.5 }}>
        Cost estimates based on SPS Commerce network data, FSMA 204 Traceability Readiness Report (2026),
        BLS labor statistics, and FDA Regulatory Impact Analysis (2022).
      </p>
    </div>
  )
}
