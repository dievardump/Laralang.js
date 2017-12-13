// rollup.config.js
import babel from 'rollup-plugin-babel';

export default {
    name: 'laralang',
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd'
    },
    plugins: [
        babel()
    ]
}