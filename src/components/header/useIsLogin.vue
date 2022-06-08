<template>
  <div class="h-size">
    <el-avatar :size="40" :src="avatarSrc" @error="errorHandler">
      <img
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
    </el-avatar>
    <el-dropdown trigger="hover" size="medium">
      <span class="el-dropdown-link">
        {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          ><a :href="'/center/course'">个人中心</a></el-dropdown-item
        >
        <el-dropdown-item @click.native="logoutFn">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      username: "supcrf",
      avatarSrc: "",
    };
  },

  mounted() {
    // console.log(Cookies.get("token"));
    let token = Cookies.get("token");
    console.log(token);
    if (!token) {
      // this.flag = false
      console.log(1);
    } else {
      // this.flag = true
      this.username = this.$store.state.userInfo.username;
      this.avatarSrc = this.$store.state.userInfo.avatar;
      console.log(2);
    }
  },

  methods: {
    errorHandler() {
      return true;
    },

    logoutFn() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$api.login.logoutFn().then((res) => {
            console.log(123);
            console.log(res);
            // if (res.code == 200) {
            this.$store.commit("REMOVE_INFO");
            // this.$router.push("/login");
            console.log(123);
            location.reload();
            Cookies.remove("token");
            // } else {
            //   this.$message({
            //     message: res.msg,
            //     type: "error",
            //   });
            // }
          });
        })
        .catch(() => {});
    },
  },
};
</script>