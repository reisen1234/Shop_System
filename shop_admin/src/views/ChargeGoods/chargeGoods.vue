<!-- eslint-disable no-unused-vars -->
<template>
    <div class="tableMain" style="padding-top:20px">
        <h1 style="font-size:25px; font-family:宋体;font-weight:900;padding-bottom:20px;" v-if="shopData">
            {{ shopData.name }}
        </h1>
        <el-table :data="filterTableData" style="width: 100%" height="460px" stripe border size="large">
            <el-table-column label="Id" type="index" />
            <el-table-column label="商品名" prop="name" />
            <el-table-column label="商品价格" width="150px">
                <template #default="scope">
                    {{ scope.row.price }}￥
                </template>
            </el-table-column>
            <el-table-column label="库存" prop="inventory" width="100px">
                <template #default="scope">
                    {{ scope.row.inventory }}件
                </template>
            </el-table-column>
            <el-table-column label="付款人数" prop="paying" width="100px">
                <template #default="scope">
                    {{ scope.row.paying }}人
                </template>
            </el-table-column>
            <el-table-column label="创建日期">
                <template #default="scope">
                    {{ baseUtil.formatter.format(new Date(scope.row.createTime)) }}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="搜索商品" />
                </template>
                <template #default="scope" v-if="userRole === 1">
                    <el-button size="small" @click="handleUpload(scope.$index, scope.row)">
                        <el-icon>
                            <Picture />
                        </el-icon>
                        上传
                    </el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        编辑
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="uploadImage" title="上传商品图片">
            <el-upload v-model:file-list="fileList"
                v-if="filterTableData[uploadImageIndex] !== null && filterTableData[uploadImageIndex] !== undefined"
                :action="'http://localhost:8099/goods/uploadPhoto?goodsId=' + filterTableData[uploadImageIndex].id"
                method="post" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </el-dialog>
        <el-dialog v-model="dialogVisible" title="警告" width="30%">
            <span>你确定要删除</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleDeleteConfirm">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogFormVisible" title="修改商品信息">
            <el-form ref="ruleFormRef" :model="form" @submit.prevent>
                <el-form-item label="商品名:" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" maxlength="60" show-word-limit />
                </el-form-item>
                <el-form-item label="商品价格:" :label-width="formLabelWidth" prop="price">
                    <el-input-number :precision="2" v-model="form.price" :min="0" autocomplete="off" type="number" />
                </el-form-item>
                <el-form-item label="库存:" :label-width="formLabelWidth" prop="price">
                    <el-input-number :precision="0" v-model="form.inventory" :min="0" autocomplete="off" type="number" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleEditCancel(ruleFormRef)">取消</el-button>
                    <el-button type="primary" @click="handleEditConfirm(ruleFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <div class="demo-pagination-block">
            <el-row>
                <el-col :span="22">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" large
                        layout="prev, pager, next, jumper" :total="searchFilterTableData" />
                </el-col>
                <el-col :span="2">
                    <el-button round @click="addFormVisible = true" v-if="userRole === 1">增加商品</el-button>
                    <el-dialog v-model="addFormVisible" title="增加商品信息">
                        <el-form ref="addRuleFormRef" :model="addFrom" status-icon :rules="rules" label-width="120px"
                            @submit.prevent class="demo-ruleForm">
                            <el-form-item label="商品名" prop="name">
                                <el-input v-model="addFrom.name" autocomplete="off" maxlength="60" show-word-limit />
                            </el-form-item>
                            <el-form-item label="商品价格" prop="price">
                                <el-input-number :precision="2" v-model="addFrom.price" :min="0" autocomplete="off"
                                    type="number" />
                            </el-form-item>
                            <el-form-item label="商品库存" prop="inventory">
                                <el-input-number :precision="0" v-model="addFrom.inventory" :min="0" autocomplete="off"
                                    type="number" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm(addRuleFormRef)"
                                    :loading="Loading">提交</el-button>
                                <el-button @click="resetForm(addRuleFormRef)">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import store from '@/store';
