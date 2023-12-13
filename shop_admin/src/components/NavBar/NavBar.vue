<template>
    <el-affix :offset="0">
        <div>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
                <div class="navbar">
                    <div class="centered-content">
                        <img src="../../assets/T1Kz0pXzJdXXXIdnjb-146-58.png" style="width: 100px;"
                            @click="$router.push('/')" />
                    </div>
                </div>
                <div class="flex-grow" />
                <h1 class="centered-content">{{ userData.name }}</h1>
                <router-link to="/myspace" class="centered-content">
                    <el-avatar :src="userData.avatarUrl === null ? defaultAvatarUrl : userData.avatarUrl"
                        class="centered-content" />
                </router-link>
                <el-sub-menu index="2">
                    <template #title>WorkSpace</template>
                    <el-menu-item index="space" @click="() => $router.push('/myspace')">个人空间</el-menu-item>
                    <el-menu-item index="chargeUser" v-if="userData.role === 0"
                        @click="() => $router.push('/UserCharge')">用户管理</el-menu-item>
                    <el-menu-item index="shopMessage" v-if="userData.role === 1"
                        @click="$router.push(`/shopMessage/${userData.id}`)">
                        订单消息
                    </el-menu-item>
                    <el-menu-item index="Myshop" v-if="userData.role !== 2"
                        @click="() => $router.push(`/ChargeShop/${userData.id}`)">商店管理</el-menu-item>
                    <el-menu-item index="logOut" @click="logOut">
                        退出登录
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>
    </el-affix>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/avatar.png';
import store from '@/store';
import router from '@/router/router';
import baseUtil from '../../utils/index';
import { ref, onMounted, watch } from 'vue'
const activeIndex = ref('1');
const userData = ref({});

onMounted(() => {
    userData.value = store.state.user.User;
    watch(() => store.getters['user/getUser'], (newUser) => {
        userData.value = newUser;
    });
});

function logOut() {
    store.dispatch('user/logOut');
    store.dispatch('admin/logOut');
    store.dispatch('goods/logOut')
    store.dispatch('shop/logOut')
    store.dispatch('order/logOut')
    baseUtil.successMessage('退出成功');
    router.push('/login');
}

</script>

<style>
.flex-grow {
    flex-grow: 1;
}

.navbar {
    display: flex;
    justify-content: space-between;
    /* 可以根据需要调整对齐方式 */
    align-items: center;
    /* 设置文本颜色 */
    padding: 10px 20px;
    /* 设置内边距 */
}

.centered-content {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.flex-grow {
    display: flex;
    align-items: center;
}
</style>