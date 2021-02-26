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
                        v-model="emailVal">
                </validate-input>
                {{ emailVal }}
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input
                        type="password"
                        placeholder="请输入密码"
                        :rules="pwdRules"
                        v-model="pwdVal">
                    >
                </validate-input>
            </div>
            <template v-slot:submit>
                <div class="submit-area"><button type="submit" class="btn btn-primary btn-block ">登录</button></div>
            </template>
        </vlidate-form>

        <div class="form-text"><a href="/signup" class="">还没有账户？去注册一个新的吧！</a></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent,ref } from "vue";
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import VlidateForm from "../components/VliDataForm.vue";
    import ValidateInput,{ RulesProp } from '../components/ValiDateInput.vue'

    export default defineComponent({
        name: "login",
        components: {
            VlidateForm,
            ValidateInput
        },
        setup() {
            const emailVal = ref()
            const router = useRouter()
            const store = useStore()
            const emailRules: RulesProp = [
                { type: 'required', message: '电子邮箱地址不能为空' },
                { type: 'email', message: '请输入正确的电子邮箱格式' }
            ]
            const pwdVal = ref()
            const pwdRules = [
                { type: 'required', message: '密码不能为空' }
            ]
            const onFormSubmit = (result: boolean)=> {
                if(result){
                    const payload = {
                        email: emailVal.value,
                        password : pwdVal.value
                    }
                    store.dispatch('loginAndFetch',payload).then(data => {
                        console.log(data)
                        router.push('/')
                    })
                    
                }
            }
            return {
                emailVal,
                emailRules,
                pwdVal,
                pwdRules,
                onFormSubmit
            }
        }
    })
</script>

<style scoped>

</style>