import { useRoute } from "vue-router";
import { Edit, Delete, Picture, Plus } from '@element-plus/icons-vue'
import baseUtil from '../../utils/index'
onMounted(async () => {
    if (store.state.goods.ChargeGoodsStatus === "idle") {
        await store.dispatch('goods/getGoodsByUserId', store.state.user.User.id).then(() => {
            tableData.value = store.getters['goods/getGoodsByShopId'](shopId)
        })
    } else tableData.value = store.getters['goods/getGoodsByShopId'](shopId)
});
const userRole = store.state.user.User.role;
const route = useRoute();
const shopId = route.params.shopId
const tableData = ref([])
const shopData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const ruleFormRef = ref()
const search = ref('')
const editRow = ref(0);
const editIndex = ref(0)
const uploadImageIndex = ref(0)
const uploadImageRow = ref(0)
const dialogVisible = ref(false)
const addFormVisible = ref(false)
const addRuleFormRef = ref();
const Loading = ref(false);
const dialogFormVisible = ref(false)
const uploadImage = ref(false)
const formLabelWidth = '140px'
const filterTableData = computed(() => {
    const table = tableData.value;
    if (table === null || table === undefined || table.length === 0) return table
    return table.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    ).slice(pageSize.value * (currentPage.value - 1), pageSize.value * (currentPage.value - 1) + pageSize.value)
});
const searchFilterTableData = computed(() => {
    const table = tableData.value;
    if (table === null || table === undefined || table.length === 0) return 0
    return table.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    ).length
})
const form = reactive({
    id: '',
    price: 0,
    name: '',
    shopId: shopId,
    inventory: 0,
})
const addFrom = reactive({
    name: '',
    price: 0,
    shopId: shopId,
    inventory: 0,
})
const checkGoodsName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入商品名字'));
    } else {
        callback();
    }
};
const rules = reactive({
    name: [{ validator: checkGoodsName, trigger: 'blur' }],
});
const submitForm = (formEl) => {
    Loading.value = true
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            store.dispatch('goods/addGoods', addFrom).then(res => {
                if (res.code === -1) baseUtil.UnkownErrorMessage('未知错误')
                else if (res.code === -2) baseUtil.failMessage('输入不合法')
                else {
                    res.data.photos = []
                    tableData.value.push(res.data)
                    baseUtil.successMessage('商品增加成功')
                }
                Loading.value = false
            })
        } else {
            Loading.value = false
            return false;
        }
        addFormVisible.value = false
    });
};
const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
};
const handleEditConfirm = async (ruleFormRef) => {
    await store.dispatch("goods/updateGoods", { data: form }).then(res => {
        if (res.code === 1) {
            baseUtil.successMessage("修改成功")
            tableData.value = res.data
        }
        else if (res.code === 0) {
            baseUtil.failMessage('输入不合法');
        }
        else baseUtil.UnkownErrorMessage("未知错误")
    })
    ruleFormRef.resetFields()
    dialogFormVisible.value = false;

}
const handleEditCancel = (ruleFormRef) => {
    ruleFormRef.resetFields()
    dialogFormVisible.value = false;
}
const handleEdit = (index, row) => {
    dialogFormVisible.value = true
    editRow.value = row
    editIndex.value = index
    form.name = row.name
    form.inventory = row.inventory
    form.price = row.price
    form.paying = row.paying
    form.id = row.id
}
const handleDelete = (index, row) => {
    dialogVisible.value = true
    editIndex.value = index
    editRow.value = row
}
const handleUpload = (index, row) => {
    uploadImage.value = true
    uploadImageIndex.value = index
    uploadImageRow.value = row
    if (tableData.value[index].photos === null) fileList.value = []
    else fileList.value = tableData.value[index].photos
}
const handleDeleteConfirm = async () => {
    console.log("in")
    dialogVisible.value = false
    await store.dispatch('goods/deleteGoodsById', { goodsId: editRow.value.id, shopId: shopId }).then(res => {
        if (res === 1) {
            tableData.value = tableData.value.filter(item => item.id !== editRow.value.id);
            console.log(editRow.value)
            baseUtil.successMessage('删除成功')
        } else if (res === 0) baseUtil.failMessage('删除失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const fileList = ref([])
const handleRemove = async (uploadFile) => {
    var file = uploadFile;
    if (uploadFile.response !== null && uploadFile.response !== undefined) file = uploadFile.response.data
    await store.dispatch('goods/deleteGoodsPhoto', { name: file.name, goodsId: file.goodsId, id: file.id }).then(res => {
        if (res === 1) {
            const index = tableData.value.findIndex(item => item.id === uploadImageRow.value.id)
            tableData.value[index].photos = tableData.value[index].photos.filter(item => item.id !== file.id);
            baseUtil.successMessage('删除成功')
        } else if (res === 0) baseUtil.failMessage('删除失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const handleSuccess = (response) => {
    if (response.statusCode === "200") {
        const index = tableData.value.findIndex(item => item.id === uploadImageRow.value.id)
        tableData.value[index].photos.push(response.data)
        baseUtil.successMessage('上传成功')
    } else if (response.statusCode === "400") baseUtil.failMessage('上传失败')
    else baseUtil.UnkownErrorMessage("未知错误")
}
</script>
<style>
.el-table__header th {
    color: black;
}
</style>