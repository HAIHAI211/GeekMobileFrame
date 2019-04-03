import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../assets/styles'

class SecondPage extends React.Component {
    render () {
        <View style={styles.container}>
            <Text>Second</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyle.container,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SecondPage