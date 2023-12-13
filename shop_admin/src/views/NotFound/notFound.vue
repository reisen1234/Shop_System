<template>
    <div>
        <img src="../../assets/404.jpg" class="full-img" />
    </div>
</template>
<script setup>
</script>
<style>
.full-img {
    position: absolute;
    /* 设置绝对定位 */
    top: 0;
    left: 0;
    width: 100%;
    /* 图像宽度占满容器 */
    /* 图像高度占满容器 */
    object-fit: cover;
    /* 裁剪图像以适应容器 */
}
</style>