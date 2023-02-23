const path = require('path')

const config = {
    entry: {
        newtab: './src/newtab.js',
        // backgound: './src/background.js',
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'app/js'),
    },
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map'
    }

    return config
}
