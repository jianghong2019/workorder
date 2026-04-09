<template>
  <div class="person-tooltip-box-con">
    <div class="card">
      <div class="profile">
        <div
          :class="[
            'user-icon',
            data.warningDegree === '0'
              ? 'safe'
              : data.warningDegree === '04'
                ? 'gay'
                : ['01', '02', '03'].includes(data.warningDegree)
                  ? 'warning'
                  : 'safe',
          ]"
        >
          <img class="image" src="@/assets/images/uer-portrait/icon_person.png" alt="" />
        </div>
        <div class="profile-text">
          <div>
            {{ data.name }}
          </div>
          <div class="info">
            <span class="label">所在单位：</span>
            <span class="value">{{ data.orgName }}</span>
          </div>
        </div>
        <div>
          <div class="profile-right">负责人</div>
        </div>
      </div>
      <div class="content">
        <span
          v-for="(item, i) in personTags"
          :key="i"
          :class="['text', isIncludeError(item.tagCode) ? 'error' : '']"
          >{{ item.tagName }}</span
        >
      </div>
      <div class="info-row">
        <div class="label">定位时间：</div>
        <div class="value">{{ data.locationTime }}</div>
      </div>
      <div class="info-row">
        <div class="label">位 &nbsp; &nbsp; &nbsp; 置：</div>
        <div class="value-address">
          {{ data.address }}
        </div>
      </div>
      <ul v-if="waringList.length" class="efficiency">
        <li v-for="(item, i) in waringList" :key="i">
          <span
            :class="[
              'eff-title',
              item.warningDegree === '03' ? 'error' : item.warningDegree === '02' ? 'warning' : '',
            ]"
            >{{ item.title }}：</span
          >
          <span class="eff-text">{{ item.timeOutText }}</span>
        </li>
        <!-- <li>
          <span class="eff-title error">效率偏差：</span>
          <span class="eff-text"
            >当选为市场就是从数据库盲从心理上买了积极{{ efficiencyText }}</span
          >
        </li> -->
      </ul>
      <div class="detail" @click="onDetail">
        <span class="detail-text">待办工单</span>
      </div>
    </div>
    <PersonnelDetails
      v-if="isShowDetail"
      ref="personnelDetails"
      :data="data"
      @close="isShowDetail = false"
    ></PersonnelDetails>
  </div>
</template>
<script>
import Clickoutside from 'element-ui/lib/utils/clickoutside';
import PersonnelDetails from './PersonnelDetails.vue';
export default {
  name: 'PersonTooltip',
  directives: { Clickoutside },
  components: { PersonnelDetails },
  props: ['data'],
  data() {
    return {
      isShowDetail: false,
    };
  },
  computed: {
    personTags() {
      return JSON.parse(this.data.personTags) ?? [];
    },
    waringList() {
      return JSON.parse(this.data.waringList) ?? [];
    },
  },
  methods: {
    onDetail() {
      console.log(this.data);
      // this.$refs.personnelDetails.openFn(this.data);
      this.isShowDetail = true;
      this.$emit('onDetail');
    },
    handlerOutside() {
      console.log('OrderTooltip关闭');
      this.$emit('close');
    },
    isIncludeError(code) {
      return code?.endsWith('99') ?? false;
    },
  },
};
</script>
<style lang="scss" scoped>
.person-tooltip-box-con {
  .card {
    box-sizing: border-box;
    width: 268px;
    padding: 10px;
    // height: 300px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
    .profile {
      display: flex;
      justify-content: space-around;
      .user-icon {
        box-sizing: border-box;
        width: 47px;
        height: 47px;
        border-width: 4px;
        border-style: solid;
        border-radius: 50%;
        &.safe {
          border-color: #2ba174;
        }
        &.warning {
          border-color: #f7b94b;
        }
        &.error {
          border-color: #fe3333;
        }
        &.gay {
          border-color: #bcbcbc;
        }
        .image {
          width: 39px;
          height: 39px;
        }
      }

      .profile-text {
        font-size: 14px;
        font-weight: 700;
        color: #333333;
        .info {
          font-size: 12px;
          font-weight: 350;
          color: #7b807e;
          width: 140px;
          height: 12px;
          line-height: 12px;
          margin-top: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .value {
          }
        }
      }
      .profile-right {
        font-size: 10px;
        font-weight: 400;
        color: #ffffff;
        background: #14c893;
        border-radius: 4px 0 4px 0;
        padding: 0 4px;
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;
      .text {
        font-size: 10px;
        font-weight: 400;
        background: #64d591;
        color: #ffffff;
        padding: 2px 4px 1px;
        margin-right: 4px;
        margin-bottom: 4px;
        &.error {
          background: #fe3333;
        }
      }
    }
    /* 每一行对齐：左为灰色小标题，右为值（首行已单独处理） */
    .info-row {
      display: flex;
      font-size: 12px;
      font-weight: 400;
      // line-height: 20px;
      color: #1c2623;
      /* 小标题（灰色） */
      .label {
        width: 80px;
        text-align: end;
      }
      .value {
        width: 180px;
      }
    }
    /* 效率偏差区域：底色灰色；“效率偏差”四字为橙色（靠左），描述文字为深灰 */
    .efficiency {
      background: #f0f0f0; /* 灰色底（第5条） */
      border-radius: 6px;
      padding: 8px 10px;
      margin-top: 10px;
      box-sizing: border-box;
      max-height: 260px;
      overflow-y: auto;
      .eff-title {
        font-weight: 400;
        font-size: 12px;
        &.warning {
          color: #ff981b;
        }
        &.error {
          color: #fe3333;
        }
      }
      .eff-text {
        color: #99a09e; /* 深灰/褐色，易读 */
        font-size: 12px;
        line-height: 16px;
        word-break: break-all;
      }
    }

    /* 查看详情：图标在左，文字在右，单行水平布局（第6条） */
    .detail {
      margin-top: 12px;
      cursor: pointer;
      user-select: none;
      color: #2ba174;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
