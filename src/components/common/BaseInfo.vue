<template>
  <div class="base-info-container">
    <!-- 计量箱档案核对 -->
    <div class="base-info-section" v-if="boxInfo.length">
      <h4 v-if="title" class="section-title">{{ title }}</h4>
      <div class="info-grid">
        <div v-for="(item, index) in boxInfo" :key="index" class="info-item">
          <span class="item-label">{{ item.label }}：</span>
          <template>
            <el-tooltip v-if="item.value.length > 15" :content="item.value" placement="top-start" effect="dark">
              <span class="item-value">{{ item.value }}</span>
            </el-tooltip>
            <span v-else class="item-value">{{ item.value }}</span>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 箱内电能表 -->
    <div class="base-info-section"  v-if="boxInfoList.length">
      <h4 v-if="title" class="section-title">{{ title }}</h4>
      <div class="info-list">
        <div v-for="(meter, index) in boxInfoList" :key="index" class="info-grid info-list-item">
          <div v-for="(field, fieldIndex) in meter" :key="fieldIndex" class="info-item">
            <span class="item-label">{{ field.label }}：</span>
          <template>
            <el-tooltip v-if="field.value.length > 15" :content="field.value" placement="top-start" effect="dark">
              <span class="item-value">{{ field.value }}</span>
            </el-tooltip>
            <span v-else class="item-value">{{ field.value }}</span>
          </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: {
    title: {
      type: String,
      default: ''
    },
    boxInfo: {
      type: Array,
      default: () => []
    },
    boxInfoList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    checkOverflow(event) {
      const target = event.target;
      target.dataset.overflow = target.scrollWidth > target.clientWidth || target.scrollHeight > target.clientHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
.base-info-section {
  margin-bottom: $spacing-base;

  .section-title {
    font-size: $font-base;
    color: $font-color-dark;
    margin-bottom: $spacing-md;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .info-item {
      margin-bottom: $spacing-sm;
      display: flex;
      align-items: flex-start;

      .item-label {
        font-size: $font-sm;
        color: $font-color-light;
        margin-right: $spacing-sm;
        min-width: 80px;
        flex-shrink: 0;
      }

      .item-value {
        font-size: $font-base;
        color: $font-color-main;
        flex: 1;
        word-break: break-word;
        @include text-overflow(3);
      }
    }
  }
}

.info-list {
  .info-list-item {
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $border-color-lighter;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
    }

    .item-label {
      font-size: $font-sm;
      color: $font-color-light;
      margin-right: $spacing-sm;
      min-width: 80px;
      flex-shrink: 0;
    }

    .item-value {
      font-size: $font-base;
      color: $font-color-main;
      flex: 1;
      word-break: break-word;
      margin-right: $spacing-base;
      @include text-overflow(3);
    }
  }
}
</style>