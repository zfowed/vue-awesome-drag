## Drag 拖动块

## 基础用法

```html
/*vue*/

<template>
  <div class="app-demo">
    <vue-drag class="drag">拖动我</vue-drag>
  </div>
</template>

<script>
  export default {}
</script>

<style>
  .app-demo {
    height: 100px;
    position: relative;
  }
  .drag {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.5);
  }
</style>
```

## 设置位置

```html
/*vue*/

<template>
  <div class="app-demo">
    <vue-drag
      class="drag"
      :top.sync="top"
      :left.sync="left">
      <span>拖动我</span>
    </vue-drag>
    <p>
      <span>top：</span>
      <input type="number" v-model.number="top">
      <span>left：</span>
      <input type="number" v-model.number="left">
    </p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        top: 0,
        left: 0
      }
    }
  }
</script>

<style>
  .app-demo {
    height: 100px;
    position: relative;
  }
  .drag {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.5);
  }
</style>
```

## 禁止拖动

```html
/*vue*/

<template>
  <div class="app-demo">
    <vue-drag
      class="drag"
      :disabled="disabled"
      :top.sync="top"
      :left.sync="left">
      <span>拖动我</span>
    </vue-drag>
    <p>
      <span>top：</span>
      <input type="number" v-model.number="top">
      <span>left：</span>
      <input type="number" v-model.number="left">
    </p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        top: 0,
        left: 0,
        disabled: true
      }
    }
  }
</script>

<style>
  .app-demo {
    height: 100px;
    position: relative;
  }
  .drag {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.5);
  }
</style>
```
