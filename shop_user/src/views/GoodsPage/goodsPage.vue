<template>
    <div style="width: 1300px; margin:0 auto" v-if="goods !== null && goods !== undefined">
        <shopSider v-if="shop !== null && shop !== undefined" :shop="shop" />
    </div>
    <div v-if="goods !== null && goods != [] && goods !== undefined" class="Main"
        style="width: 1300px; padding:20px; margin-top:30px; border-radius: 25px;">
        <el-row :gutter="50">
            <el-col :span="10">
                <el-carousel :interval="5000" arrow="hover" style="border-radius: 25px;">
                    <el-carousel-item
                        v-if="goods.photos === null || goods.photos === undefined || goods.photos.length === 0">
                        <img :src="photoUrl" lazy class="carousel-image" justify="center" />
                    </el-carousel-item>
                    <el-carousel-item v-for="item in goods.photos" :key="item.id">
                        <img :src="item.url" lazy class="carousel-image" justify="center" />
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="14">
                <p>
                    <span style="font-size: 30px; font-weight: 600;">{{ goods.name }}</span>
                </p>
                <p>
                    <span style="color:rgb(153,153,153); font-size:15px">月销{{
                        baseUtil.roundDownToNearestMultiple(goods.paying)
                    }}+</span>
                </p>
                <p>
                    <span style="color:rgb(255,80,0)">￥</span>
                    <span style="font-size :30px; font-weight:400; color:rgb(255,80,0)">{{ goods.price }}</span>
                </p>
                <p>
                    <el-row>
                        <el-col :span="3">
                            <span style="color: rgb(127,127,127);">配送:</span>
                        </el-col>
                        <el-col :span="21">
                            <span style="color:black;font-size:20px"> {{ shop.address }} 至</span>
                            <el-cascader v-model="addressSelect" :options="options" :props="props"
                                style="padding-left:20px" />
                        </el-col>
                    </el-row>
                </p>
                <p>
                    <el-row>
                        <el-col :span="3">
                            <span style="color: rgb(127,127,127);">数量:</span>
                        </el-col>
                        <el-col :span="21">
                            <el-input-number v-model="number" :min="1" :max="200" size="large" />
                            <span v-if="number <= goods.inventory">
                                有货
                            </span>
                            <span v-else>
                                没货了
                            </span>
                        </el-col>
                    </el-row>
                </p>
                <p style="padding:30px">
                    <el-button-group size="large">
                        <el-button type="primary" round class="buttonStyle" style="background-color: rgb(255,154,2);"
                            @click="addToCart">
                            <el-icon>
                                <ShoppingCart />
                            </el-icon>加入购物车
                        </el-button>
                        <el-button type="primary" round class="buttonStyle" style="background-color:rgb(255,84,0)"
                            @click="buy">
                            <el-icon>
                                <ShoppingBag />
                            </el-icon>立即购买
                        </el-button>
                    </el-button-group>
                </p>
            </el-col>
        </el-row>
        <div><span style="font-size: 20px;">宝贝评价
            </span></div> <el-divider />
        <el-table v-if="goods.evaluates !== null && goods.evaluates !== undefined && goods.evaluates.length !== 0"
            :data="goods.evaluates" style="width: 100%">

            <el-table-column label="买家">
                <template #default="scope">
                    <el-row>
                        <el-col :span="8">
                            <el-avatar
                                :src="scope.row.user.avatarUrl === null ? defaultAvatarUrl : scope.row.user.avatarUrl"
                                size="large" />
                        </el-col>
                        <el-col :span="14" :offset="2">
                            {{ scope.row.user.name }}
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="拍下价格" width="150">
                <template #default="scope">
                    <span style="font-size: 18px; color:rgb(255,115,32)">￥{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="数量" width="100" />
            <el-table-column prop="createTime" label="付款时间">
                <template #default="scope">
                    {{ baseUtil.formatter.format(new Date(scope.row.createTime)) }}
                </template>
            </el-table-column>
            <el-table-column label="用户评分" width="260">
                <template #default="scope">
                    <el-row>
                        <el-col :span="11">物流服务:</el-col>
                        <el-col :span="12" :offset="1">
                            <el-rate v-model="scope.row.logisticsRating" disabled />
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">卖家服务:</el-col>
                        <el-col :span="12" :offset="1">
                            <el-rate v-model="scope.row.serveRating" disabled />
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">宝贝描述:</el-col>
                        <el-col :span="12" :offset="1">
                            <el-rate v-model="scope.row.describeRating" disabled />
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="用户评价">
                <template #default="scope">
                    "{{ scope.row.evaluate }}"
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import defaultAvatarUrl from '@/assets/avatar.png';
import store from '@/store';
import { ShoppingCart, ShoppingBag } from '@element-plus/icons-vue'
import options from '../../assets/options'
import shopSider from '../../components/ShopSider/shopSider'
// eslint-disable-next-line no-unused-vars
import baseUtil from '../../utils/index'
import photoUrl from '@/assets/photo.png'
import router from "@/router/router";
const props = {
    expandTrigger: 'hover',
}
const number = ref(1)
const addressSelect = ref();
const route = useRoute();
const shopId = route.params.shopId
const goodsId = route.params.goodsId
const shop = ref({})
const goods = ref({})
onMounted(async () => {
    shop.value = (await store.dispatch('shop/getShopById', shopId))
    goods.value = (await store.dispatch('goods/getGoodsById', goodsId))
});
const addToCart = async () => {
    await store.dispatch("shopCart/addToCart", {
        userId: store.state.user.User.id,
        goodsId: goodsId,
        number: number.value,
        shopId: shopId,
        shopName: shop.value.name,
    }).then((res) => {
        if (res === 1) baseUtil.successMessage("加入购物车成功")
        else if (res === 2) baseUtil.failMessage("购物车物品超过50条")
        else if (res === 0) baseUtil.failMessage("加入购物车失败")
        else if (res === -5) {
            baseUtil.failMessage("请先登入")
            router.push('/login')
        }
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const buy = async () => {
    if (addressSelect.value === null || addressSelect.value === undefined) {
        baseUtil.failMessage("请填写收货地址")
        return;
    }
    await store.dispatch("order/addOrder", {
        order: {
            userId: store.state.user.User.id,
            shopId: shopId,
            totalPrice: number.value * goods.value.price,
            goodsId: goodsId,
            address: addressSelect.value.join(""),
            chargeId: shop.value.userId
        },
        orderItem: {
            goodsId: goodsId,
            number: number.value,
        }
    }).then(res => {
        if (res.code === 1) baseUtil.successMessage("下单成功")
        else if (res.code === -3) baseUtil.failMessage("支付失败，请在五分钟内前往支付页面支付")
        else if (res.code === -2) baseUtil.failMessage("无权下订单")
        else if (res.code === -1) baseUtil.UnkownErrorMessage("未知错误")
        else if (res === -5) {
            baseUtil.failMessage("请先登入")
            router.push('/login')
        }
        else baseUtil.failMessage("下单失败")
    })
}
</script>

<style>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    background-color: aquamarine;
}

.shop-font-style {
    font-size: large;
    font-weight: 900;
    color: black;
}

.buttonStyle {
    width: 180px;
    height: 50px;
    border: white;
    font-size: 18px;
}

.center-align {
    text-align: right;
}

el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: white;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: white;
}

p {
    padding-top: 10px;
}

.carousel-image {
    width: 100%;
    /* 使图片宽度充满容器 */
    height: 100%;
    /* 使图片高度充满容器 */
    object-fit: contain;
    /* 调整图片尺寸以适应容器，保持宽高比 */
    object-position: center;
    /* 居中显示图片 */
}
</style>