<template>
	<picker 
	class="picker"
	mode="multiSelector" 
	:range="[firstList, secondList]" 
	@columnchange="handlePickerChange"
	@change="handleChange" 
	:value="valueList"
	>
		<text class="item_title">{{pName}}</text>
		<text class="item_selected">{{pValue}}</text>
		<text class="iconfont icon-arrow-right"></text>
	</picker>
</template>

<script>
	export default {
		props: {
			pName: {
				type: String,
				default: ''
			},
			pValue: {
				type: String,
				default: ''
			},
			pType: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				firstList: [],
				secondList: [],
				valueList: [null, null]
			};
		},
		created() {
			// console.log(this.pValue)
			for(let i = 1; i <= 100; i++) {
				if(i === 100) {
					this.firstList.push('100K+')
				}else {
					this.firstList.push(`${i}K`)
				}
				
			}
			this.secondList = this.firstList.slice(1,100)
		},
		methods: {
			handlePickerChange(e) {
				//设置薪水区间， 第一列不大于等于第二列
				const secondLen = this.secondList.length
				if(e.detail.column === 0) {	
					if(e.detail.value === 98) {
						this.secondList.splice(0, secondLen, '100K')
					} else if(e.detail.value === 99) {
						this.secondList.splice(0, secondLen, '--')
					}else {
						this.secondList.splice(0,secondLen)
						this.firstList.slice(e.detail.value+1,this.firstList.length - 1).map((item, index) => {
							this.secondList.push(item)
						})
						this.secondList.push('100K')
					}
					
				}
			},
			
			handleChange(e) {
				const index1 = e.detail.value[0]
				const index2 = e.detail.value[1]
				let salary = ''
				if(index2 === null) {
					salary = `${this.firstList[index1]} - ${this.firstList[index1+1]}`
				}else if(index1 === 99) {
					salary = this.firstList[index1]
				}else {
					salary = `${this.firstList[index1]} - ${this.secondList[index2]}`
				}
				uni.showToast({
					title: salary,
					icon: "none"
				})
				
				this.$emit('comfirm', { type: this.pType, data: salary})
			}
		}
		
	}
</script>

<style scoped lang="scss">
	.picker {
		width: 100%;
		height: 100rpx;
		position: relative;
		line-height: 100rpx;
		.item_title {
			color: $main-color;
			font-size: 35rpx;
		}
		.item_selected {
			position: absolute;
			color: $shallow-color;
			font-size: $main-size;
			right: 60rpx;
		}
		.icon-arrow-right {
			position: absolute;
			color: $shallow-color;
			margin-left: 20rpx;
			right: 0;
			font-size: $small-size;
		}
	}
	
</style>
