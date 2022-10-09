import { getRegionRank, getProvinceRank, getPosSalary, posTrend, getEducation, getCompanySize, getCompanyFinance } from '@/utils/api'
import { TopFiveDate } from '@/utils/utils'
const hope = {
	state: {
		isReady: false,
		hopeSalary: '',
		hopeCity: '',
		hopeType: '',
		hopeDate: '',
		hopePos: '',
		regionRank: [],
		skillRank: [],
		salaryList: [],
		trendList: [],
		eduList: [],
		companySizeList: [],
		FinanceList: []
	},
	getters: {
		isReady: state => state.isReady,
		hopeSalary: state => state.hopeSalary,
		hopeCity: state => state.hopeCity,
		hopeType: state => state.hopeType,
		hopeDate: state => state.hopeDate,
		hopePos: state => state.hopePos,
		regionRank: state => state.regionRank,
		skillRank: state => state.skillRank,
		salaryList: state => state.salaryList,
		trendList: state => state.trendList,
		eduList: state => state.eduList,
		companySizeList: state => state.companySizeList,
		FinanceList: state => state.FinanceList
	},
	mutations: {
		SET_READY: (state, isReady) => {
			state.isReady = isReady
		},
		SET_HOPESALARY: (state, hopeSalary) => {
			state.hopeSalary = hopeSalary
		},
		SET_HOPECITY: (state, hopeCity) => {
			state.hopeCity = hopeCity
		},
		SET_HOPETYPE: (state, hopeType) => {
			state.hopeType = hopeType
		},
		SET_HOPEDATE: (state, hopeDate) => {
			state.hopeDate = hopeDate
		},
		SET_HOPEPOS: (state, hopePos) => {
			state.hopePos = hopePos
		},
		SET_REGIONRANK: (state, regionRank) => {
			state.regionRank = regionRank
		},
		SET_SKILLRANK: (state, skillRank) => {
			state.skillRank = skillRank
		},
		SET_SALARYLIST: (state, salaryList) => {
			state.salaryList = salaryList
		},
		SET_TRENDLIST: (state, trendList) => {
			state.trendList = trendList
		},
		SET_EDULIST: (state, eduList) => {
			state.eduList = eduList
		},
		SET_COMPANYSIZELIST: (state, companySizeList) => {
			state.companySizeList = companySizeList
		},
		SET_FINANCELIST: (state, FinanceList) => {
			state.FinanceList = FinanceList
		},
		CLEAR_ALL: (state) => {
			state.hopeSalary = '',
			state.hopeCity = '' 
			state.hopeData = '' 
			state.hopeType = '' 
			state.hopePos = '' 
		}
	},
	actions: {
		async setHopeData({ commit }, hopeData) {
			switch(hopeData.type){
				case 'hopeSalary':
					commit('SET_HOPESALARY', hopeData.data)
					break;
				case 'hopeCity':
					commit('SET_HOPECITY', hopeData.data)
					break;
				case 'hopeType':
					commit('SET_HOPETYPE', hopeData.data)
					break;
				case 'hopeDate':
					commit('SET_HOPEDATE', hopeData.data)
					break;
				case 'hopePos':
					commit('SET_HOPEPOS', hopeData.data)
					break;
				case 'noHope':
					let regionRes = await getProvinceRank()
					let skillRes = await getRegionRank()
					let salaryRes = await getPosSalary()
					let trendRes = await posTrend()
					let eduRes = await getEducation()
					let companySizeRes = await getCompanySize()
					let companyFinanceRes = await getCompanyFinance()
					commit('SET_REGIONRANK', TopFiveDate(regionRes.data))
					commit('SET_SKILLRANK', TopFiveDate(skillRes.data.skill))
					commit('SET_SALARYLIST', salaryRes.data)
					commit('SET_TRENDLIST', trendRes.data)
					commit('SET_EDULIST', eduRes.data)
					commit('SET_COMPANYSIZELIST', companySizeRes.data)
					commit('SET_FINANCELIST', companyFinanceRes.data)
			}
		},
		async setReady({ commit, rootState }, hopeObj) {
			let pos = hopeObj.hopePos.split('-')[0]
			let city = hopeObj.hopeCity || rootState.user.userInfo.location
			let salaryRes
			let regionRes
			let skillRes
			let trendRes
			let eduRes
			let companySizeRes
			let companyFinanceRes
			let res

			
			if(pos && city) {
				salaryRes = await getPosSalary({level: 3, region: city, position: pos})
				res = await getRegionRank({level: 3, region: city, position: pos})
				trendRes = await posTrend({city})
				eduRes = await getEducation({level: 3, region: city, position: pos})
				if(!eduRes.data.some(item => item.value)) {
					eduRes = await getEducation()
				}
				companySizeRes = await getCompanySize({level: 3, region: city, position: pos})
				if(!companySizeRes.data.some(item => item.value)) {
					companySizeRes = await getCompanySize()
				}
				companyFinanceRes = await getCompanyFinance({level: 3, region: city, position: pos})
				if(!companyFinanceRes.data.some(item => item.value)) {
					companyFinanceRes = await getCompanySize()
				}
				if(res.data.hotRegion) {
					//nothing
				}else {
					res = await getRegionRank({ level: 3, region: city })
				}
				commit('SET_REGIONRANK', res.data.hotRegion)
				commit('SET_SKILLRANK', TopFiveDate(res.data.skill))

			}else if(pos && !city ) {
				salaryRes = await getPosSalary({position: pos})
				res = await getRegionRank({position: pos})
				trendRes = await posTrend()
				if(res.data.hotRegion) {
					commit('SET_REGIONRANK', res.data.hotRegion)
					commit('SET_SKILLRANK', TopFiveDate(res.data.skill))
				}else {
					regionRes = await getProvinceRank()
					skillRes = await getRegionRank()
					salaryRes = await getPosSalary()
					commit('SET_REGIONRANK', TopFiveDate(regionRes.data))
					commit('SET_SKILLRANK', TopFiveDate(skillRes.data.skill))
				}
				eduRes = await getEducation({position: pos})
				if(!eduRes.data.some(item => item.value)) {
					eduRes = await getEducation()
				}
				companySizeRes = await getCompanySize({position: pos})
				if(!companySizeRes.data.some(item => item.value)) {
					companySizeRes = await getCompanySize()
				}
				companyFinanceRes = await getCompanyFinance({position: pos})
				if(!companyFinanceRes.data.some(item => item.value)) {
					companyFinanceRes = await getCompanySize()
				}

			}else if(!pos && city) {
				salaryRes = await getPosSalary({level: 3, region: city})
				res = await getRegionRank({level: 3, region: city})
				eduRes = await getEducation({level: 3, region: city})
				trendRes = await posTrend({city})
				if(!eduRes.data.some(item => item.value)) {
					eduRes = await getEducation()
				}
				companySizeRes = await getCompanySize({level: 3, region: city})
				if(!companySizeRes.data.some(item => item.value)) {
					console.log(companySizeRes.data)
					companySizeRes = await getCompanySize()
				}
				companyFinanceRes = await getCompanyFinance({level: 3, region: city})
				if(!companyFinanceRes.data.some(item => item.value)) {
					companyFinanceRes = await getCompanySize()
				}
				commit('SET_REGIONRANK', res.data.hotRegion)
				commit('SET_SKILLRANK', TopFiveDate(res.data.skill))
			}else if(!pos && !city) {
				eduRes = await getEducation()
				regionRes = await getProvinceRank()
				skillRes = await getRegionRank()
				salaryRes = await getPosSalary()
				trendRes = await posTrend()
				companySizeRes = await getCompanySize()
				companyFinanceRes = await getCompanyFinance()
				commit('SET_REGIONRANK', TopFiveDate(regionRes.data))
				commit('SET_SKILLRANK', TopFiveDate(skillRes.data.skill))
			}
			console.log(trendRes.data)
			commit('SET_SALARYLIST', salaryRes.data)
			commit('SET_TRENDLIST', trendRes.data)
			commit('SET_EDULIST', eduRes.data)
			commit('SET_COMPANYSIZELIST', companySizeRes.data)
			commit('SET_FINANCELIST', companyFinanceRes.data)
		},
		clearAll({ commit }) {
			commit('CLEAR_ALL')
		}
	}
}

export default hope