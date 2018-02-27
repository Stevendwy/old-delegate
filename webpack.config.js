let isLogin = false
// isLogin = true

let entry = isLogin ? `${__dirname}/js/index.login.js` : `${__dirname}/js/index.js`
let path = `${__dirname}/js`
let filename = isLogin ? 'delegate-login.js' : 'delegate.js'

module.exports = {
    entry,
    output: {
        path,
        filename
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|gif|jpe?g)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: '../img/[name].[ext]'
                }
            },
            // {
            //     test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            //     loader: 'url-loader',
            //     query: {
            //         limit: 100000
            //     }
            // },
            // {
            //     test: /\.css$/,
            //     loader: 'style-loader!css-loader'
            // },
        ]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
//    stats: 'errors-only'
}
