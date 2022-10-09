<template>
    <view class="conatiner">
        <cell cType="input" :value="eduObj.schoolName" valueType="schoolName" @cellValue="handleCellValue" title="学校名称"></cell>
        <cell cType="popup" :value="eduObj.edu" valueType="edu" :cList="eduList" @cellValue="handleCellValue" title="学历"></cell>
        <cell cType="input" :value="eduObj.major" valueType="major" @cellValue="handleCellValue" title="专业"></cell>
        <cell cType="date" dateMode='year' :value="eduObj.eduStartDate" valueType="eduStartDate" @cellValue="handleCellValue" title="入学年份" start="1970" :end="end"></cell>
        <cell cType="date" dateMode='year' :value="eduObj.eduEndDate" valueType="eduEndDate" @cellValue="handleCellValue" title="毕业年份" start="1970" :end="end"></cell>
        <button class="save_btn" @click="saveInfo">保存</button>
        <text class="delete_btn" v-if="mode === 'edit'" @click="deleteInfo">删除</text>
    </view>
</template>

<script>
import cell from '@/components/cell/cell'
import { getEndDate } from '@/utils/utils'
import { mapGetters, mapActions } from 'vuex'
export default {
    data() {
        return {
            end: '',
            mode: '',
            limit: 5,
            eduList: ['专科', '本科', '硕士', '博士', '其他'],
            eduObj: {}
        }
    },
    onLoad(option) {
        this.end = getEndDate(1000 * 60 * 60 * 24 * 30 * 12 * 10 ,'year')
        console.log(this.end)
        //mode: 1.edit 2.create
        this.mode = option.mode
        if(option.mode === 'edit') {
            let currentObj = this.eduInfo.filter(item => {
                return item.eid === parseInt(option.eid)
            })
            this.eduObj = currentObj[0]
            this.limit = 6
        }
    },
    computed: {
        ...mapGetters([
            'eduInfo'
        ])
    },
    components: {
        cell
    },
    methods: {
        ...mapActions([
            'setEduInfo',
            'deleteEduInfo'
        ]),
        handleCellValue(e) {
            this.$set(this.eduObj, e.type, e.data)
            // this.eduObj[e.type] = e.data
        },
        saveInfo() {
            if(Object.keys(this.eduObj).length < this.limit){
                uni.showToast({
                    title: '请完善您的信息',
                    icon: 'none'
                })
            }else{
                var flag = 1
                Object.values(this.eduObj).map((item, index) => {
                    if(item === '') {
                        uni.showToast({
                            title: '请完善您的信息',
                            icon: 'none'
                        })
                        flag = 0
                    }
                })
                if(flag) {
                    if(this.mode === 'create') {
                        if(!this.eduInfo.length) {
                            this.eduObj.eid = 1
                        }else {
                            this.eduObj.eid = this.eduInfo[this.eduInfo.length - 1].eid + 1
                        }
                    }
                    this.setEduInfo(this.eduObj)
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
            }
        },
        deleteInfo() {
            uni.showModal({
				content: '确认删除此项？',
				success: (res) => {
					if (res.confirm) {
						this.deleteEduInfo(this.eduObj.eid)
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
.conatiner {
    width: 100%;
    .save_btn, .delete_btn {
        margin: 120rpx auto;
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