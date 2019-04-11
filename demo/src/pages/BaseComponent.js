import React from 'react'
import {CommonStyle} from '../assets/styles'
import Toast from '../components/toast'
import {rpx} from '../utils/screenUtil'

class BaseComponent extends React.Component {

    constructor (props) {
        super(props)
        // this.Toast = Toast
        // this.CommonStyle = CommonStyle
        // this.rpx = rpx
    }

    static Toast = Toast
    static CommonStyle = CommonStyle
    static rpx = rpx

}

export {Toast, CommonStyle, rpx}


export default BaseComponent