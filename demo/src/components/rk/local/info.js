import {PixelRatio} from 'react-native';

export const PullStates = {
    PULLING: 'pulling',
    PULL_OK: 'pullok',
    PULL_RELEASE: 'pullrelease'
}

export const pulling = "下拉刷新..."
export const pullok = "松开刷新..."
export const pullrelease = "正在刷新数据..."

export const defaultDuration = 300
export const defaultTopIndicatorHeight = 50; //顶部刷新指示器的高度
export const isDownGesture = (x, y) => {return y > 0 && (y > Math.abs(x))}
export const dip2px = (dpValue) => {return dpValue * PixelRatio.get()}
export const px2dip = (pxValue) => {return pxValue / PixelRatio.get()}

