<template>
    <div class="home">
        <el-container>
            <el-header style="background-color: white; z-index: 1000">
                <NavBar />
            </el-header>
            <el-container>
                <el-container>
                    <el-main>
                        <RouterView />
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import NavBar from '@/components/NavBar/NavBar.vue';
</script>
<style>
.home {
    height: 100%;
    width: 100%;
    background-image: url("/src/assets/background.jpg");
}

.el-container {
    overflow: hidden;
}
</style>