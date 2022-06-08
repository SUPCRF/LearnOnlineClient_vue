<template>
  <div>
    <!-- <el-button type="primary" class="addbtn" @click="gotoedit"
      >添加博客</el-button
    > -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <el-tooltip
              class="item"
              effect="dark"
              content="新建博客"
              placement="top-start"
            >
              <div class="icon-size">
                <a :href="'/center/newblog'"
                  ><i class="el-icon-circle-plus"></i
                ></a>
              </div>
            </el-tooltip>
          </el-card>
        </div>
      </el-col>

      <el-col :span="6" v-for="item in blogs" :key="item.id">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>
                <el-link
                  type="success"
                  :underline="false"
                  v-if="item.state === 0"
                  >已通过审核</el-link
                >
                <el-link
                  type="danger"
                  :underline="false"
                  v-if="item.state === 1"
                  >未通过审核</el-link
                >
                <el-link
                  type="warning"
                  :underline="false"
                  v-if="item.state === -1"
                  >待审核</el-link
                >
              </span>
              <el-link
                icon="el-icon-delete"
                :underline="false"
                style="float: right; padding: 3px 0"
                @click="delblog(item.blogId)"
                >删除</el-link
              >
              <el-link
                icon="el-icon-edit"
                :underline="false"
                style="float: right; padding: 3px 0; margin-right: 5px"
                @click="editblog(item.blogId)"
                >编辑</el-link
              >
            </div>
            <div class="text item text_hidden">
              {{ item.blogName }}<br /><br />
              {{ item.title }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Meta({
  title: "个人中心",
})
@Component
export default class Blog extends Vue {
  data() {
    return {
      flag: false,
      blogs: [],
    };
  }
  // gotoedit() {
  //   this.$router.replace("/center/edit");
  // }
  created() {
    this.getBlog();
    console.log(this.blogs);
  }
  getBlog() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    let type = localStorage.getItem("type");
    console.log(type);
    formdata.append("userType", type);
    console.log(this.$store.state.userInfo);
    formdata.append("userid", this.$store.state.userInfo.userid);
    formdata.append("username", this.$store.state.userInfo.username);
    axios({
      url: "http://localhost:8000/api/blog/blogTypeAll",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.blogs = res.data.data;
        console.log(this.blogs);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editblog(index) {
    console.log(index);
    this.$router.push("/center/editblog/"+index);
  }

  delblog(index) {
    this.$confirm("此操作将永久删除该博客, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        console.log(index);
        let token = Cookies.get("token");
        let formdata = new FormData();
        formdata.append("blogId", index);
        axios({
          url: "http://localhost:8000/api/blog/delete",
          method: "post",
          data: formdata,
          headers: { Authorization: token },
        })
          .then((res) => {
            console.log(res);
            console.log(res.data.data);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            location.reload();
          })
          .catch((error) => {
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
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 86px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-card {
  height: 150px;
  cursor: pointer;
}

.blog_name {
  // display: inline-block;
  // display: block;
  // width: 40px;
  overflow: hidden;
  // background-color: aquamarine;
}

.icon-size {
  height: 115px;
  // background-color: aquamarine;
  font-size: 80px;
  color: cadetblue;
  // text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-size:hover {
  // height: 110px;
  font-size: 100px;
}
.text_hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>