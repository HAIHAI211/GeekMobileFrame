export default {
    namespace: 'service:home',
    state: {},
    reducers: { // 处理同步数据
    },
    effects: { // 处理异步数据 使用redux-soga 语法为es6 generator
        /**
         * effect demo
         * @call 调用自己定义的业务方法
         * @put 发起action
         * @select 选择某个namespace的state
         */
        // [ACTION_TYPE_NAME] ({payload}, {call, put, select}) {
        //     yield call()
        //     yield put({
        //         type: OTHER_ACTION_TYPE_NAME,
        //         payload: {}
        //     })
        // }
    }
}