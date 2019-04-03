import React from 'react'
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native'
import {CommonStyle} from '../../assets/styles'
import {fetchUserToken} from '../../service/authService'

class AuthLoadingPage extends React.Component {
    constructor (props) {
        super(props)
        this._bootstrapAsync()
    }

    render () {
        return (
            <View style={styles.container}>
                <ActivityIndicator/> 
                <Text>AuthLoadingPage</Text>
            </View>
        )
    }

    _bootstrapAsync = async () => {
        const userToken = await fetchUserToken()
        this.props.navigation.navigate(!userToken ? 'ServiceRouter' : 'AuthRouter')
    }
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyle.container,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AuthLoadingPage