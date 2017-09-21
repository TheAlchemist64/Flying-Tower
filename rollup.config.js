import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'src/app.js',
	format: 'iife',
	plugins: [ commonjs() ],
	dest: 'dist/bundle.js',
	sourceMap: true
}