


const { ccclass, property } = cc._decorator;

export const LocalStorageKey = {
    /** 首次安装打开，删除再打开也算是首次打开-暂无该需求 */
    INSTALL_FLAG: "INSTALL_FLAG",
    /** 声音开关*/
    MUSIC_KEY: "_MUSIC_",
    /** 音效开关 */
    SOUND_KEY: "_SOUND_",
    /** 声音音量 */
    MUSIC_VOLUME_KEY: "_MUSIC_VOLUME_",
    /**当前时间戳*/
    TIME_STAMP: 'TIME_STAMP',

};

//便于存储一些不需要向服务器获取的本地配置--及后续若用中台系统使用可本地数据做部分业务逻辑
//1. 支持功能点如音频开关
//2. 增删改查功能
//3. 本地的加密 解密- TODO 暂时不用
//4. 获取所有存储的值
//5. 导出所有本地存储数据-json

/**
 * 本地数据管理器
 */
@ccclass
export default class LocalDataManager {

    private constructor() {
    }
    private static _instance: LocalDataManager = null;
    public static getInstance(): LocalDataManager {
        if (!this._instance) {
            this._instance = new LocalDataManager();
        }
        return this._instance;
    }
    _secretkey = 'hxly_deskcat_20230327'; // 加密密钥测试


    BG_MUSIC_SWITCH: boolean = true;
    EFFECT_SOUND_SWITCH:boolean = true;

    /**
     * 增加本地的存储数据
     * @param key key值
     * @param val 数据 支持保存字符串、数字、布尔值和对象.
     */
    addLocalData<T>(key: string, val: T) {
        // console.log('数据类型: ' + typeof val);
        //复杂数据转json 
        if (typeof val == 'object') {
            cc.sys.localStorage.setItem(key, JSON.stringify(val));
        } else {
            cc.sys.localStorage.setItem(key, val);
        }
    }

    /**
     * 删除指定的本地数据
     * @param key key值
     */
    desLocalData(key: string) {
        let desInfo: any = this.findLocalData(key);
        if (desInfo != null && desInfo != '') {
            cc.sys.localStorage.removeItem(key)
        } else {
            cc.warn(`未找到${key},删除失败`);
        }
    }

    /**
     * 改指定的本地数据
     * @param key key值
     * @param val 数据
     */
    changeLocalData<T>(key: string, val: T) {
        // let changeInfo: T = this.findLocalData(key);
        // if (changeInfo != null && changeInfo != '') {
        this.addLocalData(key, val)
        // } else {
        //     if (GameGlobalConfig.RUNTIME === RUNTIME.DEBUG) {
        //         cc.warn(`未找到${key},修改失败`);
        //     }
        // }
    }

    /**
     * 查指定的本地数据
     * @param key key值
     * @returns 转成对应的类型
     */
    findLocalData(key: string) {
        let findInfo: any = cc.sys.localStorage.getItem(key);
        if (findInfo != null && findInfo != '') {
            return findInfo;
        } else {
            cc.warn(`未找到${key},请检查是否有本地数据或key值是否正确`);
            return null;
        }
    }

    /** 删除所有本地数据 */
    clearAllLocalData() {
        cc.sys.localStorage.clear();
    }

    /** 获取所有本地数据 */
    getAllLocalData() {
        let localObj = {};
        for (let i = 0; i < cc.sys.localStorage.length; i++) {
            let key = cc.sys.localStorage.key(i);
            let value = cc.sys.localStorage.getItem(key);
            cc.log(`Key: ${key}, Value: ${value}`);
            localObj[key] = value;
        }
        return localObj;
    }


    //TODO: 暂定 加密
    encryptFun(info: any) {

    }

    //TODO: 暂定 解密
    decEncryptFun(info: any) {

    }

    //导出本地存储的数据成json-仅web
    exportLocalDataByJsonOrExcel() {
        // 引用方式
        LocalDataManager.creatJosnFile(JSON.stringify(this.getAllLocalData()), "test.json")
    }

    /**生成json文件 */
    public static creatJosnFile(data: any, fileName: string) {
        var content = JSON.stringify(data)
        this.saveForBrowser(content, fileName)
    }

    /**
     * 存字符串内容到文件。
     * @param textToWrite  - 要保存的文件内容
     * @param fileNameToSaveAs - 要保存的文件名
     */
    public static saveForBrowser(textToWrite, fileNameToSaveAs) {
        if (cc.sys.isBrowser) {
            console.log("浏览器");
            let textFileAsBlob = new Blob([textToWrite], { type: 'application/json' });
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null) {
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            downloadLink.click();
        }
    }

}
