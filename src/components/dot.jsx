import React from "react"

const Dot = ({ cx, cy, active = false, color, belongsToActiveLine }) => {
  if (!cx || !cy) {
    return null
  }

  const ActiveDotRadius = 10
  const ActiveDotDiam = 20
  const ActiveDotInnerRadius = 5

  return (
    <svg
      x={cx - ActiveDotRadius}
      y={cy - ActiveDotRadius}
      width={ActiveDotDiam}
      height={ActiveDotDiam}
      viewBox={`0 0 ${ActiveDotDiam} ${ActiveDotDiam}`}
    >
      {active && (
        <circle
          cx={ActiveDotRadius}
          cy={ActiveDotRadius}
          r={ActiveDotRadius}
          fill={color}
          opacity="0.3"
        />
      )}
      <circle
        cx={ActiveDotRadius}
        cy={ActiveDotRadius}
        r={ActiveDotInnerRadius}
        fill={color}
      />
    </svg>
  )
}

export default Dot
