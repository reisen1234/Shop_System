<!-- eslint-disable no-unused-vars -->
<template>
    <div class="tableMain">
        <el-table :data="filterTableData" style="width: 100%" height="500px" stripe border size="large">
            <el-table-column label="Id" type="index" />
            <el-table-column label="头像" width="120px">
                <template #default="scope">
                    <el-upload class="avatar-uploader" :on-success="uploadImage(scope.row.id)" v-if="userRole === 1"
                        :show-file-list="false" :action="'http://localhost:8099/shop/photo?id=' + scope.row.id"
                        method="post">
                        <el-avatar
                            :src="scope.row.photos === undefined || scope.row.photos === null ? defaultAvatarUrl : scope.row.photos"
                            size="large" />
                    </el-upload>
                    <el-avatar v-if="userRole !== 1"
                        :src="scope.row.photos === undefined || scope.row.photos === null ? defaultAvatarUrl : scope.row.photos"
                        size="large" />
                </template>
            </el-table-column>
            <el-table-column label="商店名" width="350px">
                <template #default="scope">
                    <router-link :to="'/ChargeGoods/' + scope.row.id" style="color:black">{{
                        scope.row.name }}</router-link>
                </template>
            </el-table-column>
            <el-table-column label="商店地址" prop="address" width="300px" />
            <el-table-column label="创立时间">
                <template #default="scope">
                    {{ baseUtil.formatter.format(new Date(scope.row.createTime)) }}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="搜索商店" />
                </template>
                <template #default="scope" v-if="userRole === 1">
                    <el-row>
                        <el-col :span="12">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                修改
                            </el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                删除
                            </el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" title="警告" width="30%">
            <span>你确定要删除这个商店信息吗</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleDeleteConfirm">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogFormVisible" title="修改商店信息">
            <el-form ref="ruleFormRef" :model="form" @submit.prevent>
                <el-form-item label="商店名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" maxlength="45" show-word-limit />
                </el-form-item>
                <el-form-item label="商店地址" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="form.address" autocomplete="off" maxlength="45" show-word-limit />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleEditCancel(ruleFormRef)">取消</el-button>
                    <el-button type="primary" @click="handleEditConfirm(ruleFormRef)">
                        确认
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
                    <el-button round @click="addFormVisible = true" v-if="userRole === 1">增加商店</el-button>
                    <el-dialog v-model="addFormVisible" title="增加商店信息">
                        <el-form ref="addRuleFormRef" :model="addFrom" status-icon :rules="rules" label-width="120px"
                            @submit.prevent class="demo-ruleForm">
                            <el-form-item label="商店名" prop="name">
                                <el-input v-model="addFrom.name" autocomplete="off" maxlength="45" show-word-limit />
                            </el-form-item>
                            <el-form-item label="商店地址" prop="address">
                                <el-input v-model="addFrom.address" autocomplete="off" maxlength="45" show-word-limit />
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
import { Edit, Delete } from '@element-plus/icons-vue'
import baseUtil from '../../utils/index'
import defaultAvatarUrl from '@/assets/avatar.png'
onMounted(async () => {
    if (store.state.shop.shopStatus === "idle") {
        tableData.value = await store.dispatch('shop/getAllShopByUserId', userId)
    } else tableData.value = store.state.shop.shop
});
const userRole = store.state.user.User.role;
const route = useRoute();
const userId = route.params.userId
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const ruleFormRef = ref()
const search = ref('')
const editRow = ref(0);
const editIndex = ref(0)
const dialogVisible = ref(false)
const addFormVisible = ref(false)
const addRuleFormRef = ref();
const Loading = ref(false);
const dialogFormVisible = ref(false)
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
    address: '',
    name: '',
    userId: userId,
})
const addFrom = reactive({
    name: '',
    address: '',
    userId: userId
})
const checkAddress = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入地址'));
    } else {
        callback();
    }
};
const checkShopName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入商店名'));
    } else {
        callback();
    }
};
const rules = reactive({
    address: [{ validator: checkAddress, trigger: 'blur' }],
    name: [{ validator: checkShopName, trigger: 'blur' }],
});
const submitForm = (formEl) => {
    Loading.value = true
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            store.dispatch('shop/addShop', addFrom).then(res => {
                if (res.code === 0) baseUtil.failMessage('商店名已存在')
                else if (res.code === -1) baseUtil.UnkownErrorMessage('未知错误')
                else if (res.code === -2) baseUtil.failMessage('输入不合法')
                else {
                    baseUtil.successMessage('商店增加成功')
                    tableData.value.push(res.data)
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
    await store.dispatch("shop/updateShop", { index: editIndex.value, data: form }).then(res => {
        if (res.code === 1) {
            baseUtil.successMessage("修改成功")
            tableData.value = res.data
        }
        else if (res.code === 0) {
            baseUtil.failMessage('输入不合法');
        }
        else if (res.code === -2) {
            baseUtil.failMessage("商店名已存在")
        } else baseUtil.UnkownErrorMessage("未知错误")
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
    form.address = row.address
    form.id = row.id
}
const handleDelete = (index, row) => {
    dialogVisible.value = true
    editIndex.value = index
    editRow.value = row
}
const handleDeleteConfirm = async () => {
    dialogVisible.value = false
    await store.dispatch('shop/deleteShopById', { userId: userId, shopId: editRow.value.id }).then(res => {
        if (res === 1) {
            tableData.value = tableData.value.filter(item => item.id !== editRow.value.id);
            baseUtil.successMessage('删除成功')
        } else if (res === 0) baseUtil.failMessage('删除失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const findArrayIndex = (id) => {
    return tableData.value.findIndex(item => item.id === id);
}
const uploadImage = (index) => {
    return (response) => {
        handleSuccess(index, response);
    };
}
const handleSuccess = (index, response) => {
    if (response.statusCode === "200") {
        tableData.value[findArrayIndex(index)].photos = response.data
        baseUtil.successMessage("上传成功")
    } else baseUtil.failMessage("上传失败")
}
</script>
<style scope>
.tableMain {
    width: 1300px;
    margin: 0 auto;
    background-color: white;
    border-radius: 30px;
    padding: 40px;
    margin-top: 30px;
}


.demo-pagination-block {
    padding-top: 10px
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>