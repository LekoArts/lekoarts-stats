import React from 'react'
import { css } from 'astroturf'

const styles = css`
  .slice {
    background: var(--color-white);
    box-shadow: var(--shadow-md);
    font-size: 16px;
    border-radius: var(--radii);
  }
  @media screen and (max-width: 900px) {
    .slice {
      font-size: 14px;
    }
  }
  .header {
    font-weight: 600;
    color: var(--color-black);
    border-bottom: 1px solid var(--color-gray-100);
  }
  .header,
  .content {
    padding: 1rem;
  }
  .point {
    display: flex;
    flex-direction: row;
    margin: 0.1rem 0;
    justify-content: space-between;
    align-items: center;
  }
  .yFormatted {
    margin-left: 0.5rem;
    font-size: 14px;
    padding: 0.1rem 0.25rem;
    font-weight: 600;
    color: var(--color-white);
    border-radius: var(--radii-sm);
  }
`

export const commonProperties = {
  margin: {
    top: 20,
    right: 5,
    bottom: 70,
    left: 40,
  },
  animate: true,
  enableSlices: 'x',
}

export const sliceTooltip = (slice) => {
  return (
    <div className={styles.slice}>
      <div className={styles.header}>Date: {slice.points[0].data.xFormatted.replace(/"/g, '')}</div>
      <div className={styles.content}>
        {slice.points.map((point) => (
          <div key={point.id} className={styles.point}>
            <div>{point.serieId}</div>
            <div style={{ backgroundColor: point.serieColor }} className={styles.yFormatted}>
              {point.data.yFormatted}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
