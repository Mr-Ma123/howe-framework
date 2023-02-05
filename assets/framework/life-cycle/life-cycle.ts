import { ResourcesReferenceManager } from "../manager/resources-reference-manager";

const { ccclass, property } = cc._decorator;

/**
 * 脚本生命周期父类
 */
@ccclass
export default class BaseLifeCycle extends cc.Component {

    protected onLoad(): void {
        
    }
  
    protected onEnable(): void {
       
    }

    protected start(): void {
       
    }

    protected lateUpdate(dt: number): void {
        
    }

    protected onDisable(): void {
        
    }

    protected onDestroy(): void {
        ResourcesReferenceManager.decRefAllByComponent(this);
    }

}