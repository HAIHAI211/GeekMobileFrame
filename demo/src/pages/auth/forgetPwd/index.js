import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../assets/styles'

class ForgetPwdPage extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <Text>ForgetPwdPage</Text>
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

export default ForgetPwdPage