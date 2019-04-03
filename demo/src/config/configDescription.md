    @RouterConfig
        Profile: {
            screen: ProfileScreen,
            path: 'people/:name',
            navigationOptions: ({ navigation }) => ({
                title: `${navigation.state.params.name}'s Profile'`,
            }) || @TabNavigationOptions || StackNavigationOptions
        }

    @BottomTabNavigatorConfig
        initialRouteName -第一次加载时初始选项卡路由的 routeName。
        order -定义选项卡顺序的 routeNames 数组。
        paths - 提供 routeName 到 path 配置的映射, 它重写 routeConfigs 中设置的路径。
        backBehavior - 控制 "返回" 按钮是否会导致 Tab 页切换到初始 Tab 页? 如果是, 设置为 initialRoute, 否则 none。 默认为 initialRoute的行为。
        lazy - Defaults to true. If false, all tabs are rendered immediately. When true, tabs are rendered only when they are made active for the first time. Note: tabs are not re - rendered upon subsequent visits.
        tabBarComponent - 可选，覆盖用作标签栏的组件.
        tabBarOptions - 具有以下属性的对象:
        activeTintColor - 活动选项卡的标签和图标颜色。
        activeBackgroundColor - 活动选项卡的背景色。
        inactiveTintColor - "非活动" 选项卡的标签和图标颜色。
        inactiveBackgroundColor -非活动选项卡的背景色。
        showLabel - 是否显示选项卡的标签, 默认值为 true。
        showIcon - 是否显示 Tab 的图标，默认为false。
        style -选项卡栏的样式对象。
        labelStyle - 选项卡标签的样式对象。
        tabStyle - 选项卡的样式对象。
        allowFontScaling - 无论标签字体是否应缩放以尊重文字大小可访问性设置，默认值都是 true。
        safeAreaInset - 为 <SafeAreaView> 组件重写 forceInset prop， 默认值：{ bottom: 'always', top: 'never' }； top | bottom | left | right 的可选值有： 'always' | 'never'。
    
    @StackNavigatorConfig
        路由的选项：
            initialRouteName - 设置 stack navigator 的默认页面， 必须是路由配置中的某一个。
            initialRouteParams - 初始路由的参数
            initialRouteKey - 初始路由的可选标识符
            defaultNavigationOptions - 用于屏幕的默认导航选项
            paths - 覆盖路由配置中设置的路径的映射
        视觉选项：
            mode - 定义渲染和转换的样式：
                card - 使用标准的 iOS 和 Android 屏幕转换， 这是默认设置。
                modal - 页面从屏幕底部滑入，这是iOS的常用模式， 只在 iOS 上生效，在 Android 上无效。
            headerMode - 指定页眉的呈现方式：
                float - 呈现一个位于顶部的单个页眉, 并在屏幕被更改时进行动画显示， 这是 iOS 上常见的模式。
                screen - 每个屏幕都有一个标头, 并且页眉随屏幕一起淡入和淡出， 这是 Android 的常见模式。
                none - 不会呈现页眉。ß
            headerBackTitleVisible - 提供合理的默认值以确定后退按钮标题是否可见，但如果要覆盖它，则可以使用true或` false < /code>在此选项中。
            headerTransitionPreset` - `headerMode: float` 时，指定 header 应该如何过渡，当页面跳转时。 * `淡入就地的` -头组件跨淡出而不移动, 类似于 Twitter、Instagram 和 Facebook 应用程序的 iOS， 这是默认值。 * `uikit` -iOS 的默认行为的近似值。 * `headerLayoutPreset` - 指定 Header 组件如何布局 * `left` - 将标题锚定在左侧，靠近后退按钮或其他左侧组件。 在 Android 上默认的。 在 iOS 上，Header 组件的返回标题是隐藏的 左侧组件的内容将在标题下方溢出，如果你需要调整此内容，可以使用` headerLeftContainerStyle `和` headerTitleContainerStyle `。 此外，此对齐与`headerTransitionPreset: 'ui-kit'`不兼容。 * `center` - 将标题居中，这是iOS上的默认设置。 * ` cardStyle ` - 使用此 props 覆盖或扩展堆栈中单个 Card 的默认样式。 * `cardShadowEnabled` - 使用此 prop 可在页面切换时，显示可见阴影， 默认值： `true`。 * `cardOverlayEnabled` - 使用此 prop 在页面切换时显示堆栈卡片浮层， 默认值： `false`。 * `transitionConfig` - 返回与默认的页面切换效果合并的对象的函数（在[切换效果类型定义](https://github.com/react-navigation/react-navigation/blob/master/flow/react-navigation.js)中查看） 提供的函数将传递以下参数: * `transitionProps` -新屏幕的过渡道具。 * `prevTransitionProps` -为旧屏幕过渡道具。 * `isModal` -布尔值指定屏幕是否为模式。 * `onTransitionStart` -当卡过渡动画即将启动时要调用的函数。 * `onTransitionEnd` -在卡过渡动画完成后调用的函数。 * `transparentCard` - *Experimental* - 保持堆栈中所有卡片可见的 prop, 并添加透明的背景而不是白色的 这对于实现像模式对话框这样的事情很有用, 在这种对话框中, 前面的场景在当前场景的下方仍然可见。
    
    @SwitchNavigatorConfig
        initialRouteName -第一次加载时初始选项卡路由的 routeName。
        resetOnBlur - 切换离开屏幕时，重置所有嵌套导航器的状态， 默认为true。
        paths - 提供 routeName 到 path 配置的映射, 它重写 routeConfigs 中设置的路径。
        backBehavior - 控制 "返回" 按钮是否会导致 Tab 页切换到初始 Tab 页? 如果是, 设置为 initialRoute, 否则 none。 默认为none行为。

    @TabNavigationOptions
        title - 可用作headerTitle和tabBarLabel的后备的通用标题。
        tabBarVisible - true或false用于显示或隐藏标签栏，如果未设置，则默认为true。
        tabBarIcon - React元素或给定{ focused: boolean, horizontal: boolean, tintColor: string }返回一个 React.Node的函数，用于在标签栏中显示。当设备处于横屏时，horizontal 是 true；当设备处于竖屏时false。 每当设备方向发生变化时, 都会重新渲染该图标。
        tabBarLabel - 标签栏或 React 元素中显示的选项卡的标题字符串或给定{ focused: boolean, tintColor: string }的函数返回 React.Node，用于显示在标签栏中。 未定义时，使用场景title。 要隐藏，请参阅上一节中的tabBarOptions.showLabel。
        tabBarButtonComponent - React组件，它包装图标和标签并实现onPress。 默认情况下是TouchableWithoutFeedback的一个封装，使其其表现与其它可点击组件相同。 tabBarButtonComponent: TouchableOpacity 将使用 TouchableOpacity 来替代.
        tabBarAccessibilityLabel - 选项卡按钮的无障碍标签。 当用户点击该选项卡时，该标签会被屏幕阅读器阅读（用于方便视障人士使用 手机，鼓励有条件的开发者设置该标签）， 如果您的选项卡的没有标签, 强烈建议您设置此选项。
        tabBarTestID - 用于在测试中找到该选项卡按钮的 ID。
        tabBarOnPress - 处理点击事件的回调; 该参数是一个对象，其中包含：
            navigation：页面的 navigation props
            defaultHandler: tab press 的默认 handler在开始转换到下一个场景之前添加自定义逻辑（点击的场景）。