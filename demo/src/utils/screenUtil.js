import {Dimensions} from 'react-native'

const device = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    scale: Dimensions.get('window').scale
}

const rpxScale = device.width / 750

function rpx(px) { // 750rpx等于屏幕宽度
    return px * rpxScale
}

export {device, rpx}