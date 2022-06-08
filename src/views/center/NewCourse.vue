<template>
  <div>
    <el-form :model="form">
      <el-form-item label="课程名称" :label-width="formLabelWidth">
        <el-input v-model="form.coursename" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="课程描述" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.title"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-upload
      class="upload"
      ref="upload"
      action="string"
      :file-list="fileList"
      :auto-upload="false"
      :http-request="uploadFile"
      :on-change="handleChange"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-progress="progressA"
      multiple="multiple"
    >
      <el-button slot="trigger" size="small" type="primary"
        >上传课程视频</el-button
      >
      <el-button slot="trigger" size="small" type="primary"
        >上传课程封面</el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >确定</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Meta({
  title: "个人中心",
})
@Component()
export default class Index extends Vue {
  data() {
    return {
      form: {
        coursename: "",
        title: "",
      },
      newForm: {},
      fileList: [],
      multiple: true,
      formData: "",
    };
  }

  handleChange(file, fileList) {
    this.fileList = fileList;
  }
  uploadFile(file) {
    this.formData.append("file", file.file);
  }
  handleRemove(file, fileList) {
    console.log(file, fileList);
  }
  handlePreview(file) {
    console.log(file);
  }
  submitUpload() {
    console.log(this.form.coursename);
    console.log(this.form.title);
    console.log(this.$store.state.userInfo.id);
    let formData = new FormData();
    let token = Cookies.get("token");
    formData.append("coursename", this.form.coursename);
    formData.append("userid", this.$store.state.userInfo.id);
    let type = localStorage.getItem("type");
      // formData.append("userType", type);
    formData.append("usertype", type);
    formData.append("title", this.form.title);
    formData.append("video", this.fileList[0].raw);
    formData.append("coursepic", this.fileList[1].raw);

    axios({
      url: "http://localhost:8000/api/course/save",
      method: "post",
      data: formData,
      headers: {
        Authorization: token,
      },
    }).then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res);
        // this.fileList.onSuccess();
        this.$message.success("success");
        this.$router.push("/center/course")
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    });
  }

  /**     文件正在上传时的钩子    **/
  progressA(event, file) {}
  /**     移除上传文件    **/
  handleRemove(file) {
    this.$refs.upload.abort(); //取消上传
    this.$message({ message: "成功移除" + file.name, type: "success" });
  }
}
</script>

<style>

</style>
