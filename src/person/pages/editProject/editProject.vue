<template>
    <view class="container">
        <cell cType="input" :value="projectObj.name" valueType="name" @cellValue="handleCellValue" title="项目名称"></cell>
        <cell cType="input" :value="projectObj.position" valueType="position" @cellValue="handleCellValue" title="你的职责"></cell>
        <cell cType="date" dateMode='month' :value="projectObj.startDate" valueType="startDate" @cellValue="handleCellValue" title="开始时间" start="1970" :end="now"></cell>
        <cell cType="date" dateMode='month' :value="projectObj.endDate" valueType="endDate" @cellValue="handleCellValue" title="结束时间" start="1970" :end="now" bottom></cell>
        <text class="introduce_title">项目内容</text>
        <textarea class="introduce_content" @blur="getContent" :value="projectObj.introduce"/>
        <text class="show_title">项目链接(若有)</text>
        <input type="text" placeholder="https://" class="show_src">
        <button class="save_btn" @click="saveInfo">保存</button>
        <text class="delete_btn" v-if="mode === 'edit'" @click="deleteInfo">删除</text>
    </view>
</template>

<script>
import { getNowDate,debounce } from '@/utils/utils'
import { mapActions,mapGetters } from 'vuex'
export default {
    data() {
        return {
            now: '',
            mode: '',
            projectObj: {}
        }
    },
    onLoad(option) {
        this.mode = option.mode
        this.now = getNowDate('month')
        if(option.mode === 'edit') {
            let currentObj = this.projInfo.filter(item => {
                console.log(item.pid)
                return item.pid === parseInt(option.pid)
            })
            this.projectObj = currentObj[0]
        }
    },
    computed: {
        ...mapGetters([
            'projInfo'
        ])
    },
    methods: {
        ...mapActions([
            'setProjInfo',
            'deleteProjInfo'
        ]),
        handleCellValue(e) {
            this.$set(this.projectObj, e.type, e.data)
            console.log(e)
        },
        getContent(e) {
             this.$set(this.projectObj, 'introduce', e.detail.value)
        },
        saveInfo() {
            setTimeout(() => {
                if(!this.projectObj.name || !this.projectObj.position || !this.projectObj.startDate || !this.projectObj.endDate) {
                    uni.showToast({
                        title: '请完善您的信息',
                        icon: 'none'
                    })
                }else {
                     if(this.mode === 'create') {
                        if(!this.projInfo.length) {
                            this.projectObj.pid = 1
                        }else {
                            this.projectObj.pid = this.projInfo[this.projInfo.length - 1].pid + 1
                        }
                    }
                    this.setProjInfo(this.projectObj)
                    uni.showToast({
                        title: '保存成功'
                    }).then(() => {
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1
                            });
                        },1000)
                    })
                }
            }, 200) 
        },
        deleteInfo() {
            uni.showModal({
				content: '确认删除此项？',
				success: (res) => {
					if (res.confirm) {
						this.deleteProjInfo(this.projectObj.pid)
						uni.showToast({
							title: '删除成功',
							icon: 'none'
                        });
                        setTimeout(() => {
                             uni.navigateBack({
                                delta: 1
                            });
                        },1000)
					}
				}
			});
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    .introduce_title, .show_title {
        display: block;
        font-size: $middle-size;
        color: $middle-color;
        background-color: $back-color;
        padding: 15rpx 30rpx;
    }
    .introduce_content, .show_src {
        font-size: $middle-size;
        color: $middle-color;
        padding: 30rpx;
    }
    .show_src {
        padding: 20rpx 10rpx;
        border-bottom: 2rpx solid $border-color;
    }
    .save_btn, .delete_btn {
        margin: 0 auto;
        margin-top: 60rpx;
        width: 500rpx;
        height: 80rpx;
        color: $border-color;
        background-color: $theme-color;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .delete_btn {
        margin-top: 30rpx;
        color: $middle-color;
        background-color: white;
    }
}
</style>