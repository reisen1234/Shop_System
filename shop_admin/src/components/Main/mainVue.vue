<template>
    <div class="main">
        <h1 style="font-size:25px; font-family:宋体;font-weight:900">
            欢迎来到商店管理系统
        </h1>
    </div>
</template>
  
<script setup >
</script>
  
<style>
.main {
    width: 1300px;
    margin: 0 auto;
    background-color: rgb(255, 248, 249);
    border-radius: 30px;
    padding: 30px 30px 30px 30px;
    margin-top: 50px;
    margin-bottom: 50px
}

.row {
    width: 100%;
}

.spacer {
    flex: 0 0 100px;
    /* 设置左右间隔为100px */
}

.card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 垂直居中对齐 */
}

.card {
    margin: 10px;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}
</style>
  