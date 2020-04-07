<template>
  <div class="drag-group">
    <slot></slot>
  </div>
</template>

<script>
// 拖动容器
export default {
  props: {
    scaleX: {
      type: Number
    },
    scaleY: {
      type: Number
    },
    autoZindex: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  provide: function () {
    return {
      $dragGroup: this
    }
  },
  data () {
    return {
      zindex: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-group {
  position: relative;
}
</style>
