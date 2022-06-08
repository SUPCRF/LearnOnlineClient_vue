import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
        searchInfo: {},
        type: ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem("token", token)
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
        },
        SET_TYPE: (state, type) => {
            state.type = type
            localStorage.setItem("type", type)
        },
        REMOVE_INFO: (state) => {
            state.userInfo = ''
            state.userInfo = {}
            localStorage.setItem("token", '')
            sessionStorage.setItem("userInfo", JSON.stringify(''))
            localStorage.setItem("type", '')
        }
    },
    getters: {
        getUserInfo: state => {
            return state.userInfo
        },
        getType: state => {
            return state.type
        }
    },
    actions: {},
    modules: {}
})