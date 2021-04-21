export default {
    state: {
        menu: [],
        isLogin: false
    },
    mutations: {
        setMenu(state, data) {
            state.menu = data;
        },
        setIsLogin(state, data) {
            state.isLogin = data
        }
    },
    getters: {
        isLogin: state => state.isLogin
    }
}