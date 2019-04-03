import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../assets/styles'

class RegisterPage extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <Text>RegisterPage</Text>
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

export default RegisterPage