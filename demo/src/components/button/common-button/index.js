import React from 'react'
import {TouchableOpacity, Text} from 'react-native'
import {CommonStyle} from '../../../assets/styles'

class CommonButton extends React.PureComponent{
    render () {
        const {title, onPress, style} = this.props
        return (
            <TouchableOpacity onPress={onPress} style={{...CommonStyle.button, ...style}}>
                <Text style={CommonStyle.buttonText}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

export default CommonButton