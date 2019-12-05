<template>
  <div>
    <el-col>
      <el-row>
        <span style="margin-left: 3%;font-family: 黑体;font-size: 25px">前端使用</span>
      </el-row>
      <el-row>
        <el-select v-if="inputVisible[0].value" v-model="value" clearable placeholder="请选择产品" class="select" style="margin-top: 2%" @change="cleartags">
          <el-option
            v-for="(item,index) in productListData"
            :key="index"
            :label="item.name"
            :value="item.name"
            @click.native="Trigger(item.id)"/>
        </el-select>
        <router-link :to="{path:'createDiagramUsage',query:{proId:productIdChosen,proName:value}}" >
          <el-button
            v-if="inputVisible[3].value"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            style="margin-left:2%;">
            新建前端使用
          </el-button>
        </router-link>
      </el-row>
      <el-row style="margin-left: 3%;margin-top: 2%">
        <el-radio-group v-model="radio3" @change="showInput">
          <el-radio-button label="产品" @click.native="SetUsageType(1)"/>
          <el-radio-button label="顾客" @click.native="SetUsageType(3)"/>
          <el-radio-button label="Tag" @click.native="SetUsageType(4)"/>
        </el-radio-group>
        <el-select
          v-if="inputVisible[1].value"
          ref="saveTagInput"
          v-model="value2"
          clearable
          placeholder="请选择顾客"
          class="select">
          <el-option
            v-for="(item,index) in customerListData"
            :key="index"
            :label="item.name"
            :value="item.name"
            @click.native="SaveCustomerId(item.id)"/>
        </el-select>
        <el-select
          v-if="inputVisible[2].value"
          ref="saveTagInput"
          v-model="value2"
          clearable
          placeholder="请选择TagKeys"
          class="select">
          <el-option
            v-for="(item,index) in tagkeysListData"
            :key="index"
            :label="item"
            :value="item"
            @click.native="GetAllTagValues(item)"/>
        </el-select>
        <el-select
          v-if="inputVisible[2].value"
          ref="saveTagInput"
          v-model="value1"
          clearable
          placeholder="请选择TagValues"
          class="select">
          <el-option
            v-for="(item,index) in tagvaluekeysListData"
            :key="index"
            :label="item"
            :value="item"/>
        </el-select>
        <el-tag v-if="value!=''" style="margin-left: 3%">
          {{ value }}
        </el-tag>
        <el-tag v-if="value2!=''">
          {{ value2 }}
        </el-tag>
        <el-tag v-if="value1!=''">
          {{ value1 }}
        </el-tag>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          style="margin-left: 2%"
          @click.native="HowToFindDiagramUsages()"
        />
      </el-row>
      <el-row style="background-color: rgba(251,251,252,1);margin-top: 1%" class="row">
        <el-col span="2" align="center" class="col"><span>序号</span></el-col>
        <el-col span="10" align="center" class="col"><span>描述</span></el-col>
        <el-col span="5" align="center" class="col">文件</el-col>
        <el-col span="3" align="center" class="col">组别</el-col>
        <el-col span="3" align="center" class="col">变量</el-col>
      </el-row>
      <div style="margin-top: 10px">
        <el-row v-for="(item,index) in diagramUsageList" :key="index" class="row">
          <el-col span="2" class="col" align="center"><span>{{ index+1 }}</span></el-col>
          <el-col span="10" class="col" align="center"><span>{{ item.description }}</span></el-col>
          <el-col span="5" class="col" align="center"><span>{{ item.file }}</span></el-col>
          <el-col span="4" class="col" align="center"><span>{{ item.groups }}</span></el-col>
          <el-col span="4" class="col" align="center"><span>{{ item.variables }}</span></el-col>
        </el-row>
        <!--    </div>-->
      </div>
    </el-col>
  </div>
</template>

