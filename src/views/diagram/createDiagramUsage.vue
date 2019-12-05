<template>
  <div>
    <el-col>
      <el-row>
        <span style="margin-left: 3%;font-family: 黑体;font-size: 25px">新建前端使用</span>
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
          v-model="value1"
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
          v-model="value3"
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
        <el-tag v-if="value1!=''">
          {{ value1 }}
        </el-tag>
        <el-tag v-if="value2!=''">
          {{ value2 }}
        </el-tag>
        <el-tag v-if="value3!=''">
          {{ value3 }}
        </el-tag>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          style="margin-left: 2%"
          @click.native="CreateDiagram()"
        >创建</el-button>
      </el-row>
      <el-row style="background-color: rgba(251,251,252,1);margin-top: 1%" class="row">
        <el-col span="4" align="center" class="col">序号</el-col>
        <el-col span="3" align="center" class="col"><span>示意图号</span></el-col>
        <el-col span="14" align="center" class="col"><span>描述</span></el-col>
      </el-row>
      <div style="margin-top: 10px">
        <el-row v-for="(item,index) in diagramListData" :key="index" class="row">
          <el-col span="4" class="col" align="center"><el-radio v-model="diagramIdChosen" :label="item.id" >{{ index+1 }}</el-radio></el-col>
          <el-col span="3" class="col" align="center"><span>{{ item.id }}</span></el-col>
          <el-col span="14" class="col" align="center"><span>{{ item.description }}</span></el-col>
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
  findDiagramUsagesBykeyValue,
  createDiagramUsages
} from '@/api/diagramusage'
import {
  getOrganizationList
} from '@/api/organizations'
import {
  getDiagramList
} from '@/api/diagram'
export default {
  name: 'CreateDiagramUsage',
  data() {
    return {
      createUsageData: {
        diagramId: '',
        type: '',
        customer: '',
        tagvalue: ''
      },
      usageType: '1',
      productIdChosen: '',
      customerIdChosen: '',
      diagramIdChosen: '',
      productListData: [],
      customerListData: [],
      tagkeysListData: [],
      tagvaluekeysListData: [],
      diagramListData: [],
      options: [],
      customer: [],
      tagValue: [],
      dynamicTags: [],
      buttonVisible: true,
      value: '',
      label: '',
      value1: '',
      value2: '',
      value3: '',
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
    this.productIdChosen = this.$route.query.proId
    this.value = this.$route.query.proName
    this.GetDiagramList()
    this.GetCustomerList()
    this.GetAllTagKeys()
  },
  methods: {
    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    // },
    // clearTags(){
    //   this.dynamicTags=[];
    //   this.buttonVisible = true;
    // },
    CreateDiagram() {
      // console.log(this.diagramIdChosen);
      // console.log(this.productIdChosen);
      // console.log(this.value2);
      // console.log(this.value1);
      this.createUsageData.diagramId = this.diagramIdChosen
      this.createUsageData.type = this.usageType
      if (this.customerIdChosen != null) {
        this.createUsageData.customer = this.customerIdChosen
      }
      let tagkey = this.value2
      let tagvalue = this.value3
      if (tagvalue == null && tagkey == null) {
        this.createUsageData.tagvalue = null
      } else if (tagvalue != null && tagkey != null) {
        this.createUsageData.tagvalue = tagkey + tagvalue
      } else if (tagkey != null) {
        this.createUsageData.tagvalue = tagkey
      }
      // console.log(this.createUsageData);
      createDiagramUsages(this.productIdChosen,
        this.createUsageData.diagramId,
        this.createUsageData.type,
        this.createUsageData.customer,
        this.createUsageData.tagvalue).then(response => {
        this.createUsageData.diagramId = ''
        this.createUsageData.type = ''
        this.createUsageData.customer = ''
        this.createUsageData.tagvalue = ''
        this.$router.push({ path: 'frontend' })
      })
      // console.log(this.createUsageData);
    },
    SaveCustomerId(cusId) {
      this.customerIdChosen = cusId
    },
    resetData() { // 更新时调用
      Object.assign(this.$data, this.$options.data.call(this))
    },
    GetDiagramList() {
      this.listLoading = true
      getDiagramList(this.productIdChosen).then(response => {
        // console.log(response);
        this.diagramListData = response.data
        this.listLoading = false
      })
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
      if (type == 1) {
        this.value1 == ''
        this.value2 == ''
        this.value3 == ''
      } else if (type == 3) {
        this.value2 == ''
        this.value3 == ''
      } else {
        this.value2 == ''
      }
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
        this.tagvaluekeysListData = response.data
        this.listLoading = false
      })
    },
    GetAllTagKeys() {
      this.listLoading = true
      getAllTagKeys(this.productIdChosen).then(response => {
        this.tagkeysListData = response.data
        this.listLoading = false
      })
    },
    GetCustomerList() {
      this.listLoading = true
      getCustomerList(this.productIdChosen).then(response => {
        this.customerListData = response.data
        this.listLoading = false
      })
    },
    cleartags() {
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
    },
    showInput(e) {
      // console.log(this.dynamicTags.length);
      console.log(e)
      // this.value='';
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
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
