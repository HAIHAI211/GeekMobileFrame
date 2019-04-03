import {createSwitchNavigator} from 'react-navigation'
import {connect} from '../utils/dva'
import ServiceRouter from './serviceRouter'
import AuthRouter from './authRouter'
import AuthLoadingPage from '../pages/authloading'

function mapStateToProps (state) {}

const appRouterConfigs = { // @RouterConfig
    AuthLoading: AuthLoadingPage,
    Service: ServiceRouter,
    Auth: AuthRouter
}

const appNavigatorConfig = { // @SwitchNavigatorConfi
    initialRouteName: 'AuthLoading'
}

const AppRouter = createSwitchNavigator(appRouterConfigs, appNavigatorConfig)

export default connect(mapStateToProps)(AppRouter)


