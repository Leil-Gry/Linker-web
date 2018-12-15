<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="organizationListData"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.organizationName')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.creater')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countStaff')" align="center" width="95" @click="handleStaff(scope.row)">
        <template slot-scope="scope">
          <span v-if="scope.row.countStaff" class="link-type" @click="handleStaff(scope.row)">{{ scope.row.countStaff }}</span>
          <span v-else class="link-type" @click="handleStaff(scope.row)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countCustomer')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countCustomer" class="link-type" @click="jumpRouter('customers','?organizationID='+scope.row.id)">{{ scope.row.countCustomer }}</span>
          <span v-else class="link-type" @click="jumpRouter('customers','?organizationID='+scope.row.id)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countProducts')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countProducts" class="link-type" @click="jumpRouter('products','?organizationID='+scope.row.id)">{{ scope.row.countProducts }}</span>
          <span v-else class="link-type" @click="jumpRouter('products','?organizationID='+scope.row.id)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countDevices')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countDevices" class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row.id)">{{ scope.row.countDevices }}</span>
          <span v-else class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row.id)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="90" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--删除按钮-->
          <el-button size="mini" type="danger" @click="DeleteOrganization(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-container">
      分页
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div> -->

    <!--编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.organizationName')" prop="name">
          <el-input v-model="temp.name" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input v-model="temp.address" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.contact')" prop="contact">
          <el-input v-model="temp.contact" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.creater')" prop="createdBy" >
          <el-input v-model="temp.createdBy" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?CreateOrganization():UpdateOrganization()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!--staff框-->
    <el-dialog :title = "staffListTitle" :visible.sync="staffFormVisible">
      <div class="filter-container">
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
        <el-table-column :label="$t('table.actions')" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="scope.row.role === '0'" @click="handleSetStaff(scope.row)">{{ $t('table.isAdmin') }}
            </el-button>
            <!--//已经是管理员，文字显示取消管理员-->
            <el-button v-if="scope.row.role === '1'" type="danger" @click="handleSetAdmin(scope.row)">{{ $t('table.notAdmin') }}
            </el-button>
            <!--//不是管理员，文字显示设置管理员-->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--staff修改框-->
    <el-dialog :title= "updateStaffTitle" :visible.sync="updateStaffFormVisible">
      <el-form ref="updateStaffForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input v-model="temp.password" type="password" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.fullname')" prop="fullname">
          <el-input v-model="temp.fullname" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.creater')" prop="createdBy" >
          <el-input v-model="temp.createdBy" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateStaffFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createStaff():updateStaff()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOrganizationList, deleteOrganization, updateOrganization, createOrganization, getOrgStaffList, createStaff, updateStaff } from '@/api/organizations'
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
      temp: {
        _id: '',
        description: '',
        address: '',
        contact: '',
        phone: '',
        createdBy: ''
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
      rules: {// 表单验证，对应prop值
        name: [{ required: true, message: '请填写组织名称', trigger: 'change' }],
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }]
      }
    }
  },
  created() {
    this.GetOrganizationList()
  },
  methods: {
    GetOrganizationList() {
      this.listLoading = true
      // console.log(this.$store.state.user.token)
      getOrganizationList(this.$store.state.user.token).then(response => {
        if (response.data.status === '200') {
          this.organizationListData = response.data.data
          this.listLoading = false
        } else {
          this.$message.error({
            message: response.data.msg
          })
          this.listLoading = false
        }
      })
    },
    DeleteOrganization(row) {
      this.$confirm('将删除该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrganization(this.$store.state.user.token, row._id).then(response => {
          this.listLoading = true
          this.$message({
            message: response.data.msg,
            type: 'success'
          })
          this.listLoading = false
          this.GetOrganizationList()
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
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    CreateOrganization() {
      this.$confirm('将创建该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.createdBy = this.$store.state.user._id// 创建人
            createOrganization(this.$store.state.user.token, this.temp).then((response) => {
              if (response.data.status === '200') {
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
            updateOrganization(this.$store.state.user.token, this.temp._id, tempData).then((response) => {
              if (response.data.status === '200') { // 返回type是success时，关弹窗，改列表
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
          message: '未修改'
        })
      })
    },
    handleStaff(row) {
      this.staffListTitle = '您正在管理组织： ' + row.name + '  的成员：'
      this.dialogStatus = 'staff'
      this.staffFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.listLoading = true
      getOrgStaffList(this.$store.state.user.token, row._id).then((response) => {
        if (response.data.status === '200') {
          this.staffListData = response.data.data
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

    // 以下还未修改
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
    createStaff() {
      this.$refs['updateStaffForm'].validate((valid) => {
        if (valid) {
          createStaff(this.temp).then((response) => {
            if (response.data.type === 'success') {
              this.staffListData.unshift(this.temp)
              this.updateStaffFormVisible = false
              this.$notify({
                title: response.data.title,
                message: response.data.message,
                type: response.data.type,
                duration: 2000
              })
            } else {
              this.$notify({
                title: response.data.title,
                message: response.data.message,
                type: response.data.type,
                duration: 2000
              })
            }
          })
        }
      })
    },
    updateStaff() {
      this.$refs['updateStaffForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateStaff(tempData).then((response) => {
            if (response.data.type === 'success') { // 返回type是success时，关弹窗，改列表
              for (const v of this.staffListData) {
                if (v.id === this.temp.id) {
                  const index = this.staffListData.indexOf(v)
                  this.staffListData.splice(index, 1, this.temp)
                  break
                }
              }
              this.updateStaffFormVisible = false
              this.$notify({
                title: response.data.title,
                message: response.data.message,
                type: response.data.type,
                duration: 2000
              })
            } else {
              this.$notify({
                title: response.data.title,
                message: response.data.message,
                type: response.data.type,
                duration: 2000
              })
            }
          })
        }
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
