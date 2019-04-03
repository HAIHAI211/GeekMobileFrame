'use strict';
import React from 'react';
import {FlatList} from 'react-native';
import Pullable from '../local/Pullable';

export default class PullFlatList extends Pullable {

    getScrollable = () => {
        let {refreshing, onRefresh, ...otherProps} = this.props
        return (
            <FlatList
                ref={(c) => this.scroll = c}
                {...otherProps}/>
        );
    }
}
