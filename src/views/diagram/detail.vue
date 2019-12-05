<template>
  <div>
    <p style="margin-left: 3%;font-family: 黑体;font-size: 25px">示意图详情</p>
    <p style="margin-left: 4%;font-size: 15px">{{ temp.description }}</p>
    <el-col :span="2" style="margin-top: 2%;margin-left:4%;">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="dialogVisible = true"
      >上传文件</el-button>
    </el-col>
    <el-row>
      <el-col :span="15" align="center">
        <div class="div">
          <img src="../../assets/草稿1.jpg" class="img">
        </div>
      </el-col>
      <el-col :span="2" align="center">
        <div class="div1">
          <div v-draggable="draggableValue" id="draw">
            <div :ref="handleId">
              <p v-show="visualable">液位level</p>
              <img v-if="visualableimg" src="../../assets/fan.png" alt="move">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="上传文件"
      width="50%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.upload')">
          <div>
            <el-upload
              ref="upload"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleFailure"
              :http-request="handleHttpRequest"
              :auto-upload="false"
              :headers="uploadHeaders"
              :limit="files"
              :disabled="disabled"
              class="upload-demo"
              :file-list="fileList"
              drag
              multiple
              action="string">
              <i class="el-icon-upload"/>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">上传文件大小不能超过 1G</div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitUpload()">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createFile
} from '@/api/file'
import {
  getAliOss
} from '@/api/alioss'
import Client from '../../utils/Client'
import axios from 'axios'
import { Draggable } from 'draggable-vue-directive'

