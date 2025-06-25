import type { LineSeries } from '@nivo/line'
import { ResponsiveLine } from '@nivo/line'
import { nivoCommonProperties } from '@utils/constants'
import { sliceTooltip } from '@utils/nivo'
import * as React from 'react'

interface ILineProps {
	data: LineSeries[]
	yScaleMin?: number | 'auto'
	yScaleMax?: number | 'auto'
}

function Line({ data, yScaleMin = 0, yScaleMax = 'auto' }: ILineProps) {
	return (
		<ResponsiveLine
			{...nivoCommonProperties}
			data={data}
			curve="linear"
			lineWidth={2}
			enablePoints={false}
			theme={{
				text: { fill: 'var(--chart-text-color, #333333)' },
				crosshair: { line: { stroke: 'var(--chart-crosshair-color, #333333)' } },
				axis: {
					domain: { line: { stroke: 'var(--chart-axis-color, #777777)' } },
					ticks: { line: { stroke: 'var(--chart-axis-color, #777777)' } },
				},
				grid: { line: { stroke: 'var(--chart-grid-color, #dddddd)' } },
			}}
			xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
			xFormat="time:%Y-%m-%d"
			yScale={{ type: 'linear', min: yScaleMin, max: yScaleMax, stacked: false }}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				format: '%Y-%m-%d',
				tickValues: 'every 6 months',
			}}
			axisLeft={{
				tickSize: 10,
				tickPadding: 5,
				tickRotation: 0,
			}}
			sliceTooltip={({ slice }) => sliceTooltip(slice)}
			colors={{ scheme: 'category10' }}
			enableCrosshair
			crosshairType="x"
		/>
	)
}

export default Line
