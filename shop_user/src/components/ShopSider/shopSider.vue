<template>
    <div v-if="props.shop !== undefined && props.shop != []" class="Main"
        style="width: 100%; padding:20px; margin-top:10px;margin-bottom:10px; border-radius: 50px;">
        <el-row :gutter="20" class="demo-avatar demo-basic">
            <el-col :span="5" style="border-right: 1px solid var(--el-border-color);">
                <el-popover :width="250"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                    <template #reference>
                        <el-row>
                            <el-col :span="6">
                                <el-avatar
                                    :src="shop.photos === undefined || shop.photos === null ? defaultAvatarUrl : shop.photos"
                                    class="centered-content" size="large" />
                            </el-col>
                            <el-col :span="18">
                                <el-row>
                                    <el-text truncated>
                                        <span class="shop-font-style">
                                            {{ props.shop.name }}
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
                                    {{ props.shop.name }}
                                </p>
                                <p>
                                    综合体验: <el-rate v-model="rateValue" disabled show-score allow-half />
                                </p>
                                <p style="padding-top: 10px;">
                                    掌柜: <span v-if="props.shop !== null && props.shop !== undefined && props.shop != {}">{{
                                        props.shop.userName
                                    }}</span>
                                </p>

                                <el-divider />
                                <p>
                                    <el-row style="padding-left: 30px;">
                                        <el-col :span="8">
                                            <span style="color: rgb(127,127,127);">
                                                宝贝
                                            </span>
                                            <div style="font-weight: 600;">
                                                {{ Number(props.shop.describeRating).toFixed(1) }}
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <span style="color: rgb(127,127,127);">
                                                卖家
                                            </span>
                                            <div style="font-weight: 600;">
                                                {{ Number(props.shop.serveRating).toFixed(1) }}
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <span style="color: rgb(127,127,127);">
                                                物流
                                            </span>
                                            <div style="font-weight: 600;">
                                                {{ Number(props.shop.logisticsRating).toFixed(1) }}
                                            </div>
                                        </el-col>
                                    </el-row>
                                </p>
                                <p style="padding-top: 20px;">
                                    <el-button size="large" style="width: 100%; border-radius: 50px;"
                                        @click="$router.push(`/Shop/${props.shop.id}`)">
                                        进店逛逛
                                    </el-button>
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
                    {{ Number(props.shop.describeRating).toFixed(1) }}
                </div>
            </el-col>
            <el-col :span="2">
                <span style="color: rgb(127,127,127);">
                    卖家服务
                </span>
                <div style="font-weight: 600;">
                    {{ Number(props.shop.serveRating).toFixed(1) }}
                </div>
            </el-col>
            <el-col :span="2">
                <span style="color: rgb(127,127,127);">
                    物流服务
                </span>
                <div style="font-weight: 600;">
                    {{ Number(props.shop.logisticsRating).toFixed(1) }}
                </div>
            </el-col>
            <el-col :span="13" class="center-align" style="padding-right: 40px;">
                <el-button round @click="$router.push(`/Shop/${props.shop.id}`)">
                    <el-icon size="20px">
                        <Goods />
                    </el-icon>
                    进入店铺</el-button>
            </el-col>

        </el-row>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/avatar.png'
import store from '@/store';
import { Goods } from '@element-plus/icons-vue'
import { defineProps, ref, onMounted, watch } from 'vue'
import photoUrl from '@/assets/photo.png'
const user = ref({})
const rateValue = ref(0)
const props = defineProps({
    shop: Object,
});
onMounted(async () => {
    if (props.shop.userId !== undefined) user.value = (await store.dispatch('user/getUserById', { id: props.shop.userId }));
    watch(() => props.shop, (newValue) => {
        if (newValue.userId !== undefined) {
            rateValue.value = Number(Number((newValue.describeRating + newValue.serveRating + newValue.logisticsRating) / 3).toFixed(1))
        }
    });
})
</script>

<style lang="scss" scoped></style>