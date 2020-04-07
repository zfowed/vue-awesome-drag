<template>
  <div class="drag-container">
    <slot></slot>
  </div>
</template>

<script>
// 拖动容器
export default {
  name: 'vue-drag-container',
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
      $dragContainer: this
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
.drag-container {
  position: relative;
}
</style>
