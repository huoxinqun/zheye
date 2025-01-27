<template>
    <div class="validate-input-container pb-3">
        <input class="form-control"
            v-if="tag !== 'textarea'"
            :class="{'is-invalid': inputRef.error}"
            @blur="validateInput"
            v-model="inputRef.val"
            v-bind="$attrs"
        >
        <textarea
            v-else
            class="form-control"
            :class="{'is-invalid': inputRef.error}"
            @blur="validateInput"
            v-model="inputRef.val"
            v-bind="$attrs"
        >
        </textarea>
        <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, PropType,onMounted,computed } from 'vue'
    import { emitter } from './VliDataForm.vue'
    const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const pwdReg = /^[a-zA-Z]\w{5,17}$/
    // 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
    interface RuleProp {
        type: 'required' | 'email' | 'password' | 'custom';
        message: string;
        validator?: () => boolean;
    }
    export type RulesProp = RuleProp[]
    export type TagType = 'input' | 'textarea'
    export default defineComponent({
        props: {
            rules: Array as PropType<RulesProp>,
            modelValue: String,
            tag: {
                type: String as PropType<TagType>,
                default: 'input'
            }
        },
        inheritAttrs:false,
        setup(props,context) {
            const inputRef = reactive({
                val: computed({
                    get: () => props.modelValue || '',
                    set: val => {
                    context.emit('update:modelValue', val)
                    }
                }),
                error: false,
                message: ''
            })
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
                            case 'custom':
                                // validator存在就返回本身，不存在默认true
                                passed = rule.validator ? rule.validator() : true
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
                validateInput
            }
        }
    })
</script>
