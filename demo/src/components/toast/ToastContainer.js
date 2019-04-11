import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    ViewPropTypes,
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Easing,
    Keyboard
} from 'react-native'

const TOAST_MAX_WIDTH = 0.8
const TOAST_ANIMATION_DURATION = 2000

const positions = {
    TOP: 20,
    BOTTOM: -20,
    CENTER: 0
}

const durations = {
    LONG: 3500,
    SHORT: 2000
}


// onPress => delay => show anim (TOAST_ANIMATION_DURATION) => duration (durations.SHORT) => hide
class ToastContainer extends Component {
    static displayName = 'ToastContainer' // ?

    static propTypes = {
        ...ViewPropTypes, // 已经继承了Component 这一步有何必要呢 ?
        containerStyle: ViewPropTypes.style,
        duration: PropTypes.number,
        visible: PropTypes.bool,
        position: PropTypes.number,
        animation: PropTypes.bool,
        shadow: PropTypes.bool,
        backgroundColor: PropTypes.string,
        opacity: PropTypes.number,
        shadowColor: PropTypes.string,
        textColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        delay: PropTypes.number,
        hideOnPress: PropTypes.bool,
        onPress: PropTypes.func,
        onHide: PropTypes.func,
        onHidden: PropTypes.func,
        onShow: PropTypes.func,
        onShown: PropTypes.func
    }

    static defaultProps = {
        visible: false,
        duration: durations.SHORT,
        animation: true,
        shadow: true,
        position: positions.BOTTOM,
        opacity: 0.8,
        delay: 0,
        hideOnPress: true
    }

    constructor (props) {
        super(props)
        console.log('constructor', 'ToastContainer')
        const window = Dimensions.get('window')
        this.state = {
            visible: this.props.visible,
            opacity: new Animated.Value(0),
            windowWidth: window.width,
            windowHeight: window.height,
            keyboardScreenY: window.height // 默认键盘收起
        }
    }

    // 设置对window、键盘的事件监听
    componentWillMount () {
        console.log('componentWillMount', 'ToastContainer')
        Dimensions.addEventListener('change', this._windowChanged)
        Keyboard.addListener('keyboardDidChangeFrame', this._keyboardDidChangeFrame)
    }

    componentDidMount = () => {
        console.log('componentDidMount', 'ToastContainer', 'this.state.visible=' + this.state.visible)
        if (this.state.visible) {
            this._showTimer = setTimeout(() => this._show(), this.props.delay)
        }
    }

