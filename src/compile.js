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
            this.compile(fragment);
            // 3、吧 fragment 一次性的添加到页面
            this.el.appendChild(fragment)
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
    /**
     * 编译文档碎片
     * @param {*} fragment
     */
    compile (fragment) {
        let childNodes = fragment.childNodes;
        this.toArray(childNodes).forEach(node => {
            // 编译子节点
           
            if (this.isElementNode(node)) {
                // 如果是元素，需要解析指令
                this.compileElement(node)
            }
            if (this.isTextNode(node)) {
                // 如果是文本节点，需要解析插值表达式
                this.compileText(node)
            }

            // 如果当前节点还有子节点，我们需要使用递归解析
            if (node.childNodes && node.childNodes > 0) {
                this.compile(node)
            }
        })
    }

    // 解析html标签
    compileElement (node) {
        // 1. 获取当前节点下所有的属性
        let attributes = node.attributes;
        this.toArray(attributes).forEach(attr => {
            // 2. 解析vue的指令（所有以v-开头的属性）
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                let expr = attr.value;
                let type = attrName.slice(2)

                // 如果是v-on指令
                if (this.isEventDirective(type)) {
                    CompileUtil['eventHandler'](node, this.vm, type, expr);
                } else {
                    CompileUtil[type] && CompileUtil[type](node, this.vm, expr);
                }
            }
        })
    }

    // 解析文本节点
    compileText (node) {

    }

    // 工具方法
    toArray (likeArray) {
        // 返回一个新数组
        return [].slice.call(likeArray);
    }
    isElementNode (node) {
        return node.nodeType === 1
    }
    isTextNode (node) {
        return node.nodeType === 3
    }
    isDirective (attrName) {
        return attrName.startsWith('v-')
    }
    isEventDirective (attrName) {
        return attrName.split(':')[0] === 'on'
    }
}

let CompileUtil = {
    // 处理text指令
    text (node, vm, expr) {
        node.textContent = vm.$data[expr]
    },
    // 处理html指令
    html (node, vm, expr) {
        node.innerHTML = vm.$data[expr]    
    },
    // 处理modal指令
    modal (node, vm, expr) {
        node.value = vm.$data[expr]
    },
    eventHandler (node, vm, type, expr) {
        let eventType = type.split(':')[1];
        let fn = vm.$methods && vm.$methods[expr];
        if (eventType && fn) {
            // bind() 绑定this
            node.addEventListener(eventType, vm.$methods[expr].bind(vm))
        }
    }
}