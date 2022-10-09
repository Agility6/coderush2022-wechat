<template>
    <view class="container">
        <Top
        :location="userLocation" 
        :nowInput="sNowInput" 
        @searchPos="nowSearchPos" 
        :isComfirm="isComfirm"></Top>
        <!-- 搜索结果列表 -->
        <view class="result_box" v-if="sNowInput">
            <text class="no_result" v-if="noResult">暂时没有符合搜索条件的职位</text>
            <view v-if="searchedPosList.length">
                <search-filter class="result_navbar"></search-filter>
                <position-list 
                class="result_list"
                :posList="searchedPosList" 
                mode="search" 
                isScroll
                :searchKey="sNowInput"
                :filter="filter"></position-list>
            </view>
            <view v-if="isSearching">
                <ul class="searchKeys_list" v-for="(item, index) in searchShowing" :key="index">
                    <li class="searchKeys" @click="handleSelect" data-type="searchShowing" :data-key="item">
                        <text class="iconfont icon-icon_search"></text>
                        {{item}}
                    </li>
                </ul>
            </view>
        </view>
        <view v-else class="search_box">
            <!-- 分类搜索 -->
            <navigator url="../../../pages/selectPosition/selectPosition?mode=search" class="search_filter">
                <text class="title">按分类搜索</text>
                <text class="search_comfirm">技术<text class="iconfont icon-arrow-down"></text></text>
            </navigator>
            <view class="border"></view>
            <view class="search_recommend">
                <!-- 搜索记录 -->
                <view class="search_history">
                    <view class="history_title">搜索记录<text class="iconfont icon-ashbin" @click="clearHistory"></text></view>
                    <view class="history_list" >
                        <text class="history_item" 
                        v-for="item in searchHistory" 
                        :key="item.id"
                        @click="selectHistory"
                        :data-index="item.id">
                        {{item.value}}
                        </text>
                    </view>
                </view>
                <!-- 热门职位 -->
                <view class="recommend" v-if="habitList.length">
                    <view class="recommend_title">猜你喜欢</view>
                    <view class="recommend_list" >
                        <text class="recommend_item" 
                        v-for="(item ,index) in habitList"
                        :key="index"
                        @click="handleSelect"
                        :data-index="index"
                        data-type="habitList">
                        {{item}}
                        </text>
                    </view>
                </view>
                <!-- 热门公司 -->
                <view class="recommend">
                    <view class="recommend_title">热门公司</view>
                    <view class="recommend_list" >
                        <text class="recommend_item" 
                        v-for="(item ,index) in campanyList"
                        :key="index"
                        @click="handleSelect"
                        :data-index="index"
                        data-type="campanyList">
                        <text class="iconfont icon-fire"></text>
                        {{item}}
                        </text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import Top from '../../components/top/top'
import SearchFilter from '../../components/searchFilter/searchFilter'
import PositionList from '../../../components/positionList/positionList'
import { mapGetters, mapActions } from 'vuex'
import { searchPos } from '@/utils/api'
import keys from './search'
// import { debounce } from '../../../utils/utils'
let timer = null

