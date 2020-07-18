import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { commonProperties, sliceTooltip } from '../utils/nivo'

const Line = ({ data, yScaleMin = 0, yScaleMax = 'auto' }) => {
  return (
    <ResponsiveLine
      {...commonProperties}
      data={data}
      xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
      xFormat="time:%Y-%m-%d"
      yScale={{ type: 'linear', min: yScaleMin, max: yScaleMax, stacked: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: '%m/%d/%y',
        tickValues: 4,
      }}
      axisLeft={{
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 0,
      }}
      sliceTooltip={({ slice }) => sliceTooltip(slice)}
      colors={{ scheme: 'category10' }}
      pointSize={4}
      pointColor={{ from: 'color' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      enableCrosshair={true}
      crossHairType="x"
    />
  )
}

export default Line
