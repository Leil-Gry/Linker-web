<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- TODO -->
      <el-input :placeholder="$t('table.productName')" v-model="temp.name" clearable style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" >{{ $t('table.search') }}</el-button>
      <el-button v-if="this.$store.state.user.role == 0" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="document" @click="handleExport">{{ $t('excel.export') }} Excel</el-button>

    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="productListData"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.productName')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.customerName')" min-width="150px">
        <template slot-scope="scope">
          <span >{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.organizationName')" min-width="150px">
        <template slot-scope="scope">
          <span >{{ scope.row.organizationName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countDevices')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countDevices" class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row.organizationId+'&customerID='+scope.row.customerId+'&productID='+scope.row._id)">{{ scope.row.countDevices }}</span>
          <span v-else class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row.organizationId+'&customerID='+scope.row.customerId+'&productID='+scope.row._id)">0</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.$store.state.user.role == 0" :label="$t('table.actions')" align="center" width="90" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--删除按钮-->
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="DeleteProduct(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- TODO -->
    <div class="pagination-container">
      <el-pagination v-if="productListData.length > 0" :page-sizes="5" :total="productListData.length" background layout="total, prev, pager, next, jumper" />
    </div>

    <!--product编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.productName')" prop="name">
          <el-input v-model="temp.name" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('table.organization')">
          <el-select v-model="temp.organization" clearable placeholder="请选择所属组织">
            <el-option
              v-for="item in organizationOptions"
              :key="item.value"
              :label="item.organizationName"
              :value="item.organizationId"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.customer')">
          <el-select v-model="temp.customer" clearable placeholder="请选择所属客户">
            <el-option
              v-for="item in customerOptions"
              :key="item.value"
              :label="item.customerName"
              :value="item.customerId"/>
          </el-select>
        </el-form-item>

        <!-- 物模型部分开始 -->
        <el-form-item :label="$t('table.specification')">
          <el-button @click="handleSpecification()">{{ $t('table.editSpecification') }}</el-button>
        </el-form-item>
        <!-- 物模型部分结束 -->

        <!--标签部分开始-->
        <el-form-item :label="$t('table.tags')">
          <el-tag
            v-for="tag in temp.tags"
            :key="tag"
            :type="tag.type"
            :disable-transitions="false"
            closable
            @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"/>
          <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <!--标签部分结束-->

        <el-form-item :label="$t('table.createAt')" prop="createAt" >
          <el-input v-model="temp.createAt" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.creater')" prop="createdBy" >
          <el-input v-model="temp.createdBy" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?CreateProduct():UpdateProduct()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 物模型编辑框开始 -->
    <el-dialog :title="specificationDialogTitle" :visible.sync="specificationDialogVisible">
      <el-table
        :data="temp.specification"
        stripe
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="$t('table.specificationIdentifier')" prop="specificationIdentifier">
                <el-input v-model="props.row.identifier" clearable autofocus/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationName')">
                <el-input v-model="props.row.name" clearable/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationType')">
                <el-input v-model="props.row.dataType.type" clearable/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationMin')">
                <el-input v-model="props.row.dataType.specs.min" clearable/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationMax')">
                <el-input v-model="props.row.dataType.specs.max" clearable/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationUnit')">
                <el-input v-model="props.row.dataType.specs.unit" clearable/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationUnitName')">
                <el-input v-model="props.row.dataType.specs.unitName" clearable/>
              </el-form-item>
              <el-form-item :label="$t('table.specificationDescription')" style="width:100%">
                <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.description" style="width:100%" type="textarea" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.specificationIdentifier')"
          prop="identifier"/>
        <el-table-column
          :label="$t('table.specificationName')"
          prop="name"/>
        <el-table-column
          :label="$t('table.specificationDescription')"
          prop="description"/>
      </el-table>
    </el-dialog>
    <!-- 物模型编辑框结束 -->
  </div>
</template>

<script>
import { getProductListByOrg, getProductListByCus, getAllProductList, deleteProduct, updateProduct, createProduct } from '@/api/product'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  data() {
    return {
      organizationOptions: [
        {
          organizationName: 'name',
          organizationId: '5c1dd642e0b099023a4b4fc0'
        }
      ],
      customerOptions: [
        {
          customerName: 'name',
          customerId: '5c1dd642e0b099023a4b4fc0'
        }
      ],
      tableKey: 0,
      listLoading: true,
      showProDetailFlag: false,
      temp: {
        createdBy: '',
        createdName: '',
        organizationId: '',
        organizationName: '',
        customerId: [],
        customerName: '',

        description: '',
        tags: [],
        specification: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        staff: '成员管理'
      },
      productListData: [],
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {// 表单验证，对应prop值
        name: [{ required: true, message: '请填写客户名称', trigger: 'change' }],
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        fullname: [{ required: true, message: '请填写全名', trigger: 'change' }]
      },
      tags: [],
      specification: [],
      specificationDialogVisible: false
    }
  },
  created() {
    this.GetProductList(this.$route.query.customerID)
  },
  methods: {
    GetProductList(cusId) {
      if (cusId) {
        this.listLoading = true
        getProductListByCus(this.$store.state.user.token, cusId).then(response => { // 如果url中有cusID，则优先根据查询id
          if (response.data.status == '200') {
            if (response.data.data == null) {
              this.productListData = this.nullList
            } else {
              this.productListData = response.data.data
            }
            this.listLoading = false
          } else {
            this.$message.error({
              message: response.data.msg
            })
            this.listLoading = false
          }
        })
      } else {
        if (this.$store.state.user.roles == 'webAdmin') { // url没有id但是是webadmin，查所有
          this.listLoading = true
          getAllProductList(this.$store.state.user.token).then(response => {
            if (response.data.status == '200') {
              if (response.data.data == null) {
                this.productListData = this.nullList
              } else {
                this.productListData = response.data.data
              }
              this.listLoading = false
            } else {
              this.$message.error({
                message: response.data.msg
              })
              this.listLoading = false
            }
          })
        } else if (this.$store.state.user.type == 1) { // 没有id 不是webadmin，是组织管理员或成员，根据组织id查其下的所有产品
          this.listLoading = true
          getProductListByOrg(this.$store.state.user.token, this.$store.state.user.organizationId).then(response => {
            if (response.data.status == '200') {
              if (response.data.data == null) {
                this.productListData = this.nullList
              } else {
                this.productListData = response.data.data
              }
              this.listLoading = false
            } else {
              this.$message.error({
                message: response.data.msg
              })
              this.listLoading = false
            }
          })
        } else { // 自己是客户管理员或者客户成员，查自己的产品
          this.listLoading = true
          getProductListByCus(this.$store.state.user.token, this.$store.state.user.customerId).then(response => {
            if (response.data.status == '200') {
              if (response.data.data == null) {
                this.productListData = this.nullList
              } else {
                this.productListData = response.data.data
              }
              this.listLoading = false
            } else {
              this.$message.error({
                message: response.data.msg
              })
              this.listLoading = false
            }
          })
        }
      }
    },
    DeleteProduct(row) {
      if (row.deviceCount > 0) {
        this.$alert('请删除所有设备后再删除产品?', '拒绝删除', {
          cancelButtonText: '关闭',
          type: 'info'
        })
      } else {
        this.$confirm('将删除该产品, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProduct(this.$store.state.user.token, row._id).then(response => {
            this.listLoading = true
            this.$message({
              message: response.data.msg,
              type: 'success'
            })
            this.listLoading = false
            this.GetProductList(this.$route.query.customerID)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '未删除'
          })
        })
      }
    },
    resetTemp() {
      this.temp = {
        createdBy: '',
        organizationId: '',
        customerId: [],

        description: '',
        tags: []
      }
      this.showProDetailFlag = false
    },
    handleCreate() {
      if (this.$store.state.user.roles != 'customerAdmin') {
        this.$alert('请使用客户管理员帐号新建产品', '拒绝新建', {
          cancelButtonText: '关闭',
          type: 'info'
        })
      } else {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    CreateProduct() {
      this.$confirm('将创建该产品, 是否继续?', '创建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.createdBy = this.$store.state.user._id// 创建人
            this.temp.createdName = this.$store.state.user.fullname// 创建人
            this.temp.customerId[0] = this.$store.state.user.customerId// 所属客户
            this.temp.customerName = this.$store.state.user.customerName// 所属客户
            this.temp.organizationId = this.$store.state.user.organizationId// 所属组织
            this.temp.organizationName = this.$store.state.user.organizationName// 所属组织
            this.temp.tags[0] = 'tagtest'
            createProduct(this.$store.state.user.token, this.temp).then((response) => {
              if (response.data.status == '200') {
                this.dialogFormVisible = false
                this.GetProductList(this.$route.query.customerID)
                this.$notify({
                  title: response.data.msg,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify.error({
                  title: response.data.msg,
                  duration: 2000
                })
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未创建'
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    UpdateProduct() {
      this.$confirm('将修改该产品, 是否继续?', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateProduct(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
              if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
                this.dialogFormVisible = false
                this.GetProductList(this.$route.query.customerID)
                this.$notify({
                  title: response.data.msg,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify.error({
                  title: response.data.msg,
                  duration: 2000
                })
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未修改'
        })
      })
    },
    handleExport() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['name', 'createdBy']
        const filterVal = ['name', 'createdBy']
        const list = this.productListData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'export-Excel',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    jumpRouter(url, param) {
      this.$router.push({ path: '/' + url + '/index' + param })
    },
    //  标签部分JS
    handleClose(tag) {
      this.temp.tags.splice(this.temp.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.temp.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 标签部分JS结束

    // 物模型部分
    handleSpecification() {
      this.specificationDialogTitle = '编辑物模型'
      this.specificationDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
<style>
  .dialogButton{
    text-align: right;
    padding-bottom: 20px;
  }
</style>
<!--标签部分样式-->
<style>
  .el-tag {
    margin-right: 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<!--物模型样式-->
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    margin-top:10px;
  }
  .demo-table-expand textarea {

    width: 100%;
  }

</style>

