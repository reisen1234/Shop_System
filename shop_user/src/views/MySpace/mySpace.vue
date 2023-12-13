<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<template>
    <div class="Main">
        <el-descriptions border :column="1" title="用户信息" size="large" style="padding-bottom:20px;">
            <el-descriptions-item label="用户头像">
                <el-upload class="avatar-uploader" :on-success="uploadImage" :show-file-list="false"
                    :action="'http://localhost:8099/user/avatar?id=' + userData.id" method="post">
                    <el-avatar :src="userData.avatarUrl === null ? defaultAvatarUrl : userData.avatarUrl" size="large" />
                </el-upload>
            </el-descriptions-item>
            <el-descriptions-item label="用户名">
                <span @click="dialogFormVisible = true">{{ userData.name }}
                </span>
                <el-dialog v-model="dialogFormVisible" title="修改用户名" style="width:500px">
                    <el-form :model="form" ref="ruleFormRef" @submit.prevent>
                        <el-form-item label="用户名">
                            <el-input v-model="form.name" placeholder="Please input" maxlength="20" show-word-limit />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="handleconfirm(ruleFormRef)">
                                Confirm
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-descriptions-item>
            <el-descriptions-item label="余额">
                ￥ {{ Number(userData.balance).toFixed(2) }}
                <el-button style="margin-left: 30px;" @click="rechargeVisable = true">余额充值</el-button>
                <el-dialog v-model="rechargeVisable" title="充值" width="1100px">
                    <el-row>
                        <el-col :span="6">
                            <rechargeVue :recharge="recharge60" :fontRecharge="fontRecharge" :type="60" />
                        </el-col>
                        <el-col :span="6">
                            <rechargeVue :recharge="recharge300" :fontRecharge="fontRecharge" :type="300" />
                        </el-col>
                        <el-col :span="6">
                            <rechargeVue :recharge="recharge980" :fontRecharge="fontRecharge" :type="980" />
                        </el-col>
                        <el-col :span="6">
                            <rechargeVue :recharge="recharge1980" :fontRecharge="fontRecharge" :type="1980" />
                        </el-col>
                    </el-row>
                    <el-row style="padding-top: 20px;">
                        <el-col :span="6">
                            <rechargeVue :recharge="recharge3280" :fontRecharge="fontRecharge" :type="3280" />
                        </el-col>
                        <el-col :span="6">
                            <rechargeVue :recharge="recharge6480" :fontRecharge="fontRecharge" :type="6480" />
                        </el-col>
                    </el-row>
                </el-dialog>
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">
                {{ baseUtil.formatter.format(new Date(userData.createTime)) }}
            </el-descriptions-item>
            <el-descriptions-item label="用户身份">
                <el-tag size="large">
                    {{ RoleData[userData.role] }}
                </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="修改密码">
                <el-button size="default" @click="handleEditPassword">
                    EditPass
                </el-button>
                <el-dialog v-model="editPassVisble" title="修改密码">
                    <el-form ref="editFormRef" :model="editPassForm" :rules="editPassRules" @submit.prevent>
                        <el-form-item label="密码" label-width="140px" prop="password">
                            <el-input v-model="editPassForm.password" autocomplete="off" maxlength="25" show-word-limit
                                type="password" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button type="primary" @click="handleEditPassConfirm(editFormRef)">
                                Confirm
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-descriptions-item>
        </el-descriptions>
        <div class="search-box" v-if="userData.role === 2">
            <el-input v-model="searchKeyword" placeholder="输入订单编号关键字进行搜索"></el-input>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs" v-if="userData.role === 2">
            <el-tab-pane label="待付款" :name="0">
                <myTab />
                <span v-if="waitPay.length === 0">没有待付款订单</span>
                <div v-for="(item, index) in waitPay" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="0" :pay="pay"
                        :cancelNotPay="cancelNotPay" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="待发货" :name="1">
                <myTab />
                <span v-if="waitShip.length === 0">没有待发货订单</span>
                <div v-for="(item, index) in waitShip" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="1" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="取消订单申请" :name="5">
                <myTab />
                <span v-if="orderCancelApply.length === 0">没有申请取消的订单</span>
                <div v-for="(item, index) in orderCancelApply" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="5" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="待收货" :name="2">
                <myTab />
                <span v-if="waitReceive.length === 0">没有待收货订单</span>
                <div v-for="(item, index) in waitReceive" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="2" :receiveOrder="receiveOrder" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="退单申请" :name="6">
                <myTab />
                <span v-if="orderRefundApply.length === 0">没有要退单的申请</span>
                <div v-for="(item, index) in orderRefundApply" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="6" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="待评价" :name="3">
                <myTab />
                <span v-if="waitEvaluate.length === 0">没有待评价订单</span>
                <div v-for="(item, index) in waitEvaluate" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="3" :evaluateOrder="evaluateOrder" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="退款/售后" :name="4">
                <myTab />
                <span v-if="afterSales.length === 0">没有退款/售后订单</span>
                <div v-for="(item, index) in afterSales" :key="index">
                    <myOrder :order="item" :name="store.state.user.User.name" :type="4" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/avatar.png';
