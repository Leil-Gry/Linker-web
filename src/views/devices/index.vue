<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.createDevice') }}</el-button>
    </div>
    <el-row>
      <el-col
        :span="4"
        v-for="(item, index) in deviceListData"
        :key="item"
      >
        <el-card shadow="hover" class="devCard">
          <el-badge :value="1" class="item">
          <img
            @click="deviceData(item.id)"
            class="devImage"
            src="data:image/png;base64,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"
          >
          </el-badge>
          <el-button
            class="devButton"
            v-if="item.status == 1"
            @click="handleUpdate(item)"
            type="primary"
          >{{ item.name }}</el-button>
          <el-button
            class="devButton"
            v-if="item.status == 3"
            @click="handleUpdate(item)"
            type="danger"
          >{{ item.name }}</el-button>
          <el-button
            class="devButton"
            v-if="item.status == 4"
            @click="handleUpdate(item)"
            type="info"
          >{{ item.name }}</el-button>
        </el-card>
      </el-col>
    </el-row>

    <!--device编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.deviceName')" prop="name">
          <el-input v-model="temp.name" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.description"
            type="textarea"
          />
        </el-form-item>
        <el-form-item :label="$t('table.deviceKey')" prop="deviceKey">
          <el-input v-model="temp.deviceKey" clearable autofocus/>
        </el-form-item>
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.status')" prop="status">
          <el-radio-group
            v-model="temp.status"
            :disabled="this.$store.state.user.currentRoles != 'webAdmin'"
            size="small"
          >
            <el-radio-button label="1">{{$t('table.online')}}</el-radio-button>
            <el-radio-button label="2">{{$t('table.offline')}}</el-radio-button>
            <el-radio-button label="4">{{$t('table.disabled')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.period')" prop="period">
          <el-input v-model="temp.period" clearable/>
        </el-form-item>
        <!-- customer部分 -->
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.customer')">
          <el-button
            v-if="this.$store.state.user.currentRoles == 'webAdmin' && this.temp.customer == null"
            size="small"
            @click="handleCustomerList()"
          >{{ $t('table.customerList') }}</el-button>
          <el-button
            v-if="this.temp.customer != null"
            size="small"
            @click="handleCustomerList()"
          >{{ this.temp.customer.name }}</el-button>
        </el-form-item>
        <!-- customer部分结束 -->
        <!-- mapping部分 -->
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.mapping')">
          <el-button
            v-if="this.$store.state.user.currentRoles == 'webAdmin' && this.temp.mapping == null"
            size="small"
            @click="handleMappingList()"
          >{{ $t('table.mappingList') }}</el-button>
          <el-button
            v-if="this.temp.mapping != null"
            size="small"
            @click="handleMappingList()"
          >{{ this.temp.mapping.name }}</el-button>
        </el-form-item>
        <!-- mapping部分结束 -->
        <!--标签部分开始-->
        <el-form-item :label="$t('table.tags')" v-if="dialogStatus !='create'">
          <div v-show="this.$store.state.user.currentRoles != 'webAdmin'">
            <el-tag
              v-for="tag in temp.tags"
              :key="tag"
              :type="tag.type"
              :disable-transitions="false"
            >{{ tag }}</el-tag>
          </div>
          <div v-show="this.$store.state.user.currentRoles == 'webAdmin'">
            <el-tag
              v-for="tag in temp.tags"
              :key="tag"
              :type="tag.type"
              :disable-transitions="false"
              closable
              @close="handleClose(tag)"
            >{{ tag }}</el-tag>
          </div>
          <el-input
            v-show="this.$store.state.user.currentRoles == 'webAdmin'"
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-show="this.$store.state.user.currentRoles == 'webAdmin'"
            v-else
            class="button-new-tag"
            size="mini"
            @click="showInput"
          >+ {{$t('table.newTag')}}</el-button>
        </el-form-item>
        <!--标签部分结束-->
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="dialogStatus !='create' && showDevDetailFlag == false"
          @click="showDevDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showDevDetailFlag == true"
          @click="showDevDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.currentRoles == 'webAdmin'"
          type="primary"
          @click="dialogStatus==='create'?CreateDevice():UpdateDevice()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showDevDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="id">
              <span>{{ temp.id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.activatedAt')" prop="activatedAt">
              <span>{{ temp.activatedAt }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.deviceSecret')" prop="deviceSecret">
              <span>{{ temp.deviceSecret }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.lastOnlineAt')" prop="lastOnlineAt">
              <span>{{ temp.lastOnlineAt }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>
    <!-- 客户详情弹框 -->
    <el-dialog :title="this.$t('table.customerList')" :visible.sync="customerDetailFormVisible">
      <el-row>
        <el-col :span="6">
            <el-radio
              class="customerRadio"
              v-for="item in this.customerList"
              :key="item"
              v-model="chosedCustomer"
              :label="item.key"
              border
            >{{item.label}}
            </el-radio>
        </el-col>
        <el-col :span="18">
          <el-form
            v-if="this.temp.customer != null"
            ref="dataForm"
            :rules="rules"
            :model="temp.customer"
            label-position="left"
            label-width="90px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item :label="$t('table.customerName')" prop="customerName">
              <span>{{ temp.customer.name }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.description')" prop="description">
              <span>{{ temp.customer.description }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.address')" prop="address">
              <span>{{ temp.customer.address }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.contact')" prop="contact">
              <span>{{ temp.customer.contact }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.phone')" prop="phone">
              <span>{{ temp.customer.phone }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialogButton">
        <el-button type="primary" @click="submitCustomerBind()">{{ $t('table.confirm') }}</el-button>
        <el-button @click="customerDetailFormVisible = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 客户详情弹框结束 -->
    <!-- mapping列表弹框 -->
    <el-dialog :title="this.$t('table.mappingList')" :visible.sync="mappingDetailFormVisible">
      <!-- <el-transfer 
        :titles="[this.$t('table.mappingList'), this.$t('table.chosedMapping')]"
        v-model="chosedMapping" 
        :data="mappingList"
      >
      </el-transfer> 由于穿梭框不支持单选，故改用单选框加列表-->
      <el-row>
        <el-col :span="6">
            <el-radio
              class="mappingRadio"
              v-for="item in this.mappingList"
              :key="item"
              v-model="chosedMapping"
              :label="item.key"
              border
            >{{item.label}}
            </el-radio>
        </el-col>
        <el-col :span="18">
          <el-form
            v-if="this.temp.mapping != null"
            ref="dataForm"
            :rules="rules"
            :model="temp.mapping"
            label-position="left"
            label-width="90px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item :label="$t('table.mappingName')" prop="mappingName">
              <span>{{ temp.mapping.name }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.description')" prop="description">
              <span>{{ temp.mapping.description }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.type')" prop="type">
              <span>{{ temp.mapping.type }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.mapping')" prop="mapping">
              <span>{{ temp.mapping.mapping }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialogButton">
        <el-button type="primary" @click="submitMappingBind()">{{ $t('table.confirm') }}</el-button>
        <el-button @click="mappingDetailFormVisible = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!--mapping列表弹框结束 -->
  </div>
</template>

<script>
import {
  getDeviceList,
  createDevice,
  updateDevice,
  getDeviceDetail
} from "@/api/device";
import { getMappingList } from "@/api/product";
import { getCustomerList } from "@/api/customer";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
export default {
  name: "ComplexTable",
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      // return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tempProId: "",
      tempDevId: "",
      showDevDetailFlag: false,
      customerDetailFormVisible: false,
      mappingDetailFormVisible: false,
      deviceItemButtonType: "",
      deviceListData: [],
      listLoading: true,
      temp: {
        id: "",
        name: "",
        description: undefined,
        status: "",
        deviceKey: "",
        activatedAt: "",
        period: "",
        deviceSecret: "",
        lastOnlineAt: "",
        customer: {
          id: "",
          name: "",
          description: "",
          address: "",
          contact: "",
          phone: ""
        },
        mapping: {
          id: "",
          name: "",
          description: "",
          type: "",
          mapping: ""
        },
        tags: []
      },
      mappingList: [],
      customerList: [],
      chosedMapping: '',
      chosedCustomer: '',
      dialogFormVisible: false, // 点框外任意位置，弹框消失
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
        staff: "成员管理"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // 表单验证，对应prop值
        name: [
          { required: true, message: "请填写组织名称", trigger: "change" }
        ],
        email: [{ required: true, message: "请填写邮箱", trigger: "change" }]
      },
      downloadLoading: false,
      organizationOptions: undefined,
      // 标签部分
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.GetDeviceList(this.$route.query.productID);
    this.tempProId = this.$route.query.productID;
  },
  methods: {
    GetDeviceList(proId) {
      this.listLoading = true;
      getDeviceList(proId).then(response => {
        this.deviceListData = response.data;
        this.listLoading = false;
      });
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        description: undefined,
        status: "",
        deviceKey: "",
        activatedAt: "",
        period: "",
        deviceSecret: "",
        lastOnlineAt: "",
        customer: {
          id: "",
          name: "",
          description: "",
          address: "",
          contact: "",
          phone: ""
        },
        mapping: {
          id: "",
          name: "",
          description: "",
          type: "",
          mapping: ""
        },
        tags: []
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    CreateDevice() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createDevice(this.tempProId, this.temp).then(response => {
            if (response.data.type == "success") {
              // this.deviceListData.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: response.data.title,
                message: response.data.message,
                type: response.data.type,
                duration: 2000
              });
            } else {
              this.$notify({
                title: response.data.title,
                message: response.data.message,
                type: response.data.type,
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(item) {
      this.tempDevId = item.id;
      this.GetDeviceDetail();
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    GetDeviceDetail() {
      getDeviceDetail(this.tempProId, this.tempDevId).then(response => {
        if (response.status == 200) {
          this.temp = response.data;
          if (response.data.tags == null) {
            this.temp.tags = [];
          }
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          });
        }
      });
    },
    UpdateDevice() {
      this.$confirm(this.$t('table.willUpdate'), this.$t('table.update'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
              delete tempData.customer; 
              delete tempData.mapping;
            updateDevice(this.tempProId, this.tempDevId, tempData).then(
              response => {
                if (response.status == 200) {
                  // 返回type是success时，关弹窗，改列表
                  for (const v of this.deviceListData) {
                    if (v.id == this.temp.id) {
                      const index = this.deviceListData.indexOf(v);
                      this.deviceListData.splice(index, 1, this.temp);
                      break;
                    }
                  }
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: this.$t('table.updateSuccess'),
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: response.data.title,
                    message: response.data.message,
                    type: response.data.type,
                    duration: 2000
                  });
                }
              }
            );
          }
        });
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    jumpRouter(url, param) {
      this.$router.push({ path: "/" + url + "/index" + param });
    },

    //  标签部分JS
    handleClose(tag) {
      this.temp.tags.splice(this.temp.tags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.temp.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 标签部分JS结束

    deviceData(devId) {
      this.$router.push({ path: "/deviceDetail/index?deviceID=" + devId });
    },
    handleMappingList() {
      this.mappingDetailFormVisible = true;
      // this.chosedMapping = '';
      this.mappingList = [];
      this.GetDeviceDetail();
      getMappingList(this.tempProId).then(response => {
        if (response.status == 200) {
          for (let i = 0; i < response.data.length; i++) {
            this.mappingList.push({
              key: response.data[i].id,
              label: response.data[i].name
            });
            if (this.temp.mapping != null) {
              if (this.temp.mapping.name == response.data[i].name) {
                this.chosedMapping = response.data[i].id;
              }
            }
          }
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          });
        }
      });
    },
    submitMappingBind() {
      var chosedMappingId;
      if (!this.chosedMapping) {
        chosedMappingId = {
          mapping: "" // 后端有bug，会返回500错误
        };
      } else {
        chosedMappingId = {
          mapping: this.chosedMapping
        };
      }
      updateDevice(this.tempProId, this.tempDevId, chosedMappingId).then(
        response => {
          if (response.status == 200) {
            this.GetDeviceDetail();
          } else {
            this.$notify.error({
              title: response,
              duration: 2000
            });
          }
        }
      );
    },
    handleCustomerList() {
      this.customerDetailFormVisible = true;
      this.customerList = [];
      this.GetDeviceDetail();
      getCustomerList(this.tempProId).then(response => {
        if (response.status == 200) {
          for (let i = 0; i < response.data.length; i++) {
            this.customerList.push({
              key: response.data[i].id,
              label: response.data[i].name
            });
            if (this.temp.customer != null) {
              if (this.temp.customer.name == response.data[i].name) {
                this.chosedCustomer = response.data[i].id;
              }
            }
          }
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          });
        }
      });
    },
    submitCustomerBind() {
      var chosedCustomerId;
      if (!this.chosedCustomer) {
        chosedCustomerId = {
          customer: "" // 后端有bug，会返回500错误
        };
      } else {
        chosedCustomerId = {
          customer: this.chosedCustomer
        };
      }
      updateDevice(this.tempProId, this.tempDevId, chosedCustomerId).then(
        response => {
          if (response.status == 200) {
            this.GetDeviceDetail();
          } else {
            this.$notify.error({
              title: response,
              duration: 2000
            });
          }
        }
      );
    },
  }
};
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
.dialogButton {
  text-align: right;
  padding-bottom: 20px;
  margin-top: 15px;
}
.devCard {
  text-align: center;
  margin: 10px!important;

}
.devImage {
  width: 70%;
  -webkit-animation: Rotate 3s linear infinite;
}
@-webkit-keyframes Rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.mappingRadio{
  margin: 5px!important;
}
.customerRadio{
  margin: 5px!important;
}
</style>
