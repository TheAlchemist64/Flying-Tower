import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'assets/js/app.js',
	format: 'iife',
	plugins: [ commonjs() ],
	dest: 'dist/bundle.js'
}