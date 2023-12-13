<template>
    <div class="Main">
        <div class="search-box">
            <el-input v-model="searchKeyword" placeholder="输入订单编号关键字进行搜索"></el-input>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs" v-if="store.state.user.User.role === 1">
            <el-tab-pane label="待处理发货" :name="0">
                <myTab />
                <span v-if="waitShip.length === 0">没有需要发货订单</span>
                <div v-for="(item, index) in waitShip" :key="index">
                    <chargeOrder :order="item" :name="store.state.user.User.name" :type="0" :ship="ship" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="取消订单申请" :name="1">
                <myTab />
                <span v-if="cancelApplication.length === 0">没有订单取消的申请</span>
                <div v-for="(item, index) in cancelApplication" :key="index">
                    <chargeOrder :order="item" :name="store.state.user.User.name" :type="1" :chargeCancel="chargeCancel" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="退单申请" :name="2">
                <myTab />
                <span v-if="refundApplication.length === 0">没有退单的申请</span>
                <div v-for="(item, index) in refundApplication" :key="index">
                    <chargeOrder :order="item" :name="store.state.user.User.name" :type="2" :chargeRefund="chargeRefund" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="其他" :name="3">
                <myTab />
                <span v-if="others.length === 0">其他</span>
                <div v-for="(item, index) in others" :key="index">
                    <chargeOrder :order="item" :name="store.state.user.User.name" :type="3" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import store from '@/store';
import { ref, onMounted, computed } from "vue";
import chargeOrder from '@/components/ChargeOrder/chargeOrder.vue';
import myTab from '@/components/MyTab/myTab.vue'
import baseUtil from '@/utils';
const orders = ref([])
const activeName = ref(0)
const searchKeyword = ref('')
onMounted(async () => {
    if (store.state.user.User.role === 1) {
        if (store.state.order.ordersStatus === 'idle') {
            orders.value = (await store.dispatch('order/getOrdersByShopUser', store.state.user.User.id)).data;
        } else {
            orders.value = store.getters['order/getOrders'];
        }
    }
});
const waitShip = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 2)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const cancelApplication = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 7)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const refundApplication = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 8)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const others = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status !== 2 && item.status !== 7 && item.status !== 8)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const ship = async (userId, orderId) => {
    await store.dispatch('order/chargeShipOrder', {
        userId: userId,
        orderId: orderId
    }).then(res => {
        if (res.code === 1) {
            const index = waitShip.value.findIndex(item => item.id === orderId)
            waitShip.value.splice(index, 1);
            baseUtil.successMessage('发货成功')
        }
        else if (res.code === -2) baseUtil.failMessage('没有权限')
        else if (res.code === 0) baseUtil.failMessage('发货失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const chargeCancel = async (orderId, userId, type) => {
    await store.dispatch('order/chargeCancel', {
        userId: userId,
        orderId: orderId,
        type: type
    }).then(res => {
        if (res === 1) {
            const index = cancelApplication.value.findIndex(item => item.id === orderId)
            cancelApplication.value.splice(index, 1);
            baseUtil.successMessage('操作成功')
        }
        else if (res === -2) baseUtil.failMessage('没有权限')
        else if (res === 0) baseUtil.failMessage('操作失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const chargeRefund = async (orderId, userId, type) => {
    await store.dispatch('order/chargeRefund', {
        userId: userId,
        orderId: orderId,
        type: type
    }).then(res => {
        if (res === 1) {
            const index = refundApplication.value.findIndex(item => item.id === orderId)
            refundApplication.value.splice(index, 1);
            baseUtil.successMessage('操作成功')
        }
        else if (res === -2) baseUtil.failMessage('没有权限')
        else if (res === 0) baseUtil.failMessage('操作失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
</script>

<style scoped>
.search-box {
    padding: 10px;
    width: 500px;
}
</style>