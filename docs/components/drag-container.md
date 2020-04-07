## DragContainer 拖动块组

限制在容器内拖动

## 基础用法

```html
/*vue*/

<template>
  <vue-drag-container class="drag-container">
    <vue-drag class="drag" :top="0" :left="0">拖动我</vue-drag>
    <vue-drag class="drag" :top="80" :left="150">拖动我</vue-drag>
    <vue-drag class="drag" :top="40" :left="300">拖动我</vue-drag>
  </vue-drag-container>
</template>

<script>
  export default {}
</script>

<style>
  .drag-container {
    height: 300px;
    position: relative;
    background-color: #eee;
  }
  .drag {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .drag:nth-child(1) {
    background-color: rgba(255, 0, 0, 0.5);
  }
  .drag:nth-child(2) {
    background-color: rgba(0, 255, 0, 0.5);
  }
  .drag:nth-child(3) {
    background-color: rgba(0, 0, 255, 0.5);
  }
</style>
```

## 禁止拖动

```html
/*vue*/

<template>
  <vue-drag-container :disabled="disabled" class="drag-container">
    <vue-drag class="drag" :top="0" :left="0">拖动我</vue-drag>
    <vue-drag class="drag" :top="80" :left="150">拖动我</vue-drag>
    <vue-drag class="drag" :top="40" :left="300">拖动我</vue-drag>
  </vue-drag-container>
</template>

<script>
  export default {
    data () {
      return {
        disabled: true
      }
    }
  }
</script>

<style>
  .drag-container {
    height: 300px;
    position: relative;
    background-color: #eee;
  }
  .drag {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .drag:nth-child(1) {
    background-color: rgba(255, 0, 0, 0.5);
  }
  .drag:nth-child(2) {
    background-color: rgba(0, 255, 0, 0.5);
  }
  .drag:nth-child(3) {
    background-color: rgba(0, 0, 255, 0.5);
  }
</style>
```
