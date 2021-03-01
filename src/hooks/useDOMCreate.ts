import { onUnmounted } from 'vue'

/**
 * 创建弹窗框DOM节点
 * @param nodeId 
 */
function useDOMCreate(nodeId: string) {
  // teleport 挂载最外层nodeId  
  // 渲染组件前创建nodeId div
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    // 渲染完成后删除自身元素
    document.body.removeChild(node)
  })
}

export default useDOMCreate