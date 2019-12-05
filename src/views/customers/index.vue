<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.customerName')"
        v-model="searchName"
        clearable
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      />
      <el-button
        v-if="this.$store.state.user.currentRoles == 'webAdmin' || this.$store.state.user.currentRoles == 'organizationAdmin'"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.createCustomer') }}</el-button>
      <!-- <el-button
        v-if="customerListData.length>0"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="document"
        @click="handleExport"
      >{{ $t('excel.export') }} Excel</el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="customerListData"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.customerName')" width="350px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.description')" min-width="500px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="295">
        <template slot-scope="scope">
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="primary"-->
          <!--            @click="handleStaffList(scope.row.name, scope.row.id)"-->
          <!--          >{{ $t('table.adminStaff') }}</el-button>-->
          <a @click="handleStaffList(scope.row.name, scope.row.id)">
            <el-tooltip class="item" effect="dark" content="成员" placement="top-end">
              <svg-icon
                icon-class="头像"
                class="icon-svg"/>
            </el-tooltip>
          </a>
          <a @click="jumpRouter('products','?customerID='+scope.row.id)">
            <el-tooltip class="item" effect="dark" content="产品" placement="top-end">
              <svg-icon
                icon-class="产品"
                class="icon-svg"/>
            </el-tooltip>
          </a>
          <a @click="DeleteCustomer(scope.row)">
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <svg-icon
                v-if="this.$store.state.user.currentRoles == 'webAdmin' || this.$store.state.user.currentRoles == 'organizationAdmin'"
                icon-class="delete"
                class="icon-svg"
              />
            </el-tooltip>
          </a>
        </template>
      </el-table-column>
      <!--      <el-table-column :label="$t('table.countProducts')" align="center" width="95">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="primary"-->
      <!--            @click="jumpRouter('products','?customerID='+scope.row.id)"-->
      <!--          >{{ $t('table.adminProduct') }}</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      &lt;!&ndash;删除按钮&ndash;&gt;-->
      <!--      <el-table-column-->
      <!--        v-if="this.$store.state.user.currentRoles == 'webAdmin' || this.$store.state.user.currentRoles == 'organizationAdmin'"-->
      <!--        :label="$t('table.actions')"-->
      <!--        align="center"-->
      <!--        width="90"-->
      <!--        class-name="small-padding fixed-width"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            v-if="scope.row.status != '2'"-->
      <!--            size="mini"-->
      <!--            type="danger"-->
      <!--            icon="el-icon-delete"-->
      <!--            @click="DeleteCustomer(scope.row)"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <!-- 分页 -->
    <!-- TODO -->
    <div class="pagination-container"/>

    <!--编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.customerName')" prop="name">
          <el-input
            v-model="temp.name"
            :disabled="!(this.$store.state.user.role == 0) || dialogStatus !='create' "
            clearable
            autofocus
          />
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.description"
            :disabled="!(this.$store.state.user.role == 0)"
            type="textarea"
          />
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input
            v-model="temp.address"
            :disabled="!(this.$store.state.user.role == 0)"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.contact')" prop="contact">
          <el-input
            v-model="temp.contact"
            :disabled="!(this.$store.state.user.role == 0)"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="dialogStatus !='create' && showCusDetailFlag == false"
          @click="showCusDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showCusDetailFlag == true"
          @click="showCusDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.role == 0"
          type="primary"
          @click="dialogStatus==='create'?CreateCustomer():UpdateCustomer()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showCusDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="id">
              <span>{{ temp.id }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>

    <!--staff框-->
    <el-dialog :title="staffListTitle" :visible.sync="staffFormVisible">
      <div v-if="this.$store.state.user.role == 0" class="filter-container">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreateStaff"
        >{{ $t('table.addStaff') }}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="staffListData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
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
        <el-table-column
          v-if="this.$store.state.user.role == 0"
          :label="$t('table.actions')"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.role == '0'"
              @click="handleSetStaff(tempCustomerName, tempCustomerId,scope.row)"
            >{{ $t('table.isAdmin') }}</el-button>
            <!--//已经是管理员，文字显示取消管理员-->
            <el-button
              v-if="scope.row.role == '1'"
              type="danger"
              @click="handleSetAdmin(tempCustomerName, tempCustomerId,scope.row)"
            >{{ $t('table.notAdmin') }}</el-button>
            <!--//不是管理员，文字显示设置管理员-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="DeleteCustomerStaff(tempCustomerName, tempCustomerId, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-if="staffListData.length > 0"
          :page-sizes="5"
          :total="staffListData.length"
          background
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </el-dialog>

    <!--staff修改框-->
    <el-dialog :title="updateStaffTitle" :visible.sync="updateStaffFormVisible">
      <el-form
        ref="updateStaffForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input
            v-model="temp.email"
            :disabled="!(this.$store.state.user.role == 0) || dialogStatus !='create'"
            clearable
            autofocus
          />
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input
            v-model="temp.password"
            :disabled="!(this.$store.state.user.role == 0)"
            type="password"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" :disabled="!(this.$store.state.user.role == 0)" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.fullname')" prop="fullname">
          <el-input
            v-model="temp.fullname"
            :disabled="!(this.$store.state.user.role == 0)"
            clearable
          />
        </el-form-item>
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="dialogStatus !='create' && showCusDetailFlag == false"
          @click="showCusDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showCusDetailFlag == true"
          @click="showCusDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="updateStaffFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.role == 0"
          type="primary"
          @click="dialogStatus==='create'?CreateStaff(tempCustomerName, tempCustomerId):UpdateStaff(tempCustomerName, tempCustomerId)"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showCusDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="_id">
              <!-- <el-input v-model="temp._id" :disabled="true"/> -->
              <span>{{ temp._id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.creater')" prop="createdBy">
              <!-- <el-input v-model="temp.createdBy" :disabled="true"/> -->
              <span>{{ temp.createdBy }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.createdName')" prop="createdName">
              <!-- <el-input v-model="temp.createdName" :disabled="true"/> -->
              <span>{{ temp.createdName }}</span>
            </el-form-item>
            <el-form-item
              v-if="temp.organizationId"
              :label="$t('table.organizationId')"
              prop="organizationId"
            >
              <!-- <el-input v-model="temp.organizationId" :disabled="true"/> -->
              <span>{{ temp.organizationId }}</span>
            </el-form-item>
            <el-form-item
              v-if="temp.organizationName"
              :label="$t('table.organizationName')"
              prop="organizationName"
            >
              <!-- <el-input v-model="temp.organizationName" :disabled="true"/> -->
              <span>{{ temp.organizationName }}</span>
            </el-form-item>
            <el-form-item v-if="temp.customerId" :label="$t('table.customerId')" prop="customerId">
              <!-- <el-input v-model="temp.customerId" :disabled="true"/> -->
              <span>{{ temp.customerId }}</span>
            </el-form-item>
            <el-form-item
              v-if="temp.customerName"
              :label="$t('table.customerName')"
              prop="customerName"
            >
              <!-- <el-input v-model="temp.customerName" :disabled="true"/> -->
              <span>{{ temp.customerName }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.createdAt')" prop="createdAt">
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
import {
  getCustomerDetail,
  getCustomerList,
  deleteCustomer,
  updateCustomer,
  createCustomer,
  getCustomerStaffList,
  getAllCustomerList,
  createCustomerStaff,
  updateCustomerStaff,
  deleteCustomerStaff
} from '@/api/customer'
import { getUserByEmail } from '@/api/search'
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
      // tempCustomerId: '', // 点某条org的成员时，记录一下，添加成员的时候使用
      // tempCustomerName: '',
      // tempOrgName: '',
      // tempOrgId: '',
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
      customerListData: [],
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {
        // 表单验证，对应prop值
        name: [
          { required: true, message: '请填写客户名称', trigger: 'change' }
        ],
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        fullname: [{ required: true, message: '请填写全名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.GetCustomerList(this.$route.query.productID)
  },
  methods: {
    GetCustomerList(proId, page, size) {
      this.listLoading = true
      getCustomerList(proId).then(response => {
        if (response.status == 200) {
          if (response.data == null) {
            this.customerListData = this.nullList
          } else {
            this.customerListData = response.data
          }
          this.listLoading = false
        } else {
          this.$message.error({
            message: response
          })
          this.listLoading = false
        }
      })
    },
    DeleteCustomer(row) {
      if (row.memberCount > 0) {
        this.$alert('请删除所有成员后再删除客户?', '拒绝删除', {
          cancelButtonText: '关闭',
          type: 'info'
        })
      } else if (row.productCount > 0) {
        this.$alert('请删除所有产品后再删除客户?', '拒绝删除', {
          cancelButtonText: '关闭',
          type: 'info'
        })
      } else if (row.deviceCount > 0) {
        this.$alert('请删除所有设备后再删除客户?', '拒绝删除', {
          cancelButtonText: '关闭',
          type: 'info'
        })
      } else {
        this.$confirm('将删除该客户, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteCustomer(this.$store.state.user.token, row._id).then(
              response => {
                this.listLoading = true
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
                this.listLoading = false
                this.GetCustomerList(this.$route.query.organizationID)
              }
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '未删除'
            })
          })
      }
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
      this.$confirm('将创建该客户, 是否继续?', '创建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              createCustomer(this.$route.query.productID, this.temp).then(
                response => {
                  if (response.status == 201) {
                    this.dialogFormVisible = false
                    this.GetCustomerList(this.$route.query.productID)
                    this.$notify({
                      title: response.data,
                      type: 'success',
                      duration: 2000
                    })
                  } else {
                    this.$notify.error({
                      title: response.data,
                      duration: 2000
                    })
                  }
                }
              )
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未创建'
          })
        })
    },
    GetCustomerDetail(cusId) {
      getCustomerDetail(cusId).then(response => {
        if (response.status == 200) {
          this.temp = response.data
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          })
        }
      }).catch((error) => {
        if (error.response.status == 404) {
          this.$message.error({
            message: '获取客户详情失败'
          })
        }
      })
    },
    handleUpdate(row) {
      // 弹出修改cus弹框
      this.GetCustomerDetail(row.id) // 弹出时拉取详情
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    UpdateCustomer() {
      this.$confirm('将修改该客户, 是否继续?', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              const tempData = Object.assign({}, this.temp)
              updateCustomer(
                this.$store.state.user.token,
                this.temp._id,
                tempData
              ).then(response => {
                if (response.data.status == '200') {
                  // 返回type是success时，关弹窗，改列表
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未修改'
          })
        })
    },
    openStaffDialog(
      customerName,
      customerId,
      organizationId,
      organizationName
    ) {
      // 该函数仅限点成员数字时使用，避免每次删除、更改操作都会把临时的orgId置为空
      // 因为更新、删除操作只传两个参数
      this.tempOrgId = organizationId
      this.tempOrgName = organizationName
      this.handleStaffList(customerName, customerId)
    },
    handleStaffList(
      customerName,
      customerId,
      organizationId,
      organizationName
    ) {
      this.staffListTitle = '您正在管理客户： ' + customerName + '  的成员：'
      this.dialogStatus = 'staff'
      this.staffFormVisible = true
      this.tempCustomerId = customerId // 临时存到这里
      this.tempCustomerName = customerName
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.listLoading = true
      getCustomerStaffList(customerId).then(
        response => {
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
        }
      )
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
    CreateStaff(customerName, customerId) {
      getUserByEmail(this.$store.state.user.token, this.temp.email).then(
        response => {
          if (response.data.msg == 'Success') {
            // 存在该email
            this.$alert('该Email已被注册，请重新输入', '拒绝新建', {
              cancelButtonText: '关闭',
              type: 'info'
            })
          } else {
            this.$refs['updateStaffForm'].validate(valid => {
              if (valid) {
                this.$confirm('将添加该成员, 是否继续?', '添加', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(() => {
                    this.temp.createdBy = this.$store.state.user._id // 创建人
                    this.temp.createdName = this.$store.state.user.fullname // 创建人
                    this.temp.customerId = customerId // 创建的user属于传进来的customerId
                    this.temp.customerName = customerName
                    this.temp.organizationId = this.tempOrgId // 所属组织
                    this.temp.organizationName = this.tempOrgName
                    this.temp.role = 1
                    this.temp.type = 2 // customer staff
                    createCustomerStaff(
                      this.$store.state.user.token,
                      this.temp
                    ).then(response => {
                      if (response.data.status == '200') {
                        this.updateStaffFormVisible = false
                        this.handleStaffList(customerName, customerId) // 刷新该customer的成员列表
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
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '未创建'
                    })
                  })
              }
            })
          }
        }
      )
    },
    UpdateStaff(customerName, customerId) {
      this.$refs['updateStaffForm'].validate(valid => {
        if (valid) {
          this.$confirm('将修改该成员信息, 是否继续?', '修改', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const tempData = Object.assign({}, this.temp)
              updateCustomerStaff(
                this.$store.state.user.token,
                this.temp._id,
                tempData
              ).then(response => {
                if (response.data.status == '200') {
                  // 返回type是success时，关弹窗，改列表
                  this.updateStaffFormVisible = false
                  this.handleStaffList(customerName, customerId) // 刷新该customer的成员列表
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
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '未修改'
              })
            })
        }
      })
    },
    handleSetAdmin(customerName, customerId, row) {
      // 更新成员role为0
      this.$confirm('设置该成员为管理员, 是否继续?', '设为管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.temp = Object.assign({}, row)
          this.temp.role = 0 // 更新成员role为0
          const tempData = this.temp
          updateCustomerStaff(
            this.$store.state.user.token,
            this.temp._id,
            tempData
          ).then(response => {
            if (response.data.status == '200') {
              // 返回type是success时，关弹窗，改列表
              this.handleStaffList(customerName, customerId) // 刷新该customer的成员列表
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未提交'
          })
        })
    },
    handleSetStaff(customerName, customerId, row) {
      // 更新成员role为1
      this.$confirm('取消该成员的管理员权限, 是否继续?', '取消管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.temp = Object.assign({}, row)
          this.temp.role = 1 // 更新成员role为1
          const tempData = this.temp
          updateCustomerStaff(
            this.$store.state.user.token,
            this.temp._id,
            tempData
          ).then(response => {
            if (response.data.status == '200') {
              // 返回type是success时，关弹窗，改列表
              this.handleStaffList(customerName, customerId) // 刷新该customer的成员列表
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未提交'
          })
        })
    },
    DeleteCustomerStaff(customerName, customerId, row) {
      this.$confirm('将删除该成员, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCustomerStaff(this.$store.state.user.token, row._id).then(
            response => {
              this.listLoading = true
              this.$message({
                message: response.data.msg,
                type: 'success'
              })
              this.listLoading = false
              this.handleStaffList(customerName, customerId) // 刷新该customer的成员列表
              this.GetCustomerList(this.$route.query.organizationID)
            }
          )
        })
        .catch(() => {
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
        const list = this.customerListData
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
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    jumpRouter(url, param) {
      this.$router.push({ path: '/' + url + '/index' + param })
    }
  }
}
</script>
<style>
.dialogButton {
  text-align: right;
  padding-bottom: 20px;
}
.icon-svg{
  font-size: 45px;
  padding-left: 20px;
}
</style>
