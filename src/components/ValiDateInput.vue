<template>
    <div class="validate-input-container pb-3">
        <input class="form-control"
               :class="{'is-invalid': inputRef.error}"
               :value="inputRef.val"
               @blur="validateInput"
               @input="updateValue"
               v-bind="$attrs"
        >
        <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, PropType,onMounted } from 'vue'
    import { emitter } from './VliDataForm.vue'
    const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const pwdReg = /^[a-zA-Z]\w{5,17}$/
    // 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
    interface RuleProp {
        type: 'required' | 'email' | 'password';
        message: string;
    }
    export type RulesProp = RuleProp[]
    export default defineComponent({
        props: {
            rules: Array as PropType<RulesProp>,
            modeValue: String
        },
        inheritAttrs:false,
        setup(props,context) {
            const inputRef = reactive({
                val: props.modeValue || '',
                error: false,
                message: ''
            })
            const updateValue = (e: KeyboardEvent) => {
              const targetValue = (e.target as HTMLInputElement).value
              inputRef.val = targetValue
              context.emit('update:modelValue',targetValue)
            }
            const validateInput = () => {
                if (props.rules) {
                    const allPassed = props.rules.every(rule => {
                        let passed = true
                        inputRef.message = rule.message
                        switch (rule.type) {
                            case 'required':
                                passed = (inputRef.val.trim() !== '')
                                break;
                            case 'email':
                                passed = emailReg.test(inputRef.val)
                                break;
                            case 'password':
                                passed = pwdReg.test(inputRef.val)
                                break
                            default:
                                break
                        }
                        return passed
                    })
                    inputRef.error = !allPassed
                    return allPassed
                }
                return true
            }
            onMounted(()=>{
                emitter.emit('form-item-created',validateInput);
            })
            return {
                inputRef,
                validateInput,
                updateValue
            }
        }
    })
</script>
