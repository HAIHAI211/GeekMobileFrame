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


export default class Pullable extends PullRoot {

    constructor(props) {
        super(props)
        this.animState = index.AnimStateEnum.ANIM_OK
        this.refreshing = false
        this.topIndicatorHeight = this.props.topIndicatorHeight ?
            this.props.topIndicatorHeight : index.defaultTopIndicatorHeight
        this.defaultXY = {x: 0, y: this.topIndicatorHeight * -1}
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
        // console.warn(props.refreshing)
        this.state = {
            ...this.state,
            props,
            pullPan: new Animated.ValueXY(this.defaultXY),
            atTop: true,
            height: 0,
            width: 0,
            log: '呵呵'
        }
    }

    render() {
        return (
            <View style={{flex: 1, zIndex: -999}} {...this.panResponder.panHandlers} onLayout={this.onLayout}>
                {this.props.isContentScroll ?
                    <View pointerEvents='box-none'>
                        <Animated.View style={[this.state.pullPan.getLayout()]}>
                            {this.renderTopIndicator()}
                            {this.renderScrollContainer()}
                        </Animated.View>
                    </View> :

                    <View>
                        {this.renderScrollContainer()}
                        <View pointerEvents='box-none'
                              style={{position: 'absolute', left: 0, right: 0, top: 0}}>
                            <Animated.View style={[this.state.pullPan.getLayout()]}>
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

    componentDidMount = async () => {
        if (this.props.refreshing !== this.refreshing) {
            this._setStateRefreshing(this.props.refreshing)
        }
    }

    componentDidUpdate = async (prevProps, prevState) =>  {
        if (this.props.refreshing !== this.refreshing) {
            this._setStateRefreshing(this.props.refreshing)
        }
    }

    // 先移动y，y达到要求（true为flagY,false为defaultY），才能修改refreshing
    _setStateRefreshing = async (nextRefreshing) => {
        await this._refreshAnim(nextRefreshing)
        if (this.animState.code === index.AnimStateEnum.ANIM_OK.code) { // y符合刷新要求
            this.refreshing = nextRefreshing
            this.props.onRefresh && this.props.onRefresh(nextRefreshing)
        }
    }


    //下拉的时候根据高度进行对应的操作
    setPullState = (moveHeight) => {
        let topHeight = this.topIndicatorHeight
        if (moveHeight > 0 && moveHeight < topHeight) { //此时是下拉没有到位的状态
            this.setState({
                pullState: index.PullStateEnum.PULLING
            })
        } else if (moveHeight >= topHeight) { //下拉刷新到位
            this.setState({
                pullState: index.PullStateEnum.PULL_OK
            })
        } else { //下拉刷新释放,此时返回的值为-1
            this.setState({
                pullState: index.PullStateEnum.PULL_RELEASE
            })
        }
        this.props.onPullStateChange && this.props.onPullStateChange(this.state.pullState.code)
    }


    onShouldSetPanResponder = (e, gesture) => { // 顶部+手势向下+配置许可方可开启refresh
        let y = this.scroll._listRef._getScrollMetrics().offset
        //根据y的值来判断是否到达顶部
        this.setState({
            atTop: y <= 0
        })
        if (this.state.atTop && index.isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) {
            this.lastY = this.state.pullPan.y._value
            return true
        }
        return false
    }

    onPanResponderMove = (e, gesture) => {
        if (index.isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) { //下拉
            let dy = gesture.dy / 2
            this.state.pullPan.setValue({x: this.defaultXY.x, y: this.lastY + dy})
            this.setPullState(dy)
        }
    }

    onPanResponderRelease = async (e, gesture) => {
        let nextRefreshing = this.state.pullState.code === index.PullStateEnum.PULL_OK.code
        this._setStateRefreshing(nextRefreshing)
        this.setPullState(-1)
    }

    // 收起动画(重置刷新的操作)
    _folderAnim = () => {
        return new Promise((resolve, reject) => {
            Animated.timing(this.state.pullPan, {
                toValue: this.defaultXY,
                easing: Easing.linear,
                duration: this.duration
            }).start((finished) => {
                resolve({
                    finished
                })
            })
        })
    }


    // 展开动画
    _unfolderAnim = () => {
        return new Promise((resolve, reject) => {
            Animated.timing(this.state.pullPan, {
                toValue: {x: 0, y: 0},
                easing: Easing.linear,
                duration: this.duration
            }).start(({finished}) => {
                resolve({
                    finished
                })
            })
        })
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