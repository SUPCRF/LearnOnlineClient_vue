<template>
  <div>
    <el-table
      :header-cell-style="{ 'text-align': 'center' }"
      :data="tableData"
      border
      style="width: 100%; min-height: calc(100vh - 220px)"
    >
      <el-table-column
        align="center"
        prop="courseName"
        label="课程"
        min-width="50%"
      >
      </el-table-column>
      <el-table-column align="center" width="150" label="状态">
        <template slot-scope="scope">
          <el-tag
          v-if="scope.row.grades >= 0"
            type="success"
            effect="dark"
          >
            以批阅
          </el-tag>
          <el-tag
          v-if="scope.row.grades == -1"
            type="warning"
            effect="dark"
          >
            未批阅
          </el-tag>
          <el-tag
          v-if="scope.row.grades == -2"
            type="danger"
            effect="dark"
          >
            未考试
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="studentName" label="学生">
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" size="small" v-if="scope.row.grades == -1"
            >批阅</el-button
          >
          <el-button @click="handleClick(scope.row)" disabled size="small" v-if="scope.row.grades != -1"
            >批阅</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="批阅试卷" :visible.sync="modifFormVisible">
      <el-row
        type="flex"
        justify="center"
        :gutter="20"
        style="margin-bottom: 10px"
        v-for="item in examAnswer"
        :key="item.id"
      >
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>题目：{{ item.content }}</span>
              </div>
              <div class="text item">
                <div style="margin-bottom: 10px">考生答案：</div>
                <el-input
                  type="textarea"
                  :disabled="true"
                  :v-model="item.myAnswer"
                  :placeholder="item.myAnswer"
                ></el-input>
              </div>
              <div class="text item">标准答案：{{ item.answer }}</div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">成 绩</el-button>
      </div>
      <el-dialog
        width="30%"
        title="成绩"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-input placeholder="请输入成绩" v-model="gradeses" clearable>
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGrades">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import Cookies from "js-cookie";
import axios from "axios";

@Context("id")
@Meta({
  title: "个人中心",
})
@Component()
export default class GradesList extends Vue {
  data() {
    return {
      tableData: [],
      examAnswer: [],
      modifFormVisible: false,
      innerVisible: false,
      form: {
        content: "",
        answer: "",
      },
      modifForm: {},
      formLabelWidth: "120px",
      gradeses: "",
      studentCourse: {},
    };
  }
  mounted() {
    this.getGradesInfo();
  }
  getGradesInfo() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$route.params.id);
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/student-course/all",
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
  getExamAnswer(courseId, studentId, studentName) {
    let token = Cookies.get("token");
    let formdata = new FormData();
    formdata.append("userId", studentId);
    formdata.append("userName", studentName);
    formdata.append("courseId", courseId);
    axios({
      url: "http://localhost:8000/api/exam-answer/selectAnswer",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.examAnswer = res.data.data;
        console.log(this.examAnswer);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleClick(index) {
    console.log(index);
    this.modifFormVisible = true;
    this.studentCourse = index;
    this.getExamAnswer(index.courseId, index.studentId, index.studentName);
  }
  addGrades() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    formdata.append("userId", this.studentCourse.studentId);
    formdata.append("userName", this.studentCourse.studentName);
    formdata.append("courseId", this.studentCourse.courseId);
    formdata.append("grades", this.gradeses);
    axios({
      url: "http://localhost:8000/api/exam-answer/saveGrades",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.innerVisible = false;
        this.modifFormVisible = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style>
</style>