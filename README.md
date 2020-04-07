# 快速开始

## 安装

```shell
npm install vue-awesome-drag -S
```

## 全局安装

```javascript
import { Drag, DragContainer } from 'vue-awesome-drag'

Vue.use(Drag)
Vue.use(DragContainer)
```

## 组件安装

```javascript
import { Drag, DragContainer } from 'vue-awesome-drag'

export default {
  name: 'app-demo'
  components: {
    'vue-drag': Drag,
    'vue-drag-container': DragContainer
  }
}
```

有关更多信息，请参考我们[详细文档](https://zfowed.github.io/vue-awesome-drag/)。
