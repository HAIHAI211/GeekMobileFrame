import React from 'react'
import {StyleSheet, View, Text, Animated, Easing, PanResponder} from 'react-native'
import {CommonStyle} from '../../assets/styles'
import {rpx} from '../../utils/screenUtil'

const isXGesture = (x, y) => {
  return Math.abs(x) >= Math.abs(y)
}

const AnimType = {
  STATUS_UPDATE: 'STATUS_UPDATE',
  STATUS_BACK: 'STATUS_BACK'
}

const AnimState = {
  ANIM_OK: 'ANIM_OK',
  ANIM_NOT_OK: 'ANIM_NOT_OK',
  ANIMING: 'ANIMING',
  ANIM_ERROR: 'ANIM_ERROR'
}


class Swiper extends React.PureComponent {

  constructor (props) {
    super(props)
    this.data = Swiper._modifyData(props.data)
    this.minIndex = this.data[0].index
    this.maxIndex = this.data[this.data.length - 1].index
    this.rightToLeft = true
    this.width = rpx(750)
    this.height = rpx(400)
    this.offsetX = 0
    this.anim = null
    this.index = 0
    this.animType = undefined
    this.animState = undefined
    this.animId = 0
    this.timer = null
    this.panResponder = PanResponder.create({
      // 申请授权
      onStartShouldSetPanResponder: this.onTouchShould,
      onStartShouldSetPanResponderCapture: this.onTouchShould,
      onMoveShouldSetPanResponder: this.onTouchShould,
      onMoveShouldSetPanResponderCapture: this.onTouchShould,

      // 授权成功
      onPanResponderGrant: this.onTouchStart,

      // 移动
      onPanResponderMove: this.onTouchMove,

      // 放手
      onPanResponderRelease: this.onTouchEnd,

      // 让权成为事实
      onPanResponderTerminate: this.onTouchEnd,

      // 是否让权
      onPanResponderTerminationRequest: () => false,

    })
    this.state = {
      pan: new Animated.ValueXY({x: this._getXYByStatus(this.index).x, y: 0})
    }
  }

  componentDidMount () {
    console.log('didMount')
    this.switchStatus(this._getNextStatus(), this.index)
  }

  componentWillUnmount () {
    console.log('unMount')
    this.clearTimer()
  }


