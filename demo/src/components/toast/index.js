import React, {
    Component
} from 'react'
import {
    View
} from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import ToastContainer, {positions, durations} from './ToastContainer'

class Toast extends Component {
    static displayName = 'toast'
    static propTypes = ToastContainer.propTypes

    static positions = positions
    static durations = durations


    static show = (message, options = {position: positions.BOTTOM, duration: durations.SHORT}) => {
        return new RootSiblings(
            <ToastContainer {...options} visible={true}>
                {message}
            </ToastContainer>
        )
    }

    static hide = toast => {
        if (toast instanceof RootSiblings) {
            toast.destroy()
        } else {
            console.warn(`Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof toast}\` instead.`)
        }
    }

    _toast = null

    componentWillMount = () => {
        console.log('componentWillMount', 'toast')
        this._toast = new RootSiblings(
            <ToastContainer {...this.props}/>
        )
    }

    componentWillReceiveProps = nextProps => {
        console.log('componentWillReceiveProps', 'toast')
        this._toast.update(
            <ToastContainer {...nextProps}/>
        )
    }

    componentWillUnmount = () => {
        console.log('componentWillUnmount', 'toast')
        this._toast.destroy()
    }

    render () {
        console.log('render', 'toast')
        return null
    }
}

export {
    RootSiblings as Manager
}
export default Toast