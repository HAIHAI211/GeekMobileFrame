import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../../assets/styles'
import Swiper from '../../../../components/swiper'

class SwiperDemoPage extends React.Component {

    static navigationOptions = {
        title: 'SwiperDemo'
    }

    render () {
        const data = this._createData()
        return (
            <View style={styles.container}>
                <Text>SwiperDemoPage</Text>
                <Swiper data={data}/>
            </View>
        )
    }

    _createData () {
        let bgColors = ['red', 'yellow', 'green', 'blue']
        return bgColors.map((item) => {
        return {
            bgColor: item
        }
    })
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
