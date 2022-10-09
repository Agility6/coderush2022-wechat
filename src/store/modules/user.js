
const user = {
	state: {
		userInfo: {},
		searchHistory: [],
		userCollect: [],
		eduInfo: [],
		projInfo: [],
		resumeInfo: {},
		userHabit: {},
		userCommit: []
	},
	getters: {
		userInfo: state => state.userInfo,
		
		//搜索记录保存到vuex，显示最后8个
		searchHistory: state => {
			let history = state.searchHistory
			if(history.length <= 8) {
				return history.slice(0, history.length)
			}else {
				return history.slice(0, 8)
			}
		},
		userCollect: state => state.userCollect,
		resumeInfo: state => state.resumeInfo,
		eduInfo: state => state.eduInfo,
		projInfo: state => state.projInfo,
		userHabit: state => state.userHabit,
		userCommit: state => state.userCommit
	},
	mutations: {
		SET_USERLOCATION: (state, location) => {
			state.userInfo.location = location
			uni.setStorageSync('userViewInfo', state.userInfo)
		},
		SET_VIEWHISTORYL: (state, viewHistory) => {
			if(typeof(viewHistory[0]) === 'object') {
				if(!state.userInfo.viewHistory) {
					viewHistory.map((item, index) => {
						if(index === 0) { state.userInfo.viewHistory = [] }
						state.userInfo.viewHistory.push(item.positionId)
					})
					state.userInfo.viewHistory = [...new Set(state.userInfo.viewHistory)]
				}else {
					viewHistory.map(item => {
						state.userInfo.viewHistory.push(item.positionId)
					})
					state.userInfo.viewHistory = [...new Set(state.userInfo.viewHistory)]
				}
			}else {
				console.log('no obj')
				state.userInfo.viewHistory = viewHistory
			}
	
			uni.setStorageSync('userViewInfo', state.userInfo)
		},
		SET_SEARCHHISTORY: (state, searchHistory) => {
			// 首次加载从本地获取数组数据(模拟从服务器获取)
			if(searchHistory instanceof Array) {
				state.searchHistory = searchHistory
			} else {
				let flag = 1
				const length = state.searchHistory.length
				if(length === 0) {
					state.searchHistory.unshift(searchHistory)
				}else {
					state.searchHistory.map((item, index) => {
						if(item.value === searchHistory.value) {
							flag = 0
						}
					})
					flag && state.searchHistory.unshift(searchHistory)
				}
			}
		},
		CLEAR_SEARCHHISTORY: (state) => {
			state.searchHistory = []
			uni.clearStorage('searchHistory');
		},
		SET_COLLECT: (state, userCollect) => {
			if(userCollect instanceof Array) {
				state.userCollect = userCollect
			}else {
				state.userCollect.unshift(userCollect)
				uni.setStorageSync('collectList', state.userCollect)
			}
			
		},
		DELETE_COLLECT: (state, pid) => {
			state.userCollect.map((item) => {
				if(parseInt(item.positionId) === pid) {
					let index = state.userCollect.indexOf(item)
					state.userCollect.splice(index,1)
				}
			})
			console.log(state.userCollect)
			uni.setStorageSync('collectList', state.userCollect)
		},
		SET_COMMIT: (state, userCommit) => {
			if(userCommit instanceof Array) {
				state.userCommit = userCommit
			}else {
				state.userCommit.unshift(userCommit)
				uni.setStorageSync('commitList', state.userCommit)
			}
		},
		DELETE_COMMIT: (state, pid) => {
			state.userCommit.map((item) => {
				if(parseInt(item.positionId) === pid) {
					let index = state.userCommit.indexOf(item)
					state.userCommit.splice(index,1)
				}
			})
			console.log(state.userCommit)
			uni.setStorageSync('commitList', state.userCommit)
		},
		SET_RESUMEINFO: (state, resumeInfo) => {
			state.resumeInfo = resumeInfo
			uni.setStorageSync('infoObj', resumeInfo)
		},
		SET_EDU: (state, eduInfo) => {
			if(eduInfo instanceof Array) {
				state.eduInfo = eduInfo
			}else {
				var eduFlag = 1
				state.eduInfo.forEach((item) => {
					if(item.eid === eduInfo.eid) {
						item = eduInfo
						eduFlag = 0
					}
				})
				if(eduFlag) {
					state.eduInfo.push(eduInfo)
				}
				uni.setStorageSync('eduList', state.eduInfo)
			}
			// console.log(eduInfo)
			console.log(state.eduInfo)
		},
		DELETE_EDU: (state, eid) => {
			state.eduInfo.forEach((item) => {
				if(item.eid === eid) {
					let index = state.eduInfo.indexOf(item)
					state.eduInfo.splice(index, 1)
				}
			})
			uni.setStorageSync('eduList', state.eduInfo)
		},
		SET_PROJ: (state, projInfo) => {
			if(projInfo instanceof Array) {
				state.projInfo = projInfo
			}else {
				var projFlag = 1
				state.projInfo.forEach((item) => {
					if(item.pid === projInfo.pid) {
						item = projInfo
						projFlag = 0
					}
				})
				if(projFlag) {
					state.projInfo.push(projInfo)
				}
				uni.setStorageSync('projList', state.projInfo)
			}
			// console.log(eduInfo)
			console.log(state.projInfo)
		},
		DELETE_PROJ: (state, pid) => {
			state.projInfo.forEach((item) => {
				if(item.pid === pid) {
					let index = state.projInfo.indexOf(item)
					state.projInfo.splice(index, 1)
				}
			})
			uni.setStorageSync('projList', state.projInfo)
		},
		SET_HABIT: (state, habit) => {
			// 统计浏览记录前三
			let { secondType, thirdType, city, positionLables, posType } = habit
			if(!Object.keys(state.userHabit).length) {
				if(Array.isArray(city)) {
					state.userHabit.city = city
				}else {
					state.userHabit.city = [city]
				}
				if(posType && posType.length) {
					state.userHabit.posType = posType
				}else {
					state.userHabit.posType = [`${secondType}-${thirdType}`]
				}
				// state.userHabit.city = [city]
				// state.userHabit.secondType = [secondType]
				state.userHabit.positionLables = [...positionLables]
			}else {
				console.log('执行SET_HABIT')
				state.userHabit.posType.push(`${secondType}-${thirdType}`)
				state.userHabit.city.push(city)
				state.userHabit.positionLables.push(...positionLables)
			}

			let cityList = {}
			let typeList = {}
			let skillList = {}
			console.log(state.userHabit.city)
			state.userHabit.city.map((item) => {
				console.log('执行了筛选')
				if(!Object.keys(cityList).includes(item)) {
					cityList[item] = 1
				}else {
					cityList[item] ++
				}
			})
			state.userHabit.posType.map((item) => {
				if(!Object.keys(typeList).includes(item)) {
					typeList[item] = 1
				}else {
					typeList[item] ++
				}
			})
			state.userHabit.positionLables.map((item) => {
				if(!Object.keys(skillList).includes(item)) {
					skillList[item] = 1
				}else {
					skillList[item] ++
				}
			})

			state.userHabit.cityList = Object.entries(cityList).sort((a,b) => {
				return b[1] - a[1]
			}).slice(0, 3)
			state.userHabit.typeList = Object.entries(typeList).sort((a,b) => {
				return b[1] - a[1]
			}).slice(0, 3)
			state.userHabit.skillList = Object.entries(skillList).sort((a,b) => {
				return b[1] - a[1]
			}).slice(0, 3)
			//模拟存到用户数据库
			uni.setStorageSync('userHabit', state.userHabit)
		}
	},
	actions: {
		setUserInfo({ commit }, userInfo) {
			switch(userInfo.type) {
				case 'location':
					commit('SET_USERLOCATION', userInfo.data)
					break
				case 'viewHistory':
					commit('SET_VIEWHISTORYL', userInfo.data)
					break
			}
		},
		setSearchHistory({ commit }, searchHistory) {
			commit('SET_SEARCHHISTORY', searchHistory)
		},
		clearSearchHistory({ commit }) {
			commit('CLEAR_SEARCHHISTORY')
		},
		setCollect({ commit }, userCollect) {
			commit('SET_COLLECT', userCollect)
		},
		deleteCollect({ commit }, pid) {
			commit('DELETE_COLLECT', pid)
		},
		setCommit({ commit }, userCommit) {
			commit('SET_COMMIT', userCommit)
		},
		deleteCommit({ commit }, pid) {
			commit('DELETE_COMMIT', pid)
		},
		setResumeInfo({ commit }, resumeInfo) {
			commit('SET_RESUMEINFO', resumeInfo)
		},
		setEduInfo({ commit }, eduInfo) {
			commit('SET_EDU', eduInfo)
		},
		deleteEduInfo({ commit }, eid) {
			commit('DELETE_EDU', eid)
		},
		setProjInfo({ commit }, projInfo) {
			commit('SET_PROJ', projInfo)
		},
		deleteProjInfo({ commit }, pid) {
			commit('DELETE_PROJ', pid)
		},
		setUserHabit({ commit }, habit) {
			commit('SET_HABIT', habit)
		}
	}
}
export default user