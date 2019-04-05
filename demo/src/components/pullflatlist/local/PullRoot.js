'use strict';
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {ActivityIndicator, Text, StyleSheet, View} from 'react-native'
import * as index from './info'


export default class PullRoot extends PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            pullState: index.PullStateEnum.PULL_RELEASE
        }
    }

    static propTypes = {
        refreshable: PropTypes.bool,
        refreshing: PropTypes.bool,
        onRefresh: PropTypes.func,
        onPullStateChange: PropTypes.func,
        isContentScroll: PropTypes.bool,
        topIndicatorRender: PropTypes.func, //下拉刷新的render
        topIndicatorHeight: PropTypes.number, //头部的高度
    }

    static defaultProps = {
        refreshable: true,     //是否需要下拉刷新
        isContentScroll: true //内容是否需要跟着滚动，默认为false
    }

    renderTopIndicator = () => {
        if (!this.props.topIndicatorRender) {
            return this.defaultTopIndicatorRender()
        } else {
            return this.props.topIndicatorRender()
        }
    }

    defaultTopIndicatorRender = () => {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: index.defaultTopIndicatorHeight}}>

                <ActivityIndicator size="small" color="gray" style={{marginRight: 5}}/>

                <Text>爱的魔力转圈圈</Text>

                {/*<Text>{this.state.pullState.msg}</Text>*/}
            </View>
        )
    }

}


