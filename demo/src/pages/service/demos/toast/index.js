import React from 'react'
import BaseComponent, {CommonStyle, Toast, rpx} from '../../../BaseComponent'
import {StyleSheet, View, Text, Button} from 'react-native'

class ToastDemoPage extends BaseComponent{

    constructor (props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    _onPress = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    render () {
        return (
            <View style={styles.container}>
                <Text>ToastPage</Text>
                <Toast animation={true} visible={this.state.visible} duration={Toast.durations.LONG}>我天哪</Toast>
                <Button title={this.state.visible.toString()} onPress={this._onPress}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyle.container,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ToastDemoPage