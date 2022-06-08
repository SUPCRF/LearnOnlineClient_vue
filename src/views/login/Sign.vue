<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <div class="title-container">
      <h3 class="title">登录</h3>
    </div>
    <el-form-item prop="username">
      <el-input
        v-model="ruleForm.username"
        type="text"
        placeholder="请输入用户名"
        prefix-icon="el-icon-user"
        clearable
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        placeholder="请输入密码"
        prefix-icon="el-icon-lock"
        show-password
      />
    </el-form-item>
    <div prop="radio" style="margin-top: 15px; margin-bottom: 10px">
      <el-radio v-model="ruleForm.radio" label="1">学生登录</el-radio>
      <el-radio v-model="ruleForm.radio" label="2">教师登录</el-radio>
    </div>
    <el-button
      type="primary"
      style="width: 100%; margin-bottom: 5px"
      @click="loginFn"
      >登录</el-button
    >
    <el-button
      type="text"
      style="width: 100%; margin-bottom: 10px"
      @click="goreg"
      >新用户注册</el-button
    >
    <el-divider content-position="center"
      ><i class="el-icon-s-promotion" />SUP-CRF</el-divider
    >
    <div style="text-align: center; margin-top: 20px">
      <el-link type="primary" style="margin: 0px 8px">用户协议</el-link>
      <el-link type="primary" style="margin: 0px 8px">隐私条款</el-link>
    </div>
  </el-form>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import Cookies from "js-cookie";
import axios from "axios";

@Meta({
  title: "登录",
})
@Component
export default class Sign extends Vue {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        radio: "1",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        radio: [
          { required: true, message: "请选择登录身份", trigger: "change" },
        ],
      },
    };
  }
  goreg() {
    this.$router.push("/login/register");
  }

  loginFn() {
    console.log(this.ruleForm);
    this.$refs["ruleForm"].validate((valid) => {
      if (valid) {
        const _this = this;
        this.$api.login
          .loginFn({
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            type: this.ruleForm.radio,
          })
          .then((res) => {
            // console.log(res);
            // console.log(this.$store);
            // console.log(res.headers);
            let type = this.ruleForm.radio;
              console.log(type);
              if (type == "1") {
                this.$store.commit("SET_TYPE", "student");
                console.log(123);
                console.log(this.$store.state.type);
              } else if (type == "2") {
                this.$store.commit("SET_TYPE", "teacher");
                console.log(456);
              }
            if (res.code == 200) {
              // const jwt = res.headers["authorization"];
              const jwt = res.data.token;
              console.log(jwt);
              const userInfo = res.data;
              console.log(userInfo);
              // Cookies.set("token", res.headers["authorization"]);
              Cookies.set("token", jwt); // 放置token到Cookie
              // this.$store.state.userInfo = res.data.data;

              this.$store.commit("SET_TOKEN", jwt);
              this.$store.commit("SET_USERINFO", userInfo);

              // _this.$router.push("/business/");
              console.log(this.$store.state.userInfo);
              this.$router.push("/business/"); // 登录成功，跳转到主页
              this.$notify({
                title: "登录成功",
                type: "success",
              });
            } else {
              console.log(res);
              console.log(this.$store);
              this.$notify.error({
                title: "登录失败",
                message: res.message,
              });
            }
          });
      } else {
        return false;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  position: relative;

  .title {
    font-size: 26px;
    color: black;
    margin: 15px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
}
</style>