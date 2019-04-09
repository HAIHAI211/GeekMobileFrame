import React from 'react'
import {createSwitchNavigator, createStackNavigator, createBottomTabNavigator} from 'react-navigation'
import {connect} from '../utils/dva'

import AuthLoadingPage from '../pages/authloading'
import HomePage from '../pages/service/home'
import SecondPage from '../pages/service/second'
import LoginPage from '../pages/auth/login'
import ForgetPwdPage from '../pages/auth/forgetPwd'
import RegisterPage from '../pages/auth/register'
import {PullRefreshDemoPage, SwiperDemoPage, ToastDemoPage} from '../pages/service/demos'

function mapStateToProps (state) {return {}}

// 底部栏路由
// const BottomTabRouter = createBottomTabNavigator({
// }, {})


// 业务路由
const ServiceRouter = createStackNavigator({
    HomePage,
    SecondPage,
    PullRefreshDemoPage,
    SwiperDemoPage,
    ToastDemoPage

}, {
    defaultNavigationOptions: {
        headerBackTitle: null
    }
})

// 验证路由
const AuthRouter = createStackNavigator({
    LoginPage,
    ForgetPwdPage,
    RegisterPage
}, {

})


// app路由（总路由）
const AppRouter = createSwitchNavigator({
    AuthLoadingPage,
    AuthRouter,
    ServiceRouter
}, {
})

export default connect(mapStateToProps)(AppRouter)
