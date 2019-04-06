import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../../assets/styles'
import Swiper from '../../../../components/swiper'

class SwiperDemoPage extends React.Component {

    static navigationOptions = {
        title: 'SwiperDemo'
    }

    render () {
        return (
            <View style={styles.container}>
                <Text>SwiperDemoPage</Text>
                <Swiper/>
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

export default SwiperDemoPage
