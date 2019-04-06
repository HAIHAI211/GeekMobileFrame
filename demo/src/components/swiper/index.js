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


class Swiper extends React.Component {

  constructor (props) {
    super(props)
    this.data = this._createData()
    this.width = rpx(750)
    this.height = rpx(400)
    this.offsetX = 0
    this.anim = null
    this.index = 0
    this.animType = undefined
    this.animState = undefined
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
      pan: new Animated.ValueXY({x: 0, y: 0})
    }
  }

  componentDidMount () {
    console.log('didMount')
    this.switchStatus(this._getNextStatus(this.index, this.data.length - 1), this.index)
  }

  componentWillUnmount () {
    this.clearTimer()
  }


  render () {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <Animated.View style={[styles.AnimatedContainer, {transform: this.state.pan.getTranslateTransform()}]}>
          {
            this.data.map((item, index) => {
              return this.renderItem(item)
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
    let oldStatus = this.index
    let newStatus = undefined
    if (Math.abs(gesture.dx) < this.width / 3) {
      newStatus = oldStatus
    } else {
      let rightToLeft = gesture.dx < 0
      newStatus = this._getNextStatus(oldStatus, this.data.length - 1, rightToLeft)
    }
    this.switchStatus(newStatus, oldStatus)
  }



  // 状态切换
  switchStatus = async (newStatus, oldStatus) => {
    console.log(`切换状态${oldStatus} => ${newStatus}`)
    if (newStatus === oldStatus) {
      await this._statusAnim(AnimType.STATUS_BACK,newStatus)
      await this.sleep()
      await this.switchStatus(this._getNextStatus(this.index,this.data.length - 1), this.index)
    } else {
      let newStatusXY = this._getXYByStatus(newStatus)
      console.log('newStatusXY', newStatusXY)
      if (!this._checkCondition(newStatusXY.x)) { // 满足必要条件
        await this._statusAnim(AnimType.STATUS_UPDATE,newStatus)
      }
      if (this._checkCondition(newStatusXY.x)) {
        this.index = newStatus
        await this.sleep()
        await this.switchStatus(this._getNextStatus(this.index,this.data.length - 1), this.index)
      }
    }
  }

  sleep = (delay = 4000) => {
    return new Promise((resolve, reject) => {
      this.timer = setTimeout(() => {
        resolve()
      }, delay)
    })
  }

  clearTimer = () => {
    console.log('--取消定时器--', this.timer == null)
    this.timer && clearTimeout(this.timer)
    this.timer = null
  }

  clearAnim = () => {
    console.log('取消动画', this.anim == null)
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
    console.log('动画 --开始', animType)
    this.animType = animType
    this.animState = AnimState.ANIMING
    let startXY = this.state.pan
    let endXY = this._getXYByStatus(newStatus)
    const {finished} = await this.baseAnim(startXY, endXY)
    console.log('动画 --结束', animType, finished)
    this.animState = finished ? AnimState.ANIM_OK : AnimState.ANIM_NOT_OK
  }



  // 获取对应状态的坐标
  _getXYByStatus = (status) => {
    let y = 0
    let x = status * this.width * -1
    return {x, y}
  }

  _getNextStatus (nowIndex, maxIndex, rightToLeft = true, minIndex = 0) { // minIndex默认为0
    if (rightToLeft) {
      return nowIndex < maxIndex ? nowIndex + 1 : minIndex
    }
    return nowIndex > minIndex ? nowIndex - 1 : maxIndex
  }

  renderItem (itemData) {
    return (
      <View style={[styles.item, {backgroundColor: itemData.bgColor}]}>
        <Text>{itemData.index}</Text>
      </View>
    )
  }

  _createData () {
    let bgColors = ['red', 'yellow', 'green', 'blue', 'orange', 'pink']
    return bgColors.map((item, index) => {
      return {
        bgColor: item,
        index: index
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