  render () {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <Animated.View style={[styles.AnimatedContainer, {transform: this.state.pan.getTranslateTransform()}]}>
          {
            this.data.map((item, index) => {
              return this.props.renderItem(item, index)
            })
          }
        </Animated.View>
      </View>
    )
  }

  onTouchShould = (e, gesture) => {
    if (isXGesture(gesture.dx, gesture.dy)) {
      return true
    }
    return false
  }

  onTouchStart = (e, gesture) => {
    console.log('onTouchStart') // statusUpdateAniming || sleep
    this.clearTimer()
    this.clearAnim()
    this.offsetX = this.state.pan.x._value // 记录初始偏移量
  }

  onTouchMove = (e, gesture) => {
    console.log('onTouchMove')
    this.state.pan.setValue({x: gesture.dx + this.offsetX, y: 0})
  }

  onTouchEnd = (e, gesture) => {
    console.log('onTouchEnd')
    let newStatus = undefined
    if (Math.abs(gesture.dx) < this.width / 4 && Math.abs(gesture.vx) < 0.6) {
      newStatus = this.index
    } else {
      let rightToLeft = gesture.dx < 0
      newStatus = this._getNextStatus(rightToLeft)
    }
    this.switchStatus(newStatus, this.index)
  }



  // 状态切换
  switchStatus = async (newStatus, oldStatus) => {
    console.log(`切换状态${oldStatus} => ${newStatus}`)
    if (newStatus === oldStatus) {
      await this._statusAnim(AnimType.STATUS_BACK,newStatus)
    } else {
      let newStatusXY = this._getXYByStatus(newStatus)
      if (!this._checkCondition(newStatusXY.x)) { // 满足必要条件
        await this._statusAnim(AnimType.STATUS_UPDATE,newStatus)
      }
      if (this._checkCondition(newStatusXY.x)) {
        this.index = newStatus
      }
    }
    if (this.index === this.maxIndex || this.index === this.minIndex) {
      let lastIndex = this.index
      let realIndex = this.index === this.maxIndex ?
        this.data[1].index : this.data[this.data.length - 2].index
      this.state.pan.setValue({x: this._getXYByStatus(realIndex).x, y: 0})
      this.index = realIndex
      console.log(`瞬切状态${lastIndex} => ${realIndex}`)
    }
    // 设置定时任务前务必取消上一个定时器
    // 涉及到取消定时器，不要用promise封装setTimeout，因为取消的仅仅是sleep中的方法，sleep后面的方法依然会被执行
    this.clearTimer()
    this.timer = setTimeout(() => {
      this.switchStatus(this._getNextStatus(), this.index)
    }, 4000)
  }
  // 涉及到取消定时器，不要用promise封装setTimeout，因为取消的仅仅是sleep中的方法，sleep后面的方法依然会被执行
  // sleep = (delay = 4000) => {
  //   return new Promise((resolve, reject) => {
  //     let lastTimer = this.timer
  //     this.timer = setTimeout(() => {
  //       resolve()
  //     }, delay)
  //     console.log('--设置定时器', `${lastTimer} => ${this.timer}`)
  //   })
  // }

  clearTimer = () => {
    console.log('--取消定时器--', this.timer)
    this.timer && clearTimeout(this.timer)
    this.timer = null
  }

  clearAnim = () => {
    console.log('取消动画', this.anim)
    this.anim && this.anim.stop()
    this.anim = null
  }


  // 检查状态切换的必要条件是否完成
  _checkCondition = (newStatusX) => {
      return this.state.pan.x._value === newStatusX
  }

  baseAnim = (startXY, endXY, duration=300) => {
    return new Promise((resolve, reject) => {
      this.anim = Animated.timing(startXY, {
        toValue: endXY,
        easing: Easing.linear,
        duration
      })
      this.anim.start((finished) => {
        resolve(finished)
      })
    })
  }


  // statusUpdateAnim statusBackAnim
  _statusAnim = async (animType, newStatus) => {
    this.animId = this.animId + 1
    console.log(`动画 --开始${this.animId}`, animType)
    this.animType = animType
    this.animState = AnimState.ANIMING
    let startXY = this.state.pan
    let endXY = this._getXYByStatus(newStatus)
    const {finished} = await this.baseAnim(startXY, endXY)
    console.log(`动画 --结束${this.animId}`, animType, finished)
    this.animState = finished ? AnimState.ANIM_OK : AnimState.ANIM_NOT_OK
  }



  // 获取对应状态的坐标
  _getXYByStatus = (status) => {
    let y = 0
    // -1 => 0 , 0 => 1 * width * -1 , 1 => 2 * width * -1
    let x = (status + 1) * this.width * -1
    return {x, y}
  }

  _getNextStatus (rightToLeft = this.rightToLeft) {
    return Swiper.getNextStatus(this.index, this.minIndex, this.maxIndex, rightToLeft)
  }

  static getNextStatus (nowIndex, minIndex, maxIndex, rightToLeft = true) {
    if (rightToLeft) {
      return nowIndex < maxIndex ? nowIndex + 1 : minIndex
    }
    return nowIndex > minIndex ? nowIndex - 1 : maxIndex
  }

  static renderItem (itemData) {
    return (
      <View style={[styles.item, {backgroundColor: itemData.bgColor}]}>
        <Text>{itemData.index}</Text>
      </View>
    )
  }

  static _modifyData (data) {
    let result = [...data]
    let first = data[0]
    let last = data[data.length - 1]
    result.unshift(last)
    result.push(first)
    return result.map((item, index) => {
      return {
        ...item,
        index: index - 1
      }
    })
  }

}

const styles = StyleSheet.create({
  container: {
    width: rpx(750),
    height: rpx(400),
    overflow: 'hidden'
  },
  AnimatedContainer: {
    flexDirection: 'row'
  },
  item: {
    width: rpx(750),
    height: rpx(400),
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Swiper
