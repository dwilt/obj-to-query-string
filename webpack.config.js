module.exports = {
    context: __dirname + "/src",
    entry: "./index",
    output: {
        path: __dirname,
        filename: "index.js",
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
