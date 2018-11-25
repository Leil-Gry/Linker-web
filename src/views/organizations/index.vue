<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input clearable :placeholder="$t('table.organizationName')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
        <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--<el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">-->
        <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"/>-->
      <!--</el-select>-->
      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
        <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
      <!--</el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>


    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="organizationListData"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <!--<el-table-column :label="$t('table.id')" align="center" width="65">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.id }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.date')" width="150px" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('table.organizationName')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
          <!--<el-tag>{{ scope.row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.creater')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.importance')" width="80px">-->
        <!--<template slot-scope="scope">-->
          <!--<svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('table.countStaff')" align="center" width="95" @click="handleStaff(scope.row)">
        <template slot-scope="scope">
          <span v-if="scope.row.countStaff" class="link-type" @click="handleStaff(scope.row)">{{ scope.row.countStaff }}</span>
          <span v-else @click="handleStaff(scope.row)" class="link-type">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countCustomer')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countCustomer" class="link-type" @click="jumpRouter('customers','?organizationID='+scope.row.id)">{{ scope.row.countCustomer }}</span>
          <span v-else @click="jumpRouter('customers','?organizationID='+scope.row.id)" class="link-type">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countProducts')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countProducts" class="link-type" @click="jumpRouter('products','?organizationID='+scope.row.id)">{{ scope.row.countProducts }}</span>
          <span v-else @click="jumpRouter('products','?organizationID='+scope.row.id)" class="link-type">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countDevices')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.countDevices" class="link-type" @click="jumpRouter('devices','?organizationID='+scope.row.id)">{{ scope.row.countDevices }}</span>
          <span v-else @click="jumpRouter('devices','?organizationID='+scope.row.id)" class="link-type">0</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.readings')" align="center" width="95">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.pageviews" class="link-type" @click="handleFetchPv(scope.row.pageviews)">{{ scope.row.pageviews }}</span>-->
          <!--<span v-else>0</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.status')" class-name="status-col" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>-->
          <!--<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}-->
          <!--</el-button>-->
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

    <!--编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <!--<el-form-item :label="$t('table.type')" prop="type">-->
          <!--<el-select v-model="temp.type" class="filter-item" placeholder="Please select">-->
            <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('table.date')" prop="timestamp">-->
          <!--<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('table.organizationName')" prop="name">
          <el-input v-model="temp.name" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input clearable v-model="temp.address"/>
        </el-form-item>
        <el-form-item :label="$t('table.contact')" prop="contact">
          <el-input clearable v-model="temp.contact"/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input clearable v-model="temp.phone"/>
        </el-form-item>
        <el-form-item :label="$t('table.createAt')" prop="createAt" >
          <el-input v-model="temp.createAt" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.creater')" prop="createdBy" >
          <el-input v-model="temp.createdBy" :disabled="true"/>
        </el-form-item>
        <!--<el-form-item :label="$t('table.status')">-->
          <!--<el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
            <!--<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('table.importance')">-->
          <!--<el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>-->
        <!--</el-form-item>-->
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
        <!--<el-table-column :label="$t('table.id')" align="center" width="65">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{ scope.row.id }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column :label="$t('table.email')" min-width="150px" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdateStaff(scope.row)">{{ scope.row.email }}</span>
            <!--<el-tag>{{ scope.row.type | typeFilter }}</el-tag>-->
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
        <!--<el-form-item :label="$t('table.status')">-->
        <!--<el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
        <!--<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('table.importance')">-->
        <!--<el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateStaffFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createStaff():updateStaff()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!--<el-dialog :visible.sync="dialogPvVisible" title="Organization Staff">-->
      <!--<el-table :data="pvData" border fit highlight-current-row style="width: 100%">-->
        <!--<el-table-column prop="organizationStaffName" label="姓名"/>-->
        <!--<el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button  size="mini" @click=""><svg-icon icon-class="user" />-->
            <!--</el-button>-->
            <!--<el-button  size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}-->
            <!--</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="handleCreate">{{ $t('table.add') }}</el-button>-->
        <!--<el-button type="primary" @click="dialogPvVisible = false">{{ $t('tagsView.close') }}</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->

  </div>
</template>

<script>
  import { fetchList,updateOrganization,createOrganization,getStaffList,createStaff,updateStaff} from '@/api/organizations'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'

  // const calendarTypeOptions = [
  //   { key: 'CN', display_name: 'China' },
  //   { key: 'US', display_name: 'USA' },
  //   { key: 'JP', display_name: 'Japan' },
  //   { key: 'EU', display_name: 'Eurozone' }
  // ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  // const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  //   acc[cur.key] = cur.display_name
  //   return acc
  // }, {})

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
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        // importanceOptions: [1, 2, 3],
        // calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
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

      }
    },
    created() {
      this.getOrganizationList()
    },
    methods: {
      getOrganizationList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.organizationListData = response.data.items
          this.total = response.data.total

          // // Just to simulate the time of the request
          // setTimeout(() => {
            this.listLoading = false
          // }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getOrganizationList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getOrganizationList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getOrganizationList()
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
          status:'draft'
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
            createOrganization(this.temp).then((response) => {
              if(response.data.type=='success')
              {
                this.organizationListData.unshift(this.temp)
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
            updateOrganization(tempData).then((response) => {
              if(response.data.type=='success'){//返回type是success时，关弹窗，改列表
                for (const v of this.organizationListData) {
                  if (v.id === this.temp.id) {
                    const index = this.organizationListData.indexOf(v)
                    this.organizationListData.splice(index, 1, this.temp)
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
      // handleDelete(row) {
      //   this.$notify({
      //     title: '成功',
      //     message: '删除成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   const index = this.list.indexOf(row)
      //   this.list.splice(index, 1)
      // },
      // handleFetchPv(pv) {
      //   fetchPv(pv).then(response => {
      //     this.pvData = response.data.pvData
      //     this.dialogPvVisible = true
      //   })
      // },
      // handleDownload() {
      //   this.downloadLoading = true
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //     const data = this.formatJson(filterVal, this.list)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: 'table-list'
      //     })
      //     this.downloadLoading = false
      //   })
      // },
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
