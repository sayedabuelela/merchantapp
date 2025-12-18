import Reactotron, { networking } from 'reactotron-react-native'

if (__DEV__) {
    Reactotron
        .configure({
            name: 'Kashier Merchant App',
        })
        .useReactNative({
            networking: {
                ignoreContentTypes: /^(image)\/.*$/i,
                ignoreUrls: /\/(logs|symbolicate)$/,
            },
        })
        .use(networking())
        .connect()

    Reactotron.clear()
}

export default Reactotron