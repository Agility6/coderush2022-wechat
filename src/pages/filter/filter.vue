<template>
	<view class="container">
		<cell 
			cType="navigator" 
			cUrl="../selectPosition/selectPosition?mode=hope" 
			title="期望职位类别" 
			:valueType="filterList[0].type" 
			:value="nowHopePos"
			@cellValue="handleCellValue">
		</cell>

		<cell 
			cType="popup"  
			title="工作性质" 
			:cList="filterList[1].typeList" 
			:valueType="filterList[1].type"
			:value="hopeType"
			@cellValue="handleCellValue">
		</cell>

		<cell 
			cType="salary"  
			title="期望工资" 
			:valueType="filterList[2].type"
			:value="hopeSalary"
			@cellValue="handleCellValue">
		</cell>

		<cell 
			cType="navigator" 
			cUrl="../selectRegion/selectRegion?mode=hope" 
			title="期望城市" 
			:valueType="filterList[3].type" 
			:value="hopeCity"
			@cellValue="handleCellValue">
		</cell>

		<cell 
			cType="date" 
			:value="hopeDate" 
			:valueType="filterList[4].type" 
			@cellValue="handleCellValue" 
			title="到岗时间" 
			:start="start"
			:end="end" 
			bottom>
		</cell>
		<view class="clear" @click="clearFilter">清空</view>
		<button class="filter_save" @click="saveFilter">保存</button>
	</view>
</template>

<script>
	import cell from '@/components/cell/cell'
	import SalaryPicker from '@/components/salaryPicker/salaryPicker'
	import DatePicker from '@/components/datePicker/datePicker'
	import { debounce, getNowDate, getEndDate } from '@/utils/utils'
	import { mapGetters, mapActions} from 'vuex'
	
	export default {
		data() {
			return {
				mode: '',
				filterList: [
					{
						type: 'hopePos',
						name: '期望职位类别'
					},
					{
						type: 'hopeType',
						name: '工作性质',
						typeList: ['全职','兼职','实习']
					},
					{
						type: 'hopeSalary',
						name: '期望月薪'
					},
					{
						type: 'hopeCity',
						name: '期望城市'
					},
					{
						type: 'hopeDate',
						name: '到岗时间'
					}
				],
				start: '',
				end: ''
			}
		},
		onLoad(option) {
			this.mode = option.mode
			this.start = getNowDate()
			this.end = getEndDate(1000 * 60 * 60 * 24 * 30 * 6)
		},
		components: {
			SalaryPicker,
			DatePicker
		},
		computed: {
			...mapGetters([
				'hopeSalary',
				'hopeCity',
				'hopeType',
				'hopeDate',
				'hopePos'
			]),
			hopeObj() {
				return {
					hopeType: this.hopeType,
					hopeDate: this.hopeDate,
					hopePos: this.hopePos,
					hopeCity: this.hopeCity,
					hopeSalary: this.hopeSalary
				}
			},
			nowHopePos() {
				if(this.hopePos) {
					return this.hopePos.split('-')[1]
				}else {
					return this.hopePos
				}
				
			}
		},
		methods: {
			...mapActions([
				'setHopeData',
				'setReady',
				'clearAll'
			]),
			handleCellValue(e) {
				console.log(e)
				this.setHopeData(e)
			},
			saveFilter() {
				//后期将数据保存到服务器并筛选首页数据
				uni.setStorageSync('hopeObj', this.hopeObj)
				this.setReady(this.hopeObj)
				uni.$emit('indexRequest')
				uni.showToast({
					title: '保存成功'
				}).then(() => {
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					},1000)
				})
			},
			clearFilter() {
				uni.showModal({
					content: '确认清空吗？',
					success: (res) => {
						if (res.confirm) {
							this.clearAll()
						} 
					}
				});
			}
			
		}
	}
	
</script>

<style scoped lang="scss">
	.container {
		margin-top: 30rpx;
		.clear {
			margin-top: 100rpx;
			height: 80rpx;
			color: $shallow-color;
			font-size: $middle-size;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.filter_save {
			margin-top: 50rpx;
			width: 500rpx;
			height: 80rpx;
			color: $border-color;
			background-color: $theme-color;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
