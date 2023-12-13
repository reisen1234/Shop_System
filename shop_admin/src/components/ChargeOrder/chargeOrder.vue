
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
                <span> **** </span><el-icon>
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
                <span v-if="props.type === 0">待发货</span>
                <span v-if="props.type === 1">用户申请取消</span>
                <span v-if="props.type === 2">用户申请退单</span>
                <span v-if="props.type === 3">
                    <span v-if="props.order.status === 1">
                        用户取消订单
                    </span>
                    <span v-if="props.order.status === 3">
                        待确认收货
                    </span>
                    <span v-if="props.order.status === 4">
                        用户未评价
                    </span>
                    <span v-if="props.order.status === 5">
                        用户已评价
                    </span>
                    <span v-if="props.order.status === 6">
                        用户已退单
                    </span>
                    <span v-if="props.order.status === 9">
                        超时订单
                    </span>
                </span>
            </el-col>
            <el-col :span="2">
                <el-row style="padding-bottom:5px" v-if="props.type === 0">
                    <el-button round @click="ship">发货</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 1">
                    <el-button round @click="agreeChargeCancel">同意</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 1">
                    <el-button round @click="refuseChargeCancel">拒绝</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 2">
                    <el-button round @click="agreechargeRefund">同意</el-button>
                </el-row>
                <el-row style="padding-bottom:5px" v-if="props.type === 2">
                    <el-button round @click="refusechargeRefund">拒绝</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider style="margin:24px 0 0 0" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import baseUtil from '../../utils/index'
import store from '@/store';
import defaultImage from '../../assets/avatar.png'
import { User } from '@element-plus/icons-vue'
const props = defineProps({
    order: Object, // 在这里定义需要接收的props的类型
    name: String,
    type: Number,
    ship: Function,
    chargeCancel: Function,
    chargeRefund: Function
});
const ship = () => {
    props.ship(store.state.user.User.id, props.order.id)
}
const agreeChargeCancel = () => {
    props.chargeCancel(props.order.id, store.state.user.User.id, 1);
}
const refuseChargeCancel = () => {
    props.chargeCancel(props.order.id, store.state.user.User.id, 0);
}
const agreechargeRefund = () => {
    props.chargeRefund(props.order.id, store.state.user.User.id, 1);
}
const refusechargeRefund = () => {
    props.chargeRefund(props.order.id, store.state.user.User.id, 0);
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