<template>
    <view class="container">
        <view class="navbar_list">
            <view class="navbar_item" @click="open" data-type="posPop">职位<text class="iconfont icon-arrow-down"></text></view>
            <view class="navbar_item" @click="open" data-type="companyPop" >公司<text class="iconfont icon-arrow-down"></text></view>
            <view class="navbar_item" @click="open" data-type="sortPop" >排序<text class="iconfont icon-arrow-down"></text></view>
        </view>
        <pop-up ref="posPop" type="bottom" class="pop_up">
            <view class="filter">
                <scroll-view scroll-y class="filter_list">
                    <uni-list>
                        <uni-list-item v-for="(item1, index1) in posFilter" :key="index1">
                            <text class="title">{{item1.name}}</text>
                            <view 
                            v-for="(item2, index2) in item1.value" 
                            :key="index2" 
                            class="item" 
                            :class="{actived: activedList.some(item => item === item2)}"
                            :data-item="item2"
                            :data-type="item1.type"
                            @click="filterSelect">
                                <text>{{item2}}</text>
                            </view>
                        </uni-list-item>
                    </uni-list>
                </scroll-view>
                <view class="pos_btn" @click="comfirm" data-type="posPop">确定</view>
            </view>
        </pop-up>
        <pop-up ref="companyPop" type="bottom" class="pop_up">
           <view class="filter">
                <scroll-view scroll-y class="filter_list">
                    <uni-list>
                        <uni-list-item v-for="(item1, index1) in companyFilter" :key="index1">
                            <text class="title">{{item1.name}}</text>
                            <view 
                            v-for="(item2, index2) in item1.value" 
                            :key="index2" 
                            class="item"
                            :class="{actived: activedList.some(item => item === item2)}"
                            :data-item="item2"
                            :data-type="item1.type"
                            @click="filterSelect">
                                <text>{{item2}}</text>
                            </view>
                        </uni-list-item>
                    </uni-list>
                </scroll-view>
                <view class="pos_btn" @click="comfirm" data-type="companyPop">确定</view>
            </view>
        </pop-up>
        <pop-up ref="sortPop" type="bottom" class="pop_up">
            <view class="filter">
                <scroll-view scroll-y class="sort_filter_list">
                    <uni-list>
                        <uni-list-item class="sort_item">综合排序</uni-list-item>
                        <uni-list-item class="sort_item">时间排序</uni-list-item>
                    </uni-list>
                </scroll-view>
                <view class="pos_btn">确定</view>
            </view>
        </pop-up>
    </view>
</template>

<script>
import PopUp from '../../../components/uni-popup/uni-popup'
// import { test } from '../../../utils/api'
export default {
    data() {
        return {
            posFilter: [
                { type: 'salary', name: '月薪范围', value: ['2k以下','2k-5k','5k-10k','10k-15k','15k-25k','25k-50k','50k以上'] },
                { type: 'workYear',name: '工作经验', value: ['应届毕业生', '三年及以下', '3-5年', '5-10年', '十年以上','经验不限'] },
                { type: 'education',name: '学历要求', value: ['大专','本科','硕士','博士','不限'] },
                { type: 'jobNature',name: '工作性质', value: ['全职','兼职','实习'] }
            ],
            companyFilter: [
                { type: 'companySize', name: '公司规模', value: ['少于15人','15-50人','50-150人','150-500人','500-2000人','2000人以上'] },
                { type: 'financeStage', name: '融资阶段', value: [ '天使轮','A轮','B轮','C轮','D轮及以上','上市公司','不需要融资'] },
                { type: 'industryField', name: '行业领域', value: ['不限','移动互联网','电商','金融','企业服务','教育','游戏','消费生活','硬件','社交','旅游','体育','工具','广告营销','数据服务','信息安全','人工智能','区块链','VR','AR','软件开发','通讯','房产家居','其他']}
            ],
            activedList: [],
            filter: {}
        }
    },
    components: {
        PopUp
    },
    methods: {
        open(e) {
            let type = e.currentTarget.dataset.type
            this.$refs[type].open()
        },
        filterSelect(e) {
            let type = e.currentTarget.dataset.type
            let item = e.currentTarget.dataset.item 
            //判断是否已经选择，分别加入两个数组
            if(type === 'salary') {
                    this.filter[type] = [item]
                    this.activedList.map((el, index) => {
                        if(el.match(/k/g) && el.match(/k/g).length) {
                            console.log(el)
                            this.activedList.splice(this.activedList.indexOf(el),1)
                        }
                    })
                    this.activedList.push(item)
            }else {
                if(this.activedList.indexOf(item) === -1){
                    this.activedList.push(item)
                    if(Object.keys(this.filter).indexOf(type) === -1) {
                        this.filter[type] = []
                    }
                    this.filter[type].push(item)
                }else {
                    this.activedList.splice(this.activedList.indexOf(item),1)
                    this.filter[type].splice(this.filter[type].indexOf(item),1)
                }
            }
            console.log(this.activedList)
            console.log(this.filter)
        },
        comfirm(e) {
            let type = e.currentTarget.dataset.type
            this.$refs[type].close()
            if(this.filter['workYear'] && this.filter['workYear'].includes('经验不限')) {
                const index = this.filter['workYear'].indexOf('经验不限')
                this.filter['workYear'][index] = "不限"
            }
            console.log(this.filter)
            uni.$emit('filterRequest',this.filter)
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    .navbar_list {
        display: flex;
        .navbar_item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70rpx;
            flex: 1;
            color: $middle-color;
            font-size: $main-size
        }
    }
    .pop_up {
        .filter {
            background-color: $back-color;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30rpx 0;
            .filter_list {
                height: 50vh;
                color: $main-color;
                width: 92%;
                margin-bottom: 30rpx;
                .actived {
                    color: white;
                    background-color: $actived-color;
                }
                .title {
                    margin: 30rpx 0;
                    font-size: $main-size;
                    display: block;
                    font-weight: 500;
                }
                .item {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 165rpx;
                    height: 60rpx;
                    font-size: 27rpx;
                    padding: 8rpx 0;
                    margin: 10rpx 5rpx;
                    border: 1rpx solid $circle-border-color;
                }
            }
            .sort_filter_list {
                height: 10vh;
                color: $main-color;
                width: 92%;
                margin-bottom: 30rpx;
                .sort_item {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    font-size: $main-size;
                    width: 320rpx;
                    height: 60rpx;
                    padding: 8rpx 0;
                    margin: 10rpx 8rpx;
                    border: 1rpx solid $circle-border-color;
                }
            }
            .pos_btn {
                width: 92%;
                background-color: $actived-color;
                color: white;
                font-size: $main-size;
                border-radius: 6rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20rpx 0;
            }
            
        }
        
    }
}
    
</style>