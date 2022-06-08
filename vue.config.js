module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        https: false,
        open: true,
        hotOnly: true,
        proxy: 'http://localhost:8000'
    },
    // test: /\.md$/,
    // use: [{
    //         loader: "html-loader"
    //     },
    //     {
    //         loader: "markdown-loader",
    //         options: {}
    //     }
    // ],
    // publicPath: './src/assets/video',
    chainWebpack: (config) => {
        config.module.rule('md')
            .test(/\.md/)
            .use('html-loader')
            // .use('markdown-loader')
            // .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true
            })
    },
}