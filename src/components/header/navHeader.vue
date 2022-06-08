<template>
  <div class="h-container">
    <el-menu
      router
      :default-active="$route.path"
      class="el-menu"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      width="100px"
    >
      <template
        v-for="group in this.$router.options.routes[1].children[2].children"
      >
        <el-menu-item
          v-if="group.children && group.children.length > 0"
          :key="group.id"
          :index="'/business/' + group.path"
          >{{ group.children[0].meta.title }}</el-menu-item
        >
        <el-menu-item
          v-else
          :key="group.id"
          :index="'/business/' + group.path"
          >{{ group.meta.title }}</el-menu-item
        >
      </template>
    </el-menu>

    <div class="search">
      <searchcom />
    </div>

    <!-- <component v-bind:is="currentBizComponent"></component> -->
    <userIsLogin v-if="flag"></userIsLogin>
    <userNoLogin v-if="!flag"></userNoLogin>
  </div>
</template>

<script>
import Searchcom from "./searchcom.vue";
import userIsLogin from "./useIsLogin";
import userNoLogin from "./userNologin";
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      flag: false,
    }
  },
  components: { userIsLogin, userNoLogin, Searchcom },
  // computed: {
  //   condition: function () {
  //     return "No";
  //   },
  //   currentBizComponent: function () {
  //     return "user" + this.condition + "Login";
  //   },
  // },
  mounted() {
    // console.log(Cookies.get("token"));
    let token = Cookies.get("token");
    console.log(token);
    if(!token) {
      this.flag = false
      console.log(1);
    }else {
      this.flag = true
      console.log(2);
    }
  }
};
</script>

<style>
.h-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.h-size {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 40px;
}

.el-dropdown {
  position: absolute;
  top: -15px;
  height: 15px;
}

.el-dropdown-link {
  margin-top: -100px;
  margin-left: 10px;
  cursor: pointer;
  color: white;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.search {
  position: absolute;
  top: 10px;
  left: 300px;
}
</style>