<template>
    <div class="my-component">
        <div class="login">
            <div style="padding: 20px">
                <h1>注册</h1>
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" @submit.prevent
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="ruleForm.name" autocomplete="off" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="电话号码" prop="telephone">
                    <el-input v-model="ruleForm.telephone" autocomplete="off" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="ruleForm.code" autocomplete="off" maxlength="6" show-word-limit>
                        <template #append>
                            <el-button @click="sendCode">发送验证码</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" maxlength="25"
                        show-word-limit />
                </el-form-item>
                <el-form-item label="重复您的密码" prop="checkPass">
                    <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" maxlength="25"
                        show-word-limit />
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-cascader v-model="ruleForm.role" :options="options" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="Loading">提交</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
                <router-link to="/login">登入</router-link>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // 导入useRouter
import baseUtil from '../../utils/index'
const router = useRouter(); // 初始化router
const store = useStore();
const ruleFormRef = ref();
const Loading = ref(false);
const options = [
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
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (value === '') {
        callback(new Error('请输入电话号码'));
    }
    else if (!reg.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
    }
    else {
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
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return;
            ruleFormRef.value.validateField('checkPass', () => null);
        }
        callback();
    }
};
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入重复密码'));
    } else if (value !== ruleForm.password) {
        callback(new Error("两次输入的密码不一致"));
    } else {
        callback();
    }
};
const checkRole = (rule, value, callback) => {
    if (value === null || value === undefined) callback(new Error('请选择注册角色'));
    else callback();
}
const ruleForm = reactive({
    password: '',
    checkPass: '',
    telephone: '',
    name: '',
    role: null,
    code: ''
});
const checkCode = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入验证码'));
    } else {
        callback();
    }
};
const rules = reactive({
    password: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    telephone: [{ validator: checkTelephone, trigger: 'blur' }],
    code: [{ validator: checkCode, trigger: 'blur' }],
    name: [{ validator: checkUsername, trigger: 'blur' }],
    role: [{ validator: checkRole, trigger: 'blur' }],
});
const sendCode = async () => {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(ruleForm.telephone)) { return baseUtil.failMessage("请输入正确格式的手机号"); }
    await store.dispatch('user/sendRegisterCode', ruleForm.telephone).then(res => {
        if (res.code === 1) baseUtil.successMessage("验证码发送成功")
        else if (res.code === -1) baseUtil.failMessage(`验证码还在有效期内，请等待${res.alive}秒再发送`)
        else if (res.code === -2) baseUtil.failMessage("手机号已存在")
        else baseUtil.failMessage("验证码发送失败")
    })
}
const submitForm = (formEl) => {
    Loading.value = true
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            ruleForm.role = ruleForm.role[0] || null;
            store.dispatch('user/register', { data: ruleForm, code: ruleForm.code }).then(res => {
                if (res === 0) baseUtil.failMessage('电话号已存在')
                else if (res === -1) baseUtil.failMessage('Unknow Error')
                else if (res === -2) baseUtil.failMessage("验证码错误")
                else {
                    baseUtil.successMessage('注册成功，跳转登入页面')
                    if (ruleForm.role === 1) window.location.href = 'http://localhost:7090/'
                    router.push('/login')
                }
                Loading.value = false
            })
        } else {
            Loading.value = false
            return false;
        }
    });
};

const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style >
.my-component {
    background: url('/src/assets/109862500_p0.jpg') center center no-repeat;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    opacity: 0.8;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    width: 500px;
}
</style>
