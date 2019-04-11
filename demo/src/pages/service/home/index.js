import React from 'react'
import {StyleSheet, View, Text, FlatList, Image} from 'react-native'
import {CommonStyle} from '../../../assets/styles'
import Card from '../../../components/card'
import {cardList} from './config'
import { rpx } from '../../../utils/screenUtil'
import FadeInView from '../../../components/fadeinview'

class HomePage extends React.Component {

    state = {
        loading: false,
        loadedTitleShow: false
    }
    render () {
        return (
            <View style={styles.container}>
                <FadeInView style={styles.loadedTitleWrap} show={this.state.loadedTitleShow}>
                    <Text style={styles.loadedTitle}>加载完成</Text>
                </FadeInView>
                <FlatList
                    keyExtractor={(item, index) => {return item.title + index}}
                    data={cardList}
                    renderItem={({item}) => {return this._renderItem(item)}}
                    ListHeaderComponent={() => (
                        <View style={styles.head}>
                            <View style={styles.headTitleWrap}>
                                <Image style={styles.headIcon} source={require('../../../assets/images/geek-icon.png')}/>
                                <Text style={styles.headTitle}>Geek Mobile</Text>
                            </View>
                            <Text style={styles.headSubTitle}>轻量、可靠的移动端框架</Text>
                        </View>
                    )}
                    refreshing={this.state.loading}
                    onRefresh = {this._onRefresh}
                />
            </View>
        )
    }

    _renderItem = (item) => {
        return (
            <Card
                title={item.title}
                items={item.items}
            />
        )
    }

    _onRefresh = async () => {
        this.setState({
            loading: true,
            loadedTitleShow: false
        })
        await this._mock()
        
        this.setState({
            loading: false,
            loadedTitleShow: true
        })
    }

    _mock = () => {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve('haha')
            }, 2000)
        })
    }
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyle.container,
        alignItems: 'center'
    },
    loadedTitleWrap: {
        width: rpx(750),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: rpx(16),
        paddingBottom: rpx(16),
        backgroundColor: '#cce5ff'
    },
    loadedTitle: {
        fontSize: rpx(24),
        color: '#2975E6'
    },
    head: {
        alignItems: 'center',
        marginTop: rpx(50),
        marginBottom: rpx(50)
    },
    headTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headIcon: {
        width: rpx(40),
        height: rpx(40),
        marginRight: rpx(10)
    },
    headTitle: {
        color: '#000',
        fontSize: rpx(40),
        fontWeight: '300'
    },
    headSubTitle: {
        color: '#aaa',
        fontSize: rpx(30),
        marginTop: rpx(10)
    }
})

export default HomePage