import React from 'react'
import {View,Text} from 'react-native'
import {createAppContainer} from 'react-navigation'
import dva from './utils/dva'
import AppRouter from './router/xx'
import ServiceRouter from './router/serviceRouter'
import { ViewPagerAndroid } from 'react-native-gesture-handler';

// const app = dva({
//     models: [],
//     onError (e) {
//         console.warn('onDvaError', e)
//     }
// })

// const AppContainer = createAppContainer(ServiceRouter)
// const App = app.start(<AppContainer/>)

