<template>
    <div v-if="shop !== null && shop != []" class="Main"
        style="width: 1300px; padding:20px; margin-top:10px;margin-bottom:10px; border-radius: 50px;">
        <el-row :gutter="20" class="demo-avatar demo-basic">
            <el-col :span="5" style="border-right: 1px solid var(--el-border-color);">
                <el-popover :width="250"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                    <template #reference>
                        <el-row>
                            <el-col :span="6">
                                <el-avatar
                                    :src="shop.photos === null || shop.photos === undefined ? defaultAvatarUrl : shop.photos"
                                    class="centered-content" size="large" />
                            </el-col>
                            <el-col :span="18">
                                <el-row>
                                    <el-text truncated>
                                        <span class="shop-font-style">
                                            {{ shop.name }}
                                        </span>
                                    </el-text>
                                </el-row>
                                <el-row>
                                    <img :src="photoUrl" style="width: 40px;" />
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                    <template #default>
                        <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
                            <div>
                                <p style="margin: 0;" class="shop-font-style">
                                    {{ shop.name }}
                                </p>
                                <p>
                                    综合体验: <el-rate v-model="rateValue" disabled show-score />
                                </p>
                                <p style="padding-top: 10px;">
                                    掌柜: {{ user.name }}
                                </p>
                                <el-divider />
                                <p>
                                    <el-row style="padding-left: 30px;">
                                        <el-col :span="8">
                                            <span style="color: rgb(127,127,127);">
                                                宝贝
                                            </span>
                                            <div style="font-weight: 600;">
                                                {{ Number(shop.describeRating).toFixed(1) }}
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <span style="color: rgb(127,127,127);">
                                                卖家
                                            </span>
                                            <div style="font-weight: 600;">
                                                {{ Number(shop.serveRating).toFixed(1) }}
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <span style="color: rgb(127,127,127);">
                                                物流
                                            </span>
                                            <div style="font-weight: 600;">
                                                {{ Number(shop.logisticsRating).toFixed(1) }}
                                            </div>
                                        </el-col>
                                    </el-row>
                                </p>
                            </div>

                        </div>
                    </template>
                </el-popover>
            </el-col>
            <el-col :span="2">
                <span style="color: rgb(127,127,127);">
                    宝贝描述
                </span>
                <div style="font-weight: 600;">
                    {{ Number(shop.describeRating).toFixed(1) }}
                </div>
            </el-col>
            <el-col :span="2">
                <span style="color: rgb(127,127,127);">
                    卖家服务
                </span>
                <div style="font-weight: 600;">
                    {{ Number(shop.serveRating).toFixed(1) }}
                </div>
            </el-col>
            <el-col :span="2">
                <span style="color: rgb(127,127,127);">
                    物流服务
                </span>
                <div style="font-weight: 600;">
                    {{ Number(shop.logisticsRating).toFixed(1) }}
                </div>
            </el-col>
            <el-col :span="6">
                <div class="flex-grow">
                    <el-input placeholder="搜索本店商品" v-model="searchValue" :prefix-icon="Search"
                        style="width: 500px; margin: 0 auto; height:40px;" />
                </div>
            </el-col>

        </el-row>
    </div>
    <div class="Main" style="width: 1300px; padding:20px; margin-top:10px;margin-bottom:10px; border-radius: 50px;">
        <div class="row" v-for="i in MaxRow" :key="i">
            <div class="card-container">
                <div class="card" v-for="j in MaxLine" :key="j">
                    <cardVue
                        v-if="filterGoodsData !== undefined && filterGoodsData !== null && filterGoodsData.length > 0 && (pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1 < filterGoodsData.length"
                        :data="filterGoodsData[(pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1]"
                        :size="(pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1" />
                </div>
            </div>
        </div>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" large
                layout="prev, pager, next, jumper" :total="filterGoodsData.length" />
        </div>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/avatar.png'
import photoUrl from '@/assets/photo.png'
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from 'vue';
import store from '@/store';
import { Search, } from '@element-plus/icons-vue'
import cardVue from '../../components/CardVue/cardVue.vue';
const currentPage = ref(1)
const pageSize = ref(50)
const MaxLine = ref(5)
const MaxRow = ref(10)
const route = useRoute();
const shopId = route.params.shopId
const shop = ref({})
const user = ref({})
const searchValue = ref('')
const rateValue = ref()
const goods = ref([])
onMounted(async () => {
    await store.dispatch('shop/getShopById', shopId).then(res => {
        shop.value = res;
        rateValue.value = Number(Number((res.describeRating + res.logisticsRating + res.serveRating) / 3).toFixed(1));
    })
    goods.value = (await store.dispatch('goods/getGoodsByShopId', shopId))
    user.value = (await store.dispatch('user/getUserById', { id: shop.value.userId }))

});
const filterGoodsData = computed(() => {
    const table = goods.value;
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchValue.value ||
            data.name.toLowerCase().includes(searchValue.value.toLowerCase())
    ).slice(pageSize.value * (currentPage.value - 1), pageSize.value * (currentPage.value - 1) + pageSize.value)
});
</script>
<style></style>