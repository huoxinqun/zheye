<template>
    <div class="login-page mx-auto p-3 w-330">
        <h5 class="my-4 text-center">登录到者也</h5>
        <vlidate-form action="" @form-submit='onFormSubmit'>
            <div class="mb-3">
                <label class="form-label">邮箱地址</label>
                <validate-input
                        type="text"
                        placeholder="请输入邮箱地址"
                        :rules="emailRules"
                        v-model="formData.emailVal">
                </validate-input>
                {{ emailVal }}
            </div>
            <div class="mb-3">
                <label class="form-label">用户名</label>
                <validate-input
                        type="text"
                        placeholder="请输入用户名"
                        :rules="userRules"
                        v-model="formData.userVal">
                </validate-input>
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input
                        type="password"
                        placeholder="请输入密码"
                        :rules="pwdRules"
                        v-model="formData.pwdVal">
                    >
                </validate-input>
            </div>
            <div class="mb-3">
                <label class="form-label">确认密码</label>
                <validate-input
                        type="password"
                        placeholder="请输入确认密码"
                        :rules="confirmpwdRules"
                        v-model="formData.confirmpwdVal">
                    >
                </validate-input>
            </div>
            <template v-slot:submit>
                <div class="submit-area"><button type="submit" class="btn btn-primary btn-block">提交</button></div>
            </template>
        </vlidate-form>

        <div class="form-text"><a href="/login" class="">已有账户？去登录吧！</a></div>
    </div>
</template>

<script lang="ts">
    import {defineComponent,reactive} from "vue";
    import axios from 'axios'
    import { useRouter } from 'vue-router'
    import VlidateForm from "../components/VliDataForm.vue";
    import ValidateInput,{ RulesProp } from '../components/ValiDateInput.vue'
    import createMessage from '../components/createMessage'

    export default defineComponent({
        name: "signup",
        components: {
            VlidateForm,
            ValidateInput
        },
        setup() {
            //reactive的用法与ref的用法相似，也是将数据变成响应式数据，当数据发生变化时UI也会自动更新。不同的是ref用于基本数据类型，而reactive是用于复杂数据类型，比如对象和数组
            const formData = reactive({
                emailVal: '',
                userVal: '',
                pwdVal: '',
                confirmpwdVal: ''
            })
            const router = useRouter()
            const emailRules: RulesProp = [
                { type: 'required', message: '电子邮箱地址不能为空' },
                { type: 'email', message: '请输入正确的电子邮箱格式' }
            ]
            const userRules: RulesProp = [
                { type: 'required', message: '昵称不能为空' },
            ]
            const pwdRules = [
                { type: 'required', message: '密码不能为空' },
               // { type: 'password', message: '密码以字母开头，长度在6-18之间，只能包含字符、数字和下划线' }
            ]
            const confirmpwdRules = [
                { type: 'required', message: '确认密码不能为空'},
                { type: 'custom',
                    validator: () => {
                      return formData.pwdVal === formData.confirmpwdVal
                    },
                    message: '密码不相同'
                }
            ]
            const onFormSubmit = (result: boolean)=> {
                console.log('result',result)
                if (result == true){
                    const payload = {
                        email: formData.emailVal,
                        password: formData.pwdVal,
                        nickName: formData.userVal
                    }
                    axios.post('/users/', payload).then(data => {
                        createMessage('注册成功 正在跳转登录页面', 'success')
                        setTimeout(() => {
                            router.push('/login')
                        }, 2000)
                    }).catch(e => {
                        //console.log(e)
                    })
                }
            }
            return {
                emailRules,
                userRules,
                pwdRules,
                confirmpwdRules,
                onFormSubmit,
                formData
            }

        }
    })
</script>

<style scoped>

</style>
