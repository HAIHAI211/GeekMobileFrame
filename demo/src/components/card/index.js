import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native'
import {rpx} from "../../utils/screenUtil"
import {withNavigation} from 'react-navigation'

class Card extends React.PureComponent{
    render () {
        const {title, items, style} = this.props
        return (
            <View style={{...styles.card, ...style}}>
                <View style={styles.cardHead}>
                    <Text style={styles.cardHeadText}>{title}</Text>
                </View>
                <View style={styles.cardItemContainer}>
                    {
                        items.map((item, key) => {
                            let {url, title} = item
                            return (
                                <TouchableOpacity 
                                    style={styles.cardItem} 
                                    key={key} 
                                    onPress={() => {this.onPress(url, title)}}>
                                    <View style={styles.cardItemInner}>
                                        <Text style={styles.cardItemText}>{title}</Text>
                                        <Text> > </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
    onPress = (url, title) => {
        if (!url) Alert.alert(title, '还未实现', [{text: '确认'}])
        const {navigation} = this.props
        navigation.navigate(url)
    }
}

const styles = StyleSheet.create({
    card: {
        width: rpx(700),
        marginBottom: rpx(30),
        backgroundColor: '#fff',
        borderRadius: rpx(10)
    },
    cardHead: {
        height: rpx(100),
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: rpx(1),
        justifyContent: 'center',
        paddingLeft: rpx(20)
    },
    cardItemContainer: {
    },
    cardItem: {
        paddingLeft: rpx(20)
    },
    cardItemInner: {
        height: rpx(80),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#F4F4F4',
        borderBottomWidth: rpx(1),
        paddingRight: rpx(25)
    },
    cardHeadText: {
        fontSize: rpx(27)
    },
    cardItemText: {
        fontSize: rpx(24)
    }
})

export default withNavigation(Card)
