<template>


  <div>
    <!--增加按钮和搜索框-->
    <div style="margin: 10px 5px">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其他</el-button>
    </div>
    <div style="margin: 10px 5px">
      <el-input v-model="search" style="width: 30%" placeholder="请输入关键字"/>
      <el-button style="margin-left: 10px" type="primary" @click="list">检索</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 90%">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="家居名"/>
      <el-table-column prop="maker" label="生产商"/>
      <el-table-column prop="price" label="价格"/>
      <el-table-column prop="sales" label="销量"/>
      <el-table-column prop="stock" label="库存"/>

      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)" type="primary">编辑</el-button>
          <el-popconfirm title="你确认删除?" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="家居名" prop="name">
          <el-input v-model="form.name" style="width: 80%"/>{{serverValidErrors.name}}
        </el-form-item>
        <el-form-item label="厂商" prop="maker">
          <el-input v-model="form.maker" style="width: 80%"/>{{serverValidErrors.maker}}
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 80%"/>{{serverValidErrors.price}}
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" style="width: 80%"/>{{serverValidErrors.sales}}
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" style="width: 80%"/>{{serverValidErrors.stock}}
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
           <el-button @click="dialogVisible = false">取消</el-button>
           <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2,5,10]"
          :page-size="pageSize"
          layout="total,sizes,prev, pager, next,jumper"
          :total="total"/>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {

      serverValidErrors:{},

      currentPage: 1,
      pageSize: 5,
      total: 1,
      search: '',
      dialogVisible: false,
      form: {},
      tableData: [],
      rules :{
        name:[{
          required:true,message:"请输入家居名",trigger:"blur"
        }],
        maker:[{
          required:true,message:"请输入生产商",trigger:"blur"
        }],
        price:[
            {required:true,message:"请输入价格",trigger:"blur"},
            {pattern:/^([1-9]\d*|0)(\.\d+)?$/,message:"请输入数字",trigger:"blur"}
        ],
        sales:[
            {required:true,message:"请输入销量",trigger:"blur"},
            {pattern:/^([1-9]\d*|0)$/,message:"请输入整数",trigger:"blur"}
        ],
        stock:[
            {required:true,message:"请输入库存",trigger:"blur"},
            {pattern:/^([1-9]\d*|0)$/,message:"请输入整数",trigger:"blur"}
        ],
    }
    }
  },

  created() {
    this.list();
  },

  methods: {
    add() {
      this.dialogVisible = true;
      this.form = {}
      this.$refs['form'].resetFields()
      this.serverValidErrors = { }
    },

    save() {
      if (this.form.id) {
        request.put("/api/update", this.form).then(res => {

          if (res.code === 200) {
            this.$message({
              message: "更新成功",
              type: "success"
            })
          } else {
            this.$message({
              message: "更新失败",
              type: "error"
            })
          }
          this.dialogVisible = false
          this.list()
        })
      } else {
        this.$refs['form'].validate((valid)=>{
          if(valid){
            request.post("/api/save", this.form).then(res => {
             if(res.code === 200){
               this.dialogVisible = false
               this.list()
             }else if(res.code === 400) {
               this.serverValidErrors.name = res.extend.errorMsg.name
               this.serverValidErrors.maker = res.extend.errorMsg.maker
               this.serverValidErrors.price = res.extend.errorMsg.price
               this.serverValidErrors.sales = res.extend.errorMsg.sales
               this.serverValidErrors.stock = res.extend.errorMsg.stock
             }

            })
          }else {
            this.$message({
              message: "验证失败,不提交",
            })
          }
          return false;
        })

      }
    },

    list() {
      /*request.get("/api/furns").then(res => {
        console.log("res", res)
        this.tableData = res.extend.furnList
      })*/
      request.get("/api/furnByConditionPage", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search:this.search
        }
      }).then(res => {
        console.log("res", res)
        this.tableData = res.extend.pageInfo.list
        this.total = res.extend.pageInfo.total
      })

    },

    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true
    },

    handleDel(id) {
      request.delete("/api/del/" + id).then(res => {

        if (res.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.list()
        } else {
          this.$message({
            message: "删除失败",
            type: "error"
          })
        }
      })
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      this.list();
    },
    handlePageSizeChange(pageSize){
      this.pageSize = pageSize
      this.list();
    }

  }
}

</script>
