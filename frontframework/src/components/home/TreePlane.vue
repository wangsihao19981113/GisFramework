<template>
  <div class="TreePlane">
    <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
    >
    </el-input>

    <el-tree
        class="filter-tree"
        :data="layertree"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
    </el-tree>

  </div>
</template>

<script>
export default {
  name:"TreePlane",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  },
  created() {
    var self = this;
    this.$axios.get('http://localhost:8081/layerplane/querytotree', {})
        .then(function (response) {
          if(response.data) {
            self.layertree = response.data;
          }
          else{
            self.layertree = [];
          }
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  data() {
    return {
      filterText: '',
      layertree:null,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  }
};
</script>

<style scoped>
.TreePlane{

}
/deep/.el-input__inner{
  border-radius: 0px;
}

/deep/.el-tree-node__label{
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>