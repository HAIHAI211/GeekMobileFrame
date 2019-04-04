import {PixelRatio} from 'react-native'

export const PullStateEnum = {
    PULLING: {
        code: 'pulling',
        msg: '下拉刷新中...'
    },
    PULL_OK: {
        code: 'pullok',
        msg: '松开刷新...'
    },
    PULL_RELEASE: {
        code: 'pullrelease',
        msg: '正在刷新数据...'
    }
}

export const AnimStateEnum = {
    ANIMING: {
        code: 'animing',
        msg: '正在动画'
    },
    ANIM_OK: {
        code: 'animok',
        msg: '动画正常结束'
    },
    ANIM_NOT_OK: {
        code: 'animnotok',
        msg: '动画未正常结束' // stop()或者被手势等打断
    }
}

export const defaultDuration = 300
export const defaultTopIndicatorHeight = 50 //顶部刷新指示器的高度
export const isDownGesture = (x, y) => {return y > 0 && (y > Math.abs(x))}
export const dip2px = (dpValue) => {return dpValue * PixelRatio.get()}
export const px2dip = (pxValue) => {return pxValue / PixelRatio.get()}

