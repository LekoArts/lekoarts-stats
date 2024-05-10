import * as React from 'react'
import type { SliceTooltipProps } from '@nivo/line'
import { sprinkles } from '@styles/sprinkles.css'
import * as styles from '@styles/nivo.css'

export function sliceTooltip(slice: SliceTooltipProps['slice']) {
	return (
		<div
			className={sprinkles({
				background: {
					light: 'white',
					dark: 'gray-900',
				},
				boxShadow: 'md',
				fontSize: {
					mobile: 'sm',
					tablet: 'md',
				},
				borderRadius: 'md',
			})}
		>
			<div className={styles.header}>
				Date:
				{slice.points[0].data.xFormatted.toString().replace(/"/g, '')}
			</div>
			<div className={sprinkles({ padding: '0x' })}>
				{slice.points.map(point => (
					<div
						key={point.id}
						className={sprinkles({
							display: 'flex',
							flexDirection: 'row',
							marginX: 'none',
							marginY: 'point',
							justifyContent: 'space-between',
							alignItems: 'center',
						})}
					>
						<div>{point.serieId}</div>
						<div
							style={{ backgroundColor: point.serieColor }}
							className={sprinkles({
								fontWeight: 'semibold',
								color: {
									light: 'white',
								},
								borderRadius: 'sm',
								paddingX: '2x',
								marginLeft: '3x',
							})}
						>
							{point.data.yFormatted}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
