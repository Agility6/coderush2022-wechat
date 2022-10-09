import { getCountrySalary } from '@/utils/api'
const position = {
    state: {
        loadedPosList: [],
        searchedPosList: [],
        countrySalaryList: []
    },
	getters: {
        loadedPosList: state => state.loadedPosList,
        searchedPosList: state => state.searchedPosList,
        countrySalaryList: state => state.countrySalaryList
    },
	mutations: {
        SET_LOADEDPOSLIST: (state, loadedPosList) => {
            loadedPosList.forEach(item => {
                item.companyLogo = `//www.lgstatic.com/thumbnail_160x160/${item.companyLogo}`
            })
            let currList = loadedPosList.filter((outItem) => {
                let flag = 1
                state.loadedPosList.map((inItem) => {
                    if(parseInt(inItem.positionId) === parseInt(outItem.positionId)) {
                        flag = 0
                        console.log(`重复职位-${outItem.positionName}`)
                    }
                })
                return flag
            })
            console.log(currList)
            state.loadedPosList.push(...currList)
        },
        SET_SEARCHEDPOSLIST: (state, searchedPosList) => {
            searchedPosList.forEach(item => {
                item.companyLogo = `//www.lgstatic.com/thumbnail_160x160/${item.companyLogo}`
            })
            let currList = searchedPosList.filter((outItem) => {
                let flag = 1
                state.searchedPosList.map((inItem) => {
                    if(parseInt(inItem.positionId) === parseInt(outItem.positionId)) {
                        flag = 0
                        console.log(`重复职位-${outItem.positionName}`)
                    }
                })
                return flag
            })
            state.searchedPosList.push(...currList)
        },
        CLEAR_POSLIST: (state) => {
            state.loadedPosList = []
        },
        CLEAR_SEARCHLIST: (state) => {
            state.searchedPosList = []
        },
        GET_COUNTRY_SALARYLIST: (state, countrySalaryList) => {
            state.countrySalaryList = countrySalaryList
        }
    },
    actions: {
        setLoadedPosList({ commit }, loadedPosList) {
            commit('SET_LOADEDPOSLIST', loadedPosList)
        },
        clearPosList({ commit }) {
            commit('CLEAR_POSLIST')
        },
        setSearchedPosList({ commit }, searchedPosList) {
            commit('SET_SEARCHEDPOSLIST', searchedPosList)
        },
        clearSearchList({ commit }) {
            commit('CLEAR_SEARCHLIST')
        },
        async set_country_salaryList({ commit }) {
            let res = await getCountrySalary()
            console.log(res.data)
            commit('GET_COUNTRY_SALARYLIST', res.data)
        }
    }
}

export default position