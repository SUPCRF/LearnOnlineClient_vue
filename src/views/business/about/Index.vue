<template>
  <div class="about-container">
    <div class="about">
      <el-row class="main" type="flex" justify="center">
        <el-col :span="16">
          <h5 class="title"><i class="el-icon-star-on"></i>关于自己</h5>
          <div class="statement">
            <div class="item">校园在线学习</div>
            <div class="item" style="margin-top: 9px">作者：程如飞</div>
          </div>
          <div class="statement">
            <div class="item">Email：cheng_ru_fei@163.com</div>
            <div class="item" style="margin-top: 9px">QQ：1469750182</div>
            <div class="item" style="margin-top: 9px">
              GitHub：
              <a target="_blank" href="https://github.com/wicrf"
                >https://github.com/wicrf</a
              >
            </div>
          </div>
          <h5 class="title"><i class="el-icon-star-on"></i>关于项目</h5>
          <el-card shadow="always" style="margin-top: 20px">
            <dl class="dl-blog">
              <dt>涉及的技术</dt>
              <dd style="margin-top: 9px">
                Vue、Vue-Router、Element-ui、Minio
              </dd>
              <dt style="margin-top: 9px">其他</dt>
              <dd style="margin-top: 9px">
                百度分享、复制追加版权信息
              </dd>
            </dl>
          </el-card>
          <h5 class="title"><i class="el-icon-star-on"></i>给我留言</h5>
          <el-card shadow="always" style="margin-top: 20px">
            <el-form
              label-position="left"
              :rules="rules"
              label-width="80px"
              ref="formLabelAlign"
              :model="formLabelAlign"
            >
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="formLabelAlign.email"></el-input>
              </el-form-item>
              <el-form-item label="留言内容" prop="content">
                <el-input
                  type="textarea"
                  v-model="formLabelAlign.content"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('formLabelAlign')"
                  >提交留言</el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from "axios";

@Meta({
  title: "关于",
})
@Component
export default class About extends Vue {
  data() {
    return {
      formLabelAlign: {
        email: "",
        content: "",
      },
    };
  }
  submitForm(formName) {
    this.$refs[formName].validate((valid) => {
      if (valid) {
        let formdata = new FormData();
        formdata.append("email", this.formLabelAlign.email);
        formdata.append("content", this.formLabelAlign.content);
        axios({
          url: "http://localhost:8000/api/message/index",
          method: "post",
          data: formdata,
          headers: {},
        })
          .then((res) => {
            this.$message({
              message: "成功留言",
              type: "success",
            });
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

<style scoped>
.dl-blog dd {
  margin-left: 30px;
}

.dl-blog .icon {
  width: 20px;
  height: 20px;
}

.title {
  margin-top: 40px;
}

.statement {
  border-left: 3px solid #f56c6c;
  padding: 20px;
  background-color: #ebeef5;
  margin-top: 20px;
}
</style>
