<template>
  <span
    class="drag"
    :style="{
      top: `${ currentTop }px`,
      left: `${ currentLeft }px`,
      'z-index': currentAutoZindex && zindex
    }"
    @touchstart="handleMousedown"
    @mousedown="handleMousedown">
    <slot :is-drag="isDrag" :disabled="currentDisabled"></slot>
  </span>
</template>

<script>
import debounce from '../../../utils/debounce'
// 拖动块
export default {
  name: 'vue-drag',
  inject: {
    $dragContainer: {
      default: null
    }
  },
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
      return this.scaleX || (this.$dragContainer && this.$dragContainer.scaleX) || 1
    },
    currentScaleY () {
      return this.scaleY || (this.$dragContainer && this.$dragContainer.scaleY) || 1
    },
    currentAutoZindex () {
      return (this.$dragContainer && this.$dragContainer.autoZindex) || false
    },
    currentDisabled () {
      return this.disabled || (this.$dragContainer && this.$dragContainer.disabled) || false
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
      if (this.$dragContainer) {
        const $container = this.$dragContainer.$el
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

    handleMousedown (_event) {
      
      const event = { clientX: 0, clientY: 0 }
      if (_event) {
        if (_event.touches && _event.touches[0]) {
          event.clientX = _event.touches[0].clientX
          event.clientY = _event.touches[0].clientY
        } else {
          event.clientX = _event.clientX
          event.clientY = _event.clientY
        }
      } else {
        event.clientX = this.getOffsetByBody(this.$el).left
        event.clientY = this.getOffsetByBody(this.$el).top
      }

      // 注销事件
      document.removeEventListener('mousemove', this.handleMousemove)
      document.removeEventListener('mouseup', this.handleMouseup)
      document.removeEventListener('touchmove', this.handleMousemove)
      document.removeEventListener('touchend', this.handleMouseup)

      // 拖动
      if (event) this.isDrag = true

      if (this.$dragContainer && this.$dragContainer.autoZindex) {
        this.$dragContainer.zindex += 1
        this.zindex = this.$dragContainer.zindex
      }

      // 按下元素位置
      this.targetdownOffset.top = this.$el.offsetTop
      this.targetdownOffset.left = this.$el.offsetLeft

      // 按下鼠标位置
      this.mousedownPosition.x = event.clientX
      this.mousedownPosition.y = event.clientY

      // 更新差异
      this.updateLimit()

      document.addEventListener('mousemove', this.handleMousemove, { passive: false })
      document.addEventListener('mouseup', this.handleMouseup, { passive: false })
      document.addEventListener('touchmove', this.handleMousemove, { passive: false })
      document.addEventListener('touchend', this.handleMouseup, { passive: false })
    },
    handleMousemove (_event) {

      if (_event) {
        _event.preventDefault && _event.preventDefault()
        _event.returnValue = false
        _event.stopPropagation && _event.stopPropagation()
      }

      const event = { clientX: 0, clientY: 0 }
      if (_event) {
        if (_event.touches && _event.touches[0]) {
          event.clientX = _event.touches[0].clientX
          event.clientY = _event.touches[0].clientY
        } else {
          event.clientX = _event.clientX
          event.clientY = _event.clientY
        }
      } else {
        event.clientX = this.getOffsetByBody(this.$el).left
        event.clientY = this.getOffsetByBody(this.$el).top
      }

      // 移动鼠标位置
      this.mousemovePosition.x = event.clientX
      this.mousemovePosition.y = event.clientY

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
      document.removeEventListener('touchmove', this.handleMousemove)
      document.removeEventListener('touchend', this.handleMouseup)
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
