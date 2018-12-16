<template>
  <div class="app-container">
    <p>组织：{{ this.$route.query.organizationID }}</p>
    <p>客户：{{ this.$route.query.customerID }}</p>
    <p>产品：{{ this.$route.query.productID }}的device</p>
    <div class="filter-container">
      <el-input :placeholder="$t('table.productName')" v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="deviceListData"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.deviceName')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.productName')" min-width="150px">
        <template slot-scope="scope">
          <span >{{ scope.row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.customerName')" min-width="150px">
        <template slot-scope="scope">
          <span >{{ scope.row.customer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="deviceDetail(scope.row.id)">{{ $t('table.detail') }}</el-button>
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

    <!--device编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.deviceName')" prop="name">
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
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.customer')">
          <el-select v-model="temp.customer" clearable placeholder="请选择所属客户">
            <el-option
              v-for="item in customerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.product')">
          <el-select v-model="temp.product" clearable placeholder="请选择所属产品">
            <el-option
              v-for="item in productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>

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
        <el-button @click="deviceDetail(temp.id)">{{ $t('table.detail') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceList, createDevice, updateDevice } from '@/api/device'
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
      // return calendarTypeKeyValue[type]
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
        name: undefined,
        type: undefined,
        id: undefined,
        description: undefined,
        address: undefined,
        contact: undefined,
        phone: undefined,
        createdBy: undefined,
        createAt: undefined,
        status: 'draft',
        organization: undefined,
        customer: undefined,
        tags: []
      },
      showReviewer: false,
      temp: {
        id: undefined,
        description: undefined,
        address: undefined,
        contact: undefined,
        phone: undefined,
        createdBy: undefined,
        createAt: undefined,
        status: 'draft',
        organization: undefined,
        customer: undefined,
        tags: []
      },
      dialogFormVisible: false, // 点框外任意位置，弹框消失
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        staff: '成员管理'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {// 表单验证，对应prop值
        name: [{ required: true, message: '请填写组织名称', trigger: 'change' }],
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }]
      },
      downloadLoading: false,
      organizationOptions: undefined,
      // 标签部分
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getDeviceList()
  },
  methods: {
    getDeviceList(productId) {
      this.listLoading = true
      getDeviceList(this.listQuery).then(response => {
        this.deviceListData = response.data.items
        this.total = response.data.total
        this.organizationOptions = response.data.organizationOptions// 所属组织选项
        this.customerOptions = response.data.customerOptions// 所属客户选项
        this.productOptions = response.data.productOptions// 所属产品选项
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getDeviceList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getDeviceList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getDeviceList()
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
        description: undefined,
        address: undefined,
        contact: undefined,
        phone: undefined,
        createdBy: undefined,
        createAt: undefined,
        status: 'draft',
        organization: undefined,
        customer: undefined,
        tags: []
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
          createDevice(this.temp).then((response) => {
            if (response.data.type == 'success') {
              this.deviceListData.unshift(this.temp)
              this.dialogFormVisible = false
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
          updateDevice(tempData).then((response) => {
            if (response.data.type == 'success') { // 返回type是success时，关弹窗，改列表
              for (const v of this.deviceListData) {
                if (v.id == this.temp.id) {
                  const index = this.deviceListData.indexOf(v)
                  this.deviceListData.splice(index, 1, this.temp)
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

    deviceDetail(id) {
      this.$router.push({ path: '/deviceDetail/index?deviceID=' + id })
    }

  }
}
</script>

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
