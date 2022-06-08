<template>
  <!-- <el-container :style="height"> -->
  <el-container>
    <el-header><nav-header /></el-header>
    <el-main><router-view /></el-main>
    <el-footer height="150px"><Footer /></el-footer>
    <el-backtop :bottom="60" />
  </el-container>
</template>

<script>
import navHeader from "@/components/header/navHeader.vue";
import Footer from "@/components/footer.vue";
export default {
  // data() {
  //   return{
  //     height: {height: ""}
  //   }
  // },
  components: { navHeader, Footer },
  // created() {
  //   console.log(this.$route.path);
  //   this.getHeight();
  // },
  // watch: {
  //   $route: "getHeight",
  // },
  // methods: {
  //   getHeight() {
  //     console.log(this.$route.path);
  //     let path = this.$route.path;
  //     if (path === "/business/about") {
  //       this.height = {height: "100vh"}
  //     } else {
  //       this.height = {height: ""}
  //     }
  //     console.log(this.height);
  //   },
  // },
};
</script>

<style>
.el-container {
  min-height: 100vh;
}
.el-header {
  width: 100%;
  position: fixed;
  top: 0;
  background-color: #545c64;
}

.el-header,
.el-footer {
  background-color: #545c64;
  color: #333;
  z-index: 1;
}

.el-main {
  margin-top: 60px;
  background-color: #ffffff;
  color: #333;
  z-index: 0;
}
</style>