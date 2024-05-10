import { style } from '@vanilla-extract/css'
import { sprinkles } from './sprinkles.css'

export const header = style([
	sprinkles({
		fontWeight: 'semibold',
		color: {
			light: 'black',
			dark: 'white',
		},
		borderBottomColor: {
			light: 'gray-100',
			dark: 'gray-600',
		},
		padding: '0x',
	}),
	style({
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
	}),
])
