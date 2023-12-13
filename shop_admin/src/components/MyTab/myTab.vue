<template>
    <div class="myTab">
        <el-row>
            <el-col :span="12">订单信息</el-col>
            <el-col :span="2">收货人</el-col>
            <el-col :span="3">收货地址</el-col>
            <el-col :span="2" :offset="1">金额</el-col>
            <el-col :span="2">订单状态</el-col>
            <el-col :span="2">操作</el-col>
        </el-row>
        <el-divider style="margin:10px" />
    </div>
</template>

<script setup>
</script>

<style scoped>
.myTab {
    padding-bottom: 20px;
}
</style>