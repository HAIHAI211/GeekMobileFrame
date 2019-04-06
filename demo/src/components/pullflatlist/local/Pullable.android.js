'use strict';

import React from 'react'
import {View, Text, PanResponder, Animated, Easing, FlatList} from 'react-native'
import * as index from './info'
import PullRoot from './PullRoot'

/**
 @description 当组件的状态内外都需要修改时，该如何设计？
    答：1、如果是vue，可以用watch来实现对prop和state的监听进而实现prop和state的一致
        2、如果是react， 依旧可以汲取vue的watch思想，利用props改变必会触发componentDidUpdate来实现对props的监听;对于state的监听，则
 采用自行封装set方法，在set方法内调用state的watch方法来实现。
        3、setState必触发子组件的shouldUpdateComponent

 @author 孙正
 * */

// 收起动画(重置刷新的操作)

const xyAnim = (startXY, targetXY, duration) => {
    return new Promise((resolve, reject) => {
        Animated.timing(startXY, {
            toValue: targetXY,
            easing: Easing.linear,
            duration
        }).start((finished) => {
            resolve(finished)
        })
    })
}

// 判断是否顶部
const isAtTop = (flatlist) => {
    return flatlist._listRef._getScrollMetrics().offset <= 0
}


export default class Pullable extends PullRoot {

    constructor(props) {
        super(props)
        this.animType = index.AnimType.STATE_SWITCH
        this.animState = index.AnimStateEnum.ANIM_OK
        this.refreshing = false
        this.pullState = index.PullStateEnum.PULL_RELEASE
        this.moveCount = 0 // 统计onPanResponderMove的调用次数
        this.topIndicatorHeight = this.props.topIndicatorHeight ?
            this.props.topIndicatorHeight : index.defaultTopIndicatorHeight
        this.defaultXY = {x: 0, y: this.topIndicatorHeight * -1}
        this.endXY = {x: 0, y: 0}
        this.duration = this.props.duration ? this.props.duration : index.defaultDuration
        this.panResponder = PanResponder.create({
            // onStartShouldSetPanResponder: (e, g) => {return this.onShouldSetPanResponder(e, g, 'startShould')},
            // onStartShouldSetPanResponderCapture: (e, g) => {return this.onShouldSetPanResponder(e, g, 'startShouldCapture')},
            onMoveShouldSetPanResponder: (e, g) => {return this.onShouldSetPanResponder(e, g, 'moveShould')},
            onMoveShouldSetPanResponderCapture: (e, g) => {return this.onShouldSetPanResponder(e, g, 'moveShouldCapture')},

            onPanResponderTerminationRequest: (evt, gestureState) => false, //这个很重要，这边不放权

            onPanResponderGrant: this.onPanResponderStart,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderEnd,
            onPanResponderTerminate: this.onPanResponderEnd,
        })
        this.state = {
            ...this.state,
            props,
            xy: new Animated.ValueXY(this.defaultXY),
            height: 0,
            width: 0
        }
    }

    render() {
        console.log('渲染')
        return (
            <View style={{flex: 1, zIndex: -999}} {...this.panResponder.panHandlers} onLayout={this.onLayout}>
                {this.props.isContentScroll ?
                    <View pointerEvents='box-none'>
                        <Animated.View style={[{transform: this.state.xy.getTranslateTransform()}]}>
                            {this.renderTopIndicator()}
                            {this.renderScrollContainer()}
                        </Animated.View>
                    </View> :

                    <View>
                        {this.renderScrollContainer()}
                        <View pointerEvents='box-none'
                              style={{position: 'absolute', left: 0, right: 0, top: 0}}>
                            <Animated.View style={[this.state.xy.getLayout()]}>
                                {this.renderTopIndicator()}
                            </Animated.View>
                        </View>
                    </View>}
            </View>
        )
    }

