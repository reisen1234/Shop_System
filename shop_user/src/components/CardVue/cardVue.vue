<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="custom-card"
            @click="$router.push(`/Goods/${props.data.id}/${props.data.shopId}`)">
            <img :src="props.data !== null && props.data !== undefined && props.data.photos.length !== 0 ? props.data.photos[0].url : defaultImage"
                class="image" />
            <div style="padding: 14px">
                <p>
                    <el-text line-clamp="2" class="w-200px mb-2" size="large">
                        {{ props.data.name }}
                    </el-text>
                </p>
                <p>
                    <span style="color:rgb(255,80,0); font-size:20px">
                        ￥{{ props.data.price }}
                    </span>
                    <span style="color:rgb(153,153,153); font-size:13px">
                        {{ baseUtil.roundDownToNearestMultiple(props.data.paying) }}+人付款
                    </span>
                </p>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
import baseUtil from '../../utils/index'
import defaultImage from '../../assets/photo.png'
const props = defineProps({
    data: Object, // 在这里定义需要接收的props的类型
    size: Number
});
onMounted(() => {
})
</script>

<style>
.time {
    font-size: 12px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.button {
    padding: 0;
    min-height: auto;
}

.image {
    display: block;
    width: 228px;
    height: 231px;
    object-fit: contain;
    /* 调整图片尺寸以适应容器，保持宽高比 */
    object-position: center;
    /* 居中显示图片 */
}

.custom-card {
    background-color: rgb(255, 248, 249);
    border: none;
}

.custom-card:hover {
    background-color: white;
    /* 鼠标悬停时的背景颜色 */
}
</style>