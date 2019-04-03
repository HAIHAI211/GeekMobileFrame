import React from 'react'
import dva from './utils/dva'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import AppRouter from './router'
import AuthLoadingPage from './pages/authloading' 
import HomePage from './pages/service/home'


const app = dva({
    models: [],
    onError (e) {
        console.log('onError', e)
    }
})

// const AppRouter = createSwitchNavigator({
//     AuthLoading: AuthLoadingPage,
//     Home: HomePage
// })

const AppContainer = createAppContainer(AppRouter)
const App = app.start(<AppContainer/>)

export default App