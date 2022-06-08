<template>
  <div class="h-size">
    <el-avatar>登录
    </el-avatar>
    <el-dropdown trigger="hover" size="medium" :hide-on-click="true">
      <span class="el-dropdown-link">
        <a :href="'/login/sign'" style="color: #fff">登录/注册</a>
      </span>
      <!-- <el-dropdown-menu></el-dropdown-menu> -->
    </el-dropdown>
  </div>
</template>

<script>
export default {
  methods: {
    errorHandler() {
        return true
      }
  },
};
</script>