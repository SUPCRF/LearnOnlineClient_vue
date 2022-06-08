<template>
  <div>
    <el-autocomplete
      v-model="searchname"
      :fetch-suggestions="querySearchAsync"
      prefix-icon="el-icon-search"
      :placeholder="placeholder"
      :disabled="disabled"
      clearable
    ></el-autocomplete>
  </div>
</template>
<script>
export default {
  name: "Input",
  mounted: function () {
    // this.loadAll();
  },
  data() {
    return {
      //input远程搜索
      searchname: "",
      restaurants: [],
      timeout: null,
      uploading: false,
      placeholder: "",
      disabled: false
    };
  },
  created() {
    console.log(this.$route.path);
    this.getPath()
  },
  watch: {
    $route: "getPath",
  },
  methods: {
    getPath() {
      console.log(this.$route.path);
      let path = this.$route.path
      if(path === '/business/') {
        this.placeholder = "请进入课程或博客搜索"
        this.disabled = true
      } else if(path === '/business/course') {
        this.placeholder = "请输入课程名称"
        this.disabled = false
      } else if(path === '/business/forum') {
        this.placeholder = "请输入博客名称"
        this.disabled = false
      } else if(path === '/business/about') {
        this.placeholder = "请进入课程或博客搜索"
        this.disabled = true
      } else {
        this.placeholder = "请进入课程或博客搜索"
        this.disabled = true
      }
    },
    //名称输入搜索
    loadAll() {
      this.$axios.get(url + "/Platform/getPlatform").then((res) => {
        if (res.data.code == 200) {
          var data2 = [];
          res.data.data.map((value, index, arry) => {
            data2.push({
              id: value.id,
              value: value.platformName, //重新修改后台返回来的Key名
            });
          });
          this.restaurants = data2;
        } else {
          this.$message.info("暂无数据");
        }
      });
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
  },
};
</script>

<style scoped>
.el-autocomplete {
  width: 300px;
  background-color: transparent;
}
</style>