<template>
    <div class="Main">
        <el-row>
            <el-col :span="16">
                <span class="left_font">
                    购物车（ 全部{{ tableData.length }} ）
                </span>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <span class="right_font">
                            已选商品 <span style="color: rgb(255,85,57); font-size:20px;"> {{ Number(totalPrice).toFixed(2)
                            }}</span>
                        </span>
                    </el-col>
                    <el-col :span="6">
                        <el-button round size="large" @click="() => {
                            if (multipleSelection.length === 0) {
                                baseUtils.failMessage('请勾选要支付的商品');
                                return
                            }
                            addressVisble = true
                        }">结算</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-divider />
        </el-row>
        <div class="list">
            <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" :border="false" :lazy="true"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品信息" width="350">
                    <template #default="scope">
                        <div>
                            <el-row>
                                <router-link :to="'/Shop/' + scope.row.shopId" style="font-size: 13px; color:black;">
                                    店铺：{{ scope.row.shopName }}
                                </router-link>
                            </el-row>
                            <el-row style="padding-top: 10px;">
                                <el-col :span="8">
                                    <img :src="scope.row.goods.photos !== null && scope.row.goods.photos !== undefined && scope.row.goods.photos.length !== 0 ? scope.row.goods.photos[0].url : defaultImage"
                                        class="image" />
                                </el-col>
                                <el-col :span="12">
                                    {{ scope.row.goods.name }}
                                </el-col>
                            </el-row>
                        </div>
                        {{ scope.row.date }}
                    </template>
                </el-table-column>
                <el-table-column label="单价" width="120">
                    <template #default="scope">
                        <span>
                            ￥{{ scope.row.goods.price }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" show-overflow-tooltip>
                    <template #default="scope">
                        <el-input-number v-model="scope.row.number" :min="1" :max="200"
                            @change="handleChange(scope.$index, scope.row, $event)" />
                    </template>
                </el-table-column>
                <el-table-column label="金额" show-overflow-tooltip>
                    <template #default="scope">
                        <span style="color: rgb(255,68,0); font-weight: 600;">
                            ￥{{ Number(scope.row.goods.price * scope.row.number).toFixed(2) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <el-dialog v-model="addressVisble" title="配送地址">
        <el-form>
            <el-form-item label="address" label-width="140px" prop="address">
                <el-input v-model="address" autocomplete="off" type="textarea" maxlength="45" show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="buy">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
    <div class="bottom-block">
        <el-row>
            <el-col :span="16">
                <el-button type="danger" @click="deleteClick">删除勾选</el-button>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <span class="right_font">
                            已选商品 <span style="color: rgb(255,85,57); font-size:20px;"> {{ Number(totalPrice).toFixed(2)
                            }}</span>
                        </span>
                    </el-col>
                    <el-col :span="6">
                        <el-button round size="large" @click="() => {
                            if (multipleSelection.length === 0) {
                                baseUtils.failMessage('请勾选要支付的商品');
                                return
                            }
                            addressVisble = true
                        }">结算</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import store from '@/store';
import { ElTable } from 'element-plus'
import defaultImage from '../../assets/avatar.png'
import { Delete } from '@element-plus/icons-vue'
import baseUtils from '@/utils';
const route = useRoute();
const userId = route.params.userId;
const addressVisble = ref(false)
const tableData = ref([]);
const totalPrice = ref(Number(0).toFixed(2))
const address = ref('')
onMounted(async () => {
    if (store.state.shopCart.shopCartStatus === 'idle') {
        tableData.value = await store.dispatch('shopCart/getShopCart', userId);
    } else {
        tableData.value = store.getters['shopCart/getShopCart'];
    }
});
const handleChange = async (index, row, newValue) => {
    await store.dispatch('shopCart/updateGoodsNumber', { id: row.id, number: newValue }).then(res => {
        if (res.code === 0) {
            tableData.value[index].number = res.data
            baseUtils.failMessage("库存不足!")
        }
    })
    checkTotalPrice()
}
const handleDelete = async (index, row) => {
    try {
        await store.dispatch('shopCart/removeShopCart', row.id).then((res) => {
            if (res === 1) baseUtils.successMessage("删除成功")
            else if (res === 0) baseUtils.failMessage("删除失败")
            else baseUtils.UnkownErrorMessage("未知错误")
        })
    } catch (error) {
        console.log(error)
        baseUtils.UnkownErrorMessage("未知错误")
    }
}
const multipleTableRef = ref(null);
const multipleSelection = ref([]);
const checkTotalPrice = () => {
    var newTotalPrice = 0;
    multipleSelection.value.forEach(item => {
        newTotalPrice += item.number * item.goods.price;
    })
    totalPrice.value = newTotalPrice
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
    checkTotalPrice()
};
const deleteClick = async () => {
    var ids = [];
    multipleSelection.value.forEach(item => ids.push(item.id))
    try {
        const res = await store.dispatch('shopCart/deleteByIds', ids);
        if (res.code === 1) {
            baseUtils.successMessage("删除成功")
            tableData.value = res.data
        }
        else if (res.code === 0) baseUtils.failMessage("删除失败")
        else baseUtils.UnkownErrorMessage("未知错误")
    } catch (error) {
        console.log(error)
        baseUtils.UnkownErrorMessage("未知错误")
    }
}
const buy = async () => {
    if (address.value === '' || address.value === undefined || address.value === null) {
        baseUtils.failMessage("请输入地址")
        return
    }
    var ids = [];
    multipleSelection.value.forEach(item => ids.push(item.id))
    try {
        const res = await store.dispatch('shopCart/addOrderByShopCart', {
            ids: ids,
            userId: userId,
            address: address.value
        });
        if (res.code === 1) {
            baseUtils.successMessage("下单成功")
            tableData.value = res.data
        }
        else if (res.code === 0) {
            baseUtils.successMessage("部分商品支付成功，请前往页面支付")
            tableData.value = res.data
        }
        else if (res.code === -2) baseUtils.failMessage("下单失败")
        else baseUtils.UnkownErrorMessage("未知错误")
    } catch (error) {
        console.log(error)
        baseUtils.UnkownErrorMessage("未知错误")
    }
}
</script>

<style scoped>
.left_font {
    float: left;
    font-size: 20px;
    font-weight: 600;
    font-family: '仿宋';
}

.image {
    display: block;
    width: 80px;
    height: 80px;
    object-fit: contain;
    object-position: center;
}

.Main {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 80px;
}

.right_font {
    float: right;
    font-size: 15px;
}

.bottom-block {
    width: 1200px;
    background-color: white;
    height: 60px;
    position: absolute;
    bottom: 0;
    z-index: 1000;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgb(242, 242, 242);
    padding: 15px;
    /* 1像素宽，黑色边框 */
}
</style>