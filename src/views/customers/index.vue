<template>
  <div class="app-container">
    <p>组织：{{this.$route.query.organizationID}}的customer</p>
    <div class="filter-container">
      <el-input clearable :placeholder="$t('table.customerName')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="customerListData"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.customerName')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.organizationName')" min-width="150px">
        <template slot-scope="scope">
          <span >{{ scope.row.organization }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countStaff')" align="center" width="95" @click="handleStaff(scope.row)">
        <template slot-scope="scope">
          <span v-if="scope.row.countStaff" class="link-type" @click="handleStaff(scope.row)">{{ scope.row.countStaff }}</span>
          <span v-else @click="handleStaff(scope.row)" class="link-type">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countProducts')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countProducts" class="link-type" @click="jumpRouter('products','?organizationID='+scope.row.organizationId+'&customerID='+scope.row.id)">{{ scope.row.countProducts }}</span>
          <span v-else @click="jumpRouter('products','?organizationID='+scope.row.organizationId+'&customerID='+scope.row.id)" class="link-type">0</span>
          <!--//数字为0时候也能点击-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countDevices')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countDevices" class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row.organizationId+'&customerID='+scope.row.id)">{{ scope.row.countDevices }}</span>
          <span v-else @click="jumpRouter('devices','?organizationID='+scope.row.organizationId+'&customerID='+scope.row.id)" class="link-type">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status =='deleted'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>
          <el-button v-if="scope.row.status =='draft'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!--customer编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.customerName')" prop="name">
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
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.createAt')" prop="createAt" >
          <el-input v-model="temp.createAt" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.creater')" prop="createdBy" >
          <el-input v-model="temp.createdBy" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!--staff框-->
    <el-dialog :title = staffListTitle :visible.sync="staffFormVisible">
      <div>
        <el-button @click="handleCreateStaff">{{ $t('table.addStaff') }}</el-button>
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
            <el-button v-if="scope.row.status =='isAdmin'" @click="handleModifyStatus(scope.row,'notAdmin')">{{ $t('table.isAdmin') }}
            </el-button>
            <!--//已经是管理员，文字显示取消管理员-->
            <el-button v-if="scope.row.status =='notAdmin'" type="danger" @click="handleModifyStatus(scope.row,'isAdmin')">{{ $t('table.notAdmin') }}
            </el-button>
            <!--//不是管理员，文字显示设置管理员-->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--staff修改框-->
    <el-dialog :title= updateStaffTitle :visible.sync="updateStaffFormVisible">
      <el-form ref="updateStaffForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input type="password" clearable v-model="temp.password"/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input clearable v-model="temp.phone"/>
        </el-form-item>
        <el-form-item :label="$t('table.fullname')" prop="fullname">
          <el-input clearable v-model="temp.fullname"/>
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
  import { getCustomerList,getStaffList,createCustomer,updateCustomer,createStaff,updateStaff } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  export default {
    name: 'ComplexTable',
    directives: {
      waves
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name:undefined,
          type: undefined,
        },
        showReviewer: false,
        temp: {
          id: undefined,
          description:undefined,
          address:undefined,
          contact:undefined,
          phone:undefined,
          createdBy:undefined,
          createAt: undefined,
          status: 'draft'
        },
        dialogFormVisible: false,//点框外任意位置，弹框消失
        staffFormVisible:false,
        updateStaffFormVisible:false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建',
          staff:'成员管理'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {//表单验证，对应prop值
          name: [{ required: true, message: '请填写组织名称', trigger: 'change' }],
          email: [{ required: true, message: '请填写邮箱', trigger: 'change' }]
        },
        downloadLoading: false,
        organizationOptions : undefined,
      }
    },
    created() {
      this.getCustomerList(this.$route.query.organizationID)
    },
    methods: {
      getCustomerList(oranizationID) {
        this.listLoading = true
        getCustomerList(this.listQuery).then(response => {
          this.customerListData = response.data.items
          this.total = response.data.total
          this.organizationOptions = response.data.organizationOptions
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getCustomerList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getCustomerList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getCustomerList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          description:undefined,
          address:undefined,
          contact:undefined,
          phone:undefined,
          createdBy:undefined,
          createAt: undefined,
          status:'draft',
          organization:undefined,
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
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) // mock a id
            this.temp.createdBy = 'vue-element-admin'
            this.temp.createAt = '1234566'
            this.temp.status = 'draft'
            createCustomer(this.temp).then((response) => {
              if(response.data.type=='success')
              {
                this.customerListData.unshift(this.temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: response.data.title,
                  message: response.data.message,
                  type: response.data.type,
                  duration: 2000
                })
              }
              else {
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        // this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateCustomer(tempData).then((response) => {
              if(response.data.type=='success'){//返回type是success时，关弹窗，改列表
                for (const v of this.customerListData) {
                  if (v.id === this.temp.id) {
                    const index = this.customerListData.indexOf(v)
                    this.customerListData.splice(index, 1, this.temp)
                    break
                  }
                }
                this.dialogFormVisible = false
                this.$notify({
                  title: response.data.title,
                  message: response.data.message,
                  type: response.data.type,
                  duration: 2000
                })
              }
              else {
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
      handleStaff(row) {
        this.staffListTitle = '您正在管理 '+row.name+' 的成员：'
        this.dialogStatus = 'staff'
        this.staffFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.listLoading = true
        getStaffList(row.id).then((response)=>{
          if(response.data.type == 'success')
          {
            this.staffListData = response.data.items
            this.total = response.data.total
            this.listLoading = false
          }
          else {
            this.$notify({
              title: response.data.title,
              message: response.data.message,
              type: response.data.type,
              duration: 2000
            })
          }
        })
      },
      handleCreateStaff(){
        this.resetTemp()
        this.dialogStatus = 'create'
        this.updateStaffTitle = '添加成员'
        this.updateStaffFormVisible = true
        this.$nextTick(() => {
          this.$refs['updateStaffForm'].clearValidate()
        })
      },
      handleUpdateStaff(row){
        this.temp = Object.assign({}, row) // copy obj
        this.updateStaffTitle = '修改： '+row.email
        this.dialogStatus = 'update'
        this.updateStaffFormVisible = true
        this.$nextTick(() => {
          this.$refs['updateStaffForm'].clearValidate()
        })
      },
      createStaff(){
        this.$refs['updateStaffForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) // mock a id
            this.temp.createdBy = 'vue-element-admin'
            this.temp.createAt = '1234566'
            this.temp.status = 'notAdmin'
            createStaff(this.temp).then((response) => {
              if(response.data.type=='success')
              {
                this.staffListData.unshift(this.temp)
                this.updateStaffFormVisible = false
                this.$notify({
                  title: response.data.title,
                  message: response.data.message,
                  type: response.data.type,
                  duration: 2000
                })
              }
              else {
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
      updateStaff(){
        this.$refs['updateStaffForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateStaff(tempData).then((response) => {
              if(response.data.type=='success'){//返回type是success时，关弹窗，改列表
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
              }
              else {
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
      jumpRouter(url,param){
        this.$router.push({path:'/'+url+'/index'+param})
      }
    }
  }
</script>
