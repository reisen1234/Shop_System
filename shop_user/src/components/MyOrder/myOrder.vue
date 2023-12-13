
<template>
    <div>
        <el-row style="font-size: 13px;">
            <el-col :span="4">
                {{ baseUtil.formatter.format(new Date(props.order.creatTime)) }}
            </el-col>
            <el-col :span="20">
                订单编号:{{ props.order.serialNumber }}
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div v-for="(item, index) in props.order.orderItems" :key="index">
                    <el-row style="padding-top: 10px;">
                        <el-col :span="4">
                            <img :src="item.goods.photos !== null && item.goods.photos !== undefined
                                && item.goods.photos.length !== 0 ? item.goods.photos[0].url : defaultImage"
                                class="image" />
                        </el-col>
                        <el-col :span="8">
                            {{ item.goods.name }}
                        </el-col>
                        <el-col :span="12" :v-once="true" v-if="props.order.status === 1 || props.order.status === 7">
                            <span style="font-size: 12px;">
                                (申请理由:{{ props.order.cancelReason }})
                            </span>
                        </el-col>
                        <el-col :span="12" :v-once="true" v-if="props.order.status === 6 || props.order.status === 8">
                            <span style="font-size: 12px;">
                                (申请理由:{{ props.order.refund }})
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="2">
                <span>{{ props.name }}</span><el-icon>
                    <User />
                </el-icon>
            </el-col>
            <el-col :span="3">
                <span> {{ props.order.address }}</span>
            </el-col>
            <el-col :span="2" :offset="1">
                ￥<span>{{ Number(props.order.totalPrice).toFixed(2) }}</span>
            </el-col>
            <el-col :span="2">
                <span v-if="props.type === 0">未付款<br /><span style="font-size:10px;color:red">请在30分钟内尽快付款</span></span>
                <span v-if="props.type === 1">待发货</span>
                <span v-if="props.type === 2">待收货</span>
                <span v-if="props.type === 3">待评价</span>
                <span v-if="props.type === 4">
                    <span v-if="props.order.status === 6">已退单</span>
                    <span v-if="props.order.status === 1">订单已取消</span>
                    <span v-if="props.order.status === 5">订单已完成</span>
                    <span v-if="props.order.status === 9">订单超时</span>
                </span>
                <span v-if="props.type === 5">取消订单申请中</span>
                <span v-if="props.type === 6">退单申请中</span>
            </el-col>
            <el-col :span="2">
                <el-row style="padding-bottom:5px" v-if="props.type === 0">
                    <el-button round @click="pay">付款</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 0">
                    <el-button round @click="cancelNotPay">取消订单</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 1">
                    <el-button round>提醒发货</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 1">
                    <el-button round @click="cancelReasonVisble = true">取消订单</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 2">
                    <el-button round @click="receiveOrder">确认收货</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 2">
                    <el-button round @click="refundReasonVisble = true">退单</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 3">
                    <el-button round @click="evaluateOrderVisble = true">订单评价</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 4 && props.order.status === 5">
                    <el-button round>订单申诉</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider style="margin:24px 0 0 0" />
    </div>
    <el-dialog v-model="cancelReasonVisble" title="申请取消订单理由">
        <el-form @submit.prevent>
            <el-form-item label="cancelReason" label-width="140px" prop="cancelReason">
                <el-input v-model="cancelReason" type="textarea" maxlength="200" show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="cancelOrder">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="refundReasonVisble" title="申请退单理由">
        <el-form @submit.prevent>
            <el-form-item label="refundReason" label-width="140px" prop="refundReason">
                <el-input v-model="refundReason" type="textarea" maxlength="200" show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="refundOrder">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="evaluateOrderVisble" title="Evaluate Order">
        <el-form ref="evaluateFormRef" :model="evaluateForm" @submit.prevent>
            <el-form-item label="卖家服务" label-width="140px" prop="serveRating" @submit.prevent>
                <el-rate v-model="evaluateForm.serveRating" allow-half />
            </el-form-item>
            <el-form-item label="物品描述" label-width="140px" prop="describeRating">
                <el-rate v-model="evaluateForm.describeRating" allow-half />
            </el-form-item>
            <el-form-item label="物流服务" label-width="140px" prop="logisticsRating">
                <el-rate v-model="evaluateForm.logisticsRating" allow-half />
            </el-form-item>
            <el-form-item label="评价商品" label-width="140px" prop="evaluate">
                <el-input v-model="evaluateForm.evaluate" type="textarea" maxlength="200" show-word-limit
                    placeholder="请输入评论" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="evaluateOrder(evaluateFormRef)">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { defineProps, ref, reactive } from 'vue';
import baseUtil from '../../utils/index'
import defaultImage from '../../assets/avatar.png'
import { User } from '@element-plus/icons-vue'
import store from '@/store';
const cancelReasonVisble = ref(false)
const cancelReason = ref('')
const refundReasonVisble = ref(false)
const refundReason = ref('')
const evaluateOrderVisble = ref(false)
const evaluateFormRef = ref()
const props = defineProps({
    order: Object, // 在这里定义需要接收的props的类型
    name: String,
    type: Number,
    pay: Function,
    cancelNotPay: Function,
    receiveOrder: Function,
    evaluateOrder: Function
});
const evaluateForm = reactive({
    userId: store.state.user.User.id,
    shopId: props.order.shopId,
    orderId: props.order.id,
    serveRating: 5,
    describeRating: 5,
    logisticsRating: 5,
    evaluate: ''
})
const pay = () => {
    props.pay(props.order.userId, props.order.id)
}
const cancelNotPay = () => {
    props.cancelNotPay(props.order.userId, props.order.id)
}
const cancelOrder = async () => {
    if (cancelReason.value === null || cancelReason.value === undefined || cancelReason.value === '') {
        baseUtil.failMessage('请输入取消订单理由')
        return;
    }
    await store.dispatch('order/cancelOrder', {
        userId: props.order.userId,
        orderId: props.order.id,
        cancelReason: cancelReason.value
    }).then(res => {
        if (res === 1) baseUtil.successMessage('申请成功')
        else if (res === -2) baseUtil.failMessage('权限不足')
        else if (res === 0) baseUtil.failMessage('申请失败')
        else baseUtil.UnkownErrorMessage("未知错误")
        cancelReasonVisble.value = false;
    })
}
const refundOrder = async () => {
    if (refundReason.value === null || refundReason.value === undefined || refundReason.value === '') {
        baseUtil.failMessage('请输入退单理由')
        return;
    }
    await store.dispatch('order/refundOrder', {
        userId: props.order.userId,
        orderId: props.order.id,
        refundReason: refundReason.value
    }).then(res => {
        if (res === 1) baseUtil.successMessage('申请成功')
        else if (res === -2) baseUtil.failMessage('权限不足')
        else if (res === 0) baseUtil.failMessage('申请失败')
        else baseUtil.UnkownErrorMessage("未知错误")
        refundReasonVisble.value = false;
    })
}
const receiveOrder = () => {
    props.receiveOrder(props.order.userId, props.order.id)
}
const evaluateOrder = (evaluateFormRef) => {
    if (!evaluateFormRef) return;
    evaluateFormRef.validate((valid) => {
        if (valid) {
            props.evaluateOrder(evaluateForm)
        } else {
            return false;
        }
        evaluateFormRef.resetFields()
    });
    evaluateOrderVisble.value = false;
}
</script>

<style scoped>
.image {
    display: block;
    width: 80px;
    height: 80px;
    object-fit: contain;
    object-position: center;
}
</style>