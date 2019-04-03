import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../assets/styles'
import CommonButton from '../../../components/button/common-button'
import {rpx} from '../../../utils/screenUtil'

class LoginPage extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <Text>LoginPage</Text>
                <CommonButton
                    style={styles.button}
                    title="登录"
                    onPress={this._navigateToHome}
                />
                <CommonButton
                    style={styles.button}
                    title="注册"
                    onPress={this._navigateToRegister}
                />
                <CommonButton
                    style={styles.button}
                    title="忘记密码"
                    onPress={this._navigateToForgetPwd}
                />
            </View>
        )
    }
    _navigateToHome = () => {
        this.props.navigation.navigate('ServiceRouter')
    }

    _navigateToRegister = () => {
        this.props.navigation.navigate('RegisterPage')
    }

    _navigateToForgetPwd = () => {
        this.props.navigation.navigate('ForgetPwdPage')
    }
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyle.container,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: rpx(700),
        marginTop: rpx(50)
    }
})

export default LoginPage