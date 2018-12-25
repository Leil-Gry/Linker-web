<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 这个页面只能webAdmin进入，以后可能改成所以admin ，所以一些需要判断权限的按钮，都全部显示了-->
      <!-- TODO -->
      <el-input :placeholder="$t('table.email')" v-model="temp.email" clearable style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" >{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="document" @click="handleExport">{{ $t('excel.export') }} Excel</el-button>

    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="allUserListData"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.email')" min-width="150px">
        <template slot-scope="scope" >
          <span class="link-type" @click="handleUpdateUser(scope.row)">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.phone')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.fullname')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.fullname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.organizationName')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.organizationName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.customerName')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-show="scope.row.email.indexOf(selfString)== -1" v-if="scope.row.role == '0'" @click="handleSetStaff(scope.row)">{{ $t('table.isAdmin') }}
          </el-button>
          <!--//已经是管理员，文字显示取消管理员-->
          <el-button v-show="scope.row.email.indexOf(selfString)== -1" v-if="scope.row.role == '1'" type="danger" @click="handleSetAdmin(scope.row)">{{ $t('table.notAdmin') }}
          </el-button>
          <!--//不是管理员，文字显示设置管理员-->
          <!--删除按钮-->
          <el-button v-show="scope.row.email.indexOf(selfString)== -1" type="danger" icon="el-icon-delete" @click="DeleteUser(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- TODO -->
    <div class="pagination-container">
      <el-pagination v-if="allUserListData.length > 0" :page-sizes="5" :total="allUserListData.length" background layout="total, prev, pager, next, jumper" />
    </div>

    <!--staff修改框-->
    <el-dialog :title= "updateStaffTitle" :visible.sync="updateStaffFormVisible">
      <el-form ref="updateStaffForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email" :disabled="true" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input v-model="temp.password" :disabled="!(this.$store.state.user.role == 0)" type="password" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.fullname')" prop="fullname">
          <el-input v-model="temp.fullname" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
      </el-form>
      <div class="dialogButton">
        <el-button v-if="dialogStatus !='create' && showOrgDetailFlag == false" @click="showOrgDetailFlag = true">{{ $t('table.showDetail') }}</el-button>
        <el-button v-if="dialogStatus !='create' && showOrgDetailFlag == true" @click="showOrgDetailFlag = false">{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="updateStaffFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="this.$store.state.user.role == 0" type="primary" @click="UpdateUser(tempOrgName, tempOrgId)">{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showOrgDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="_id" >
              <!-- <el-input v-model="temp._id" :disabled="true"/> -->
              <span>{{ temp._id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.creater')" prop="createdBy" >
              <!-- <el-input v-model="temp.createdBy" :disabled="true"/> -->
              <span>{{ temp.createdBy }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.createdName')" prop="createdName" >
              <!-- <el-input v-model="temp.createdName" :disabled="true"/> -->
              <span>{{ temp.createdName }}</span>
            </el-form-item>
            <el-form-item v-if="temp.organizationId" :label="$t('table.organizationId')" prop="organizationId" >
              <!-- <el-input v-model="temp.organizationId" :disabled="true"/> -->
              <span>{{ temp.organizationId }}</span>
            </el-form-item>
            <el-form-item v-if="temp.organizationName" :label="$t('table.organizationName')" prop="organizationName" >
              <!-- <el-input v-model="temp.organizationName" :disabled="true"/> -->
              <span>{{ temp.organizationName }}</span>
            </el-form-item>
            <el-form-item v-if="temp.customerId" :label="$t('table.customerId')" prop="customerId" >
              <!-- <el-input v-model="temp.customerId" :disabled="true"/> -->
              <span>{{ temp.customerId }}</span>
            </el-form-item>
            <el-form-item v-if="temp.customerName" :label="$t('table.customerName')" prop="customerName" >
              <!-- <el-input v-model="temp.customerName" :disabled="true"/> -->
              <span>{{ temp.customerName }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.createdAt')" prop="createdAt" >
              <!-- <el-input v-model="temp.createdAt" :disabled="true"/> -->
              <span>{{ temp.createdAt }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsersList, deleteUser, updateUser } from '@/api/allUsers'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      tempOrgId: '', // 点某条org的成员时，记录一下，添加成员的时候使用
      tempOrgName: '',
      showOrgDetailFlag: false,
      temp: {
        email: '',
        type: '',
        role: '',
        phone: '',
        fullname: '',
        createdBy: '',
        organizationId: '',
        customerId: ''
      },
      dialogFormVisible: false,
      staffFormVisible: false,
      updateStaffFormVisible: false,
      selfString: '(本人)',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        staff: '成员管理'
      },
      staffListData: [], // 初始化 ，防止.length失效
      organizationListData: [],
      allUserListData: [],
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {// 表单验证，对应prop值
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        fullname: [{ required: true, message: '请填写全名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.GetAllUsersList()
  },
  methods: {
    GetAllUsersList() {
      this.listLoading = true
      // console.log(this.$store.state.user.token)
      getAllUsersList(this.$store.state.user.token).then(response => {
        if (response.data.status == '200') {
          if (response.data.data == null) {
            this.allUserListData = this.nullList
          } else {
            for (let i = 0; i < response.data.data.length; i++) {
              if (response.data.data[i]._id == this.$store.state.user._id) { // 是本人的话添加本人标志
                response.data.data[i].email = this.selfString + response.data.data[i].email
              }
            }
            this.allUserListData = response.data.data
          }
          this.listLoading = false
        } else {
          this.$message.error({
            message: response.data.msg
          })
          this.listLoading = false
        }
      })
    },
    DeleteUser(row) {
      this.$confirm('将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(this.$store.state.user.token, row._id).then(response => {
          this.listLoading = true
          this.$message({
            message: response.data.msg,
            type: 'success'
          })
          this.listLoading = false
          this.GetAllUsersList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未删除'
        })
      })
    },
    resetTemp() {
      this.temp = {
        email: '',
        type: 2, // 不传权限默认是customer staff，因为我不知道怎么初始化为空的int类型，尴尬。如果初始化为字符串的话会400错误
        role: 1,
        phone: '',
        fullname: '',
        createdBy: '',
        organizationId: '',
        customerId: '',

        description: '',
        address: '',
        contact: ''
      }
      this.showOrgDetailFlag = false
    },

    handleUpdateUser(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.updateStaffTitle = '修改： ' + row.email
      if (this.temp.email.indexOf(this.selfString) != -1) {
        this.temp.email = this.temp.email.replace(this.selfString, '')// 如果有本人字符串的话
      }
      this.dialogStatus = 'update'
      this.updateStaffFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateStaffForm'].clearValidate()
      })
    },
    UpdateUser() {
      this.$refs['updateStaffForm'].validate((valid) => {
        if (valid) {
          this.$confirm('将修改该成员信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const tempData = Object.assign({}, this.temp)
            updateUser(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
              if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
                this.updateStaffFormVisible = false
                this.GetAllUsersList()
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '未修改'
            })
          })
        }
      })
    },
    handleSetAdmin(row) { // 更新成员role为0
      this.$confirm('设置该成员为管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp = Object.assign({}, row)
        this.temp.role = 0// 更新成员role为0
        const tempData = this.temp
        updateUser(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
          if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
            this.GetAllUsersList()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未提交'
        })
      })
    },
    handleSetStaff(row) { // 更新成员role为1
      this.$confirm('取消该成员的管理员权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp = Object.assign({}, row)
        this.temp.role = 1// 更新成员role为1
        const tempData = this.temp
        updateUser(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
          if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
            this.GetAllUsersList()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未提交'
        })
      })
    },
    handleExport() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['email', 'createdBy']
        const filterVal = ['email', 'createdBy']
        const list = this.allUserListData
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
