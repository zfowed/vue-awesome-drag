<template>
  <span
    class="drag"
    :style="{
      top: `${ currentTop }px`,
      left: `${ currentLeft }px`,
      'z-index': currentAutoZindex && zindex
    }"
    @mousedown="handleMousedown">
    <slot :is-drag="isDrag" :disabled="currentDisabled"></slot>
  </span>
</template>

<script>
import debounce from '../../utils/debounce'
// 拖动块
export default {
  inject: ['$dragGroup'],
  props: {
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    scaleX: {
      type: Number
    },
    scaleY: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentTop: this.top,
      currentLeft: this.left,
      isDrag: false,
      zindex: 1,
      mousedownPosition: {
        x: 0,
        y: 0
      },
      targetdownOffset: {
        top: 0,
        left: 0
      },
      limit: {
        minTop: null,
        minLeft: null,
        maxTop: null,
        maxLeft: null
      },
      mousemovePosition: {
        x: 0,
        y: 0
      },
      mousemoveDistance: {
        x: 0,
        y: 0
      },
      targetmoveOffset: {
        top: 0,
        left: 0
      }
    }
  },
  computed: {
    currentScaleX () {
      return this.scaleX || (this.$dragGroup && this.$dragGroup.scaleX) || 1
    },
    currentScaleY () {
      return this.scaleY || (this.$dragGroup && this.$dragGroup.scaleY) || 1
    },
    currentAutoZindex () {
      return (this.$dragGroup && this.$dragGroup.autoZindex) || false
    },
    currentDisabled () {
      return this.disabled || (this.$dragGroup && this.$dragGroup.disabled) || false
    }
  },
  watch: {
    top () {
      this.currentTop = this.top
    },
    left () {
      this.currentLeft = this.left
    },
    currentTop () {
      this.watchCurrentTop()
    },
    currentLeft () {
      this.watchCurrentLeft()
    }
  },
  created () {
    this.handleMouseup = this.handleMouseup.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.watchCurrentTop = debounce(this.watchCurrentTop.bind(this), 200)
    this.watchCurrentLeft = debounce(this.watchCurrentLeft.bind(this), 200)
  },
  mounted () {
    this.handleResize()
    this.handleResize = debounce(this.handleResize.bind(this), 200)
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    watchCurrentTop () {
      this.$emit('update:top', this.currentTop)
    },
    watchCurrentLeft () {
      this.$emit('update:left', this.currentLeft)
    },
    getOffsetByBody  (el) {
      let top = 0
      let left = 0
      while (el && el.tagName !== 'BODY') {
        top += el.offsetTop
        left += el.offsetLeft
        el = el.offsetParent
      }
      return { top, left }
    },
    updateLimit () {
      // 存在 父容器，限制在里面拖动
      if (this.$dragGroup) {
        const $container = this.$dragGroup.$el
        const containerOffset = this.getOffsetByBody($container)
        const targetOffset = this.getOffsetByBody(this.$el)

        this.limit.minTop = 0 - (targetOffset.top - containerOffset.top - this.targetdownOffset.top)
        this.limit.minLeft = 0 - (targetOffset.left - containerOffset.left - this.targetdownOffset.left)
        this.limit.maxTop = this.limit.minTop + $container.clientHeight - this.$el.clientHeight
        this.limit.maxLeft = this.limit.minLeft + $container.clientWidth - this.$el.clientWidth
      } else {
        this.limit.minTop = null
        this.limit.minLeft = null
        this.limit.maxTop = null
        this.limit.maxLeft = null
      }
    },
    handleResize () {
      this.handleMousedown()
      this.handleMousemove()
      this.handleMouseup()
    },
    handleMousedown (event) {
      // 注销事件
      document.removeEventListener('mousemove', this.handleMousemove)
      document.removeEventListener('mouseup', this.handleMouseup)

      // 拖动
      if (event) this.isDrag = true

      if (this.$dragGroup && this.$dragGroup.autoZindex) {
        this.$dragGroup.zindex += 1
        this.zindex = this.$dragGroup.zindex
      }

      // 按下元素位置
      this.targetdownOffset.top = this.$el.offsetTop
      this.targetdownOffset.left = this.$el.offsetLeft

      // 按下鼠标位置
      this.mousedownPosition.x = (event && event.clientX) || this.getOffsetByBody(this.$el).left
      this.mousedownPosition.y = (event && event.clientY) || this.getOffsetByBody(this.$el).top

      // 更新差异
      this.updateLimit()

      document.addEventListener('mousemove', this.handleMousemove)
      document.addEventListener('mouseup', this.handleMouseup)
    },
    handleMousemove (event) {
      // 移动鼠标位置
      this.mousemovePosition.x = (event && event.clientX) || this.mousedownPosition.x
      this.mousemovePosition.y = (event && event.clientY) || this.mousedownPosition.y

      // 移动鼠标的距离
      this.mousemoveDistance.x = (this.mousemovePosition.x - this.mousedownPosition.x) / this.currentScaleX
      this.mousemoveDistance.y = (this.mousemovePosition.y - this.mousedownPosition.y) / this.currentScaleY

      // 移动元素位置
      this.targetmoveOffset.top = this.targetdownOffset.top + (this.mousemoveDistance.y)
      this.targetmoveOffset.left = this.targetdownOffset.left + (this.mousemoveDistance.x)

      if (typeof this.limit.minTop === 'number' && this.targetmoveOffset.top < this.limit.minTop) this.targetmoveOffset.top = this.limit.minTop
      if (typeof this.limit.maxTop === 'number' && this.targetmoveOffset.top > this.limit.maxTop) this.targetmoveOffset.top = this.limit.maxTop
      if (typeof this.limit.minLeft === 'number' && this.targetmoveOffset.left < this.limit.minLeft) this.targetmoveOffset.left = this.limit.minLeft
      if (typeof this.limit.maxLeft === 'number' && this.targetmoveOffset.left > this.limit.maxLeft) this.targetmoveOffset.left = this.limit.maxLeft

      if (this.currentDisabled) return

      this.currentTop = parseInt(this.targetmoveOffset.top)
      this.currentLeft = parseInt(this.targetmoveOffset.left)
      // this.$el.style.top = this.targetmoveOffset.top + 'px'
      // this.$el.style.left = this.targetmoveOffset.left + 'px'
    },
    handleMouseup (event) {
      // 拖动
      if (event) this.isDrag = false
      // 注销事件
      document.removeEventListener('mousemove', this.handleMousemove)
      document.removeEventListener('mouseup', this.handleMouseup)
    }
  }
}
</script>

<style lang="scss" scoped>
.drag {
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  display: inline-block;
}
</style>