export default {
    data() {
        return {
            userLocation: '',
            sNowInput: '',
            filter: {},
            // recommendList: ['前端', 'java', 'ui', '自动化测试'],
            campanyList: ['虎牙科技', '字节跳动', 'Bigo', '小鹏汽车', '唯品会'],
            noResult: false,
            isSearching: false,
            isComfirm: false
        }
    },
    onLoad() {
        let history = uni.getStorageSync("searchHistory") || []
        this.setSearchHistory(history)
    },
    onShow() {
        if(this.userInfo.location) {
            this.userLocation = this.userInfo.location
        }
        uni.$on('request', (data) => {
            this.nowSearchPos(data)
            this.sendRequest(data, 1)
            this.isComfirm = true
        })
        uni.$on('filterRequest', (data) => {
            // console.log(data)
            this.filter = data
            this.clearSearchList()
            this.sendRequest(this.sNowInput, 1, 0, data)
        })
    },
    onUnload() {
        uni.setStorageSync('searchHistory', this.searchHistory)
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'searchHistory',
            'searchedPosList',
            'userHabit'
        ]),
        habitList() {
            // console.log([...this.userHabit.skillList, ...this.userHabit.typeList])
            if(this.userHabit.skillList) {
                return [...this.userHabit.skillList].map((item) => {
                    return item[0]
                })
            }
        },
         //搜索提示词
         searchShowing() {
             let list = []
             let reg
             if(this.sNowInput.replace(/[\^\$\*\+\?\=\!\.\(\)\\\/\[\]\{\}]/,"")) {
                reg = new RegExp(this.sNowInput.replace(/[\^\$\+\?\=\!\.\(\)\\\/\[\]\{\}]/,""),"gi")
             }else {
                reg = /无结果/
             }
             
             keys.map((item) => {
                 if(reg.test(item)) {
                     if(list.indexOf(item) === -1) {
                         list.push(item)
                     }
                 }
             })
             return list
         }
    },
    components: {
        Top,
        SearchFilter,
        PositionList
    },
    methods: {
        ...mapActions([
            'clearSearchHistory',
            'setSearchHistory',
            'setSearchedPosList',
            'clearSearchList'
        ]),
        async _searchPos(key, location, page, filter) {
            const res = await searchPos(key,location, page, filter)
            // this.resultList = res.data
            if(res.data.length) {
                this.noResult = false
                this.setSearchedPosList(res.data)
            }else {
                this.noResult = true
            }
        },
        //获取当前搜索框的内容
        nowSearchPos(data) {
            this.sNowInput = data.trim()
            this.clearSearchList()
            this.isComfirm = false
            this.noResult = false
            if(!this.isSearching) {
                this.isSearching = true
            }
        },
        //发送请求
        //暂时为减轻服务器压力，只有确认搜索时才发送请求
        sendRequest(key, page, delay = 800, filter) {
            this.isSearching = false
            timer && clearTimeout(timer)
            timer = setTimeout(() => {
                if(key.trim()) {
                    this._searchPos(key.trim(), this.userInfo.location, page, filter)
                }
            }, delay)
        },
        clearHistory() {
            uni.showModal({
                content: '确定删除全部搜索记录?',
                success: (res) => {
                    if (res.confirm) {
                        this.clearSearchHistory()
                    }
                }
            })
        },
        //点击搜索记录再次搜索
        selectHistory(e) {
             this.searchHistory.map((item) => {
                 if(item.id === e.currentTarget.dataset.index) {
                     this.nowSearchPos(item.value)
                     this.sendRequest(item.value, 1, 0)
                 }
            })
            this.isComfirm = true
        },
        handleSelect(e) {
            //点击标签搜索
            const type = e.currentTarget.dataset.type
            if(type === 'searchShowing') {
                const key = e.currentTarget.dataset.key
                this.nowSearchPos(key)
                this.sendRequest(key, 1, 0)
            }else {
                const index = e.currentTarget.dataset.index
                this.nowSearchPos(this[type][index])
                this.sendRequest(this[type][index], 1, 0)
            }
            //搜索之后保存记录
            const length = this.searchHistory.length
            if(!length) {
                this.setSearchHistory({ value: this.sNowInput, id: 0})
            }else {
                this.setSearchHistory({ value: this.sNowInput, id: length})
            }
            this.isComfirm = true
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        padding: 0 30rpx;
        position: relative;
        .border {
            position: absolute;
            left: 0;
            top: 180rpx;
            width: 100%;
            height: 20rpx;
            background-color: $back-color;
        }
        .search_box {
            .search_filter {
                height: 90rpx;
                width: 100%;
                display: flex;
                align-items: center;
                position: relative;
                margin-top: 10rpx;
                border-top: 1rpx solid $circle-border-color;
                .title {
                    color: $main-color;
                    font-size: $main-size;
                    font-weight: 500;
                }
                .search_comfirm {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    color: $shallow-color;
                    font-size: $middle-size;
                    right: 0;
                }
            }
            .search_recommend {
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                .search_history {
                    width: 100%;
                    padding-top: 60rpx;
                    display: flex;
                    flex-direction: column;
                    .history_title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: $main-color;
                        .icon-ashbin {
                            color: $middle-color;
                            font-size: 45rpx;
                        }
                    }
                    .history_list {
                        width: 100%;
                        .history_item {
                            display: inline-block;
                            font-size: $middle-size;
                            color: $middle-color;
                            padding: 15rpx;
                            border: 1rpx solid $circle-border-color;
                            margin: 15rpx 30rpx 15rpx 0;
                        }
                    }
                }
                .recommend {
                    width: 100%;
                    padding-top: 60rpx;
                    display: flex;
                    flex-direction: column;
                    .recommend_title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: $main-color;
                    }
                    .recommend_list {
                        width: 100%;
                        .recommend_item {
                            display: inline-block;
                            font-size: $middle-size;
                            color: $middle-color;
                            padding: 15rpx;
                            border: 1rpx solid $circle-border-color;
                            margin: 15rpx 30rpx 15rpx 0;
                            white-space: nowrap;
                            .icon-fire {
                                margin: 0 10rpx;
                                color: $salary-color;
                            }
                        }
                    }
                    
                }
            }
        }
        .result_box {
            .no_result {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 80rpx 0;
                color: $main-color;
                font-size: $main-size;
            }
            .result_list {
                
            }
            .searchKeys_list {
                display: flex;
                flex-direction: column;
                .searchKeys {
                    width: 100%;
                    height: 80rpx;
                    line-height: 80rpx;
                    font-size: $main-size;
                    color: $middle-color;
                    .icon-icon_search {
                        font-size: 45rpx;
                        color: $shallow-color;
                        margin-right: 30rpx;
                    }
                }
            }
            
        }
    }
</style>