<template>
    <div class="main">
        <h1 style="font-size:25px; font-family:宋体;font-weight:900">猜你喜欢
            <img src="../../assets/个性推荐.png" style="width:60px" />
        </h1>
        <div class="row" v-for="i in MaxRow" :key="i">
            <div class="card-container">
                <div class="card" v-for="j in MaxLine" :key="j">
                    <cardVue
                        v-if="tableData !== undefined && tableData !== null && tableData.length > 0 && (pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1 < tableData.length"
                        :data="tableData[(pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1]"
                        :size="(pageSize * (currentPage - 1) + (i - 1) * MaxLine + j) - 1" />
                </div>
            </div>
        </div>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" large
                layout="prev, pager, next, jumper" :total="tableData.length" />
        </div>
    </div>
</template>
  
<script setup >
import cardVue from '../CardVue/cardVue';
import { ref, onMounted } from 'vue'
import store from '@/store';
const currentPage = ref(1)
const pageSize = ref(25)
const tableData = ref([])
const MaxLine = ref(5)
const MaxRow = ref(5)
onMounted(async () => {
    if (store.state.goods.GoodsStatus === "idle") {
        await store.dispatch('goods/getAllData').then(() => {
            tableData.value = store.getters['goods/getGoods']
        })
    } else tableData.value = store.getters['goods/getGoods']
});
</script>
  
<style>
.main {
    width: 1300px;
    margin: 0 auto;
    background-color: rgb(255, 248, 249);
    border-radius: 30px;
    padding: 30px 30px 30px 30px;
    margin-top: 50px;
    margin-bottom: 50px
}

.row {
    width: 100%;
}

.spacer {
    flex: 0 0 100px;
    /* 设置左右间隔为100px */
}

.card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 垂直居中对齐 */
}

.card {
    margin: 10px;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}
</style>
  