    renderScrollContainer = () => {
        return (
            <View
                ref={(c) => {this.scrollContainer = c}}
                style={{width: this.state.width, height: this.state.height}}>
                {this.getScrollable()}
            </View>
        )
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        console.log('shouldComponentUpdate', `nextPropRefreshing=${nextProps.refreshing}`, `nowPropRefreshing=${this.props.refreshing}`)

        if (nextProps.data !== this.props.data) {
            console.log('aaa')
            return true
        }
        if (nextProps.refreshing !== this.refreshing) { //外部refreshing和内部refreshing不一致时必须更新
            console.log('bbb')
            return true
        }
        console.log('ccc')
        return false

    }

    // prop => refreshing change
    componentDidMount = async () => {
        this._setRefreshing(this.props.refreshing, 'DidMount')
    }

    componentDidUpdate = async (prevProps, prevState) =>  { // props或者state改变会触发
        this._setRefreshing(this.props.refreshing, 'DidUpdate')
    }


    // pull => refreshing change
    onShouldSetPanResponder = (e, gesture, byWho) => { // 顶部+手势向下+配置许可方可开启refresh

        if (isAtTop(this.scroll) && index.isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) {
            console.log('判断', byWho, true, gesture.dx.toFixed(5), gesture.dy.toFixed(5))
            return true
        }
        console.log('判断', byWho, false, gesture.dx.toFixed(5), gesture.dy.toFixed(5))
        return false
    }

    onPanResponderStart = (e, gesture) => {
        console.log('--开始--', gesture.dy.toFixed(5))
        this.startY = this._getY()
        this.moveCount = 0
    }


    onPanResponderMove = (e, gesture) => {
        this.moveCount += 1
        let dy = gesture.dy / 2
        console.log('--移动--', gesture.dy.toFixed(5), gesture.vy)
        this.state.xy.setValue({x: this.defaultXY.x, y: this.startY + dy})
        this._setPullState(dy)
        // if (index.isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) { //下拉
        //     let dy = gesture.dy
        //     this.state.xy.setValue({x: this.defaultXY.x, y: this.startY + dy})
        //     this._setPullState(dy)
        // }
    }

    // 安卓机在滑动过快时会出现gesture.dy明显小于实际的触摸距离
    // 经过反复测试，发现在滑动过快时具有如下特征：
    // 1、onPanResponderMove的调用次数只有1-3次
    // 2、onPanResponderRelease的速度明显较快，大致在0.2及以上，而正常滑动时速度在0.0x
    // 为了修复这个安卓bug，我们在松开手指时，判断是否刷新的条件除了距离达标，还要加上一个[或条件]即滑动过快时也认为可以刷新
    onPanResponderEnd = async (e, gesture) => {
        console.log('--放手--', gesture.dy.toFixed(5), gesture.vy)
        // 根据业务逻辑确定nextRefreshing的值
        let nowRefreshing = this.refreshing
        let nextRefreshing = false

        if (!nowRefreshing) { // 不允许组件内部在refreshing为true时改变其为false
            if (this.pullState.code === index.PullStateEnum.PULL_OK.code ||
                (gesture.vy >= 0.2 && this.moveCount <= 3)) {
                nextRefreshing = true
            }
        } else {
            nextRefreshing = true
        }

        // if (this.pullState.code === index.PullStateEnum.PULL_OK.code ||
        //     (gesture.vy >= 0.2 && this.moveCount <= 3)) {
        //     nextRefreshing = true
        // }




        // //  true => false 恢复true的必要条件(业务逻辑不允许)
        // false => true 正常调用setRefreshing即可
        // true => true 恢复true的必要条件
        // false => false 恢复false的必要条件
        if (nextRefreshing !== nowRefreshing) {
            console.log('内部决定：状态切换', `${nowRefreshing} => ${nextRefreshing}`)
            this._setRefreshing(nextRefreshing, 'release')
        } else {
            // 需要判断状态切换动画是否在运行，如果有状态切换动画正在执行则不执行状态回调动画
            if (this.animType.code === index.AnimType.STATE_SWITCH.code
                && this.animState.code === index.AnimStateEnum.ANIMING) {
                console.log('内部决定：因为正处于状态切换动画，故取消本次状态回调', nowRefreshing)
            } else {
                this.animType = index.AnimType.STATE_BACK
                this._refreshAnim(nowRefreshing)
            }
        }
        this._setPullState(-1)

    }

