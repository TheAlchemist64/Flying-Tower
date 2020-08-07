import commonjs from 'rollup-plugin-commonjs';

export default {
	input: 'src/app.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife',
		sourcemap: true
	}
	plugins: [ commonjs() ]
}