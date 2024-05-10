import antfu from '@antfu/eslint-config'

export default antfu({
	formatters: true,
	astro: true,
	react: true,
	stylistic: {
		indent: 'tab',
		quotes: 'single',
	},
}, {
	rules: {
		'node/prefer-global/process': 'off',
	},
})
