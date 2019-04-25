// 定义一个类，用于创建Vue实例
class Vue {
    constructor (options = {}) {
        // 给Vue实例增加属性
        this.$el = options.el
        this.$data = options.data

        // 如果指定了el的参数，对el进行解析
        if (this.$el) {
            // compile 负责解析模板跟数据
            // 传入模板和数据
            new Compile(this.$el, this)
        }
    }
}