<template>
  <div class="app-container">
    <div v-if="this.$store.state.user.currentRoles == 'webAdmin'" class="filter-container">
      <el-input
        :placeholder="$t('table.organizationName')"
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
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.createOrganization') }}</el-button>
      <!-- <el-button
        v-if="organizationListData.length>0"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="document"
        @click="handleExport"
      >{{ $t('excel.export') }} Excel</el-button> -->
    </div>
    <!-- 只有webadmin显示org列表，orgadmin和orgstaff显示自己组织的详情，所以table中的按钮无需判断权限 -->
    <el-table
      v-loading="listLoading"
      v-if="this.$store.state.user.currentRoles == 'webAdmin'"
      :key="tableKey"
      :data="organizationListData"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.organizationName')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.description')" width="700px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.staff')" align="center" width="95">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleStaffList(scope.row.name, scope.row.id)"
          >{{ $t('table.adminStaff') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.countProducts')" align="center" width="95">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="jumpRouter('products','?organizationID='+scope.row.id)"
          >{{ $t('table.adminProduct') }}</el-button>
        </template>
      </el-table-column>
      <!--删除按钮-->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="90"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="DeleteOrganization(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页，只有webadmin需要显示这个 -->
    <div
      v-if="organizationListData.length > 0 && this.$store.state.user.currentRoles == 'webAdmin'"
      class="pagination-container"
    >
      <!-- <el-pagination
        @current-change= pageChange
        :page-size= "1"
        :total= organizationListData.length
        background
        layout="total, prev, pager, next, jumper">
      </el-pagination>-->
      <el-button
        v-loading="listLoading"
        v-if="showMoreButtonFlag"
        style="width:100%"
        icon="el-icon-arrow-down"
        @click="showMore"
      >更多</el-button>
      <el-button
        v-if="!showMoreButtonFlag"
        style="width:100%"
        icon="el-icon-arrow-up"
        @click="showLess"
      >收起</el-button>
    </div>
    <!-- organizationAdmin和orgstaff显示本人所属的org详情 -->
    <el-card v-if="this.$store.state.user.currentRoles != 'webAdmin'" class="myOrgCard">
      <div slot="header" class="clearfix">
        <span>组织： {{ orgCard.name }}</span>
        <el-button
          v-if="this.$store.state.user.currentRoles[0] == 'organizationAdmin'"
          style="float: right; margin: 0 10px"
          type="primary"
          size="mini"
          @click="handleStaffList(orgCard.name, orgCard.id)"
        >{{ $t('table.adminStaff') }}</el-button>
        <el-button
          style="float: right;"
          type="primary"
          size="mini"
          @click="jumpRouter('products','?organizationID='+orgCard.id)"
        >{{ $t('table.adminProduct') }}</el-button>
      </div>
      <el-form
        :model="orgCard"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.description')">
          <span>{{ orgCard.description }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <span>{{ orgCard.address }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.contact')" prop="contact">
          <span>{{ orgCard.contact }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <span>{{ orgCard.phone }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.id')" prop="id">
          <span>{{ orgCard.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.createdAt')" prop="createdAt">
          <span>{{ orgCard.createdAt }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <!--org编辑、新建框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.organizationName')" prop="name">
          <el-input v-model="temp.name" :disabled="dialogStatus !='create'" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.description"
            type="textarea"
          />
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
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="dialogStatus !='create' && showOrgDetailFlag == false"
          @click="showOrgDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showOrgDetailFlag == true"
          @click="showOrgDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?CreateOrganization():UpdateOrganization()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <!-- 展开详情部分 -->
      <el-collapse-transition>
        <div v-show="showOrgDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="id">
              <span>{{ temp.id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.createdAt')" prop="createdAt">
              <span>{{ temp.createdAt }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>

    <!--staff列表框-->
    <el-dialog :title="staffListTitle" :visible.sync="staffFormVisible" width="700px">
      <div
        v-if="this.$store.state.user.currentRoles != 'organizationStaff'"
        class="filter-container"
      >
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
            <span>{{ scope.row.fullName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="this.$store.state.user.currentRoles != 'organizationStaff'"
          :label="$t('table.actions')"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.role == '21'"
              @click="handleSetStaff(tempOrgName, tempOrgId,scope.row)"
            >{{ $t('table.isAdmin') }}</el-button>
            <!--//已经是管理员，文字显示取消管理员-->
            <el-button
              v-if="scope.row.role == '22'"
              type="danger"
              @click="handleSetAdmin(tempOrgName, tempOrgId,scope.row)"
            >{{ $t('table.notAdmin') }}</el-button>
            <!--//不是管理员，文字显示设置管理员-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="DeleteOrgStaff(tempOrgName, tempOrgId, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 先暂时不做分页 -->
      <!-- <div class="pagination-container">
        <el-pagination v-if="staffListData.length > 0" :page-sizes="5" :total="staffListData.length" background layout="total, prev, pager, next, jumper" />
      </div>-->
    </el-dialog>

    <!--staff修改、创建框-->
    <el-dialog :title="updateStaffTitle" :visible.sync="updateStaffFormVisible" width="550px">
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
            :disabled="(this.$store.state.user.currentRoles == 'organizationStaff') || dialogStatus !='create'"
            clearable
            autofocus
          />
        </el-form-item>
        <el-form-item v-if="dialogStatus =='create'" :label="$t('table.password')" prop="password">
          <el-input
            v-model="temp.password"
            :disabled="(this.$store.state.user.currentRoles == 'organizationStaff')"
            type="password"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input
            v-model="temp.phone"
            :disabled="(this.$store.state.user.currentRoles == 'organizationStaff') || dialogStatus !='create'"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.fullName')" prop="fullName">
          <el-input
            v-model="temp.fullName"
            :disabled="(this.$store.state.user.currentRoles == 'organizationStaff')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.gender')" prop="gender">
          <el-radio-group
            v-model="temp.gender"
            :disabled="(this.$store.state.user.currentRoles == 'organizationStaff')"
            size="small"
          >
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="dialogStatus !='create' && showOrgDetailFlag == false"
          @click="showOrgDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showOrgDetailFlag == true"
          @click="showOrgDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="updateStaffFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.currentRoles != 'organizationStaff'"
          type="primary"
          @click="dialogStatus==='create'?CreateStaff(tempOrgName, tempOrgId):UpdateStaff(tempOrgName, tempOrgId)"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showOrgDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="id">
              <span>{{ temp.id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.organizationId')" prop="organizationId">
              <span>{{ tempOrgId }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.organizationName')" prop="organizationName">
              <span>{{ tempOrgName }}</span>
            </el-form-item>
            <el-form-item v-if="temp.customerId" :label="$t('table.customerId')" prop="customerId">
              <span>{{ temp.customerId }}</span>
            </el-form-item>
            <el-form-item
              v-if="temp.customerName"
              :label="$t('table.customerName')"
              prop="customerName"
            >
              <span>{{ temp.customerName }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrganizationDetail,
  getOrganizationList,
  deleteOrganization,
  updateOrganization,
  createOrganization,
  getOrgStaffList,
  createOrgStaff,
  updateOrgStaff,
  deleteOrgStaff
} from '@/api/organizations'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  data() {
    return {
      // 整体
      listLoading: true,
      tableKey: 0,
      searchName: '', // 搜索框的内容
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {
        // 表单验证，对应prop值  TODO:email更加详细的验证
        name: [
          { required: true, message: '请填写组织名称', trigger: 'change' }
        ],
        email: [{ required: true, message: '请填写邮箱', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        fullName: [
          { required: true, message: '请填写全名', trigger: 'change' }
        ],
        phone: [{ required: true, message: '请填写电话', trigger: 'change' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },

      // 弹框、数据相关：
      tempOrgId: '', // 点某条org的成员时，记录一下，添加成员的时候使用，并且在弹框中显示name
      tempOrgName: '',
      temp: {
        // org框和staff框都用temp，在此初始化
        email: '',
        type: '',
        role: '',
        phone: '',
        fullName: '',
        createdBy: '',
        organizationId: '',
        customerId: '',
        gender: '',
        nickname: '',
        avatar: '',

        description: '',
        address: '',
        contact: ''
      },
      dialogFormVisible: false, // org编辑框显示
      staffFormVisible: false, // staff列表框显示
      updateStaffFormVisible: false, // staff编辑框显示
      dialogStatus: '', // 弹框标题初始化，标题显示为下面的textmap
      textMap: {
        update: '编辑',
        create: '创建',
        staff: '成员管理'
      },
      staffListTitle: '',
      updateStaffTitle: '',
      staffListData: [], // 初始化 ，防止.length失效
      organizationListData: [],
      orgCard: {
        // 非webadmin时详情卡片信息，防止管理成员时清空temp
        name: '',
        description: '',
        address: '',
        contact: '',
        phone: '',
        createdAt: '',
        id: ''
      },

      // 按钮相关：
      showOrgDetailFlag: false,
      showMoreButtonFlag: true,
      needRefreshOrgListFlag: 0,

      // 分页相关：
      currentPage: 1,
      pageSize: 10 // 单页条数，要和api中的保持一致，否则数据会有重复
    }
  },
  created() {
    if (this.$store.state.user.currentRoles == 'webAdmin') {
      // 如果是webAdmin，加载列表，如果不是，加载详情
      this.GetOrganizationList()
    } else {
      this.GetOrganizationDetail(this.$store.state.user.currentRelatedId)
    }
  },
  methods: {
    resetTemp() {
      // 初始化弹框中的数据，每次弹出弹框时调用
      this.temp = {
        email: '',
        phone: '',
        fullName: '',
        createdBy: '',
        organizationId: '',
        customerId: '',
        gender: '',
        nickname: '',
        avatar: '',

        description: '',
        address: '',
        contact: ''
      }
      this.showOrgDetailFlag = false
    },
    GetOrganizationDetail(orgId) {
      // 获得org内容，在webadmin点击修改时，和非webadmin获取自己详情时调用
      getOrganizationDetail(orgId).then(response => {
        if (response.status == 200) {
          this.temp = response.data
          this.orgCard = response.data
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          })
        }
      }).catch((error) => {
        if (error.response.status == 404) {
          this.$message.error({
            message: '获取组织详情失败'
          })
        }
      })
    },
    GetOrganizationList(page, size, name) {
      // 启动获得orglist，如果非webadmin则不用这个
      this.listLoading = true
      if (this.needRefreshOrgListFlag) {
        this.organizationListData = []
      }
      if (name) {
        getOrganizationList(page, size, name).then(response => {
          if (response.status == 200) {
            if (response.data.length < this.pageSize) {
              // 不够一页了，隐藏更多按钮，让当前页再减回来，因为点更多的时候加了一个
              this.showMoreButtonFlag = false
              this.organizationListData.push(...response.data)
              this.currentPage--
            } else {
              this.organizationListData.push(...response.data)
            }
            this.listLoading = false
          } else {
            this.$message.error({
              message: response
            })
            this.listLoading = false
          }
        })
      } else if (page && size) {
        getOrganizationList(page, size).then(response => {
          if (response.status == 200) {
            if (response.data.length < this.pageSize) {
              // 不够一页了，隐藏更多按钮，让当前页再减回来，因为点更多的时候加了一个
              this.showMoreButtonFlag = false
              this.organizationListData.push(...response.data)
              this.currentPage--
            } else {
              this.organizationListData.push(...response.data)
            }
            this.listLoading = false
          } else {
            this.$message.error({
              message: response
            })
            this.listLoading = false
          }
        })
      } else {
        getOrganizationList().then(response => {
          // 首次加载，按api中的page和size
          if (response.status == '200') {
            if (response.data == null) {
              this.organizationListData = this.nullList
            } else {
              this.organizationListData.push(...response.data)
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
    },
    DeleteOrganization(row) {
      this.$confirm('将删除该组织, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOrganization(row.id)
            .then(response => {
              this.listLoading = true
              if (response.status == 204) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                for (var i = 0; i < this.organizationListData.length; i++) {
                  // 从表格中删除这行
                  if (this.organizationListData[i].id == row.id) {
                    this.organizationListData.splice(i, 1)
                  }
                }
                this.listLoading = false
              } else {
                this.$message.error({
                  message: response
                })
                this.listLoading = false
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message.error({
                message: '删除错误'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未删除'
          })
        })
    },
    handleCreate() {
      // 弹出创建org弹框
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    CreateOrganization() {
      // 新建org
      this.$confirm('将创建该组织, 是否继续?', '创建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              createOrganization(this.temp)
                .then(response => {
                  if (response.status == 201) {
                    this.dialogFormVisible = false
                    this.organizationListData.push(response.data)
                    this.$notify({
                      title: '创建成功',
                      type: 'success',
                      duration: 2000
                    })
                  } else {
                    this.$notify.error({
                      title: response.status,
                      message: response,
                      duration: 2000
                    })
                  }
                })
                .catch(error => {
                  if (error.response.status == 409) {
                    // 已存在该orgname
                    this.$message.error({
                      message: '已存在该组织名称'
                    })
                  }
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
    },
    handleUpdate(row) {
      // 弹出修改org弹框
      this.GetOrganizationDetail(row.id) // 弹出时拉取详情
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    UpdateOrganization() {
      // 修改org
      this.$confirm('将修改该组织, 是否继续?', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              const tempData = Object.assign({}, this.temp)
              updateOrganization(this.temp.id, tempData)
                .then(response => {
                  if (response.status == 201) {
                    // 关弹窗，改列表
                    this.dialogFormVisible = false
                    this.$notify({
                      title: '修改成功',
                      type: 'success',
                      duration: 2000
                    })
                    for (var i = 0; i < this.organizationListData.length; i++) {
                      // 修改后遍历表格，替换为新的数据
                      if (this.organizationListData[i].id == this.temp.id) {
                        this.organizationListData.splice(i, 1, tempData) // put时，如果服务器返回新的数据，就改成response.data，如果不返回，就把提交的数据替换到里面，反正点击的时候会拉取一遍
                      }
                    }
                  } else {
                    this.$notify.error({
                      title: response,
                      duration: 2000
                    })
                  }
                })
                .catch(() => {
                  this.$message.error({
                    message: '修改错误'
                  })
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
    handleStaffList(orgName, orgId) {
      // 弹出成员列表框
      this.staffListTitle = '您正在管理组织： ' + orgName + '  的成员：'
      this.dialogStatus = 'staff'
      this.staffFormVisible = true
      this.tempOrgId = orgId // 临时存到这里
      this.tempOrgName = orgName
      this.$nextTick(() => {
        this.$refs['updateStaffForm'].clearValidate()
      })
      this.listLoading = true
      getOrgStaffList(orgId).then(response => {
        // 拉取成员列表
        if (response.status == '200') {
          if (response.data == null) {
            this.staffListData = this.nullList
          } else {
            this.staffListData = response.data
          }
          this.listLoading = false
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          })
          this.listLoading = false
        }
      })
    },
    handleCreateStaff() {
      // 弹出创建成员框
      this.resetTemp()
      this.dialogStatus = 'create'
      this.updateStaffTitle = '添加成员'
      this.updateStaffFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateStaffForm'].clearValidate()
      })
    },
    handleUpdateStaff(row) {
      // 修改成员框，成员详情在拉取列表时候已经得到了
      this.temp = Object.assign({}, row)
      this.updateStaffTitle = '修改： ' + row.email
      this.dialogStatus = 'update'
      this.updateStaffFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateStaffForm'].clearValidate()
      })
    },
    CreateStaff(orgName, orgId) {
      // 创建orgstaff
      this.$refs['updateStaffForm'].validate(valid => {
        if (valid) {
          this.$confirm('将添加该成员, 是否继续?', '添加', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.temp.organizationId = orgId // 创建的user属于传进来的orgId
              this.temp.role = 22 // organization staff
              createOrgStaff(this.temp)
                .then(response => {
                  if (response.status == 200) {
                    this.updateStaffFormVisible = false
                    this.handleStaffList(orgName, orgId) // 刷新该org的成员列表
                    this.$notify({
                      title: '创建用户成功',
                      type: 'success',
                      duration: 2000
                    })
                  } else {
                    this.$notify.error({
                      title: response,
                      duration: 2000
                    })
                  }
                })
                .catch(() => {
                  this.$message.error({
                    message: '创建用户错误'
                  })
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
    },
    UpdateStaff(orgName, orgId) {
      // 修改成员
      this.$refs['updateStaffForm'].validate(valid => {
        if (valid) {
          this.$confirm('将修改该成员信息, 是否继续?', '修改', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const tempData = Object.assign({}, this.temp)
              updateOrgStaff(this.temp.id, tempData)
                .then(response => {
                  if (response.status == 200) {
                    // 返回type是success时，关弹窗，改列表
                    this.updateStaffFormVisible = false
                    this.handleStaffList(orgName, orgId) // 刷新该org的成员列表
                    this.$notify({
                      title: '修改成功',
                      type: 'success',
                      duration: 2000
                    })
                  } else {
                    this.$notify.error({
                      title: response,
                      duration: 2000
                    })
                  }
                })
                .catch(error => {
                  this.$message.error({
                    message: '修改错误'
                  })
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
    handleSetAdmin(orgName, orgId, row) {
      // 更新成员role为21 organizationAdmin
      this.$confirm('设置该成员为管理员, 是否继续?', '设置管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.temp = Object.assign({}, row)
          this.temp.role = 21 // 更新成员role为21
          const tempData = this.temp
          updateOrgStaff(this.temp.id, tempData)
            .then(response => {
              if (response.status == 200) {
                // 返回type是success时，关弹窗，改列表
                this.updateStaffFormVisible = false
                this.handleStaffList(orgName, orgId) // 刷新该org的成员列表
                this.$notify({
                  title: '设置成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify.error({
                  title: response,
                  duration: 2000
                })
              }
            })
            .catch(error => {
              this.$message.error({
                message: '设置错误'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未修改'
          })
        })
    },
    handleSetStaff(orgName, orgId, row) {
      // 更新成员role为22 organizationStaff
      this.$confirm('取消该成员的管理员权限, 是否继续?', '设置管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.temp = Object.assign({}, row)
          this.temp.role = 22 // 更新成员role为22
          const tempData = this.temp
          updateOrgStaff(this.temp.id, tempData)
            .then(response => {
              if (response.status == 200) {
                // 返回type是success时，关弹窗，改列表
                this.updateStaffFormVisible = false
                this.handleStaffList(orgName, orgId) // 刷新该org的成员列表
                this.$notify({
                  title: '取消成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify.error({
                  title: response,
                  duration: 2000
                })
              }
            })
            .catch(error => {
              this.$message.error({
                message: '设置错误'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未修改'
          })
        })
    },
    DeleteOrgStaff(orgName, orgId, row) {
      // 删除成员
      this.$confirm('将删除该成员, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            organizationId: orgId, // 需要传所属orgid和要删除的role
            role: row.role
          }
          deleteOrgStaff(row.id, data)
            .then(response => {
              this.listLoading = true
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.listLoading = false
              this.handleStaffList(orgName, orgId) // 刷新该org的成员列表
            })
            .catch(error => {
              this.$message.error({
                message: '删除错误'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '未删除'
          })
        })
    },
    handleExport() {
      // 导出excel，其实应该从后端获得
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
      // 为导出使用
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
      // 跳转页面函数
      this.$router.push({ path: '/' + url + '/index' + param })
    },
    // pageChange(page){ //1234分页
    //   alert(page)
    //   this.GetOrganizationList(page, 10)
    // },
    showMore() {
      // 无限滚动分页
      this.currentPage++
      this.GetOrganizationList(this.currentPage, this.pageSize, this.searchName)
      // TODO： 页面保持滚动在最下面
    },
    showLess() {
      // 收起，当滚动到底时，显示收起，这时候收起到只显示第一页，页面大小由pagesize决定
      this.currentPage = 1
      this.showMoreButtonFlag = !this.showMoreButtonFlag
      this.organizationListData.splice(
        this.pageSize,
        this.organizationListData.length - this.pageSize
      )
    },
    handleSearch() {
      // 点击搜索按钮调用
      if (this.searchName) {
        this.needRefreshOrgListFlag = 1
        this.currentPage = 1
        this.showMoreButtonFlag = 1
        this.GetOrganizationList(
          this.currentPage,
          this.pageSize,
          this.searchName
        )
        this.needRefreshOrgListFlag = 0
      }
    }
  }
}
</script>
<style>
.dialogButton {
  text-align: right;
  padding-bottom: 20px;
}
.myOrgCard {
  width: 500px;
  margin: 0 auto;
}
</style>
