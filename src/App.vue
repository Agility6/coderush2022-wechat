<script>
import { mapActions } from 'vuex'
	export default {
		onLaunch() {
			//模拟首页加载时从用户服务器拉取用户数据
			let userInfo = uni.getStorageSync('userViewInfo')
			if(Object.keys(userInfo).length) {
				let values = Object.values(userInfo)
				Object.keys(userInfo).map((item, index) => {
					this.setUserInfo({ type: item, data: values[index]})
				})
			}

			let collectList = uni.getStorageSync('collectList')
			if(collectList && collectList.length) {
				this.setCollect(collectList)
			}

			let commitList = uni.getStorageSync('commitList')
			if(commitList && commitList.length) {
				this.setCommit(commitList)
			}

			let resumeInfo = uni.getStorageSync('infoObj')
			if(resumeInfo) {
				this.setResumeInfo(resumeInfo)
			}

			let eduList = uni.getStorageSync('eduList')
			if(eduList && eduList.length) {
				this.setEduInfo(eduList)
			}

			let projList = uni.getStorageSync('projList')
			if(projList && projList.length) {
				this.setProjInfo(projList)
			}

			if(uni.getStorageSync('hopeObj')) {
				let firstHopeObj = uni.getStorageSync('hopeObj')
				let keys = Object.keys(firstHopeObj)
				Object.values(firstHopeObj).map((item, index) => {
					if(item) {
						this.setHopeData({type: keys[index], data: item})
					}
				})
			}
			if(uni.getStorageSync('userHabit')) {
				let userHabit = uni.getStorageSync('userHabit')
				this.setUserHabit(userHabit)
			}
			this.set_country_salaryList()
		},
		methods: {
			...mapActions([
				'setUserInfo',
				'setCollect',
				'setEduInfo',
				'setResumeInfo',
				'setHopeData',
				'setProjInfo',
				'setUserHabit',
				'setCommit',
				'set_country_salaryList'
			])
		}
	}
</script>
	
<style>
/* @import url('~@/static/styles/weui.wxss'); */
</style>