<script>
import {
  getCustomerList
} from '@/api/customer'
import {
  getProductListByOrg,
  getAllTagKeys,
  getAllTagValues
} from '@/api/product'
import {
  findDiagramUsagesByProId,
  findDiagramUsagesBycusId,
  findDiagramUsagesBykeyValue
} from '@/api/diagramusage'
import {
  getOrganizationList
} from '@/api/organizations'
export default {
  name: 'Frontend',
  data() {
    return {
      usageType: '',
      productIdChosen: '',
      customerIdChosen: '',
      diagramIdChosen: '',
      productListData: [],
      customerListData: [],
      tagkeysListData: [],
      tagvaluekeysListData: [],
      diagramUsageList: [],
      options: [],
      customer: [],
      tagValue: [],
      dynamicTags: [],
      buttonVisible: true,
      value: '',
      label: '',
      value1: '',
      value2: '',
      inputVisible: [{
        id: 0,
        value: true
      },
      {
        id: 1,
        value: false
      },
      {
        id: 2,
        value: false
      },
      {
        id: 3,
        value: false
      }
      ],
      inputValue: '',
      radio3: '产品',
      diagramlist: []
    }
  },
  created() {
    this.GetAllProductList()
  },
  methods: {
    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    // },
    // clearTags(){
    //   this.dynamicTags=[];
    //   this.buttonVisible = true;
    // },
    GetFrontend() {

    },
    SaveCustomerId(cusId) {
      this.customerIdChosen = cusId
    },
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
      })
    },
    Trigger(proId) {
      this.productIdChosen = proId
      this.inputVisible[3].value = true
      this.GetCustomerList(proId)
      this.GetAllTagKeys(proId)
    },
    HowToFindDiagramUsages() {
      if (this.usageType == '1') {
        this.FindDiagramUsagesByproId()
      } else if (this.usageType == '3') {
        this.FindDiagramUsagesBycusId()
      } else {
        this.FindDiagramUsagesBykeyValue()
      }
    },
    SetUsageType(type) {
      this.usageType = type
    },
    FindDiagramUsagesByproId() {
      console.log('FindDiagramUsagesByproId')
      this.listLoading = true
      findDiagramUsagesByProId(this.productIdChosen, this.usageType).then(response => {
        console.log(response)
        this.diagramUsageList = response.data
        this.listLoading = false
      })
    },
    FindDiagramUsagesBycusId() {
      this.listLoading = true
      findDiagramUsagesBycusId(this.productIdChosen, this.usageType, this.customerIdChosen).then(response => {
        this.diagramUsageList = response.data
        this.listLoading = false
      })
    },
    FindDiagramUsagesBykeyValue() {
      this.listLoading = true
      findDiagramUsagesBykeyValue(this.productIdChosen, this.usageType, this.value2, this.value1).then(response => {
        console.log(response)
        this.diagramUsageList = response.data
        this.listLoading = false
      })
    },
    GetAllTagValues(tagKey) {
      this.listLoading = true
      getAllTagValues(this.productIdChosen, tagKey).then(response => {
        // console.log(response);
        this.tagvaluekeysListData = response.data
        this.listLoading = false
      })
    },
    GetAllTagKeys(proId) {
      this.listLoading = true
      getAllTagKeys(proId).then(response => {
        // console.log(response);
        this.tagkeysListData = response.data
        this.listLoading = false
      })
    },
    GetCustomerList(proId) {
      this.listLoading = true
      getCustomerList(proId).then(response => {
        this.customerListData = response.data
        this.listLoading = false
      })
    },
    cleartags() {
      this.value1 = ''
      this.value2 = ''
    },
    showInput(e) {
      // console.log(this.dynamicTags.length);
      console.log(e)
      // this.value='';
      this.value1 = ''
      this.value2 = ''
      // this.inputVisible[0].value = false;
      this.inputVisible[1].value = false
      this.inputVisible[2].value = false
      if (e == '产品') {
        this.inputVisible[0].value = true
      } else if (e == '顾客') {
        this.inputVisible[1].value = true
      } else {
        this.inputVisible[2].value = true
      }
    }

    // handleInputConfirm(vId) {
    //   let obj = {};
    // switch (this.dynamicTags.length){
    //   case 0: obj = this.customer.find((item)=> {//这里的userList就是上面遍历的数据源
    //     return item.id === vId;//筛选出匹配数据
    //   });
    //   break;
    //   case 1:obj = this.tagValue.find((item)=> {//这里的userList就是上面遍历的数据源
    //     return item.id === vId;//筛选出匹配数据
    //   });
    //   break;
    //   default: break;
    // }
    // obj = this.customer.find((item)=> {//这里的userList就是上面遍历的数据源
    //   return item.id === vId;//筛选出匹配数据
    // });
    // console.log(obj.title);
    // let inputValue = obj.title;
    // if (inputValue) {
    //   this.dynamicTags.push(inputValue);
    // }
    // this.inputValue = '';
    // this.buttonVisible = false;
    // },
    // handleInputConfirm1(vId) {
    //   console.log(vId);
    //   let obj = {};
    //    obj = this.customer.find((item)=> {//这里的userList就是上面遍历的数据源
    //      return item.id === vId;//筛选出匹配数据
    //     });
    //   let inputValue = obj.title;
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue);
    //   }
    //   this.inputValue = '';
    // },
    // handleInputConfirm2(vId) {
    //   let obj = {};
    //   obj = this.tagValue.find((item)=> {//这里的userList就是上面遍历的数据源
    //     return item.id === vId;//筛选出匹配数据
    //   });
    //   let inputValue = obj.title;
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue);
    //   }
    //   this.inputValue = '';
    // },
    // handleInputConfirm3(vId) {
    //   let obj = {};
    //   obj = this.customer.find((item)=> {//这里的userList就是上面遍历的数据源
    //     return item.id === vId;//筛选出匹配数据
    //   });
    //   let inputValue = obj.title;
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue);
    //   }
    //   this.inputValue = '';
    // }
  }
}
</script>

<style scoped>
.select{
  /* margin-top: 2%; */
  margin-left: 3%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.col{
  margin-top: 20px;
  font-size: 15px;
}
.d_div{
  margin:10px auto;
  width:55%;
  height:55px;
  background-color: rgba(251,251,252,1);
  border-radius:5px 5px 5px 5px;
}
.icon-svg{
  font-size: 30px;
  margin-top: -7%;
  margin-left: 5%;
}
.row{
  height: 55px;
  width:90%;
  margin-left: 4%;
}
</style>