    // watch prop状态 ? 为什么不是在componentDidUpdate
    componentWillReceiveProps = nextProps => {
        console.log('componentWillReceiveProps', 'ToastContainer', nextProps.visible, this.props.visible)
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                clearTimeout(this._showTimer)
                clearTimeout(this._hideTimer)
                this._showTimer = setTimeout(() => this._show(), this.props.delay)
            } else {
                this._hide()
            }
            this.setState({
                visible: nextProps.visible
            })
        }
    }

    // computed 根据windowHeight和键盘Y更新键盘高度
    componentWillUpdate () {
        const {windowHeight, keyboardScreenY} = this.state
        this._keyboardHeight = Math.max(windowHeight - keyboardScreenY, 0)
        console.log('componentWillUpdate', this._keyboardHeight)
    }

    //移除监听、定时器
    componentWillUnmount = () => {
        console.log('componentWillUnmount', 'ToastContainer')
        Dimensions.removeEventListener('change', this._windowChanged)
        Keyboard.removeListener('keyboardDidChangeFrame', this._keyboardDidChangeFrame)
        this._hide()
    }

    _animating = false
    _root = null
    _hideTimer = null
    _showTimer = null
    _keyboardHeight = 0


    _windowChanged = ({window}) => {
        this.setState({
            windowWidth: window.width,
            windowHeight: window.height
        })
    }

    _keyboardDidChangeFrame = ({endCoordinates}) => {
        this.setState({
            keyboardScreenY: endCoordinates.screenY
        })
    }

    // visible = true的必要条件
    _show = async () => {
        console.log('_show', this.props.duration)
        clearTimeout(this._showTimer) // 其实没必要,参考126 、127行
        if (!this._animating) { // 如果没有正在执行动画(即不管是show还是hide,必要条件都已经满足)
            clearTimeout(this._hideTimer) // ? 也不明白为何如此
            this._root.setNativeProps({ // 让toast可以响应点击事件
                pointerEvents: 'auto'
            })
            this.props.onShow && this.props.onShow(this.props.siblilngManager) // ?
            this._animating = true
            console.log('show animating before', this._animating)
            this._animating = !await this._anim(true)
            console.log('show animating after', this._animating)
            if (!this._animating) { // 动画结束
                this.props.onShown && this.props.onShown(this.props.siblingManager)
                if (this.props.duration > 0) {
                    this._hideTimer = setTimeout(() => this._hide(), this.props.duration)
                }
            }
        }
        // 没有针对动画执行中的逻辑处理,将问题简单化了很多，因为不会出现【状态失衡】
    }

    _hide = async () => {
        console.log('_hide')
        clearTimeout(this._showTimer)
        clearTimeout(this._hideTimer)
        if (!this._animating) {
            this._root.setNativeProps({
                pointerEvents: 'none'
            })
            this.props.onHide && this.props.onHide(this.props.siblingManager)
            this._animating = true
            console.log('hide animating before', this._animating)
            this._animating = !await this._anim(false)
            console.log('hide animating after', this._animating)
            if (!this._animating) {
                this.props.onHidden && this.props.onHidden(this.props.siblingManager)
            }
        }
    }


    _anim = (isShow) => {
        return new Promise((resolve, reject) => {
            Animated.timing(this.state.opacity, {
                toValue: isShow ? this.props.opacity : 0,
                duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
                easing: isShow ? Easing.out(Easing.ease) : Easing.in(Easing.ease)
            }).start(({finished}) => {
                resolve(finished)
            })
        })
    }

    _onPress = () => {
        typeof this.props.onPress === 'function' && this.props.onPress()
        this.props.hideOnPress && this._hide()
    }

    render () {
        console.log('render', 'ToastContainer')
        let {props} = this
        const {windowWidth} = this.state
        let position = props.position ? {
            [props.position < 0 ? 'bottom' : 'top'] : props.position < 0 ? (this._keyboardHeight - props.position) : props.position
        } : {
            top: 0,
            bottom: this._keyboardHeight
        }
        let defaultStyle = [styles.defaultStyle, position]
        let containerStyle = [
            styles.containerStyle,
            { marginHorizontal: windowWidth * ((1 - TOAST_MAX_WIDTH) / 2) },
            props.containerStyle,
            props.backgroundColor && {backgroundColor: props.backgroundColor},
            {
                opacity: this.state.opacity
            },
            props.shadow && styles.shadowStyle,
            props.shadowColor && {shadowColor: props.shadowColor}
        ]
        let textStyle = [
            styles.textStyle,
            props.textStyle,
            props.textColor && {color: props.textColor}
        ]
        return (this.state.visible || this._animating) ? ( // v-if
            <View style={defaultStyle} pointerEvents="box-none">
                <TouchableWithoutFeedback onPress={this._onPress}>
                    <Animated.View style={containerStyle} pointerEvents="none" ref={ele => this._root = ele}>
                        <Text style={textStyle}>
                            {this.props.children}
                        </Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        ) : null
    }

}

const styles = StyleSheet.create({
    defaultStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerStyle: {
        padding: 10,
        backgroundColor: '#000',
        opacity: 0.8,
        borderRadius: 5
    },
    shadowStyle: {
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10 // android中提高权重
    },
    textStyle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    }
})

export default ToastContainer
export {
    positions,
    durations
}