<template>
  <el-container id="center-container">
    <el-aside width="200px">
      <div class="aside-container">
        <div class="center-avatar">
          <el-avatar :size="90" @error="errorHandler">
            <img
              :src="avatarSrc"
            />
          </el-avatar>
        </div>

        <el-menu
          router
          :default-active="this.$route.path"
          background-color="#3d3b4f"
          text-color="white"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/center/course">
            <span slot="title">课程</span>
          </el-menu-item>
          <el-menu-item v-if="teacherFlag" index="/center/grades">
            <span slot="title">成绩</span>
          </el-menu-item>
          <el-menu-item index="/center/blog">
            <span slot="title">博客</span>
          </el-menu-item>
          <template v-if="flagType">
            <el-menu-item index="/center/homework">
              <span slot="title">作业</span>
            </el-menu-item>
            <el-menu-item index="/center/exam">
              <span slot="title">考试</span>
            </el-menu-item>
          </template>
          <el-menu-item index="/center/setting">
            <span slot="title">设置</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <el-page-header @back="goBack" title="返回首页" content="个人中心" />
        <div class="center-avatar-link">欢迎你，{{ username }}，<el-link :underline="false" type="danger" @click="logoutFn">退出</el-link></div>
      </el-header>
      <el-main><router-view /></el-main>
      <el-footer>
        <div style="font-size: 12px">Copyright/© 2020-2021 supcrf 程如飞</div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
export default {
  data() {
    return {
      username: "supcrf",
      avatarSrc: "",
      flagType: true,
      teacherFlag: false,
    };
  },
  mounted() {
    this.getUserInfo()
  },
  created() {
    console.log(this.$store.state.type);
    console.log(localStorage.getItem("type"));
    console.log(this.$store.state.userInfo);
    let username = this.$store.state.userInfo.username;
    this.username = username;
    console.log(this.$store.getType);
    let type = localStorage.getItem("type");
    if (type === "student") {
      this.flagType = true;
      this.teacherFlag = false;
    } else {
      this.flagType = false;
      this.teacherFlag = true;
    }
  },
  methods: {
    errorHandler() {
      return true;
    },
    goBack() {
      this.$router.replace("/business/");
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
            // location.reload();
            Cookies.remove("token");
            this.$router.push("/business/");
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
    getUserInfo() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    let type = localStorage.getItem("type")
    console.log(type);
    formdata.append("userType", type);
    formdata.append("userId", this.$store.state.userInfo.id);
    axios({
      url: "http://localhost:8000/api/common/userInfo",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    }).then((res) => {
      console.log(res);
      if (res.status == 200) {
        console.log("ok");
        console.log(res.data.data);
        // this.ruleForm.id = res.data.data.id;
        // this.ruleForm.userName = res.data.data.username;
        // if (res.data.data.sex === 0) {
        //   this.ruleForm.sex = "男";
        // } else {
        //   this.ruleForm.sex = "女";
        // }
        // this.ruleForm.phone = res.data.data.phone;
        // this.ruleForm.email = res.data.data.email;
        // this.ruleForm.birth = res.data.data.birth;
        this.avatarSrc = res.data.data.avatar;
        console.log(this.avatarSrc);
      }
    });
  }
  },
};
</script>

<style scoped>
#center-container {
  height: 100vh;
}

.el-header,
.el-footer {
  /* background-color: #425066; */
  background-color: aliceblue;
  color: black;
  text-align: center;
  line-height: 60px;
}

.el-header {
  display: inline-block;
  text-align: justify;
}

.el-header .el-page-header {
  position: absolute;
  margin-top: 18px;
  width: 260px;
}

.el-header .center-avatar-link {
  position: absolute;
  right: 20%;
  /* float: right; */
  text-align: right;
  font-size: 12px;
  color: black;
  /* background-color: aqua; */
  width: 250px;
}

.el-page-header >>> .el-page-header__content {
  color: black;
  font-size: 16px;
}

.el-aside {
  text-align: center;
  background-color: #3d3b4f;
  /* background-image: url('../../assets/images/bg.jpg');
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-position: -50px 0px;
  background-size: 300px 200px; */
  /* height: 250px;    */
  width: 375px;
  float: left;
  margin: 10px;
  -webkit-background-size: 50px 50px;
  -moz-background-size: 50px 50px;
  background-size: 50px 50px; /* 控制条纹的大小 */
  -moz-box-shadow: 1px 1px 8px gray;
  -webkit-box-shadow: 1px 1px 8px gray;
  box-shadow: 1px 1px 8px gray;
}

.el-aside .center-avatar {
  margin-top: 40px;
  margin-bottom: 20px;
}

.el-aside .el-avatar {
  margin-bottom: 3px;
}

.el-main {
  color: #333;
  background-color: aliceblue;
}

.el-menu {
  border-right: 0;
}
</style>