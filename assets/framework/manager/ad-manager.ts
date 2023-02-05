import GameConfig from "./game-config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdManager extends cc.Component {
    private static instance: AdManager;
    static getInstance(): AdManager {
        if (!this.instance) {
            this.instance = new AdManager();
        }
        return this.instance;
    }
    
    showInsertAd(){
        if (CC_JSB) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // 反射调用原生的隐藏方法
                jsb.reflection.callStaticMethod(
                   GameConfig.AppActivity,
                    "Show_InsertAd",//安卓自定义
                    "()V"
                );
            }
        }
    }

    showRewardAd(){
        if (CC_JSB) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // 反射调用原生的隐藏方法
                jsb.reflection.callStaticMethod(
                    GameConfig.AppActivity,
                    "Show_RewardAd",//安卓自定义
                    "()V"
                );
            }
        }
    }

    //回调

}
