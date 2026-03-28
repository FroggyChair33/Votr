export function GeorgiaMap() {
  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full h-full"
      style={{ maxHeight: '100%' }}
    >
      {/* Georgia State Outline */}
      <path
        d="M 25 15 
           L 50 10 L 80 8 L 110 10 L 140 12 L 170 15 L 200 18 
           L 230 20 L 260 22 L 275 25 
           L 280 30 L 282 40 L 283 50 L 284 60 L 285 70 
           L 286 80 L 287 90 L 288 100 L 289 110 L 290 120 
           L 290 130 L 289 140 L 287 150 L 284 160 L 280 170 
           L 275 175 L 268 178 L 260 180 L 250 182 L 240 183 
           L 230 184 L 220 185 L 210 185 L 200 184 L 190 183 
           L 180 182 L 170 181 L 160 180 L 150 179 L 140 178 
           L 130 177 L 120 176 L 110 175 L 100 174 L 90 173 
           L 80 172 L 70 171 L 60 170 L 50 168 L 40 165 
           L 32 160 L 26 155 L 22 148 L 19 140 L 17 130 
           L 16 120 L 15 110 L 14 100 L 13 90 L 12 80 
           L 12 70 L 12 60 L 13 50 L 14 40 L 16 30 
           L 18 22 L 20 18 L 25 15 Z"
        fill="#E5E7EB"
        stroke="#D1D5DB"
        strokeWidth="1.5"
      />

      {/* Location Pins */}
      {/* Northern Georgia Pin (Atlanta area) */}
      <g transform="translate(130, 60)">
        <ellipse cx="0" cy="15" rx="6" ry="2" fill="#EF4444" opacity="0.3" />
        <path
          d="M 0,-12 C -5,-12 -9,-8 -9,-3 C -9,3 0,12 0,12 C 0,12 9,3 9,-3 C 9,-8 5,-12 0,-12 Z"
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth="1"
        />
        <circle cx="0" cy="-3" r="3" fill="#FFFFFF" />
      </g>

      {/* Central Georgia Pin (Macon area) */}
      <g transform="translate(145, 110)">
        <ellipse cx="0" cy="15" rx="6" ry="2" fill="#EF4444" opacity="0.3" />
        <path
          d="M 0,-12 C -5,-12 -9,-8 -9,-3 C -9,3 0,12 0,12 C 0,12 9,3 9,-3 C 9,-8 5,-12 0,-12 Z"
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth="1"
        />
        <circle cx="0" cy="-3" r="3" fill="#FFFFFF" />
      </g>

      {/* Southern Georgia Pin (Savannah/Southern region) */}
      <g transform="translate(195, 150)">
        <ellipse cx="0" cy="15" rx="6" ry="2" fill="#EF4444" opacity="0.3" />
        <path
          d="M 0,-12 C -5,-12 -9,-8 -9,-3 C -9,3 0,12 0,12 C 0,12 9,3 9,-3 C 9,-8 5,-12 0,-12 Z"
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth="1"
        />
        <circle cx="0" cy="-3" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
