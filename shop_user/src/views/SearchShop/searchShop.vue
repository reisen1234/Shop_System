<template>
    <div class="main">
        <h1 style="font-size:25px; font-family:宋体;font-weight:900">
            此次共检索到{{ shop.length }}件符合要求的商店
        </h1>
        <el-row>
            <el-col>
                <div class="row" v-for="i in shop.length" :key="i">
                    <shopSider :shop="shop[i - 1]" />
                </div>
            </el-col>
        </el-row>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" large
                layout="prev, pager, next, jumper" :total="shop.length" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from 'vue'
import store from '@/store';
import shopSider from '@/components/ShopSider/shopSider.vue'
const currentPage = ref(1)
const pageSize = ref(20)
const route = useRoute();
const searchValue = ref(route.params.like)
const shop = ref([])
onMounted(async () => {
    shop.value = (await store.dispatch("shop/getShopLike", searchValue.value))
});
</script>

<style lang="scss" scoped></style>