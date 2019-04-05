import React from 'react'
import {StyleSheet, View, Text, ToastAndroid} from 'react-native'
import {CommonStyle} from '../../../../assets/styles'
import {PullFlatList} from '../../../../components/pullflatlist'
import {rpx} from '../../../../utils/screenUtil'

class PullRefreshDemoPage extends React.Component {
    static navigationOptions = {
        title: '下拉刷新Demo'
    }

    constructor (props) {
        super(props)
        this.flag = false
        this.state = {
            refreshing: false,
            dataSource: []
        }
    }

    componentDidMount () {
        // this.pull && this.pull.startRefresh()
    }

    render () {
        return (
            <View style={styles.container}>
                <PullFlatList
                    // ref={(c) => this.pull = c}
                    style={styles.pullFlatList}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                />

            </View>
        )
    }
    _renderItem = ({item}) => {
        return (
            <View style={styles.item}>
                <Text>{item.value}</Text>
            </View>
        )
    }

    _mockData = () => {
        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push({
                key: `key${i}`,
                value: `第${i+1}`
            })
        }
        return arr
    }

    _onRefresh = async () => {
        console.log(`onRefresh ${this.state.refreshing} => true`)
        ToastAndroid.show('onRefresh', ToastAndroid.SHORT)
        try {
            const result = await this._fetchList()
            console.log(`数据请求成功`)
            ToastAndroid.show('数据请求成功', ToastAndroid.SHORT)
            this.setState({
                dataSource: result, // 此字段必定会让子组件重选渲染
                refreshing: false
            })
        } catch (e) {
            console.log(e)
            ToastAndroid.show('数据请求失败', ToastAndroid.SHORT)
            this.setState({
                refreshing: false
            })
        }
    }

    _fetchList = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.flag ? resolve(this._mockData()) : reject('network error')
                this.flag = !this.flag
            }, 4000)
        })
    }
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyle.container
    },
    pullFlatList: {
        flex: 1
    },
    item: {
        width: rpx(750),
        height: rpx(100),
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PullRefreshDemoPage