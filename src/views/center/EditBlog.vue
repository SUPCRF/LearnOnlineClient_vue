<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      :hide-required-asterisk="true"
      class="demo-ruleForm"
    >
      <el-form-item label="博客标题" prop="blogname">
        <el-input v-model="ruleForm.blogname"></el-input>
      </el-form-item>
      <!-- <el-form-item label="博客类型" prop="blogtype">
        <el-checkbox-group v-model="ruleForm.blogtype">
          <el-checkbox label="java" name="type"></el-checkbox>
          <el-checkbox label="web" name="type"></el-checkbox>
          <el-checkbox label="linux" name="type"></el-checkbox>
          <el-checkbox label="其他" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="博客描述" prop="title">
        <el-input type="textarea" v-model="ruleForm.title"></el-input>
      </el-form-item>
    </el-form>
    <mavon-editor
      v-model="content"
      :placeholder="'请编辑你的内容 ···'"
      :ishljs="true"
      :scrollStyle="true"
      ref="md"
      :toolbarsBackground="'#f9f9f9'"
      :toolbars="toolbars"
      style="min-height: calc(100vh - 358px)"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
      @change="change"
    ></mavon-editor>
    <div class="checkbtn">
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitEdit"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";
import "highlight.js/styles/github.css";
import "mavon-editor/dist/markdown/github-markdown.min.css";
import "github-markdown-css";
import { addCodeBtn } from "../../utils/mavon";

@Context("id")
@Meta({
  title: "个人中心",
})
@Component
export default class Edit extends Vue {
  data() {
    return {
      // markdownOption: {
      //   bold: true, // 粗体
      // },
      // handbook: GUID,
      ruleForm: {
        blogname: "",
        // blogtype: [],
        title: "",
      },
      rules: {
        blogname: [
          { required: true, message: "请输入博客名称", trigger: "blur" },
          { min: 3, message: "长度最少三个字符", trigger: "blur" },
        ],
        // blogtype: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一个博客类型",
        //     trigger: "change",
        //   },
        // ],
        title: [{ required: true, message: "请填写博客描述", trigger: "blur" }],
      },
      content: "",
      html: "",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: false, // 预览
      },
      fileList: [],
      multiple: true,
      formData: "",
    };
  }

  created() {
    this.getBlogInfo();
  }

  getBlogInfo() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    formdata.append("blogId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/blog/blogInfos",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.content = res.data.data.md;
        this.ruleForm.blogname = res.data.data.blogName;
        this.ruleForm.title = res.data.data.title;
        // console.log(this.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  $imgAdd(pos, $file) {
    // 第一步.将图片上传到服务器.
    var formdata = new FormData();
    formdata.append("image", $file);
    this.img_file[pos] = $file;
    this.$http({
      url: "/api/edit/uploadimg",
      method: "post",
      data: formdata,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      let _res = res.data;
      // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
      this.$refs.md.$img2Url(pos, _res.url);
    });
  }
  $imgDel(pos) {
    delete this.img_file[pos];
  }
  change(value, render) {
    this.html = render;
    this.$nextTick((_) => {
      addCodeBtn();
    });
  }
  提交;
  submit() {
    console.log(this.content);
    console.log(this.html);
  }

  delFile() {
    this.fileList = [];
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
  submitEdit() {
    let formData = new FormData();
    let token = Cookies.get("token");
    formData.append("blogname", this.ruleForm.blogname);
    formData.append("blogId", this.$route.params.id);
    formData.append("title", this.ruleForm.title);
    formData.append("md", this.content);
    formData.append("html", this.html);
    axios({
      url: "http://localhost:8000/api/blog/editBlog",
      method: "post",
      data: formData,
      headers: {
        Authorization: token,
      },
    }).then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res);
        // this.addFormVisible = false; //dialog对话窗口关闭
        this.$message.success("success");
        this.$router.push("/center/blog");
        // location.reload();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    });
  }

  submitUpload() {
    console.log(this.ruleForm.blogname);
    console.log(this.ruleForm.title);
    console.log(this.$store.state.userInfo.id);
    let formData = new FormData();
    let token = Cookies.get("token");
    // formData.append("theme", this.theme);
    formData.append("blogname", this.ruleForm.blogname);
    formData.append("userid", this.$store.state.userInfo.id);
    let type = localStorage.getItem("type");
    console.log(type);
    formData.append("usertype", type);
    // formData.append("usertype", "admin");
    formData.append("title", this.ruleForm.title);
    formData.append("md", this.content);
    formData.append("html", this.html);
    formData.append("blogpic", this.fileList[0].raw);

    axios({
      url: "http://localhost:8000/api/blog/save",
      method: "post",
      data: formData,
      headers: {
        Authorization: token,
      },
    }).then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res);
        // this.addFormVisible = false; //dialog对话窗口关闭
        this.$message.success("success");
        this.$router.push("/center/blog");
        // location.reload();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    });
  }

  // submitForm(formName) {
  //   this.$refs[formName].validate((valid) => {
  //     if (valid) {
  //       alert("submit!");
  //     } else {
  //       console.log("error submit!!");
  //       return false;
  //     }
  //   });
  // }
  // resetForm(formName) {
  //   this.$refs[formName].resetFields();
  // }
}
</script>

<style>
.checkbtn {
  margin-top: 20px;
  text-align: center;
}
</style>

<style lang="scss">
.markdown-container {
  .editor-btn {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

pre.code {
  position: relative;
  border-radius: 3px;
  border: 1px solid #c3ccd0;
  overflow: hidden;
  padding-left: 60px !important;
  code {
    line-height: 30px !important;
  }
  ol.pre-numbering {
    position: absolute;
    top: 0;
    left: 5px;
    line-height: 30px;
    padding: 16px 0;
    list-style-type: none;
    counter-reset: sectioncounter;
    margin-bottom: 0;
    li {
      margin-top: 0 !important;
      &:before {
        content: counter(sectioncounter) "";
        counter-increment: sectioncounter;
        display: inline-block;
        width: 40px;
        text-align: center;
        border-right: solid 1px rgba(0, 0, 0, 0.53);
      }
    }
  }
  i.code-copy {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #464d5e;
    padding: 3px;
    margin: 3px 3px 0 0;
    font-size: 11px;
    border-radius: inherit;
    color: #f1f1f1;
    cursor: pointer;
    display: none;
  }
  &:hover i.code-copy {
    display: block;
  }
}
</style>
