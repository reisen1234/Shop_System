<template>
    <div class="my-component">
        <div class="login">
            <div style="padding:20px">
                <h1>登入</h1>
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" @submit.prevent
                class="demo-ruleForm">
                <el-form-item label="电话号码" prop="telephone">
                    <el-input v-model="ruleForm.telephone" autocomplete="off" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!loginByCode">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" maxlength="25"
                        show-word-limit />
                </el-form-item>
                <el-form-item label="验证码" prop="code" v-if="loginByCode">
                    <el-input v-model="ruleForm.code" type="code" autocomplete="off" maxlength="6" show-word-limit>
                        <template #append>
                            <el-button @click="sendCode">发送验证码</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain @click="submitForm(ruleFormRef)">登入</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                    <el-button @click="router.push('/')">游客登入</el-button>
                </el-form-item>
                <el-button @click="router.push('/register')" link type='success'>注册</el-button>
                <el-button link type='success'>
                    <span v-if="!loginByCode" @click="loginByCode = true">验证码登入</span>
                    <span v-if="loginByCode" @click="loginByCode = false">密码登入</span>
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script  setup>
import { reactive, ref, onMounted } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // 
import baseUtil from '../../utils/index'
const ruleFormRef = ref();
// eslint-disable-next-line no-unused-vars
const router = useRouter();
const store = useStore();
const loginByCode = ref(false)
onMounted(() => {
    if (store.state.user.userStatus === "success") router.push('/')
    else {
        store.dispatch('user/logOut');
        store.dispatch('shopCart/logOut')
        store.dispatch('order/logOut')
        router.push('/login')
    }
});
const checkTelephone = (rule, value, callback) => {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (value === '') {
        callback(new Error('请输入电话号码'));
    }
    else if (!reg.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
    } else {
        callback();
    }
};

const ruleForm = reactive({
    password: '',
    telephone: '',
    code: ''
});

const rules = reactive({
    telephone: [{ validator: checkTelephone, trigger: 'blur' }],
});
const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            if (loginByCode.value === false) {
                if (ruleForm.password === '' || ruleForm.password === null || ruleForm.password === undefined) {
                    baseUtil.failMessage("请输入密码")
                    return false;
                }
            } else if (loginByCode.value === true) {
                if (ruleForm.code === '' || ruleForm.code === null || ruleForm.code === undefined) {
                    baseUtil.failMessage("请输入验证码")
                    return false;
                }
            }
            else {
                return false;
            }
            store.dispatch('user/login', { data: ruleForm, loginType: loginByCode.value, code: ruleForm.code }).then(res => {
                if (res === 0) baseUtil.failMessage('密码或者电话号码错误')
                else if (res == -1) baseUtil.UnkownErrorMessage('Unkow Error');
                else if (res === 2) baseUtil.failMessage('账户已被封禁！');
                else if (res === 3) baseUtil.failMessage("请前往管理员客户端登入")
                else if (res === 4) baseUtil.failMessage("验证码错误")
                else {
                    baseUtil.successMessage('登入成功')
                    router.push('/')
                }
            })
        } else {
            return false;
        }
    });
};
const sendCode = async () => {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(ruleForm.telephone)) { return baseUtil.failMessage("请输入正确格式的手机号"); }
    await store.dispatch('user/sendLoginCode', ruleForm.telephone).then(res => {
        if (res.code === 1) baseUtil.successMessage("验证码发送成功")
        else if (res.code === -1) baseUtil.failMessage(`验证码还在有效期内，请等待${res.alive}秒再发送`)
        else if (res.code === -2) baseUtil.failMessage("手机号不存在")
        else baseUtil.failMessage("验证码发送失败")
    })
}
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