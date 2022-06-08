<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-link icon="el-icon-arrow-left" :underline="false" @click="goOff()"
      >返回</el-link
    >
    <div class="title-container">
      <h3 class="title">注册</h3>
    </div>
    <el-form-item prop="username">
      <el-input
        ref="username"
        v-model="ruleForm.username"
        placeholder="请输入用户名"
        prefix-icon="el-icon-user"
        clearable
      />
    </el-form-item>
    <el-form-item prop="email">
      <el-input
        ref="email"
        v-model="ruleForm.email"
        placeholder="请输入邮箱"
        prefix-icon="el-icon-s-promotion"
        clearable
      />
    </el-form-item>
    <el-form-item prop="pass">
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="ruleForm.pass"
        autocomplete="off"
        prefix-icon="el-icon-lock"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input
        type="password"
        placeholder="确认密码"
        v-model="ruleForm.checkPass"
        autocomplete="off"
        prefix-icon="el-icon-unlock"
        clearable
      ></el-input>
    </el-form-item>
    <el-button
      type="primary"
      style="width: 100%; margin-bottom: 5px"
      @click="register(ruleForm)"
      >注册</el-button
    >
  </el-form>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from "axios"

@Meta({
  title: "注册",
})
@Component
export default class Register extends Vue {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        email: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  }
  goOff() {
    this.$router.go(-1);
  }
  register(ruleForm) {
    this.$refs.ruleForm.validate((valid) => {
      if (valid) {
        let formdata = new FormData();
        formdata.append("username", this.ruleForm.username);
        formdata.append("email", this.ruleForm.email);
        let pass = this.$md5(this.ruleForm.checkPass);
        formdata.append("pass", pass);
        axios({
          url: "http://localhost:8000/api/student-user/register",
          method: "post",
          data: formdata,
          headers: {},
        })
          .then((res) => {
            console.log(res);
            this.$message({
              message: "注册成功",
              type: "success",
            });
            this.$router.go(-1);
          })
          .then((error) => {
            console.log(error);
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