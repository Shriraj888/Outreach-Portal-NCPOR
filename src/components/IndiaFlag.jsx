export default function IndiaFlag({ width = 21, height = 14, className = '', style = {} }) {
  // 24 spokes for Ashoka Chakra (360° / 24 = 15°)
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 200" 
      width={width} 
      height={height} 
      className={`india-flag-svg ${className}`}
      style={{ 
        display: 'inline-block', 
        verticalAlign: 'middle', 
        borderRadius: '2px', 
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.2)',
        flexShrink: 0,
        ...style 
      }}
      aria-label="National Flag of India"
      role="img"
    >
      {/* Top Saffron (Kesari) Band */}
      <rect width="300" height="66.67" fill="#FF9933" />
      
      {/* Middle White Band */}
      <rect y="66.67" width="300" height="66.67" fill="#FFFFFF" />
      
      {/* Bottom India Green Band */}
      <rect y="133.34" width="300" height="66.67" fill="#138808" />

      {/* Ashoka Chakra (Navy Blue) */}
      <g transform="translate(150, 100)">
        {/* Outer Circular Ring */}
        <circle r="26.5" fill="none" stroke="#000080" strokeWidth="2.8" />
        
        {/* Inner Hub Circle */}
        <circle r="5.2" fill="#000080" />
        
        {/* 24 Radiating Spokes */}
        {spokes.map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2="0"
            y2="-26.5"
            stroke="#000080"
            strokeWidth="1.6"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  );
}
