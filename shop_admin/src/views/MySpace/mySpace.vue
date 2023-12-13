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
                            <el-input v-model="form.name" placeholder="请输入" maxlength="20" show-word-limit />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取消</el-button>
                            <el-button type="primary" @click="handleconfirm(ruleFormRef)">
                                确认
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-descriptions-item>
            <el-descriptions-item label="余额">
                ￥ {{ Number(userData.balance).toFixed(2) }}
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
                    修改密码
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
                                确认
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/avatar.png';
import store from '@/store';
import { ref, reactive } from "vue";
import baseUtil from '../../utils/index'
import router from '@/router/router';

const userData = ref(store.state.user.User)
const editPassVisble = ref(false)
const editFormRef = ref()
const RoleData = [
    "超级管理员",
    "商家",
    "普通用户"
]
const dialogFormVisible = ref(false)
const ruleFormRef = ref();
const form = reactive({
    id: store.state.user.User.id,
    name: store.state.user.User.name
})
const handleconfirm = async (ruleFormRef) => {
    await store.dispatch("user/updateUserName", { data: form }).then(res => {
        if (res === 1) {
            baseUtil.successMessage("修改成功")
        } else if (res === 0) {
            baseUtil.failMessage("修改失败")
        } else baseUtil.UnkownErrorMessage("未知错误")
    })
    ruleFormRef.resetFields()
    dialogFormVisible.value = false;
}
const checkPassword = (rule, value, callback) => {
    if (value === '' || value === null || value === undefined) {
        callback(new Error('请输入密码'));
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
                    baseUtil.successMessage("修改成功")
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