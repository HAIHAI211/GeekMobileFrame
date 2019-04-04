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
            resolve({
                finished
            })
        })
    })
}


export default class Pullable extends PullRoot {

    constructor(props) {
        super(props)
        this.animState = index.AnimStateEnum.ANIM_OK
        this.refreshing = false
        this.topIndicatorHeight = this.props.topIndicatorHeight ?
            this.props.topIndicatorHeight : index.defaultTopIndicatorHeight
        this.defaultXY = {x: 0, y: this.topIndicatorHeight * -1}
        this.endXY = {x: 0, y: 0}
        this.duration = this.props.duration ? this.props.duration : index.defaultDuration
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.onShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: this.onShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.onShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: this.onShouldSetPanResponder,

            onPanResponderTerminationRequest: (evt, gestureState) => false, //这个很重要，这边不放权

            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: this.onPanResponderRelease,
        })
        this.state = {
            ...this.state,
            props,
            xy: new Animated.ValueXY(this.defaultXY),
            atTop: true,
            height: 0,
            width: 0
        }
    }

    render() {
        return (
            <View style={{flex: 1, zIndex: -999}} {...this.panResponder.panHandlers} onLayout={this.onLayout}>
                {this.props.isContentScroll ?
                    <View pointerEvents='box-none'>
                        <Animated.View style={[this.state.xy.getLayout()]}>
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

    // prop => refreshing change
    componentDidMount = async () => {
        this._setRefreshing(this.props.refreshing, 'DidMount')
    }

    componentDidUpdate = async (prevProps, prevState) =>  { // props或者state改变会触发
        this._setRefreshing(this.props.refreshing, 'DidUpdate')
    }


    // pull => refreshing change
    onShouldSetPanResponder = (e, gesture) => { // 顶部+手势向下+配置许可方可开启refresh
        let y = this.scroll._listRef._getScrollMetrics().offset
        //根据y的值来判断是否到达顶部
        this.setState({
            atTop: y <= 0
        })
        if (this.state.atTop && index.isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) {
            this.startY = this._getY()
            return true
        }
        return false
    }

    onPanResponderMove = (e, gesture) => {
        if (index.isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) { //下拉
            let dy = gesture.dy / 2
            this.state.xy.setValue({x: this.defaultXY.x, y: this.startY + dy})
            this._setPullState(dy)
        }
    }

    onPanResponderRelease = async (e, gesture) => {
        let nextRefreshing = this.state.pullState.code === index.PullStateEnum.PULL_OK.code
        let nowRefreshing = this.refreshing

        // true => false 恢复true的必要条件(业务逻辑不允许)
        // false => true 正常调用setRefreshing即可
        // true => true 恢复true的必要条件
        // false => false 恢复false的必要条件

        if (nextRefreshing === nowRefreshing || nowRefreshing) {
            this._refreshAnim(nowRefreshing)
        } else {
            this._setRefreshing(nextRefreshing, 'release')
        }
        this._setPullState(-1)

    }

    _setRefreshing = async (nextRefreshing, byWho) => {
        if (this.refreshing === nextRefreshing) return // 必须放第一句

        // 满足必要条件(调整y)
        let isConfirm = await this._confirmRefreshingNecessaryCondition(nextRefreshing)
        // console.warn(`${byWho}: ${this.refreshing}=>${nextRefreshing},y调整到位${isConfirm}`)
        if (!isConfirm) return

        // 修改赋值
        this.refreshing = nextRefreshing
        this.props.onRefresh && this.props.onRefresh(nextRefreshing)
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
        this.setState({
            pullState
        })
        this.props.onPullStateChange && this.props.onPullStateChange(this.state.pullState.code)
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
        let animFinished = nextRefreshing ? await this._unfolderAnim() : await this._folderAnim()
        this.animState = animFinished ? index.AnimStateEnum.ANIM_OK : index.AnimStateEnum.ANIM_NOT_OK
        return this.animState
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