export default {
  name: 'Detail',
  directives: {
    Draggable
  },
  data: function() {
    return {
      percentx: 0,
      percenty: 0,
      visualable: true,
      visualableimg: false,
      handleId: 'handle-id',
      draggableValue: {
        onPositionChange: this.onPosChanged,
        onDragEnd: this.onDragEnd,
        boundingElement: null,
        stopDragging: false,
        initialPosition: true,
        onDragStart: this.onDragStart
      },
      fd: '',
      temp: {
        filename: '',
        size: '',
        type: '',
        productId: '5c2204e8936e156aa9840afd',
        description: ''
      },
      rules: {// 表单验证
        filename: [
          { required: true, message: '请填写文件名', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogFormVisible: false,
      // ali-oss
      region: 'oss-cn-hangzhou',
      bucket: 'qliot', // 这里选择OSS容器
      percentage: 0,
      url: '', // 后台获取token地址
      ClientObj: null,
      dataObj: {},
      expiration: '',
      fileList: [],
      files: 10,
      uploadHeaders: {
        authorization: '*'
      },
      disabled: false,
      dialogImageUrl: '',
      textarea: '',
      dialogStatus: '',
      dialogVisible: false,
      dialogVisible1: false
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
    // this.getAliToken();
    this.temp.productId = this.$route.query.proId
    this.temp.description = this.$route.query.des
  },
  mounted() {
    let _this = this// 赋值vue的this
    window.onresize = () => {
      // 调用methods中的事件
      _this.pab()
    }
  },
  methods: {
    onPosChanged: function(positionDiff, absolutePosition, event) {
      let img = document.getElementsByTagName('img')[0]
      this.draggableValue.boundingElement = img
      // let imgps = img.getBoundingClientRect();
    },
    onDragStart: function() {
      this.visualableimg = true
      this.visualable = false
    },
    onDragEnd: function(positionDiff, absolutePosition, event) {
      let img = document.getElementsByTagName('img')[0]
      let imgps = img.getBoundingClientRect()

      this.percentx = (absolutePosition.left - imgps.x) / img.width
      this.percenty = (absolutePosition.top - imgps.y) / img.height
      console.log('left corner', this.percentx)
      console.log('top corner', this.percenty)
      // positionDiff.left = imgps.x;
      // positionDiff.top = imgps.y;
      // this.draggableValue.initialPosition.left = absolutePosition.left-imgps.x;
      // this.draggableValue.initialPosition.top = absolutePosition.top-imgps.y;
      console.log('left img', img.offsetLeft)
      console.log('top img', img.offsetTop)
    },
    pab: function() {
      let img = document.getElementsByTagName('img')[0]
      let imgps = img.getBoundingClientRect()
      let div = document.getElementById('draw')
      let updatex = (this.percentx * img.width) + imgps.x
      let updatey = this.percenty * img.height + imgps.y
      div.style.left = updatex + 'px'
      div.style.top = updatey + 'px'
      console.log(updatex, updatey)
    },
    submitUpload() {
      // console.log("submitUpload()");
      this.$confirm('此操作将上传该文件, 是否继续?', '提示', {
        confirmButtonText: '上传',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.upload.submit()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        })
      })
    },
    CreateFile() { // 新建文件
      this.listLoading = true
      // this.temp.productId = this.$route.query.proId;
      createFile(this.temp.filename, this.temp.size, this.temp.type, this.temp.productId).then(response => {
        this.listLoading = false
        // this.$message("已成功获取文件序号");
        this.fd = response.data.fd
      })
    },
    handleClose(done) {
      s
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // ali-oss
    getDate() {
      const date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
      return `${year}${month}${day}${hh}${mm}`
    },
    getAliToken() { // 获取Token
      return new Promise((resolve, reject) => {
        getAliOss(this.temp.productId).then(res => {
          if (res.status == 200) {
            let tempAk, tempSk, expiration, token
            tempAk = res.data.credentials.AccessKeyId
            tempSk = res.data.credentials.AccessKeySecret
            expiration = res.data.credentials.Expiration
            token = res.data.credentials.SecurityToken
            this.dataObj = {
              region: 'oss-cn-hangzhou',
              bucket: 'qliot',
              accessKeyId: tempAk,
              accessKeySecret: tempSk,
              endpoint: 'oss-cn-hangzhou.aliyuncs.com',
              stsToken: token
            }
            // console.log(this.dataObj);
            resolve(true)
          } else {
            reject(false)
          }
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    beforeUpload(file) {
      this.temp.filename = file.name
      this.temp.size = file.size
      this.temp.type = file.type
      return new Promise((resolve, reject) => {
        this.getAliToken().then(response => {
          // console.log(response);
          if (response) {
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(err => {
          // console.log("error");
          console.log(err)
          reject(err)
        })
      })
    },
    async handleHttpRequest(option) { // 上传OSS
      try {
        // 获取fd
        this.CreateFile()
        // 上传OSS
        let vm = this
        vm.disabled = true
        const client = Client(this.dataObj), file = option.file
        let url = '/' + this.temp.productId + '/' + this.fd
        // 分片上传文件
        await client.multipartUpload(url, file, {
          progress: async function(p) {
            let e = {}
            e.percent = p * 100
            option.onProgress(e)
          }
        }).then(({ res }) => {
          if (res.statusCode === 200) {
            // option.onSuccess(ret)
            // console.log(res);
            return res.requestUrls
          } else {
            vm.disabled = false
            option.onError('上传失败')
          }
        }).catch(error => {
          vm.disabled = false
          option.onError('上传失败')
        })
      } catch (error) {
        console.error(error)
        this.disabled = false
        option.onError('上传失败')
      }
    },
    handleSuccess(response, file, fileList) {
      this.$message({
        type: 'success',
        message: '上传成功!'
      })
      this.dialogVisible = false
    },
    handleFailure() {
      this.$message({
        type: 'info',
        message: '上传失败!'
      })
      this.dialogVisible = false
    },
    // 随机生成文件名
    random_string(len) {
      len = len || 32
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678', maxPos = chars.length, pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },

    start: function(ev) {
      // 鼠标左键点击
      ev = ev || event
      ev.preventDefault()
      if (ev.button == 0) {
        // 记录鼠标指针位置
        this.x0 = ev.clientX
        this.y0 = ev.clientY
      }
      this.drawable = true
    },
    move: function(ev) {
      ev = ev || event
      ev.preventDefault()
      console.log(this.drawable)
      if (this.drawable) {
        this.x1 = ev.clientX
        this.y1 = ev.clientY
        this.style = 'transform:translate(' + this.x1 + 'px,' + this.y1 + 'px)'
      }
    },
    stop: function(e) {
      this.drawable = false
      console.log('结束后' + this.drawable)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    }
  }
}
</script>

<style scoped>
.fd-req{
  margin-top: 5%;
}
.el-input{
  width:360px;
}
.image-container{
  margin-left: -10%;
}
.aliossupload{
  margin-top:2%;
  margin-left:20%;
  margin-bottom: 2%;
}
#draw{
  position: relative;     /*定位*/
}
.div{
  width: 80%;
  height: 400px;
  /* background-color: rgba(245,245,245,1); */
  margin-left: 18%;
  margin-top: 5%;
}
.div1{
  width: 20%;
  height: 400px;
  /*background-color: rgba(230,230,230,1);*/
  margin-left: 78%;
  margin-top: 18%;
}
.img{
  width: auto;
  height: auto;
  max-width: 100%;

}
</style>
