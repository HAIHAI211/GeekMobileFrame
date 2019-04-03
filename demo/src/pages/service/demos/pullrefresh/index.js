import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../../../../assets/styles'
import {PullFlatList} from '../../../../components/pullflatlist'
import {rpx} from '../../../../utils/screenUtil'

class PullRefreshDemoPage extends React.Component {
    static navigationOptions = {
        title: '下拉刷新Demo'
    }

    constructor (props) {
        super(props)
        this.state = {
            refreshing: true,
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

    _fetchList = () => {
        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push({
                key: `key${i}`,
                value: `第${i+1}行`
            })
        }
        return arr
    }

    _onRefresh = (refreshing) => {
        this.setState({
            refreshing
        })
        if (refreshing) {
            // this.setState({
            //     dataSource: []
            // })
            setTimeout(() => {
                this.setState({
                    dataSource: this._fetchList(),
                    refreshing: false
                })
            }, 2000)
        }
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