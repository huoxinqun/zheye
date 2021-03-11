<template>
    <div class="file-upload">
        <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
            <slot v-if="fileStatus === 'loading'" name="loading">
                <button class="btn btn-primary" disabled>正在上传...</button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>
        <input 
            type="file" 
            class="file-input d-none"
            ref="fileInput"
            @change.prevent="handleFileChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref,PropType  } from 'vue'
import axios from 'axios'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
//用户自定义函数事件，传值文件，返回boolean
type CheckFunction = (file: File) => boolean;

export default defineComponent({
    props: {
      action: {
        type: String,
        required: true
      },
      beforeUpload: {
        type: Function as PropType<CheckFunction>
      },
      uploaded: {
        type: Object
      }
    },
    inheritAttrs: false,
    emits: ['file-uploaded', 'file-uploaded-error'],
    setup(props,context){
        const fileInput= ref<null | HTMLInputElement>(null)
        //把成功后data返回slot-图片回显
        const uploadedData = ref(props.uploaded)  
        const fileStatus = ref<UploadStatus>('ready')
    
        const triggerUpload = () => {
            if(fileInput.value){
                fileInput.value.click()
            }
        }
        const handleFileChange = (e: Event) => {
            const currentTarget = e.target as HTMLInputElement
            if (currentTarget.files) { 
                //转换array
                const files = Array.from(currentTarget.files)
                //判断是否满足用户自定义属性
                if (props.beforeUpload) {
                    const result = props.beforeUpload(files[0])
                    console.log(result)
                    if (!result) {
                        return
                    }
                }
                fileStatus.value = 'loading'
                const uploadedFile = files[0]
                const formData = new FormData()
                formData.append('file', uploadedFile)
                // console.log('getFile', formData.get('file'));
                axios.post(props.action, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                }).then((resp: any) => {
                    fileStatus.value = 'success' 
                    uploadedData.value =  resp.data;
                    context.emit('file-uploaded', resp.data)
                }).catch((error) => {
                    fileStatus.value = 'error' 
                    context.emit('file-uploaded-error', { error })
                }).finally(() => {
                    //fileInput.value是DOM节点
                    if (fileInput.value) {
                        fileInput.value.value = ''
                    }
                })
            }
        }
        return{
            fileInput,
            triggerUpload,
            handleFileChange,
            fileStatus,
            uploadedData
        }
    }
})
</script>

<style scoped>
    .file-upload{
        border: 1px solid #ccc;
        min-height:150px;
    }    
</style>