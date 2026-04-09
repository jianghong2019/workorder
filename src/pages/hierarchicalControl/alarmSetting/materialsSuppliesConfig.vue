<template>
  <!-- 物资预警配置 -->
  <el-card shadow="hover" class="config-card">
    <!-- 卡片内绿色标题 -->

    <h2 class="card-title box-linear-gradient">物资预警配置</h2>
    <div class="card-main">
      <!-- 说明文字 -->
      <div class="desc">
        <div>说明：</div>
        <div>
          依据考核评价确定物资各类工单的预估使用标准值，据此计算每日各类物资的预估使用量；结合当前库存与每日预估使用量，进一步核算物资可维持天数；当各类物资的可维持天数小于<b
            class="text-green"
            >预设的维持天数</b
          >时，自动触发物资库存预警。
        </div>
      </div>

      <!-- 表单 -->
      <div class="form-box">
        <el-form label-width="120px" :model="form">
          <!-- 基础配置 -->
          <Vtitleindex :title="'基础配置'" />
          <div class="style-padding-left">
            <el-form-item label="启用状态：">
              <el-radio-group v-model="form.enabled">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="物资类型：">
              <el-checkbox-group v-model="form.suppliesTypes" @change="showSuppliesType">
                <el-checkbox
                  v-for="(item, index) in MaterialArry"
                  :key="index"
                  :label="item.codeValue"
                  >{{ item.codeName }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </div>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'" />
          <div class="style-padding-left">
            <div v-for="(item, index) in materialRules" :key="index" class="material-rule-item">
              <template v-if="item.visible">
                <div class="instrument-name">{{ item.suppliesType }}</div>
                <el-form-item label="维持天数：">
                  <el-input-number
                    v-model="item.keepDay"
                    :min="1"
                    :step="1"
                    controls-position="right"
                  />
                  <span class="hint">
                    单位<b class="text-green"> {{ item.suppliesType }}</b> 的可维持天数小于（<b
                      class="text-green"
                      >{{ item.keepDay }}天</b
                    >）触发预警
                  </span>
                </el-form-item>
              </template>
            </div>
          </div>
          <!-- 预警通知配置 -->
          <!-- <Vtitleindex :title="'预警通知配置'" />
          <div class="style-padding-left">
            <el-form-item label="预警方式：">
              <el-radio-group v-model="form.warningWay">
                <el-radio-button label="01">消息通知</el-radio-button>
                <el-radio-button label="02">短信通知</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="通知人员：">
              <el-radio-group v-model="form.notifyPerson">
                <el-radio-button label="01">管理人员</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div> -->
        </el-form>
      </div>
      <!-- 操作按钮 -->
      <div class="button-group">
        <el-button v-debounce="[saveConfig]" type="primary">保存配置</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import API from '@/api/hierarchicalControl/alarmSetting.js';
export default {
  name: 'MaterialWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '1',
        suppliesTypes: [],
        warningWay: '01',
        notifyPerson: '01',
      },
      // 预警规则数据：每个物资类型对应一个维持天数
      MaterialArry: [],
      materialRules: [],
      searchData: {
        warningCategory: '06',
      },
    };
  },
  // watch: {
  //   // 监听 suppliesTypes 变化，动态显示/隐藏对应的规则项
  //   "form.suppliesTypes": {
  //     handler(newVal) {
  //       if (Array.isArray(newVal)) {
  //         console.log(this.materialRules,"this.materialRules1111");

  //         this.materialRules = this.materialRules.map((item) => ({
  //           ...item,
  //           visible: newVal.includes(item.suppliesTypeValue),
  //         }));
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  mounted() {
    this.searchSuppliesType(); //getSuppliesType
  },
  activated() {
    this.searchQuery();
  },
  methods: {
    showSuppliesType(value) {
      const values = value;
      const selectItems = this.MaterialArry.filter((item) => values.includes(item.codeValue));

      const existingMap = new Map(
        this.materialRules.map((item) => [item.suppliesTypeValue, item.keepDay])
      );
      this.materialRules = value.map((codeValue) => {
        const item = this.MaterialArry.find((t) => t.codeValue === codeValue);
        return {
          suppliesType: item ? item.codeName : '',
          suppliesTypeValue: item ? item.codeValue : codeValue,
          keepDay: existingMap.has(codeValue) ? existingMap.get(codeValue) : 80,
          value: codeValue,
          visible: true,
        };
      });
      console.log(this.materialRules, 'this.materialRules');
    },
    resetForm() {
      this.$confirm('确定要重置所有配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.form = {
          enabled: '1',
          suppliesTypes: [],
          warningWay: '01',
          notifyPerson: '01',
        };
        this.materialRules = [];
        // 初始化 materialRules
        if (this.MaterialArry && this.MaterialArry.length > 0) {
          this.MaterialArry.forEach((tool) => {
            this.materialRules.push({
              suppliesType: tool.codeName,
              suppliesTypeValue: tool.codeValue,
              keepDay: 30,
              value: tool.codeValue,
              visible: true,
            });
          });
        }

        if (this.MaterialArry && this.MaterialArry.length > 0) {
          this.form.suppliesTypes = [this.MaterialArry[0].codeValue];
        }
        this.$message.info('物资预警配置已重置!');
      });
    },
    // 查询
    searchQuery() {
      let params = { ...this.searchData };
      // demo
      API.getAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          res.data.DTS.suppliesTypes = res.data.DTS.suppliesTypes.split(',');

          this.arrayList = JSON.parse(res.data.DTS.suppliesRule);
          let array = this.arrayList,
            arr = [];
          for (let i = 0; i < array.length; i++) {
            if (array[i].suppliesType) {
              for (let j = 0; j < this.MaterialArry.length; j++) {
                if (this.MaterialArry[j].codeValue === array[i].suppliesType) {
                  let obj = {
                    ...array[i],
                  };
                  obj.suppliesTypeValue = array[i].suppliesType;
                  obj.suppliesType = this.MaterialArry[j].codeName;
                  obj.value = j + 1 < 10 ? '0' + (j + 1) : String(j + 1);
                  arr.push(obj);
                }
              }
            }
          }
          res.data.DTS.suppliesTypes = arr?.map((item, index) => {
            return item.suppliesTypeValue;
          });
          this.materialRules = arr?.map((item, index) => {
            return {
              ...item,
            };
          });
          this.showSuppliesType(res.data.DTS.suppliesTypes);
          this.form = res.data.DTS;
          console.log('res.data.DTS', this.form);
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
    // 查询物资类型
    async searchSuppliesType() {
      let params = { ...this.searchData };
      // demo
      let res = await API.getSuppliesType(params);
      const { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.MaterialArry = res.data.DTS;
        this.searchQuery();
      } else {
        return this.$alert(res.data.RT_D, '提示', {
          type: 'error',
        });
      }
    },
    // 保存配置
    saveConfig() {
      if (Array.isArray(this.form.suppliesTypes) && this.form.suppliesTypes.length > 0) {
        this.form.suppliesTypes = this.form.suppliesTypes.join(',');
      } else {
        this.$message.info('物资预警配置不能为空！');
        return;
      }

      const visibleList = this.materialRules
        .filter((item) => item.visible === true)
        .map(({ visible, value, ...rest }) => rest)
        .map((item) => ({
          suppliesType: item.suppliesTypeValue,
          keepDay: item.keepDay,
        }));
      const resultStr = JSON.stringify(visibleList);

      if (visibleList) {
        this.form.suppliesRule = resultStr;
      } else {
        this.form.suppliesRule = [];
      }

      let params = { ...this.form, ...this.searchData };
      // demo
      API.setAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.$message.success('物资预警配置已保存！');
          console.log('保存数据：', this.form);
          // this.searchQuery();
          this.searchSuppliesType();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
