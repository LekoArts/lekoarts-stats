import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { commonProperties, sliceTooltip } from '../utils/nivo'

const Line = ({ data, yScaleMin = 0, yScaleMax = 'auto' }) => {
  return (
    <ResponsiveLine
      {...commonProperties}
      data={data}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: yScaleMin, max: yScaleMax, stacked: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -90,
      }}
      axisLeft={{
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 0,
      }}
      sliceTooltip={({ slice }) => sliceTooltip(slice)}
      colors={{ scheme: 'category10' }}
      pointSize={5}
      pointColor={{ from: 'color' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      enableCrosshair={true}
      crossHairType="x"
    />
  )
}

export default Line
