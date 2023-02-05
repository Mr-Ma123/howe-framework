// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 异步管理器Mpromise的使用例子
 */
export default class mSynsEg {

    //直接使用MPromise即可，新增功能 cancel功能(可在异步请求中，取消回调的数据处理)
    //Mpromise使用例子：
    EgOne() {
        let syncOne = new MPromise((resolve, reject, options) => {

            //进行一些加载资源的操作
            //...

            //判断是否是已修改状态
            if (options.cancellend) {
                return;//取消回调后的处理
            }

            // 进行一些条件判断
            if (!true) {
                reject('no');
            }
            else {
                resolve('yes');
            };

        });
        //用法
        syncOne.then( (res)=>{} ).catch( ()=>{ });
        //只要异步没完成cancel都有效
        syncOne.cancel();

        let syncTwo = MPromise.resolve('Error');
        //let syncTwo = MPromise.reject('Error');
        let syncThree = MPromise.resolve('Good');
        const res = MPromise.all([syncOne,syncTwo,syncThree]);
        const resFirst = MPromise.race([syncOne,syncTwo,syncThree]);
        console.log(res.catch((err)=>{console.log(err)}));
        console.log(resFirst.catch((err)=>{console.log(err)}));

        //一个promise指定多个成功/失败回调函数时,当promise改变未对应状态时都会调用
        let p1 = new Promise((resolve,reject)=>{
            resolve('OK')
          })
          p1.then(value => {
            console.log(value)
          })
          setTimeout(() => {
              p1.then(value => {
                //alert(value)
              })
          }, 1000);
          
    }

}
