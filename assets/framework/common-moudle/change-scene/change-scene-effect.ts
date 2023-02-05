// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventManager, { Event_Name } from "../manager/event-manager";

const { ccclass, property } = cc._decorator;

/** 将该脚本挂载在第一个场景中 &  Canvas 同级即可。 切换场景效果 */
@ccclass
export default class ChangeSceneEffect extends cc.Component {

    @property(cc.Animation)
    animation: cc.Animation = null;

    _sceneName: string = '';
    onLoad() {
        //监听切换场景事件
        EventManager.getInstance().add(Event_Name.CHANGE_SCENE_EFFER, this.showeChangeSceneEffet, this);
        cc.game.addPersistRootNode(this.node);
        this.node.opacity = 0;
        // this.animation.on('finished',()=>{
        //     this.node.runAction( cc.fadeOut(0.5)); 
        // },this)

    }

    showeChangeSceneEffet(sceneName: string) {
        this.node.opacity = 255;
        this.animation.play();
        this._sceneName = sceneName;
        cc.director.preloadScene(this._sceneName);
    }

    ani_loadscene() {
        cc.director.loadScene(this._sceneName);
    }
    //监听幕布over，或者监听finished都行
    mubaOver() {
        this.node.runAction(cc.fadeOut(0.5));
    }
}
