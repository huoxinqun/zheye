<template>
    <div class="file-upload">
        <div class="file-upload-container" @click.prevent="triggerUpload" >
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
    setup(props,context){
        const fileInput= ref<null | HTMLInputElement>(null)
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
                const files = Array.from(currentTarget.files)
                if (props.beforeUpload) {
                    const result = props.beforeUpload(files[0])
                    if (!result) {
                        return
                    }
                }
                fileStatus.value = 'loading'
                const uploadedFile = files[0]
                const formData = new FormData()
                formData.append('file', uploadedFile)
                // console.log('getFile', formData.get('file'));
                axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                }).then((resp: any) => {
                    console.log(resp.data)
                    fileStatus.value = 'success' 
                    uploadedData.value =  resp.data;
                    context.emit('file-uploaded-success', resp.data)
                }).catch((error) => {
                    fileStatus.value = 'error' 
                    context.emit('file-uploaded-error', { error })
                }).finally(() => {
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