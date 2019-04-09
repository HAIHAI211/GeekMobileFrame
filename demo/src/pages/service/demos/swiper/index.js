import React from 'react'
import {StyleSheet, View, Text, ImageBackground} from 'react-native'
import {CommonStyle} from '../../../../assets/styles'
import Swiper from '../../../../components/swiper'
import {rpx} from '../.././../../utils/screenUtil'

class SwiperDemoPage extends React.Component {

    static navigationOptions = {
        title: 'SwiperDemo'
    }

    render () {
        const data = this._createData()
        return (
            <View style={styles.container}>
                <Text>SwiperDemoPage</Text>
                <Swiper
                  data={data}
                  renderItem={this._renderItem}
                />
            </View>
        )
    }

    _createData () {
        // let bgColors = ['red', 'yellow', 'green', 'blue']
        // return bgColors.map((item) => {
        //     return {
        //         bgColor: item
        //     }
        // })
      return [
        {
            img: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278400367,3092351145&fm=11&gp=0.jpg',
            title: '春天'
        },
        {
            img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2151323139,2913823812&fm=26&gp=0.jpg',
            title: '夏天'
        },
        {
            img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3105756623,303063004&fm=26&gp=0.jpg',
            title: '秋天'
        },
        {
            img: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1245732018,2267622547&fm=200&gp=0.jpg',
            title: '冬天'
        }
      ]
    }
    _renderItem = (item, index) => {
        return (
          <View style={{width: rpx(750), height: rpx(400), alignItems: 'center'}} key={item.index + 'item'}>
              <ImageBackground source={{uri: item.img}}
                               style={{width: rpx(680), height: '100%', borderRadius: rpx(10), overflow: 'hidden', justifyContent:'center', alignItems: 'center'}}>
                  <Text>{item.title}</Text>
              </ImageBackground>
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
