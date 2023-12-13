<template>
    <div style="width: 250px;" id="recharge">
        <el-card shadow="hover" style="width: 100%;">
            <template #header>
                <div style="padding:0px">
                    <span class="chargeStyle">
                        余额充值
                    </span>
                </div>
            </template>
            <div style="padding:0 30px 0 30px">
                <el-row>
                    <el-col :span="24">
                        <el-image :src="props.recharge" style="width: 150px;" />
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span style=" font-size: 20px;color: #666;margin-top: 19px;text-align: center; display: block;
                    ">
                            账户余额×{{ props.type }}
                        </span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span
                            style="font-size: 14px; margin-top: 19px;color: #666; text-align: center; display: block; height: 24px; line-height: 24px;">
                            额外赠&nbsp;
                            <img :src="props.fontRecharge" style="vertical-align: middle;" />
                            ×{{ props.type }}
                        </span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button class="buttonStyle" @click="rechargeMoney">
                        <span>￥{{ props.type }}购买</span></el-button>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import store from '@/store';
import { useRoute } from "vue-router";
import baseUtils from '@/utils';
import { defineProps } from 'vue';
const props = defineProps(['recharge', 'fontRecharge', 'type']);
const router = useRoute();
const rechargeMoney = async () => {
    await store.dispatch('user/recharge', {
        userId: store.state.user.User.id,
        money: props.type
    }).then(res => {
        if (res === 1) {
            baseUtils.successMessage("充值成功")
        } else if (res === -2) baseUtils.failMessage("权限不足")
        else if (res === -5) {
            router.push('/login')
            baseUtils.failMessage("请先登入")
        } else baseUtils.UnkownErrorMessage("未知错误")
    })
}
</script>

<style scoped>
:deep() .el-card__header {
    padding: 0;
    border: 0;
}

:deep() .el-card {
    border-radius: 10px;
}

:deep() .el-card__body {
    padding-top: 0px;
}

.buttonStyle {
    width: 180px;
    height: 48px;
    margin: 20px auto 0;
    font-size: 20px;
    line-height: 48px;
    border-radius: 6px;
    background: #00c3ff;
    color: white;
}

.chargeStyle {
    background: rgb(255, 168, 79);
    color: white;
    display: block;
    border-radius: 6px 0 6px 0;
    width: 108px;
    text-align: center;
    font-size: 17px;
    padding: 5px 0 5px 0
}
</style>