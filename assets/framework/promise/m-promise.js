/**
 * 可以取消的Promise 
 * 在cocos creator 设置为全局插件
 * 小游戏平台未测试
 * @author Lei.Zhang
 * @author Howe.Ma
 */
class MPromise extends Promise {
    constructor(executor) {
        let options = { cancellend: false };
        super((resolve, reject) => {
            executor(resolve, reject, options);
        });

        this.cancel = function () {
            options.cancellend = true;
            //查看方法被谁调用了==栈调用  https://zhuanlan.zhihu.com/p/520565433
            // console.log(new Error().stack.split("\n").map((item, index, arr) => {
            //     return item.trim().split(" ")[1]
            // }));

        }
    }
}