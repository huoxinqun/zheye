<template>
  <div class="valid-form-container">
      <slot name="default"></slot>
      <div class="submit-area" @click.prevent="submitForm">
          <slot name="submit">
              <button type="button" class="btn btn-primary">提交</button>
          </slot>
      </div>
  </div>
</template>

<script lang="ts">
    import { defineComponent,onUnmounted } from 'vue'
    import emitt from 'mitt'
    type ValidateFunc = ()=> boolean
    export const emitter = emitt()
    export default defineComponent({
        name: "VliDataForm",
        emits:['form-submit'],
        //数组定义点击事件，之前都是object定义
        setup: function (props, context) {
            let funcArr: ValidateFunc[] = []
            const submitForm = () => {
                // 循环执行数组 得到最后的验证结果
                const result = funcArr.map(func => func()).every(result => result)
                context.emit('form-submit', result)
            }
            // 将监听得到的验证函数都存到一个数组中
            const callback = (func ?: ValidateFunc) => {
                if (func) {
                    funcArr.push(func)
                }
            }
            // 添加监听
            emitter.on('form-item-created', callback)
            onUnmounted(() => {
                // 删除监听
                emitter.off('form-item-created', callback)
                funcArr = []
            })
            return {
                submitForm
            }
        }
    })
</script>

<style scoped>

</style>
