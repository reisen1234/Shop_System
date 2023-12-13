<!-- eslint-disable no-unused-vars -->
<template>
    <div class="tableMain">
        <el-table :data="filterTableData" style="width: 100%" height="500px" stripe border size="large">
            <el-table-column label="Id" type="index" />
            <el-table-column label="用户名" prop="name" />
            <el-table-column label="电话号码" prop="telephone" width="200px" />
            <el-table-column label="角色" prop="role" width="100px">
                <template #default="scope">
                    <div v-if="scope.row.role === 1">
                        <el-tag type="success">商家</el-tag>
                    </div>
                    <div v-if="scope.row.role === 2">
                        <el-tag type="info">普通用户</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="封禁" prop="endBan" width="100px">
                <template #default="scope">
                    <div
                        v-if="scope.row.endBan === null || scope.row.endBan === undefined || scope.row.endBan === '' || new Date(scope.row.endBan) < new Date()">
                        <el-tag type="info">未封禁</el-tag>
                    </div>
                    <div v-if="new Date(scope.row.endBan) >= new Date()">
                        <el-tag type="danger">封禁中</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="注册时间">
                <template #default="scope">
                    {{ baseUtil.formatter.format(new Date(scope.row.createTime)) }}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="搜索用户" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="handleEditPassword(scope.$index, scope.row)">
                        修改密码
                    </el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        修改
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
        <el-dialog v-model="dialogVisible" title="Wram" width="30%">
            <span>Are you sure delete this user</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleDeleteConfirm">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogFormVisible" title="修改用户信息">
            <el-form ref="ruleFormRef" :model="form" :rules="editRules" @submit.prevent>
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="telephone">
                    <el-input v-model="form.telephone" autocomplete="off" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="form.role" placeholder="Please select a role">
                        <el-option label="商家" :value="1" />
                        <el-option label="普通用户" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="封禁时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.endBan" type="datetime" placeholder="请选择日期" :disabled-date="disabledDate"
                        format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm" />
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
        <el-dialog v-model="editPassVisble" title="修改密码">
            <el-form ref="editFormRef" :model="editPassForm" :rules="editPassRules" @submit.prevent>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="editPassForm.password" autocomplete="off" maxlength="25" show-word-limit />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleEditPassConfirm(editFormRef)">
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
                    <el-button round @click="addFormVisible = true">增加用户</el-button>
                    <el-dialog v-model="addFormVisible" title="增加用户信息">
                        <el-form ref="addRuleFormRef" :model="addFrom" status-icon :rules="rules" label-width="120px"
                            @submit.prevent class="demo-ruleForm">
                            <el-form-item label="用户名" prop="name">
                                <el-input v-model="addFrom.name" autocomplete="off" maxlength="20" show-word-limit />
                            </el-form-item>
                            <el-form-item label="电话号码" prop="telephone">
                                <el-input v-model="addFrom.telephone" autocomplete="off" maxlength="20" show-word-limit />
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="addFrom.password" type="password" autocomplete="off" maxlength="25"
                                    show-word-limit />
                            </el-form-item>
                            <el-form-item label="确认密码" prop="confirmPassword">
                                <el-input v-model="addFrom.confirmPassword" type="password" autocomplete="off"
                                    maxlength="25" show-word-limit />
                            </el-form-item>
                            <el-form-item label="角色" prop="role">
                                <el-cascader v-model="addFrom.role" :options="options" />
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
import { computed, ref, onMounted, reactive } from 'vue'
import store from '@/store';
import { Edit, Delete } from '@element-plus/icons-vue'
import baseUtil from '../../utils/index'
onMounted(async () => {
    if (store.state.admin.ChargeUserStatus === "idle") {
        tableData.value = await store.dispatch('admin/getAllData')
    } else tableData.value = store.getters['admin/getChargeUser']
});
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const ruleFormRef = ref()
const search = ref('')
const editRow = ref(0);
const editIndex = ref(0)
const dialogVisible = ref(false)
const addFormVisible = ref(false)
const editPassVisble = ref(false)
const addRuleFormRef = ref();
const editFormRef = ref()
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
    name: '',
    role: '',
    endBan: '',
    telephone: '',
})
const editPassForm = reactive({
    id: null,
    password: '',
})
const addFrom = reactive({
    name: '',
    role: null,
    telephone: '',
    password: '',
    confirmPassword: ''
})
const options = [
    {
        value: 0,
        label: '超级管理员',
    },
    {
        value: 1,
        label: '商家',
    },
    {
        value: 2,
        label: '普通用户',
    }
]
const checkTelephone = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入电话号码'));
    } else {
        callback();
    }
};
const checkUsername = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'));
    } else {
        callback();
    }
};
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'));
    } else {
        if (addFrom.password !== '') {
            if (!addRuleFormRef.value) return;
            addRuleFormRef.value.validateField('confirmPassword', () => null);
        }
        callback();
    }
};
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== addFrom.password) {
        callback(new Error("两次密码不一致！"));
    } else {
        callback();
    }
};
const checkRole = (rule, value, callback) => {
    if (value === null || value === undefined) callback(new Error('请选择角色'));
    else callback();
}
const rules = reactive({
    password: [{ validator: validatePass, trigger: 'blur' }],
    confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
    telephone: [{ validator: checkTelephone, trigger: 'blur' }],
    name: [{ validator: checkUsername, trigger: 'blur' }],
    role: [{ validator: checkRole, trigger: 'blur' }],
});
const checkPassword = (rule, value, callback) => {
    if (value === '' || value === null || value === undefined) {
        callback(new Error('请再次输入密码'));
    } else {
        callback();
    }
};
const editRules = reactive({
    name: [{ validator: checkUsername, trigger: 'blur' }],
    telephone: [{ validator: checkTelephone, trigger: 'blur' }],
    role: [{ validator: checkRole, trigger: 'blur' }],
})
const editPassRules = reactive({
    password: [{ validator: checkPassword, trigger: 'blur' }],
})
const submitForm = (formEl) => {
    Loading.value = true
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            addFrom.role = addFrom.role[0];
            store.dispatch('admin/addUser', addFrom).then(res => {
                if (res === 0) baseUtil.failMessage('电话号码已存在')
                else if (res === -1) baseUtil.UnkownErrorMessage('未知错误')
                else if (res === -2) baseUtil.failMessage('输入不合法')
                else {
                    formEl.resetFields()
                    baseUtil.successMessage('用户增加成功')
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
/* const roleName = ["商家", "普通用户"]; */
const disabledDate = (date) => {
    // 在这里你可以编写自定义的逻辑来判断是否禁用日期
    const today = new Date();
    if (form.endBan) return false
    return date < today;
};
const handleEditConfirm = async (ruleFormRef) => {
    if (!ruleFormRef) return;
    ruleFormRef.validate(async (valid) => {
        if (valid) {
            await store.dispatch("admin/updateUser", { index: editIndex.value, data: form }).then(res => {
                if (res === 1) {
                    baseUtil.successMessage("修改成功")
                } else if (res === 0) {
                    baseUtil.failMessage("电话号码已存在")
                }
                else if (res === -2) baseUtil.failMessage('输入不合法');
                else baseUtil.UnkownErrorMessage("未知错误")
                dialogFormVisible.value = false
            })
        } else {
            return false;
        }
        ruleFormRef.resetFields()
    });
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
    form.role = row.role
    form.telephone = row.telephone
    form.id = row.id
    if (row.endBan !== null && row.endBan !== undefined) form.endBan = new Date(row.endBan)
    else form.endBan = ''
}
const handleDelete = (index, row) => {
    dialogVisible.value = true
    editIndex.value = index
    editRow.value = row
}
const handleDeleteConfirm = async () => {
    dialogVisible.value = false
    await store.dispatch('admin/deleteUserById', { id: editRow.value.id, index: editIndex.value }).then(res => {
        if (res === 1) {
            baseUtil.successMessage('删除成功')
        } else if (res === 0) baseUtil.failMessage('删除失败')
        else baseUtil.UnkownErrorMessage("未知错误")
    })
}
const handleEditPassword = (index, row) => {
    editPassForm.id = row.id
    editPassVisble.value = true;
}
const handleEditPassConfirm = async (editFormRef) => {
    if (!editFormRef) return;
    editFormRef.validate(async (valid) => {
        if (valid) {
            await store.dispatch("admin/editPassword", { userId: editPassForm.id, password: editPassForm.password }).then(res => {
                if (res === 1) {
                    baseUtil.successMessage("修改成功")
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