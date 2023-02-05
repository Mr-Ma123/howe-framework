// author:Howe.Ma

import EventManager, { Event_Name } from "./event-manager";
import ResourceManager from "./resource-manager";
import { ResourcesReferenceManager } from "./resources-reference-manager";

const { ccclass, property } = cc._decorator;

/** 场景切换管理 */
@ccclass
export default class SceneManager {
    private constructor() {
    }
    private static _instance: SceneManager = null;
    public static getInstance(): SceneManager {
        if (!this._instance) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }

    preloadScene(sceneName: string, callback: (per: number) => void) {
        cc.director.preloadScene(sceneName, (completedCount, totalnumber, item) => {
            callback( Math.round(completedCount / totalnumber * 100));
        }, (err) => { cc.log(err) });
    }

    loadScene(sceneName: string) {
        //添加跳转场景效果 
        if(EventManager.getInstance().has(Event_Name.CHANGE_SCENE_EFFER)){
            EventManager.getInstance().fireEvent(Event_Name.CHANGE_SCENE_EFFER,sceneName);
        }
        else{
            cc.director.loadScene(sceneName);
        }
    }

    /**
     * 预加载bundle内的场景。
     * @param bundleName 
     * @param sceneName 
     */
    preloadBundleScene(bundleName: string, sceneName: string) {
        ResourceManager.getInstance().LoadBundle(bundleName).then(res => {
            res.preloadScene(sceneName, (err, res) => {
                if (err) { cc.log(err); return; }
            })
        })
    }

    /**
     * 加载bundle内的场景。并打开
     * @param bundleName 
     * @param sceneName 
     */
    loadBundleScene(bundleName: string, sceneName: string) {
        ResourceManager.getInstance().LoadBundle(bundleName).then(res => {
            res.loadScene(sceneName, (err, res) => {
                if (err) { cc.log(err); return; }
                if(EventManager.getInstance().has(Event_Name.CHANGE_SCENE_EFFER)){
                    EventManager.getInstance().fireEvent(Event_Name.CHANGE_SCENE_EFFER,sceneName);
                }
                else{
                    cc.director.runScene(res);
                }
                //场景内没必要加--勾选自动释放即可
            })
        })
    }


}