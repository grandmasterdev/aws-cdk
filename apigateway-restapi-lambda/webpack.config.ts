import { Configuration } from 'webpack';
import * as path from 'path';

const config: Configuration = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts','.tsx','.js','.jsx','.json']
    },
    externals: [
        "aws-sdk"
    ]
}

export default config;