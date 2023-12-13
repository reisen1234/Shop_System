<template>
    <div class="main">
        <h1 style="font-size:25px; font-family:宋体;font-weight:900">
            此次共检索到{{ goods.length }}件符合要求的商品
        </h1>
        <div class="row" v-for="i in MaxRow" :key="i">
            <div class="card-container">
                <div class="card" v-for="j in MaxLine" :key="j">
                    <cardVue
                        v-if="goods !== undefined && goods !== null && goods.length > 0 && (pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1 < goods.length"
                        :data="goods[(pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1]"
                        :size="(pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1" />
                </div>
            </div>
        </div>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" large
                layout="prev, pager, next, jumper" :total="goods.length" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from 'vue'
import store from '@/store';
import cardVue from '../../components/CardVue/cardVue.vue';
const currentPage = ref(1)
const pageSize = ref(50)
const MaxLine = ref(5)
const MaxRow = ref(10)
const route = useRoute();
const searchValue = ref(route.params.like)
const goods = ref([])
onMounted(async () => {
    goods.value = (await store.dispatch("goods/getGoodsLike", searchValue.value))
});
</script>

<style lang="scss" scoped></style>