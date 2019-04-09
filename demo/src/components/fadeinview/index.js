import React from 'react'
import {Animated, View} from 'react-native'

class FadeInView extends React.Component{
    state = {
        fadeAnim: new Animated.Value(0)
    }

    componentDidMount () { // after render()
        if (this.props.show) {
            Animated.sequence([
                this._fadeInAnim(),
                this._fadeOutAnim()
            ])
        }
    }

    componentWillUpdate (nextProps, nextState) { // before render()
        // console.log('将要更新')
    }
    componentDidUpdate (prevProps, prevState) { // after render()
        // console.log('已经更新完毕')
        if (this.props.show) {
            Animated.sequence([
                this._fadeInAnim(),
                this._fadeOutAnim()
            ]).start()
        }
    }


    render () {
        let {fadeAnim} = this.state
        return (
            <Animated.View style={{...this.props.style, opacity: fadeAnim}}>
                {this.props.children}
            </Animated.View>
        )
    }

    _fadeInAnim = () => {
        return Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: 1000
            }
        )
    }

    _fadeOutAnim = () => {
        return Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 0,
                duration: 50,
                delay: 600
            }
        )
    }

    _disappear = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                
            }, 500)
        })
    }
}

export default FadeInView