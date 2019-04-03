import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {CommonStyle} from '../assets/styles'
import {connect} from '../utils/dva'


function mapStateToProps (state) {
    return {}
}

class TemplatePage extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <Text>TemplatePage</Text>
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

export default connect(mapStateToProps)(TemplatePage)