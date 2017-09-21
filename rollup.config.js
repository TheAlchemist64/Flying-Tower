import commonjs from 'rollup-plugin-commonjs';
import localResolve from 'rollup-plugin-local-resolve';

export default {
	entry: 'src/app.js',
	format: 'iife',
	plugins: [ localResolve(), commonjs() ],
	dest: 'dist/bundle.js',
	sourceMap: true
}