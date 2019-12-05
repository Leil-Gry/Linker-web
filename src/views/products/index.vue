<template>
  <div class="app-container">
    <el-container>
      <el-aside v-show="showSideSelect" style="height: 700px;margin-right: 10px">
        <el-input
          :placeholder="$t('table.organizationName')"
          v-model="searchOrgName"
          clearable
          style="width: 200px;"
          class="filter-item"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchOrg"
        />
        <el-menu class="el-menu-vertical-demo">
          <el-menu-item v-for="org in organizationListData" :key="org.id" index="2" align="center" @click="selectOrg(org.id)">
            <span slot="title" >{{ org.name }}</span>
          </el-menu-item>
          <!-- Org分页 -->
          <div class="pagination-container">
            <el-button
              v-loading="listLoading"
              v-if="showMoreOrgButtonFlag"
              style="width:35%;border:none;margin-left:25%;margin-top:2%;"
              icon="el-icon-arrow-down"
              @click="showMoreOrg"
            >{{ $t('table.more') }}</el-button>
            <el-button
              v-if="!showMoreOrgButtonFlag"
              style="width:35%;border:none;margin-left:25%;margin-top:2%;"
              icon="el-icon-arrow-up"
              @click="showLessOrg"
            >{{ $t('table.less') }}</el-button>
          </div>
        </el-menu>
      </el-aside>
      <el-col>
        <el-row :span="showSideSelect?18:24">
          <div class="filter-container">
            <el-button
              v-if="this.$store.state.user.currentRoles == 'webAdmin' && this.selectOrgId"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleCreate"
            >{{ $t('table.createProduct') }}</el-button>
            <el-input
              :placeholder="$t('table.productName')"
              clearable
              style="width: 200px;"
              class="filter-item"
            />
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleSearchOrg"
            />
            <!-- <el-button
              v-if="productListData.length>0"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="document"
              @click="handleExport"
            >{{ $t('excel.export') }} Excel</el-button> -->
            <!--            <el-radio-group v-if="this.selectOrgId" v-model="searchStatus" size="primary" class="filter-item" @change="handleFilterPro">-->
            <!--              <el-radio-button label="1">{{$t('table.running')}}</el-radio-button>-->
            <!--              <el-radio-button label="3">{{$t('table.stoped')}}</el-radio-button>-->
            <!--              <el-radio-button label="2">{{$t('table.deleted')}}</el-radio-button>-->
            <!--              <el-radio-button label="">{{$t('table.all')}}</el-radio-button>-->
            <!--            </el-radio-group>-->
            <!--            <el-table-->
            <!--              v-loading="listLoading"-->
            <!--              :key="tableKey"-->
            <!--              :data="productListData"-->
            <!--              border-->
            <!--              fit-->
            <!--              highlight-current-row-->
            <!--              style="width: 100%;"-->
            <!--              :empty-text="$t('table.emptyForm')"-->
            <!--            >-->
            <!--              <el-table-column :label="$t('table.productName')" min-width="150px" align="center">-->
            <!--                <template slot-scope="scope">-->
            <!--                  <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!--              <el-table-column :label="$t('table.description')" min-width="50px" align="center">-->
            <!--                <template slot-scope="scope">-->
            <!--                  <span>{{ scope.row.description }}</span>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!--              &lt;!&ndash; 状态显示 &ndash;&gt;-->
            <!--              <el-table-column :label="$t('table.status')" width="95px" align="center">-->
            <!--                <template slot-scope="scope">-->
            <!--                  <el-tag v-if="scope.row.status == '1'">{{$t('table.running')}}</el-tag>-->
            <!--                  <el-tag v-else-if="scope.row.status == '2'" type="info">{{$t('table.deleted')}}</el-tag>-->
            <!--                  <el-tag v-else-if="scope.row.status == '3'" type="danger">{{$t('table.stoped')}}</el-tag>-->
            <!--                  <el-tag v-else type="warning">{{$t('table.unknow')}}</el-tag>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!-- 管理客户按钮 -->
            <!--              <el-table-column-->
            <!--                v-if="this.$store.state.user.currentRoles == 'webAdmin'"-->
            <!--                :label="$t('table.countCustomer')"-->
            <!--                align="center"-->
            <!--                width="95"-->
            <!--              >-->
            <!--                <template slot-scope="scope">-->
            <!--                  <el-button-->
            <!--                    size="mini"-->
            <!--                    type="primary"-->
            <!--                    @click="jumpRouter('customers','?productID='+scope.row.id)"-->
            <!--                  >{{ $t('table.adminCustomer') }}</el-button>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!-- 管理设备按钮 -->
            <!--              <el-table-column-->
            <!--                v-if="this.$store.state.user.currentRoles == 'webAdmin'"-->
            <!--                :label="$t('table.countDevices')"-->
            <!--                align="center"-->
            <!--                width="95"-->
            <!--              >-->
            <!--                <template slot-scope="scope">-->
            <!--                  <el-button-->
            <!--                    size="mini"-->
            <!--                    type="primary"-->
            <!--                    @click="jumpRouter('devices','?productID='+scope.row.id)"-->
            <!--                  >{{ $t('table.adminDevice') }}</el-button>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!--              &lt;!&ndash;删除按钮&ndash;&gt;-->
            <!--              <el-table-column-->
            <!--                v-if="this.$store.state.user.currentRoles == 'webAdmin'"-->
            <!--                :label="$t('table.actions')"-->
            <!--                align="center"-->
            <!--                width="190"-->
            <!--                class-name="small-padding fixed-width"-->
            <!--              >-->
            <!--                <template slot-scope="scope">-->
            <!--                  <el-button-->
            <!--                    v-if="scope.row.status != '2'"-->
            <!--                    size="mini"-->
            <!--                    type="danger"-->
            <!--                    icon="el-icon-delete"-->
            <!--                    @click="DeleteProduct(scope.row)"-->
            <!--                  />-->
            <!--                </template>-->
            <!--                <a @click="jumpRouter('customers','?productID='+item.id)">-->
            <!--                  <el-tooltip class="item" effect="dark" content="成员" placement="top-end">-->
            <!--                    <svg-icon-->
            <!--                      icon-class="头像"-->
            <!--                      class="icon-svg"-->
            <!--                    />-->
            <!--                  </el-tooltip>-->
            <!--                </a>-->
            <!--                <a @click="jumpRouter('devices','?productID='+item.id)">-->
            <!--                  <el-tooltip class="item" effect="dark" content="产品" placement="top-end">-->
            <!--                    <svg-icon-->
            <!--                      icon-class="产品"-->
            <!--                      class="icon-svg"-->
            <!--                    />-->
            <!--                  </el-tooltip>-->
            <!--                </a>-->
            <!--                <template>-->
            <!--                <a>-->
            <!--                  <el-tooltip class="item" effect="dark" content="删除" placement="top-end">-->
            <!--                    <svg-icon-->
            <!--                      icon-class="delete"-->
            <!--                      class="icon-svg"-->
            <!--                      @click="DeleteProduct(i)"/>-->
            <!--                  </el-tooltip>-->
            <!--                </a>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!--            </el-table>-->
            <div style="margin-top: 10px">
              <el-row style="background-color: rgba(251,251,252,1)" class="row">
                <el-col :span="6" align="center" class="col"><span>{{ $t('table.productName') }}</span></el-col>
                <el-col :span="4" align="center" class="col"><span>{{ $t('table.productKey1') }}</span></el-col>
                <el-col :span="6" align="center" class="col"><span>{{ $t('table.description') }}</span></el-col>
                <el-col :span="4" align="center" class="col"><span>{{ $t('table.createdAt') }}</span></el-col>
                <el-col :span="4" align="center" class="col"><span>{{ $t('table.actions') }}</span></el-col>
              </el-row>
              <div v-if="this.$store.state.user.currentRoles == 'webAdmin'">
                <template v-loading="listLoading" v-for="(item,i) in productListData">
                  <el-row class="row">
                    <el-col :span="6" align="center" class="col">
                      <span class="link-type" @click="handleUpdate(item)">{{ item.name }}</span>
                    </el-col>
                    <el-col :span="4" align="center" class="col">
                      <span class="link-type">{{ item.productKey }}</span>
                    </el-col>
                    <el-col :span="6" align="center" class="col">
                      <span class="link-type">{{ item.description }}</span>
                    </el-col>
                    <el-col :span="4" align="center" class="col">
                      <span class="link-type">{{ item.createt }}</span>
                    </el-col>
                    <el-col :span="4" align="center" style="margin-top: inherit">
                      <a @click="jumpRouter('customers','?productID='+item.id)">
                        <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                          <svg-icon
                            icon-class="look"
                            class="icon-svg"
                          />
                        </el-tooltip>
                      </a>
                      <a @click="jumpRouter('devices','?productID='+item.id)">
                        <el-tooltip class="item" effect="dark" content="管理" placement="top-end">
                          <svg-icon
                            icon-class="管理"
                            class="icon-svg"
                          />
                        </el-tooltip>
                      </a>
                      <a @click="DeleteProduct(i)">
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-end" >
                          <svg-icon
                            icon-class="delete"
                            class="icon-svg"/>
                        </el-tooltip>
                      </a>
                    </el-col>
                  </el-row>
                </template>
              </div>
            </div>
          </div>
          <!-- pro分页 -->
          <div v-if="this.selectOrgId && this.productListData.length > 0" class="pagination-container">
            <el-button
              v-loading="listLoading"
              v-if="showMoreProButtonFlag"
              style="width:100%"
              icon="el-icon-arrow-down"
              @click="showMorePro"
            >{{ $t('table.more') }}</el-button>
            <el-button
              v-if="!showMoreProButtonFlag"
              style="width:100%"
              icon="el-icon-arrow-up"
              @click="showLessPro"
            >{{ $t('table.less') }}</el-button>
          </div>
        </el-row>
      </el-col>
    </el-container>

    <!--product编辑框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.productName')" prop="name">
          <el-input v-model="temp.name" :disabled="dialogStatus !='create' " clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.description')" prop="description" >
          <el-input
            :autosize="{ minRows: 2, maxRows: 5}"
            v-model="temp.description"
            :disabled="this.$store.state.user.currentRoles != 'webAdmin'"
            type="textarea"
            clearable
            resize="none" />
        </el-form-item>
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.status')" prop="status">
          <el-radio-group v-model="temp.status" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" size="small">
            <el-radio-button label="1">{{ $t('table.running') }}</el-radio-button>
            <el-radio-button label="3">{{ $t('table.stoped') }}</el-radio-button>
            <el-radio-button label="2">{{ $t('table.deleted') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 物模型部分开始 -->
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.specification')">
          <el-button
            v-for="(sp,index) in temp.specification"
            :key="index"
            :disable-transitions="false"
            type="mini"
            class="spButtonStyle"
            @click="handleUpdateSpecification(index)"
          >{{ index+1+'.'+sp.name }}</el-button>
          <el-button
            v-if="this.$store.state.user.currentRoles == 'webAdmin'"
            size="mini"
            @click="handleSpecification()"
          >{{ $t('table.createSpecification') }}</el-button>
        </el-form-item>
        <!-- 物模型部分结束 -->
        <!-- mapping部分 -->
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.mapping')">
          <el-button
            v-if="this.$store.state.user.currentRoles == 'webAdmin'"
            size="mini"
            @click="handleMappingList()"
          >{{ $t('table.mappingList') }}</el-button>
        </el-form-item>
        <!-- mapping部分结束 -->
        <!--标签部分开始-->
        <el-form-item v-if="dialogStatus !='create'" :label="$t('table.tags')">
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
          >+ {{ $t('table.newTag') }}</el-button>
        </el-form-item>
        <!--标签部分结束-->
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="dialogStatus !='create' && showProDetailFlag == false"
          @click="showProDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showProDetailFlag == true"
          @click="showProDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.currentRoles == 'webAdmin'"
          type="primary"
          @click="dialogStatus==='create'?CreateProduct(selectOrgId):UpdateProduct()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showProDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="id">
              <span>{{ temp.id }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.organization')" prop="organization">
              <span>{{ temp.organization }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.productKey')" prop="productKey">
              <span>{{ temp.productKey }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.productSecret')" prop="productSecret">
              <span>{{ temp.productSecret }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.createdAt')" prop="createdAt">
              <span>{{ temp.createdAt }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.updatedAt')" prop="updatedAt">
              <span>{{ temp.updatedAt }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.endDate')" prop="endDate">
              <span>{{ temp.endDate }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>

    <!-- 物模型编辑框开始 -->
    <el-dialog :title="specificationDialogTitle" :visible.sync="specificationDialogVisible" width="700px">
      <el-form
        ref="specificationDataForm"
        :rules="rules"
        v-model="currentSp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.specificationIdentifier')" prop="identifier">
          <el-input v-model="currentSp.identifier" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" clearable autofocus/>
        </el-form-item>
        <el-form-item :label="$t('table.specificationName')" prop="specificationName">
          <el-input v-model="currentSp.name" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.specificationDescription')" prop="specificationDescription">
          <el-input v-model="currentSp.description" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.specificationType')" prop="specificationType">
          <el-radio-group v-model="currentSp.dataType.type" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" size="small">
            <el-radio-button label="int">int</el-radio-button>
            <el-radio-button label="float">float</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-card>
          <el-form-item :label="$t('table.specificationMin')" prop="specificationMin">
            <el-input-number v-model="currentSp.dataType.specs.min" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" size="small"/>
          </el-form-item>
          <el-form-item :label="$t('table.specificationMax')" prop="specificationMax">
            <el-input-number
              :disabled="this.$store.state.user.currentRoles != 'webAdmin'"
              v-model="currentSp.dataType.specs.max"
              :min="this.currentSp.dataType.specs.min"
              size="small"
            />
          </el-form-item>
          <el-form-item :label="$t('table.specificationUnit')" prop="specificationUnit">
            <el-radio-group v-model="currentSp.dataType.specs.unit" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" size="small">
              <el-radio-button label="g">{{ $t('table.g') }}</el-radio-button>
              <el-radio-button label="ml">{{ $t('table.ml') }}</el-radio-button>
              <el-radio-button>{{ $t('table.other') }}</el-radio-button>
            </el-radio-group>
            <el-input
              v-show="currentSp.dataType.specs.unit != 'g' && currentSp.dataType.specs.unit != 'ml'"
              :disabled="this.$store.state.user.currentRoles != 'webAdmin'"
              v-model="currentSp.dataType.specs.unit"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.specificationUnitName')" prop="specificationUnitName">
            <el-radio-group v-model="currentSp.dataType.specs.unitName" :disabled="this.$store.state.user.currentRoles != 'webAdmin'" size="small">
              <el-radio-button label="克" aria-checked="1">{{ $t('table.g') }}</el-radio-button>
              <el-radio-button label="毫升">{{ $t('table.ml') }}</el-radio-button>
              <el-radio-button>{{ $t('table.other') }}</el-radio-button>
            </el-radio-group>
            <el-input
              v-show="currentSp.dataType.specs.unitName != '克' && currentSp.dataType.specs.unitName != '毫升'"
              :disabled="this.$store.state.user.currentRoles != 'webAdmin'"
              v-model="currentSp.dataType.specs.unitName"
              clearable
            />
          </el-form-item>
        </el-card>
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="spDialogStatus == 'update' && this.$store.state.user.currentRoles == 'webAdmin'"
          type="danger"
          @click="DeleteSp()"
        >{{ $t('table.delete') }}</el-button>
        <el-button @click="specificationDialogVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.currentRoles == 'webAdmin'"
          type="primary"
          @click="spDialogStatus==='create'?CreateSp():UpdateSp()"
        >{{ $t('table.submit') }}</el-button>
      </div>
    </el-dialog>
    <!-- 物模型编辑框结束 -->
    <!-- mapping列表弹框开始 -->
    <el-dialog :title="mappingListDialogTitle" :visible.sync="mappingListDialogVisible" width="700px">
      <div
        v-if="this.$store.state.user.currentRoles == 'webAdmin'"
        class="filter-container"
      >
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreateMapping"
        >{{ $t('table.addMapping') }}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="mappingListData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column :label="$t('table.mappingName')" min-width="150px" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdateMapping(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.description')" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="DeleteMapping(this.tempProId, scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- mapping列表弹框结束 -->
    <!-- mapping修改、新建框开始 -->
    <el-dialog :title="updateMappingTitle" :visible.sync="updateMappingFormVisible" width="550px">
      <el-form
        ref="updateMappingForm"
        :rules="rules"
        :model="tempMapping"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.mappingName')" prop="mappingName">
          <el-input
            v-model="tempMapping.name"
            :disabled=" mappingDialogStatus !='create'"
            clearable
            autofocus
          />
        </el-form-item>
        <el-form-item :label="$t('table.description')" prop="description">
          <el-input
            v-model="tempMapping.description"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.type')" prop="type">
          <el-radio-group
            v-model="tempMapping.type"
            size="small"
          >
            <el-radio-button label="1">Binary</el-radio-button>
            <el-radio-button label="2">JSON</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.mapping')" prop="mapping">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="tempMapping.mapping"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div class="dialogButton">
        <el-button
          v-if="mappingDialogStatus !='create' && showMappingDetailFlag == false"
          @click="showMappingDetailFlag = true"
        >{{ $t('table.showDetail') }}</el-button>
        <el-button
          v-if="dialogStatus !='create' && showMappingDetailFlag == true"
          @click="showMappingDetailFlag = false"
        >{{ $t('table.closeDetail') }}</el-button>
        <el-button @click="updateMappingFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="this.$store.state.user.currentRoles != 'organizationStaff'"
          type="primary"
          @click="mappingDialogStatus==='create'?CreateMapping(tempProId):UpdateMapping(tempProId, scope.row)"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showMappingDetailFlag">
          <el-form label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('table.id')" prop="id">
              <span>{{ tempMapping.id }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-dialog>
    <!-- mapping修改、新建框结束 -->
  </div>
</template>

<script>
import {
  getProductListByOrg,
  getProductListByCus,
  getAllProductList,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductDetail,
  getMappingList,
  createMapping
} from '@/api/product'
import { getOrganizationList } from '@/api/organizations'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
let self = this
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
      searchOrgName: '', // 搜索框的内容
      searchStatus: '',
      nullList: [], // 表格数据为null时，防止.length失效
      rules: {
        // 表单验证，对应prop值  TODO:email更加详细的验证
        name: [
          { required: true, message: this.$t('table.pleaseInputProName'), trigger: 'change' }
        ]
      },

      // 弹框、数据相关：
      tempMapping: {
        name: '',
        description: '',
        type: 1,
        mapping: ''
      },
      temp: {
        createdBy: '',
        createdName: '',
        organizationId: '',
        organizationName: '',
        customerId: [],
        customerName: '',

        description: '',
        tags: [],
        specification: []
      },
      dialogFormVisible: false, // pro编辑框显示
      mappingDialogStatus: '',
      dialogStatus: '', // 弹框标题初始化，标题显示为下面的textmap
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.add')
      },
      spDialogStatus: '',
      organizationListData: [],
      productListData: [],
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
      updateMappingTitle: '',

      // 按钮相关：
      showMappingDetailFlag: false,
      showProDetailFlag: false,
      showMoreOrgButtonFlag: true,
      showMoreProButtonFlag: true,
      showSideSelect:
        this.$store.state.user.currentRoles == 'webAdmin' &&
        !(this.$route.query.organizationID || this.$route.query.customerID), // 是webadmin且是点击左侧sidebar入口进入的

      // 分页相关：
      currentProPage: 1,
      currentOrgPage: 1,
      pageSize: 10, // 单页条数，要和api中的保持一致，否则数据会有重复
      needRefreshProListFlag: 0,
      needRefreshOrgListFlag: 0
    }
  },
  created() {
    this.GetProductList()
  },
  methods: {
    // update_info:function(self,data){
    //   alert(self.$store);
    //   self.$store.commit("info",data);
    // },
    // open_show: function () {
    //   let self =this;
    //   this.update_info(self,this.flag);
    // },
    resetTempMapping() {
      this.tempMapping = {
        name: '',
        description: '',
        type: 1,
        mapping: ''
      }
    },
    resetTemp() { // 重置、初始化数组
      this.temp = {
        organizationId: '',
        customerId: [],
        status: '',

        description: '',
        tags: [],
        specification: []
      }
      this.showProDetailFlag = false
      this.showMappingDetailFlag = false
    },
    resetSp() { // 重置sp对象，默认几个数据选择
      this.currentSp = {
        identifier: '',
        name: '',
        description: '',
        dataType: {
          type: 'int',
          specs: {
            min: '',
            max: '',
            unit: 'g',
            unitName: '克'
          }
        }
      }
    },
    selectOrg(orgId) { // 选择左侧org列表，暂存选择项，拉取列表
      this.needRefreshProListFlag = 1
      this.selectOrgId = orgId
      this.GetProductList()
      this.needRefreshProListFlag = 0
    },
    GetProductList(page, size, status) {
      if (this.$route.query.organizationID) { // 如果url中有orgid，则先保存到selectOrgId中，之后查这个就行
        // 给新建产品做准备
        this.selectOrgId = this.$route.query.organizationID
      }
      if (this.$route.query.customerID) {
        this.GetProductByCus(this.$route.query.customerID, page, size, status)
      }
      if (this.needRefreshProListFlag) {
        this.productListData = []
      }
      if (status) {
        this.listLoading = true
        getProductListByOrg(this.selectOrgId, page, size, status).then(response => {
          if (response.status == 200) {
            if (response.data.length < this.pageSize) {
              // 不够一页了，隐藏更多按钮，让当前页再减回来，因为点更多的时候加了一个
              this.showMoreProButtonFlag = false
              this.productListData.push(...response.data)
              this.currentProPage--
            } else {
              this.productListData.push(...response.data)
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
        this.listLoading = true
        getProductListByOrg(this.selectOrgId, page, size).then(response => {
          if (response.status == 200) {
            if (response.data.length < this.pageSize) {
              // 不够一页了，隐藏更多按钮，让当前页再减回来，因为点更多的时候加了一个
              this.showMoreProButtonFlag = false
              this.productListData.push(...response.data)
              this.currentProPage--
            } else {
              this.productListData.push(...response.data)
            }
            this.listLoading = false
          } else {
            this.$message.error({
              message: response
            })
            this.listLoading = false
          }
        })
      } else if (this.selectOrgId) {
        this.listLoading = true
        getProductListByOrg(this.selectOrgId).then(response => {
          if (response.status == 200) {
            if (response.data == null) {
              this.productListData = this.nullList
            } else {
              this.productListData.push(...response.data)
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
        // url中没有id，则没有东西在加载的时候保存到selectOrgId
        if (this.$store.state.user.currentRoles == 'webAdmin') {
          // 是webAdmin
          this.listLoading = true
          this.GetOrganizationList()
        } else {
          // url没有id并且不是webadmin
          this.selectOrgId = this.$store.state.user.currentRelatedId
          this.GetProductList() // 查自己所属的列表
        }
      }
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
              this.showMoreOrgButtonFlag = false
              this.organizationListData.push(...response.data)
              this.currentOrgPage--
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
              this.showMoreOrgButtonFlag = false
              this.organizationListData.push(...response.data)
              this.currentOrgPage--
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
    GetProductByCus(cusID, page, size, status) { // 获取客户的所有产品
      getProductListByCus(cusID).then(response => {

      }).catch(error => {
        if (error.response.status == 403) {
          alert('SERVER TODO')
        }
      })
    },
    DeleteProduct(row) { // 删除产品，修改状态为2
      this.$confirm(this.$t('table.willDelete'), this.$t('table.update'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      })
        .then(() => {
          const tempData = { // 只传这一条数据
            status: 2
          }
          updateProduct(row.id, tempData)
            .then(response => {
              if (response.status == 200) {
                this.dialogFormVisible = false
                for (var i = 0; i < this.productListData.length; i++) {
                  // 从表格中删除这行
                  if (this.productListData[i].id == row.id) {
                    this.productListData[i].status = 2
                  }
                }
                this.$notify({
                  title: this.$t('table.deleteSuccess'),
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
                message: this.$t('table.deleteWrong')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('table.notDelete')
          })
        })
    },
    GetProductDetail(proId) { // 获得org内容，在webadmin点击修改时，和非webadmin获取自己详情时调用
      getProductDetail(proId).then(response => {
        if (response.status == 200) {
          this.temp = response.data
          if (response.data.tags == null) {
            this.temp.tags = []
          }
          if (response.data.specification == null) {
            this.temp.specification = []
            this.resetSp()
          }
        } else {
          this.$notify.error({
            title: response,
            duration: 2000
          })
        }
      })
    },
    handleCreate() { // 打开创建产品弹框
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    CreateProduct(orgId) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$confirm(this.$t('table.willCreatePro'), this.$t('table.create'), {
            confirmButtonText: this.$t('table.confirm'),
            cancelButtonText: this.$t('table.cancel'),
            type: 'warning'
          })
            .then(() => {
              this.temp.organizationId = orgId // 所属组织
              this.temp.status = '1' // 初始状态为运营中
              createProduct(this.temp).then(response => {
                if (response.status == 201) {
                  this.dialogFormVisible = false
                  this.productListData.push(response.data)
                  this.$notify({
                    title: this.$t('table.createSuccess'),
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.$notify.error({
                    title: response,
                    duration: 2000
                  })
                }
              }).catch(() => {
                this.$message.error({
                  message: this.$t('table.createWrong')
                })
              })
            })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('table.notCreate')
          })
        })
    },
    handleUpdate(row) { // 弹出修改产品框，弹出时拉取详情
      this.tempProId = row.id
      this.GetProductDetail(row.id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    UpdateProduct() {
      this.$confirm(this.$t('table.willUpdate'), this.$t('table.update'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              const tempData = Object.assign({}, this.temp)
              updateProduct(this.temp.id, tempData)
                .then(response => {
                  if (response.status == 200) {
                    // 返回type是success时，关弹窗，改列表
                    this.dialogFormVisible = false
                    for (var i = 0; i < this.productListData.length; i++) {
                      // 修改后遍历表格，替换为新的数据
                      if (this.productListData[i].id == this.temp.id) {
                        this.productListData.splice(i, 1, tempData) // put时，如果服务器返回新的数据，就改成response.data，如果不返回，就把提交的数据替换到里面，反正点击的时候会拉取一遍
                      }
                    }
                    this.$notify({
                      title: this.$t('table.updateSuccess'),
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
                    message: this.$t('table.updateWrong')
                  })
                })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('table.notUpdate')
          })
        })
    },
    handleExport() { // TODO 导出
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['name', 'createdBy']
        const filterVal = ['name', 'createdBy']
        const list = this.productListData
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
    // mapping部分
    handleMappingList() {
      this.mappingListDialogTitle = this.$t('table.mapping')
      this.mappingListDialogVisible = true
      this.$nextTick(() => {
        this.$refs['updateMappingForm'].clearValidate()
      })
      this.GetMappingList(this.tempProId)
    },
    handleCreateMapping() {
      this.resetTempMapping()
      this.mappingDialogStatus = 'create'
      this.mappingDialogTitle = this.$t('table.createMapping')
      this.updateMappingFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateMappingForm'].clearValidate()
      })
    },
    handleUpdateMapping(row) {
      this.GetMappingDetail(row.id)
      this.mappingDialogStatus = 'update'
      this.mappingDialogTitle = this.$t('table.updateMapping')
      this.updateMappingFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateMappingForm'].clearValidate()
      })
    },
    GetMappingList(proId) {
      getMappingList(proId).then(response => {
        if (response.status == 200) {
          this.mappingListData = response.data
        }
        this.listLoading = false
      })
    },
    GetMappingDetail(mappingId) {
      alert(mappingId)
    },
    CreateMapping(proId) {
      this.$refs['updateMappingForm'].validate(valid => {
        if (valid) {
          this.$confirm(this.$t('table.willCreateMapping'), this.$t('table.create'), {
            confirmButtonText: this.$t('table.confirm'),
            cancelButtonText: this.$t('table.cancel'),
            type: 'warning'
          })
            .then(() => {
              createMapping(proId, this.tempMapping).then(response => {
                if (response.status == 201) {
                  this.updateMappingFormVisible = false
                  this.mappingListData.push(response.data)
                  this.$notify({
                    title: this.$t('table.createSuccess'),
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.$notify.error({
                    title: response,
                    duration: 2000
                  })
                }
              }).catch(() => {
                this.$message.error({
                  message: this.$t('table.createWrong')
                })
              })
            })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('table.notCreate')
          })
        })
    },
    UpdateMapping(proId, row) {
      alert(proId)
      alert(row)
    },

    // 物模型部分
    handleUpdateSpecification(spIndex) { // 弹出物模型编辑框，以返回数组的index为准，复制数据
      this.currentSpIndex = spIndex
      this.currentSp = this.temp.specification[spIndex]
      this.spDialogStatus = 'update'
      this.specificationDialogTitle = '编辑物模型'
      this.specificationDialogVisible = true
      this.$nextTick(() => {
        this.$refs['specificationDataForm'].clearValidate()
      })
    },
    handleSpecification() { // 弹出创建物模型框，先初始化sp
      this.resetSp()
      this.spDialogStatus = 'create'
      this.specificationDialogTitle = '新建物模型'
      this.specificationDialogVisible = true
      this.$nextTick(() => {
        this.$refs['specificationDataForm'].clearValidate()
      })
    },
    CreateSp() { // 新建一个物模型
      this.temp.specification.push(this.currentSp)
      this.specificationDialogVisible = false
    },
    UpdateSp() { // 修改物模型，替换数组，以index为准
      this.temp.specification[this.currentSpIndex] = this.currentSp
      this.specificationDialogVisible = false
    },
    DeleteSp() { // 删除物模型
      this.temp.specification.splice(this.currentSpIndex, 1)
      this.specificationDialogVisible = false
    },
    handleSearchOrg() {
      // 点击搜索按钮调用
      if (this.searchOrgName) {
        this.needRefreshOrgListFlag = 1
        this.GetOrganizationList(
          this.currentOrgPage,
          this.pageSize,
          this.searchOrgName
        )
        this.showMoreOrgButtonFlag = false
        this.needRefreshOrgListFlag = 0
      }
    },
    showMoreOrg() {
      // 无限滚动分页
      this.currentOrgPage++
      this.GetOrganizationList(this.currentOrgPage, this.pageSize, this.searchOrgName)
      // TODO： 页面保持滚动在最下面
    },
    showLessOrg() {
      // 收起，当滚动到底时，显示收起，这时候收起到只显示第一页，页面面大小由pagesize决定
      this.currentOrgPage = 1
      this.showMoreOrgButtonFlag = !this.showMoreOrgButtonFlag
      this.organizationListData.splice(
        this.pageSize,
        this.organizationListData.length - this.pageSize
      )
    },
    showMorePro() {
      // 无限滚动分页
      this.currentProPage++
      this.GetProductList(this.currentProPage, this.pageSize, this.searchStatus)
      // TODO： 页面保持滚动在最下面
    },
    showLessPro() {
      // 收起，当滚动到底时，显示收起，这时候收起到只显示第一页，页面大小由pagesize决定
      this.currentProPage = 1
      this.showMoreProButtonFlag = !this.showMoreproButtonFlag
      this.productListData.splice(
        this.pageSize,
        this.productListData.length - this.pageSize
      )
    },
    handleFilterPro() {
      this.needRefreshProListFlag = 1
      this.currentProPage = 1
      this.showMoreProButtonFlag = 1
      this.GetProductList(this.currentProPage, this.pageSize, this.searchStatus)
      this.needRefreshProListFlag = 0
    }
  }
}
</script>
<style>
.dialogButton {
  text-align: right;
  padding-bottom: 20px;
  margin-top: 15px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.pagination-container{
  margin: 0 20px;
}
.icon-svg{
  font-size: 45px;
  padding-left: 20px;
}
.row{
  height: 55px;
}
.col{
  margin-top: 20px;
  font-size: 15px;
}
</style>

