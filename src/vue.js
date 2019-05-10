// 定义一个类，用于创建Vue实例
class Vue {
    constructor (options = {}) {
        // 给Vue实例增加属性
        this.$el = options.el
        this.$data = options.data
        this.$methods = options.methods

        // 监视data中的数据
        new Observer(this.$data);
        // 把data中所有的数据代理到vm上
        this.proxy(this.$data)
        // 吧methods中所有的数据代理到vm上
        this.proxy(this.$methods)
        // 如果指定了el的参数，对el进行解析
        if (this.$el) {
            // compile 负责解析模板跟数据
            // 传入模板和数据
            new Compile(this.$el, this)
        }
    }

    proxy (data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get () {
                    return data[key]
                },
                set (newValue) {
                    if (data[key] === newValue) {
                        return 
                    }
                    data[key] = newValue
                }
            })
        })
    }
}