    _setRefreshing = async (nextRefreshing, byWho) => {
        console.log(`${byWho} setRefreshing`, `${this.refreshing}=>${nextRefreshing}`)
        if (this.refreshing === nextRefreshing) return // 必须放第一句

        // 满足必要条件(调整y)
        let isConfirm = await this._confirmRefreshingNecessaryCondition(nextRefreshing)
        // console.warn(`${byWho}: ${this.refreshing}=>${nextRefreshing},y调整到位${isConfirm}`)
        if (!isConfirm) return

        // 修改赋值
        this.refreshing = nextRefreshing
        // onRefresh只有在false=>true时才需要通知外界,否则会重复渲染
        // 重复渲染的原因就是refreshing在外界可能是绑定在一个state中的
        // setState() 就算值前后不变，但如果有其他state改变，也会导致重新渲染
        // 外界的onRefresh一但刷新后请求的数据改变，无论refreshing是否改变，必定会导致本组件渲染
        nextRefreshing && this.props.onRefresh && this.props.onRefresh(nextRefreshing)
    }






    // 定义refreshing的必要条件: y必须满足要求
    _getYByRefreshing (refreshing) {
        return refreshing ? this.endXY.y : (this.defaultXY.y)
    }

    _getY () {
        return this.state.xy.y._value
    }

    // 满足refreshing对应的必要条件
    _confirmRefreshingNecessaryCondition = async (refreshing) => {
        if (this._getY() === this._getYByRefreshing(refreshing)) return true
        this.animType = index.AnimType.STATE_SWITCH
        await this._refreshAnim(refreshing)
        return this._getY() === this._getYByRefreshing(refreshing) &&
            this.animState.code === index.AnimStateEnum.ANIM_OK.code
    }


    //下拉的时候根据高度进行对应的操作
    _setPullState = (moveHeight) => {
        const {PULLING,PULL_OK, PULL_RELEASE} = index.PullStateEnum
        let pullState = PULL_RELEASE
        if (moveHeight > 0 && moveHeight < this.topIndicatorHeight) {
            pullState = PULLING
        } else if (moveHeight >= this.topIndicatorHeight) {
            pullState = PULL_OK
        }
        this.pullState = pullState
        this.props.onPullStateChange && this.props.onPullStateChange(this.pullState.code)
    }


    // 收起动画(重置刷新的操作)
    _folderAnim = () => {
        return xyAnim(this.state.xy, this.defaultXY, this.duration)
    }


    // 展开动画
    _unfolderAnim = () => {
        return xyAnim(this.state.xy, this.endXY, this.duration)
    }


    _refreshAnim = async (nextRefreshing) => {
        this.animState = index.AnimStateEnum.ANIMING
        try {
            let animFinished = nextRefreshing ? await this._unfolderAnim() : await this._folderAnim()
            this.animState = animFinished.finished ? index.AnimStateEnum.ANIM_OK : index.AnimStateEnum.ANIM_NOT_OK
            console.log('动画执行结果', animFinished)
            return this.animState
        } catch (e) {
            this.animState = index.AnimStateEnum.ANIM_ERROR
            console.log('【动画异常】', e)
        }

    }


    onLayout = (e) => {
        let {width:newWidth, height:newHeight} = e.nativeEvent.layout
        if (this.state.width !== newWidth || this.state.height !== newHeight) {
            this.scrollContainer && this.scrollContainer.setNativeProps({
                style: {
                    width: newWidth,
                    height: newHeight
                }
            })
            this.state.width = newWidth
            this.state.height = newHeight
        }
    }

}
