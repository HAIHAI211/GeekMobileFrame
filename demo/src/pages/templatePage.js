import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../assets/styles'

class TemplatePage extends React.Component {

    componentWillMount () {}

    componentDidMount () {}

    componentWillReceiveProps () {}

    componetWillUpdate () {}

    componentDidUpdate () {}

    componetWillUnmount () {}


    render () {
        return (
            <View style={styles.container}>
                <Text>TemplatePage</Text>
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

export default TemplatePage