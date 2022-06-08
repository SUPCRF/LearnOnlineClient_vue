<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <div class="grid-content bg-purple-dark">
          <div style="blogname_title">{{blogName}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <div class="grid-content bg-purple-dark">
          <div class="mavonEditor">
            <mavon-editor
              v-model="content"
              :subfield="false"
              :ishljs="true"
              :scrollStyle="true"
              defaultOpen="preview"
              :toolbarsFlag="false"
              :toolbarsBackground="'#f9f9f9'"
              style="min-height: calc(100vh - 50px)"
              @change="change"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="20" class="messages">
        <div class="grid-content bg-purple-dark">
          <el-input
            placeholder="请输入内容"
            v-model="message"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-chat-dot-round"
              :disabled="flag"
              @click="onMessage"
              >发表留言</el-button
            >
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="messages-text">
      <el-col :span="20">
        <div class="grid-content bg-purple-dark">
          <el-table :data="tableData" :show-header="false" style="width: 100%">
            <el-table-column prop="username" label="昵称" width="180">
            </el-table-column>
            <el-table-column prop="content" label="留言"> </el-table-column>
            <!-- <el-table-column prop="createTime" fixed="right" label="时间"> </el-table-column> -->
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";
import "highlight.js/styles/github.css";
import "mavon-editor/dist/markdown/github-markdown.min.css";
import { addCodeBtn } from "../../../utils/mavon";

@Context("id")
@Meta({
  title: "论坛",
})
@Component()
export default class ShowBlog extends Vue {
  data() {
    return {
      flag: false,
      blogName: "",
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
      message: "",
      tableData: [],
    };
  }
  mounted() {
    console.log(this.$route.params.id);
    this.getBlogInfo();
    this.getMessageInfo();
  }
  getBlogInfo() {
    let formdata = new FormData();
    formdata.append("blogId", this.$route.params.id + "");
    axios({
      url: "http://localhost:8000/api/blog/blogMd",
      method: "post",
      data: formdata,
      headers: {},
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.content = res.data.data.blogmd;
        this.blogName = res.data.data.blogname;
        console.log(this.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getMessageInfo() {
    let formdata = new FormData();
    formdata.append("blogId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/blog-content/all",
      method: "post",
      data: formdata,
      headers: {},
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.tableData = res.data.data;
        console.log(this.tableData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onMessage() {
    let token = Cookies.get("token");
    console.log(token);
    if (token) {
      console.log(123);
      console.log(this.$store.state.userInfo.username);
      this.flag = false;
      console.log(this.message);
      let formdata = new FormData();
      formdata.append("blogId", this.$route.params.id);
      formdata.append("username", this.$store.state.userInfo.username)
      formdata.append("content", this.message)
      axios({
        url: "http://localhost:8000/api/blog-content/save",
        method: "post",
        data: formdata,
        headers: { Authorization: token },
      })
        .then((res) => {
          console.log(res);
          // console.log(res.data.data);
          // this.tableData = res.data.data;
          // console.log(this.tableData);
          this.getMessageInfo();
        })
        .catch((error) => {
          console.log(error);
        });
    }else{
      this.$message({
          message: '请登录后留言',
          type: 'warning'
        });
    }
  }
  change(value, render) {
    this.html = render;
    this.$nextTick((_) => {
      addCodeBtn();
    });
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.blogname_title {
  font-size: 20px;
  text-align: center;
}
.messages {
  background-color: white;
}
.messages .bg-purple-dark {
  border: 0;
}
.messages-text .bg-purple-dark {
  border: 0;
}
</style>