import store from '@/store';
import { ref, reactive, onMounted, computed } from "vue";
import baseUtil from '../../utils/index'
import myOrder from '@/components/MyOrder/myOrder.vue';
import myTab from '@/components/MyTab/myTab.vue'
import recharge60 from '@/assets/60F.png'
import recharge300 from '@/assets/300S.png'
import recharge980 from '@/assets/980T.png'
import recharge1980 from '@/assets/1980F.png'
import recharge3280 from '@/assets/3280F.png'
import recharge6480 from '@/assets/6480S.png'
import fontRecharge from '@/assets/bd9f0229dd9b07a6a4f355560634e26e_6639296868140732320.png'
import rechargeVue from '@/components/RechargeCard/rechargeCard.vue'
import router from '@/router/router';
onMounted(async () => {
    if (userData.value.role === 2) {
        if (store.state.shopCart.shopCartStatus === 'idle') {
            orders.value = (await store.dispatch('order/getOrdersByUserId', store.state.user.User.id)).data;
        } else {
            orders.value = store.getters['order/getOrders'];
        }
    }
});
const rechargeVisable = ref(false)
const waitPay = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 0)
    if (table === null || table === undefined) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const orderCancelApply = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 7)
    if (table === null || table === undefined) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const orderRefundApply = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 8)
    if (table === null || table === undefined) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
})
const waitReceive = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 3)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
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
const waitEvaluate = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 4)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const afterSales = computed(() => {
    if (orders.value === null || orders.value === undefined) return []
    const table = orders.value.filter(item => item.status === 6 || item.status === 1 || item.status === 5)
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !searchKeyword.value ||
            data.serialNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
});
const userData = ref(store.state.user.User)
const editPassVisble = ref(false)
const editFormRef = ref()
const RoleData = [
    "超级管理员",
    "商家",
    "普通用户"
]
const searchKeyword = ref('')
const orders = ref([])
const activeName = ref(1)
const dialogFormVisible = ref(false)
const ruleFormRef = ref();
const form = reactive({
    id: store.state.user.User.id,
    name: store.state.user.User.name
})
const handleconfirm = async (ruleFormRef) => {
    await store.dispatch("user/updateUserName", { data: form }).then(res => {
        if (res === 1) {
            baseUtil.successMessage("Edit Success")
        } else if (res === 0) {
            baseUtil.failMessage("Edit Fail")
        } else baseUtil.UnkownErrorMessage("未知错误")
    })
    ruleFormRef.resetFields()
    dialogFormVisible.value = false;
}
const checkPassword = (rule, value, callback) => {
    if (value === '' || value === null || value === undefined) {
        callback(new Error('Please input the checkPassword'));
    } else {
        callback();
    }
};
const editPassForm = reactive({
    id: store.state.user.User.id,
    password: '',
})
const editPassRules = reactive({
    password: [{ validator: checkPassword, trigger: 'blur' }],
})
const handleEditPassword = () => {
    editPassVisble.value = true;
}
const handleEditPassConfirm = async (editFormRef) => {
    if (!editFormRef) return;
    editFormRef.validate(async (valid) => {
        if (valid) {
            await store.dispatch("admin/editPassword", { userId: editPassForm.id, password: editPassForm.password }).then(res => {
                if (res === 1) {
                    baseUtil.successMessage("修改成功,请重新登入")
                        store.dispatch('user/logOut');
                        router.push('/')
                }
                else if (res === -2) baseUtil.failMessage('输入不合法');
                else baseUtil.UnkownErrorMessage("未知错误")
                editPassVisble.value = false
            })
        } else {
            return false;
        }
        editFormRef.resetFields()
    });
}
const uploadImage = (response) => {
    store.commit("user/updateUserAvatar", response.data)
    userData.value.avatarUrl = response.data
    if (response.statusCode === "200") baseUtil.successMessage("上传成功")
    else baseUtil.failMessage("上传失败")
}
const pay = async (userId, orderId) => {
    await store.dispatch('order/pay', {
        userId: userId,
        orderId: orderId
    }).then(res => {
        if (res === 1) {
            const index = waitPay.value.findIndex(item => item.id === orderId)
            waitPay.value.splice(index, 1)
            baseUtil.successMessage('付款成功')
        }
        else if (res === -2) baseUtil.failMessage('余额不足')
        else if (res === -3) baseUtil.failMessage('库存不足')
        else if (res === -4) baseUtil.failMessage("订单已过期")
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const cancelNotPay = async (userId, orderId) => {
    await store.dispatch('order/cancelNotPayOrder', {
        userId: userId,
        orderId: orderId
    }).then(res => {
        if (res === 1) {
            const index = waitPay.value.findIndex(item => item.id === orderId)
            waitPay.value.splice(index, 1)
            baseUtil.successMessage('取消成功')
        }
        else if (res === -2) baseUtil.failMessage('权限不足')
        else if (res === 0) baseUtil.failMessage('取消失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
/* const recharge = async () => {
    await store.dispatch('user/recharge',)
    rechargeVisable.value = false;
} */
const receiveOrder = async (userId, orderId) => {
    await store.dispatch('order/receiveOrder', {
        userId: userId,
        orderId: orderId
    }).then(res => {
        if (res === 1) {
            const index = waitReceive.value.findIndex(item => item.id === orderId)
            waitReceive.value.splice(index, 1)
            baseUtil.successMessage('收货成功')
        }
        else if (res === -2) baseUtil.failMessage('权限不足')
        else if (res === 0) baseUtil.failMessage('收货失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
// eslint-disable-next-line no-unused-vars
const evaluateOrder = async (evaluate) => {
    console.log(evaluate)
    await store.dispatch('order/evaluateOrder', evaluate).then(res => {
        if (res === 1) {
            const index = waitEvaluate.value.findIndex(item => item.id === evaluate.orderId)
            waitEvaluate.value.splice(index, 1)
            baseUtil.successMessage('评价成功')
        }
        else if (res === -2) baseUtil.failMessage('权限不足')
        else if (res === 0) baseUtil.failMessage('评价失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
</script >

<style>
.home {
    height: 100%;
    width: 100%;
    background-image: url("/src/assets/background.jpg");
}

.el-container {
    height: 100%;
    overflow: hidden;
}

.Main {
    width: 1200px;
    margin: 0 auto;
    background-color: white;
    border-radius: 30px;
    padding: 30px 30px 30px 30px;
    margin-top: 50px;
    margin-bottom: 50px;
}

.search-box {
    padding: 10px;
    width: 500px;
}
</style>