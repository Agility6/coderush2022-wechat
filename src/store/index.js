import Vuex from 'vuex'
import Vue from 'vue'
import hope from './modules/hope.js'
import user from './modules/user.js'
import position from './modules/position.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		user,
		hope,
		position
	}
})