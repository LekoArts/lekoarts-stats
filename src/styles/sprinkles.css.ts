import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { breakpoints, vars } from './vars.css'

const staticStyles = defineProperties({
	properties: {
		fontFamily: vars.fontFamily,
		boxShadow: vars.shadow,
		borderRadius: vars.radii,
	},
})

const responsiveStyles = defineProperties({
	conditions: {
		mobile: {},
		tablet: { '@media': `screen and (min-width: ${breakpoints.tablet})` },
		desktop: { '@media': `screen and (min-width: ${breakpoints.desktop})` },
	},
	defaultCondition: 'mobile',
	properties: {
		display: ['none', 'flex', 'grid'],
		flexDirection: ['row', 'column'],
		justifyContent: ['space-between', 'flex-start', 'flex-end'],
		alignItems: ['center', 'flex-start', 'flex-end'],
		paddingTop: vars.space,
		paddingBottom: vars.space,
		paddingLeft: vars.space,
		paddingRight: vars.space,
		marginTop: vars.space,
		marginBottom: vars.space,
		marginLeft: vars.space,
		marginRight: vars.space,
		fontSize: vars.fontSize,
		fontWeight: vars.fontWeight,
	},
	shorthands: {
		padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
		paddingX: ['paddingLeft', 'paddingRight'],
		paddingY: ['paddingTop', 'paddingBottom'],
		margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
		marginX: ['marginLeft', 'marginRight'],
		marginY: ['marginTop', 'marginBottom'],
	},
})

const colorModeStyles = defineProperties({
	conditions: {
		light: {},
		dark: { selector: '[data-theme="dark"] &' },
	},
	defaultCondition: 'light',
	properties: {
		color: vars.color,
		background: vars.color,
		borderTopColor: vars.color,
		borderBottomColor: vars.color,
	},
})

export const sprinkles = createSprinkles(responsiveStyles, colorModeStyles, staticStyles)

export type Sprinkles = Parameters<typeof sprinkles>[0]
