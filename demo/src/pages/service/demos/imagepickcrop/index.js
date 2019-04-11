import React from 'react'
import {View, Text, StyleSheet, Button} from 'react-native'
import BaseComponent, {rpx, Toast} from '../../../BaseComponent'
import ImagePicker from 'react-native-image-crop-picker'

class ImagePickCropDemoPage extends BaseComponent {

    static navigationOptions = {
        headerTitle: '照片选取与裁剪'
    }

    _onPress = () => {
        console.log('照片选取')
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image)
        })
    }

    render () {
        return (
            <View style={styles.container}>
                <Button onPress={this._onPress} title='选取照片'/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ImagePickCropDemoPage