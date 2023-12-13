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
                <div class="flex-grow">
                    <el-autocomplete v-model="searchValue" :fetch-suggestions="querySearch" clearable @input="handleInput"
                        class="input-with-select" size="large" style="width: 600px; margin: 0 auto;"
                        :placeholder="select === 1 ? '搜索你要查找的商品' : '搜索你要查找的商家'">
                        <template #prepend>
                            <el-select v-model="select" style="width: 80px;" size="large">
                                <el-option label="宝贝" :value="1" />
                                <el-option label="商家" :value="2" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button style="background-color: rgb(255, 132, 0); color: aliceblue;" size="large"
                                @click="handleSearch">
                                搜索
                            </el-button>
                        </template>
                    </el-autocomplete>
                </div>
                <h1 class="centered-content">
                    <span>
                        {{ userData.name }}
                    </span>
                </h1>
                <router-link to="/myspace" class="centered-content">
                    <el-avatar
                        :src="userData.avatarUrl === null || userData.avatarUrl === undefined ? defaultAvatarUrl : userData.avatarUrl"
                        class="centered-content" />
                </router-link>
                <el-sub-menu index="2">
                    <template #title>WorkSpace</template>
                    <el-menu-item index="space" @click="() => $router.push('/myspace')"
                        v-if="userData.role === 2">个人空间</el-menu-item>
                    <el-menu-item index="login" @click="() => $router.push('/login')"
                        v-if="userData.role === undefined">登入</el-menu-item>
                    <el-menu-item index="register" @click="() => $router.push('/register')"
                        v-if="userData.role === undefined">注册</el-menu-item>
                    <el-menu-item index="ShoppingCart" v-if="userData.role === 2"
                        @click="() => $router.push(`/ShopCart/${userData.id}`)">购物车</el-menu-item>
                    <el-menu-item index="logOut" @click="logOut" v-if="userData.role === 2">
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
const searchValue = ref('');
const select = ref(1);
const userData = ref({});
const restaurantsGoods = loadAllGoods();
const restaurantsShop = loadAllShop();
onMounted(() => {
    userData.value = store.state.user.User;
    watch(() => store.getters['user/getUser'], (newUser) => {
        userData.value = newUser;
    });
});

function logOut() {
    store.dispatch('user/logOut');
    store.dispatch('shopCart/logOut')
    store.dispatch('order/logOut')
    baseUtil.successMessage('退出成功');
    router.push('/');
}
function saveSearchHistory(value) {
    if (select.value === 1) {
        if (restaurantsGoods.findIndex(item => item['value'] === value['value']) !== -1) return
        // 假设最多保存5条搜索记录
        if (restaurantsGoods.length >= 8) {
            restaurantsGoods.pop(); // 移除最早的搜索记录
        }
        restaurantsGoods.unshift(value); // 将新的搜索记录添加到数组开头
        localStorage.setItem('searchHistoryGoods', JSON.stringify(restaurantsGoods));
    } else {
        if (restaurantsShop.findIndex(item => item['value'] === value['value']) !== -1) return
        // 假设最多保存5条搜索记录
        if (restaurantsShop.length >= 8) {
            restaurantsShop.pop(); // 移除最早的搜索记录
        }
        restaurantsShop.unshift(value); // 将新的搜索记录添加到数组开头
        localStorage.setItem('searchHistoryShop', JSON.stringify(restaurantsShop));
    }
}
function handleSearch() {
    const search = searchValue.value.trim();
    if (search === null || search === undefined || search === '') {
        baseUtil.failMessage('请输入搜索信息');
        return
    }
    saveSearchHistory({ value: search });
    if (select.value === 1) {
        window.location.href = `http://localhost:8090/goodsSearchPage/${search}/${select.value}`
    } else {
        window.location.href = `http://localhost:8090/shopSearchPage/${search}/${select.value}`
    }
}
function handleInput(value) {
    // 在这里处理输入框的值
    searchValue.value = value;
}
function querySearch(queryString, cb) {
    const search = queryString || '';
    if (select.value === 1) {
        const results = search
            ? restaurantsGoods.filter(createFilter(search))
            : restaurantsGoods;
        cb(results);
    } else {
        const results = search
            ? restaurantsShop.filter(createFilter(search))
            : restaurantsShop;
        cb(results);
    }
}

function createFilter(queryString) {
    return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    };
}

function loadAllGoods() {
    const savedHistory = localStorage.getItem('searchHistoryGoods');
    if (savedHistory) {
        return JSON.parse(savedHistory)
    } else return []
}
function loadAllShop() {
    const savedHistory = localStorage.getItem('searchHistoryShop');
    if (savedHistory) {
        return JSON.parse(savedHistory)
    } else return []
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