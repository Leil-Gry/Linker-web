<template>
  <div>
    <el-col>
      <el-row>
        <span style="margin-left: 3%;font-family: 黑体;font-size: 25px">示意图</span>
      </el-row>
      <el-row>
        <el-col :span="4" style="margin-left: 4%;margin-top: 2%">
          <el-select v-model="value" placeholder="请选择产品">
            <el-option
              v-for="(item,index) in productListData"
              :key="index"
              :label="item.name"
              :value="index"
              @click.native="GetDiagramList(item.id)"/>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top: 2%;margin-left:2%;">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="dialogVisible = true"
          >{{ $t('table.createDiagram') }}</el-button>
        </el-col>
      </el-row>
      <el-row style="background-color: rgba(251,251,252,1);margin-top: 1%" class="row">
        <el-col span="3" align="center" class="col"><span>序号</span></el-col>
        <el-col span="14" align="center" class="col"><span>描述</span></el-col>
        <el-col span="4" align="center" class="col">操作</el-col>
      </el-row>
      <div style="margin-top: 10px">
        <!--    <div v-for="(item,i) in diagramlist" class="d_div">-->
        <el-row
          v-for="(item,index) in diagramListData"
          :key="index"
          class="row">
          <el-col span="3" class="col" align="center"><span>{{ index+1 }}</span></el-col>
          <el-col span="15" class="col" align="center"><span>{{ item.description }}</span></el-col>
          <el-col span="4" class="col" >
            <a>
              <!-- ,diaId:item.id -->
              <router-link :to="{path:'detail',query:{proId:productIdChosen,des:item.description}}" >
                <el-tooltip class="item" effect="dark" content="查看" placement="top-end" >
                  <svg-icon
                    icon-class="look"
                    class="icon-svg"/>
                </el-tooltip>
              </router-link>
            </a>
            <a>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-end" >
                <svg-icon
                  icon-class="delete"
                  class="icon-svg"
                  @click.native="DeleteDiagram(item.id)"/>
              </el-tooltip>
            </a>
          </el-col>
        </el-row>
        <!--    </div>-->
      </div>

    </el-col>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="新建示意图"
      width="40%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.detail')" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetContent('dataForm')">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="CreateDiagram()" >
          {{ $t('table.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProductListByOrg,
  getProductListByCus,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductDetail,
  getMappingList,
  createMapping
} from '@/api/product'
import {
  getOrganizationList
} from '@/api/organizations'
import {
  getDiagramList,
  createDiagram,
  deleteDiagram
} from '@/api/diagram'
import {
  getAliOss
} from '@/api/alioss'
import Client from '../../utils/Client'
import axios from 'axios'
export default {
  name: 'Index',
  data() {
    return {
      temp: {
        filename: '',
        size: '',
        type: '',
        productId: '',

        description: ''
      },
      dialogFormVisible: false,
      value: '',
      dialogImageUrl: '',
      textarea: '',
      dialogStatus: '',
      dialogVisible: false,
      dialogVisible1: false,
      // 整体
      productIdChosen: '',
      listLoading: true,
      tableKey: 0,
      searchOrgName: '', // 搜索框的内容
      searchStatus: '',
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {// 表单验证，对应prop值  TODO:email更加详细的验证
        name: [
          { required: true, message: '请填写示意图详情', trigger: 'change' }
        ]
      },
      organizationListData: [],
      productListData: [],
      diagramListData: [],
      tags: [],
      inputVisible: false,
      inputValue: '',
      specification: [],
      specificationDialogVisible: false,
      specificationDialogTitle: '',
      selectOrgId: '',
      currentSp: {
        identifier: '',
        name: '',
        description: '',
        dataType: {
          type: '',
          specs: {
            min: '',
            max: '',
            unit: '',
            unitName: ''
          }
        }
      },
      currentSpIndex: '',
      mappingListDialogVisible: false,
      updateMappingFormVisible: false,
      mappingListDialogTitle: '',
      mappingListData: [],
      updateMappingTitle: ''
    }
  },
  watch: {
    url(val) {
      if (val) {
        this.url.push(val)
      }
    }
  },
  created() {
    this.GetAllProductList()
  },
  methods: {
    GetAllProductList() {
      getOrganizationList().then(res => {
        this.organizationListData = res.data
        for (let i = 0; i < this.organizationListData.length; i++) {
          getProductListByOrg(this.organizationListData[i].id).then(res => {
            if (res.data[0] != null) {
              this.productListData.push(res.data[0])
            }
          })
        }
        // console.log(this.productListData);
      })
    },
    DeleteDiagram(diaId) {
      deleteDiagram(this.productIdChosen, diaId).then(res => {
        this.GetDiagramList(this.productIdChosen)
      })
    },
    CreateDiagram() { // 新建示意图
      this.listLoading = true
      this.$confirm('此操作将新建示意图, 是否继续?', '提示', {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        createDiagram(this.productIdChosen, this.temp).then(response => {
          this.GetDiagramList(this.productIdChosen)
          this.listLoading = false
          this.dialogVisible = false
        })
      })
    },
    resetContent(dataForm) {
      // console.log(dataForm);
      this.$nextTick(() => {
        this.$refs[dataForm].resetFields()
        this.dialogVisible = false
      })
    },

    // this.$confirm('将创建该示意图, 是否继续?', '创建', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //     this.$refs['dataForm'].validate(valid => {
    //       if (valid) {
    //         createDiagram(tempProId,this.temp)
    //           .then(response => {
    //             if (response.status == 201) {
    //               this.dialogFormVisible = false
    //               this.diagramListData.push(response.data)
    //               this.$notify({
    //                 title: '创建成功',
    //                 type: 'success',
    //                 duration: 2000
    //               })
    //             } else {
    //               this.$notify.error({
    //                 title: response.status,
    //                 message: response,
    //                 duration: 2000
    //               })
    //             }
    //           })
    //           .catch(error => {
    //             if (error.response.status == 409) {
    //               // 已存在该filename
    //               this.$message.error({
    //                 message: '已存在该文件名称'
    //               })
    //             }
    //           })
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '未创建'
    //     })
    //   })
    // },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.dialogVisible = false
          })
          done()
        })
        .catch(_ => {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.dialogVisible = false
          })
        })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    },
    // GetProductList(page, size, status) {
    //   if (this.$route.query.organizationID) { // 如果url中有orgid，则先保存到selectOrgId中，之后查这个就行
    //     // 给新建产品做准备
    //     this.selectOrgId = this.$route.query.organizationID
    //   }
    //   if (this.$route.query.customerID){
    //     this.GetProductByCus(this.$route.query.customerID, page, size, status)
    //   }
    //   if (this.needRefreshProListFlag) {
    //     this.productListData = []
    //   }
    //   if (status) {
    //     this.listLoading = true
    //     getProductListByOrg(this.selectOrgId, page, size, status).then(response => {
    //       if (response.status == 200) {
    //         if (response.data.length < this.pageSize) {
    //           // 不够一页了，隐藏更多按钮，让当前页再减回来，因为点更多的时候加了一个
    //           this.showMoreProButtonFlag = false
    //           this.productListData.push(...response.data)
    //           this.currentProPage--
    //         } else {
    //           this.productListData.push(...response.data)
    //         }
    //         this.listLoading = false
    //       } else {
    //         this.$message.error({
    //           message: response
    //         })
    //         this.listLoading = false
    //       }
    //     })
    //   } else if (page && size) {
    //     this.listLoading = true
    //     getProductListByOrg(this.selectOrgId, page, size).then(response => {
    //       if (response.status == 200) {
    //         if (response.data.length < this.pageSize) {
    //           // 不够一页了，隐藏更多按钮，让当前页再减回来，因为点更多的时候加了一个
    //           this.showMoreProButtonFlag = false
    //           this.productListData.push(...response.data)
    //           this.currentProPage--
    //         } else {
    //           this.productListData.push(...response.data)
    //         }
    //         this.listLoading = false
    //       } else {
    //         this.$message.error({
    //           message: response
    //         })
    //         this.listLoading = false
    //       }
    //     })
    //   } else if (this.selectOrgId) {
    //     this.listLoading = true
    //     getProductListByOrg(this.selectOrgId).then(response => {
    //       if (response.status == 200) {
    //         if (response.data == null) {
    //           this.productListData = this.nullList
    //         } else {
    //           this.productListData.push(...response.data)
    //         }
    //         this.listLoading = false
    //       } else {
    //         this.$message.error({
    //           message: response
    //         })
    //         this.listLoading = false
    //       }
    //     })
    //   } else { // url中没有id，则没有东西在加载的时候保存到selectOrgId
    //     if (this.$store.state.user.currentRoles == 'webAdmin') {// 是webAdmin
    //       this.listLoading = true
    //       this.GetOrganizationList()
    //     } else {
    //       // url没有id并且不是webadmin
    //       this.selectOrgId = this.$store.state.user.currentRelatedId
    //       this.GetProductList() // 查自己所属的列表
    //     }
    //   }
    // },
    GetDiagramList(proId) {
      this.listLoading = true
      this.productIdChosen = proId
      getDiagramList(proId).then(response => {
        this.diagramListData = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .col{
    margin-top: 20px;
    font-size: 15px;
  }
  .d_div{
    margin:6px auto;
    width:80%;
    height:55px;
    border-radius:5px 5px 5px 5px;
  }
  .icon-svg{
    font-size: 30px;
    margin-top: -7%;
    margin-left: 6%;
  }
  .row{
    height: 55px;
    width:90%;
    margin-left: 4%;
  }
</style>
