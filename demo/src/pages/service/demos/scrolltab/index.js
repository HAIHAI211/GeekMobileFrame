import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import BaseComponent, {rpx} from '../../../BaseComponent'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from './tabbar'

class ScrollTabDemoPage extends BaseComponent {
    _renderTabBar = (props) => {
        return (<TabBar {...props}/>)
    }
    render () {
        return (
            <ScrollableTabView renderTabBar={this._renderTabBar}>
                <View style={styles.page} tabLabel="呵呵"></View>
                <View style={styles.page} tabLabel="嘻嘻"></View>
                <View style={styles.page} tabLabel="哈哈"></View>
            </ScrollableTabView>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    underline: {
        height: rpx(5)
    }
})

export default ScrollTabDemoPage