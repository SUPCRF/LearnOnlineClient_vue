<template>
  <div>
    <el-button type="primary" style="margin-bottom: 20px" @click="add"
      >添加试题</el-button
    >
    <el-dialog title="添加试题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.answer"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addExam">确 定</el-button>
      </div>
    </el-dialog>

    <div>
      <el-table
        :header-cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        style="width: 100%; min-height: calc(100vh - 220px)"
      >
        <el-table-column prop="content" label="题目" min-width="30%">
        </el-table-column>
        <el-table-column prop="answer" label="答案"> </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="small"
              >编辑</el-button
            >
            <el-button @click="delClick(scope.row)" type="danger" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑修改题目" :visible.sync="modifFormVisible">
        <el-form :model="modifForm">
          <el-form-item label="题目" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              v-model="modifForm.content"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="答案" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              v-model="modifForm.answer"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifExam">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Context("id")
@Meta({
  title: "个人中心",
})
@Component()
export default class ExamEdit extends Vue {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      modifFormVisible: false,
      form: {
        content: "",
        answer: "",
      },
      modifForm: {},
      formLabelWidth: "120px",
    };
  }
  mounted() {
    this.getExamInfo();
  }
  getExamInfo() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$route.params.id);
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/exam-content/all",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.tableData = res.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleClick(index) {
    this.modifForm = index;
    this.modifFormVisible = true;
  }
  delClick(index) {
    this.$confirm("此操作将永久删除该题目, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        console.log(index.id);
        let id = index.id;
        let token = Cookies.get("token");
        let formdata = new FormData();
        formdata.append("id", id);
        axios({
          url: "http://localhost:8000/api/exam-content/delExam",
          method: "post",
          data: formdata,
          headers: { Authorization: token },
        })
          .then((res) => {
            console.log(res);
            console.log(res.data.data);
            this.$message({
              message: "删除题目成功",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.getExamInfo();
          })
          .catch((error) => {
            this.$message.error("删除题目失败");
            console.log(error);
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  }
  add() {
    let courseId = this.$route.params.id;
    console.log(courseId);
    this.dialogFormVisible = true;
  }
  addExam() {
    let courseId = this.$route.params.id;
    let content = this.form.content;
    let answer = this.form.answer;
    console.log(courseId);
    console.log(content);
    console.log(answer);
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$route.params.id);
    formdata.append("courseId", courseId);
    formdata.append("content", content);
    formdata.append("answer", answer);
    axios({
      url: "http://localhost:8000/api/exam-content/saveById",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.$message({
          message: "添加题目成功",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.getExamInfo();
      })
      .catch((error) => {
        this.$message.error("添加题目失败");
        console.log(error);
      });
  }
  modifExam() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$route.params.id);
    formdata.append("id", this.modifForm.id);
    formdata.append("courseId", this.modifForm.courseId);
    formdata.append("content", this.modifForm.content);
    formdata.append("answer", this.modifForm.answer);
    axios({
      url: "http://localhost:8000/api/exam-content/modifExam",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.$message({
          message: "修改编辑题目成功",
          type: "success",
        });
        this.modifFormVisible = false;
        this.getExamInfo();
      })
      .catch((error) => {
        this.$message.error("修改编辑题目失败");
        console.log(error);
      });
  }
}
</script>

<style>
</style>