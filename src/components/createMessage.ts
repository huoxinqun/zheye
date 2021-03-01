import { createApp } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

/**
 * 函数封装调用弹窗
 * @param Message 
 * @param type 
 * @param timeout 
 */
const createMessage = (message:String,type:MessageType,timeout = 2000 ) => {
    const messageInstance = createApp(Message,{
        message,
        type
    })
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    messageInstance.mount(mountNode)
    setTimeout(() => {
        messageInstance.unmount(mountNode)
        document.body.removeChild(mountNode)
    },timeout)
}

export default createMessage