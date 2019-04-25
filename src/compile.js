// 专门用于解析模板内容
class Compile {
    // 1、模板
    // 2、Vue实例
    constructor (el, vm) {
        // el：new Vue传递的选择器
        // vm：new的Vue实例
        this.el = typeof el === 'string' ? document.querySelector(el) : el
        this.vm = vm

        // 编译模板
        if (this.el) {
            // 1、把el中所有的子节点都放入内存中 fragment
            let fragment = this.node2fragment(this.el)
            // 2、在内存中编译 fragment
            // 3、吧 fragment 一次性的添加到页面
        }
    }

    // 核心方法
    node2fragment (node) {
        let fragment = document.createDocumentFragment()
        // 把el中所有的子节点挨个添加到文档碎片中
        const childNodes = node.childNodes
        this.toArray(childNodes).forEach(node => {
            // 吧所有的子节点添加到fragment中
            fragment.appendChild(node)
        })
        return fragment
    }

    // 工具方法
    toArray (likeArray) {
        // 返回一个新数组
        return [].slice.call(likeArray);
    }
}