import { Event_Name } from "./event-manager";
import GameConfig from "./game-config";


export default class NativeManager {

    //#region 调用原生

    /** GP登录 */
    static GpLoginBtn() {
        //调用Android
        if (CC_JSB) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // 反射调用原生的隐藏方法
                jsb.reflection.callStaticMethod(
                    GameConfig.GoogleSign,
                    "logIn",
                    "()V"
                );
            }
        }
        else {
            return null;
        }
    }

    //gp登出
    static GpLoginOutBtn() {
        //调用Android
        if (CC_JSB) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // 反射调用原生的隐藏方法
                jsb.reflection.callStaticMethod(
                    GameConfig.GoogleSign,
                    "logOut",
                    "()V"
                );
            }
        }
        else {
            return null;
        }
    }

    //静默登录-gp登录
    static GpQuietLoginBtn() {
        //调用Android
        if (CC_JSB) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // 反射调用原生的隐藏方法
                jsb.reflection.callStaticMethod(
                    GameConfig.GoogleSign,
                    "silentSignIn",
                    "()V"
                );
            }
        }
        else {
            return null;
        }
    }


    //解绑gp账号
    static GpRevokeAccessBtn() {
        //调用Android
        if (CC_JSB) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // 反射调用原生的隐藏方法
                jsb.reflection.callStaticMethod(
                    GameConfig.GoogleSign,
                    "revokeAccess",
                    "()V"
                );
            }
        }
        else {
            return null;
        }
    }


    //#endregion


    //#region 原生回调
    //是否显示gp按钮
    static isShowGpBtn(info: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let tInfo = info.split("--");
            if (tInfo[0] == 'null' && tInfo[1] == 'null' && tInfo[2] == 'null') {
                cc.game.emit(Event_Name.GPLoginCallBack_showBtn);
            } else {
                //点击登录按钮登录成功后-隐藏按钮-切换场景
                //静默登录会自动走这里
                let temp = {
                    pName: tInfo[0],
                    pEmail: tInfo[1],
                    idToken: tInfo[2],
                }
                cc.game.emit(Event_Name.GPLoginCallBack, temp);
            }
        }
    }

    //是否登出成功
    static isOutGpBtn(info: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (info == 'isOk') {
                cc.sys.localStorage.removeItem(GameConfig.isGpLoginOver);
                cc.director.loadScene("要跳转的场景名称");
            } else {
                console.log("mmmmmm-登出失败");
            }
        }
    }

    //解除GP帐号与本游戏应用的关联--TODO:需要删除用户数据
    static revokeAccess(info: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (info == 'isOk') {
                cc.sys.localStorage.removeItem(GameConfig.isGpLoginOver);
                cc.director.loadScene("要跳转的场景名称");
            } else {
                console.error("mmmmmm-解绑失败");
            }
        }
    }
    //#endregion

}

cc['NativeManager'] = NativeManager;