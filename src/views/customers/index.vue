<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- TODO -->
      <el-input :placeholder="$t('table.customerName')" v-model="temp.name" clearable style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" >{{ $t('table.search') }}</el-button>
      <el-button v-if="this.$store.state.user.role == 0" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="document" @click="handleExport">{{ $t('excel.export') }} Excel</el-button>

    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="customerListData"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.customerName')" min-width="150px">
        <template slot-scope="scope" >
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 临时加一列orgId -->
      <!-- <el-table-column :label="$t('table.ID')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column> -->
      <!-- 加完了 -->
      <!-- 创建人暂时隐藏 -->
      <el-table-column :label="$t('table.creater')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.organization')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.organizationId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countStaff')" align="center" width="95" @click="handleStaffList(scope.row.name, scope.row._id)">
        <template slot-scope="scope">
          <span v-if="scope.row.memberCount" class="link-type" @click="handleStaffList(scope.row.name, scope.row._id)">{{ scope.row.memberCount }}</span>
          <span v-else class="link-type" @click="handleStaffList(scope.row.name, scope.row._id)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countProducts')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.productCount" class="link-type" @click="jumpRouter('products','?organizationID='+scope.row._id)">{{ scope.row.productCount }}</span>
          <span v-else class="link-type" @click="jumpRouter('products','?organizationID='+scope.row._id)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countDevices')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceCount" class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row._id)">{{ scope.row.deviceCount }}</span>
          <span v-else class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row._id)">0</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.$store.state.user.role == 0" :label="$t('table.actions')" align="center" width="90" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--删除按钮-->
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="DeleteCustomer(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- TODO -->
    <div class="pagination-container">
      <el-pagination v-if="customerListData.length > 0" :page-sizes="5" :total="customerListData.length" background layout="total, prev, pager, next, jumper" />
    </div>

    <!--编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.customerName')" prop="name">
          <el-input v-model="temp.name" :disabled="!(this.$store.state.user.role == 0)" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" :disabled="!(this.$store.state.user.role == 0)" type="textarea"/>
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input v-model="temp.address" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.contact')" prop="contact">
          <el-input v-model="temp.contact" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" :label="$t('table.organization')">
          <el-select v-model="temp.organization" clearable placeholder="请选择所属组织">
            <el-option
              v-for="item in organizationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
      </el-form>
      <div class="dialogButton">
        <el-button v-if="dialogStatus !='create' && showCusDetailFlag == false" @click="showCusDetailFlag = true">{{ $t('table.showDetail') }}</el-button>
        <el-button v-if="dialogStatus !='create' && showCusDetailFlag == true" @click="showCusDetailFlag = false">{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="this.$store.state.user.role == 0" type="primary" @click="dialogStatus==='create'?CreateCustomer():UpdateOrganization()">{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showCusDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="_id" >
              <el-input v-model="temp._id" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.creater')" prop="createdBy" >
              <el-input v-model="temp.createdBy" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.organization')" prop="organization" >
              <el-input v-model="temp.organizationId" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.memberCount')" prop="memberCount" >
              <el-input v-model="temp.memberCount" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.createdAt')" prop="createdAt" >
              <el-input v-model="temp.createdAt" :disabled="true"/>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>

    <!--staff框-->
    <el-dialog :title = "staffListTitle" :visible.sync="staffFormVisible">
      <div v-if="this.$store.state.user.role == 0" class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreateStaff">{{ $t('table.addStaff') }}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="staffListData"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column :label="$t('table.email')" min-width="150px" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdateStaff(scope.row)">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.fullName')" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="this.$store.state.user.role == 0" :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="scope.row.role == '0'" @click="handleSetStaff(tempOrgName, tempOrgId,scope.row)">{{ $t('table.isAdmin') }}
            </el-button>
            <!--//已经是管理员，文字显示取消管理员-->
            <el-button v-if="scope.row.role == '1'" type="danger" @click="handleSetAdmin(tempOrgName, tempOrgId,scope.row)">{{ $t('table.notAdmin') }}
            </el-button>
            <!--//不是管理员，文字显示设置管理员-->
            <el-button type="danger" icon="el-icon-delete" @click="DeleteOrgStaff(tempOrgName, tempOrgId, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-if="staffListData.length > 0" :page-sizes="5" :total="staffListData.length" background layout="total, prev, pager, next, jumper" />
      </div>
    </el-dialog>

    <!--staff修改框-->
    <el-dialog :title= "updateStaffTitle" :visible.sync="updateStaffFormVisible">
      <el-form ref="updateStaffForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email" :disabled="!(this.$store.state.user.role == 0)" clearable autofocus/>
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
        <el-button v-if="dialogStatus !='create' && showCusDetailFlag == false" @click="showCusDetailFlag = true">{{ $t('table.showDetail') }}</el-button>
        <el-button v-if="dialogStatus !='create' && showCusDetailFlag == true" @click="showCusDetailFlag = false">{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="updateStaffFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="this.$store.state.user.role == 0" type="primary" @click="dialogStatus==='create'?CreateStaff(tempOrgName, tempOrgId):UpdateStaff(tempOrgName, tempOrgId)">{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showCusDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="_id" >
              <el-input v-model="temp._id" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.creater')" prop="createdBy" >
              <el-input v-model="temp.createdBy" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.organizationId')" prop="organizationId" >
              <el-input v-model="temp.organizationId" :disabled="true"/>
            </el-form-item>
            <el-form-item :label="$t('table.createdAt')" prop="createdAt" >
              <el-input v-model="temp.createdAt" :disabled="true"/>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>

  </div>
</template>

<script>
import { getCustomerList, deleteCustomer, updateCustomer, createCustomer, getCustomerStaffList, createCustomerStaff, updateCustomerStaff, deleteCustomerStaff } from '@/api/customer'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  data() {
    return {
      organizationOptions: [],
      tableKey: 0,
      listLoading: true,
      tempId: '', // 点某条org的成员时，记录一下，添加成员的时候使用
      tempCusName: '',
      showCusDetailFlag: false,
      temp: {
        email: '',
        type: '',
        role: '',
        phone: '',
        fullname: '',
        createdBy: '',
        organizationId: '',
        customerId: '',

        description: '',
        address: '',
        contact: ''
      },
      dialogFormVisible: false,
      staffFormVisible: false,
      updateStaffFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        staff: '成员管理'
      },
      staffListData: [], // 初始化 ，防止.length失效
      CustomerListData: [],
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {// 表单验证，对应prop值
        name: [{ required: true, message: '请填写客户名称', trigger: 'change' }],
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        fullname: [{ required: true, message: '请填写全名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.GetCustomerList(this.$route.query.organizationID)
  },
  methods: {
    GetCustomerList(orgId) {
      this.listLoading = true
      // console.log(this.$store.state.user.token)
      getCustomerList(orgId, this.$store.state.user.token).then(response => {
        if (response.data.status == '200') {
          if (response.data.data == null) {
            this.customerListData = this.nullList
          } else {
            this.customerListData = response.data.data
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
    DeleteCustomer(row) {
      this.$confirm('将删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomer(this.$store.state.user.token, row._id).then(response => {
          this.listLoading = true
          this.$message({
            message: response.data.msg,
            type: 'success'
          })
          this.listLoading = false
          this.GetCustomerList(this.$route.query.organizationID)
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
      this.showCusDetailFlag = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    CreateCustomer() {
      this.$confirm('将创建该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.createdBy = this.$store.state.user._id// 创建人
            createCustomer(this.$store.state.user.token, this.temp).then((response) => {
              if (response.data.status == '200') {
                this.dialogFormVisible = false
                this.GetOrganizationList()
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
    UpdateOrganization() {
      this.$confirm('将修改该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateCustomer(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
              if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
                this.dialogFormVisible = false
                this.GetCustomerList(this.$route.query.organizationID)
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
    handleStaffList(orgName, orgId) {
      this.staffListTitle = '您正在管理组织： ' + orgName + '  的成员：'
      this.dialogStatus = 'staff'
      this.staffFormVisible = true
      this.tempOrgId = orgId // 临时存到这里
      this.tempOrgName = orgName
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.listLoading = true
      getCustomerStaffList(this.$store.state.user.token, orgId).then((response) => {
        if (response.data.status == '200') {
          if (response.data.data == null) {
            this.staffListData = this.nullList
          } else {
            this.staffListData = response.data.data
          }
          this.listLoading = false
        } else {
          this.$notify.error({
            title: response.data.msg,
            duration: 2000
          })
          this.listLoading = false
        }
      })
    },
    handleCreateStaff() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.updateStaffTitle = '添加成员'
      this.updateStaffFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateStaffForm'].clearValidate()
      })
    },
    handleUpdateStaff(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.updateStaffTitle = '修改： ' + row.email
      this.dialogStatus = 'update'
      this.updateStaffFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateStaffForm'].clearValidate()
      })
    },
    CreateStaff(orgName, orgId) {
      this.$refs['updateStaffForm'].validate((valid) => {
        if (valid) {
          this.$confirm('将添加该成员, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.temp.createdBy = this.$store.state.user._id// 创建人
            this.temp.organizationId = orgId // 创建的user属于传进来的orgId
            this.temp.role = 1
            this.temp.type = 1// organization staff
            createCustomerStaff(this.$store.state.user.token, this.temp).then((response) => {
              if (response.data.status == '200') {
                this.updateStaffFormVisible = false
                this.handleStaffList(orgName, orgId)// 刷新该org的成员列表
                this.GetCustomerList(this.$route.query.organizationID)
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
              message: '未创建'
            })
          })
        }
      })
    },
    UpdateStaff(orgName, orgId) {
      this.$refs['updateStaffForm'].validate((valid) => {
        if (valid) {
          this.$confirm('将修改该成员信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const tempData = Object.assign({}, this.temp)
            updateCustomerStaff(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
              if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
                this.updateStaffFormVisible = false
                this.handleStaffList(orgName, orgId)// 刷新该org的成员列表
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
    handleSetAdmin(orgName, orgId, row) { // 更新成员role为0
      this.$confirm('设置该成员为管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp = Object.assign({}, row)
        this.temp.role = 0// 更新成员role为0
        const tempData = this.temp
        updateCustomerStaff(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
          if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
            this.handleStaffList(orgName, orgId)// 刷新该org的成员列表
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
    handleSetStaff(orgName, orgId, row) { // 更新成员role为1
      this.$confirm('取消该成员的管理员权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp = Object.assign({}, row)
        this.temp.role = 1// 更新成员role为1
        const tempData = this.temp
        updateCustomerStaff(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
          if (response.data.status == '200') { // 返回type是success时，关弹窗，改列表
            this.handleStaffList(orgName, orgId)// 刷新该org的成员列表
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
    DeleteCustomerStaff(orgName, orgId, row) {
      this.$confirm('将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomerStaff(this.$store.state.user.token, row._id).then(response => {
          this.listLoading = true
          this.$message({
            message: response.data.msg,
            type: 'success'
          })
          this.listLoading = false
          this.handleStaffList(orgName, orgId)// 刷新该org的成员列表
          this.GetOrganizationList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未删除'
        })
      })
    },
    handleExport() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['name', 'createdBy']
        const filterVal = ['name', 'createdBy']
        const list = this.organizationListData
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
