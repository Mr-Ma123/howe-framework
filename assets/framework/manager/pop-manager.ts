// author:Howe.Ma

import Stack from "../utils/stack";
import ResourceManager from "./resource-manager";
import { ResourcesReferenceManager } from "./resources-reference-manager";

/** UI的类型 */
export enum UiType {
  /** 默认的 非全屏窗体类型 */
  DEFAULT_WINDOWS = 0,

  /** 全屏窗体类型 */
  FULL_WINDOWS = 0,

  /** 浮窗提示弹窗类型 */
  TIPS_WINDOWS = 0,

  /** 对话框类型--确认/取消 */
  DIALOG_WINDOWS = 0,

  /** */
  OTHER = 0,
}

/** UI的显示状态 */
export enum UiStatus {
  /** 默认未加载状态 */
  DEFAULT_STATUS = 0,
  /** 正在打开状态--展示动效 */
  OPENING_STATUS = 0,
  /** 已打开状态 */
  OPEN_STATUS = 0,
  /** 正在关闭状态--展示动效 */
  CLOSEING_STATUS = 0,
  /** 已关闭状态 */
  CLOSE_STATUS = 0,
}

/** UI的显示状态 */
export enum UiEffects {
  /** 默认果冻加载状态 */
  DEFAULT_STATUS = 0,
}

/** 预留预制体路径 */
export class PopResPath {
  //这里写具体的预制体路径
}


const { ccclass, property } = cc._decorator;

/** 弹窗UI管理器 */
@ccclass
export default class PopManager {
  private constructor() { }
  private static _instance: PopManager = null;
  public static getInstance(): PopManager {
    if (!this._instance) {
      this._instance = new PopManager();
      this._instance._init();
    }
    return this._instance;
  }

  private _stackName: Stack<string> = new Stack<string>();

  private _stackComponent: Stack<cc.Node> = new Stack<cc.Node>();

  shaderFather: cc.Node = null;

  _init() {
    this.shaderFather = cc.find("Canvas");
  }

  /**
   * 生成预制体
   * @param refComponent 引用的组件
   * @param path 路径
   * @param path 是否是bundle，如果是bundle后面的参数必须传
   * @param bundleName  如果是bundle后面的参数必须传
   * @returns 异步node
   */
  async InsPerfabByRes(refComponent: cc.Component, path: string, isBundle?: boolean, bundleName?: string): MPromise<cc.Node> {
    return new Promise((resolve, reject) => {
      if (isBundle) {
        //加载bundle文件= 在加载bundle文件下资源
        ResourceManager.getInstance().LoadBundleAssets<cc.Prefab>(bundleName, path, cc.Prefab).then((res) => {
          if (res) {
            if (refComponent) { ResourcesReferenceManager.addRefByAssets(refComponent, res) };
            resolve(cc.instantiate(res));
          }
          else {
            reject(null);
          }
        })

      } else {
        ResourceManager.getInstance().LoadResPerfab(path).then((res) => {
          if (res) {
            if (refComponent) { ResourcesReferenceManager.addRefByAssets(refComponent, res) };
            resolve(cc.instantiate(res));
          }
          else {
            reject(null);
          }
        })

      }
    });
  }

  /**
   * 显示弹窗
   * @param refComponent 引用的组件
   * @param popName 弹窗路径
   * @param priority 优先级默认10 升序出 eg：0最先出
   * @returns 
   */
  async ShowPop(refComponent: cc.Component, popName: string, priority: number = 10, isBundle?: { isBundle: boolean, BundleName: string }): MPromise<cc.Node> {
    //打开uiMask
    //A.一级弹窗
    //B.多级弹窗--通过优先级处理 越低的越先出
    //B1.和上一级同时显示s
    //B2.上一级的隐藏显示
    return new MPromise(async (reslove, reject) => {
      this.openShade();
      let tNode: cc.Node = null;
      //空栈or栈顶不是要显示的
      if (this._stackName.sizePrioprity() == 0 || this._stackComponent.sizePrioprity() == 0) {
        if (isBundle) {
          tNode = await this.InsPerfabByRes(refComponent, popName, isBundle.isBundle, isBundle.BundleName);
        } else {
          tNode = await this.InsPerfabByRes(refComponent, popName);
        }
        if (!tNode) { reject(null); this.closeShade(); return; }
        tNode.scale = 0.5;
        tNode.active = true;
        this._stackName.pushPrioprity(popName, priority);
        this._stackComponent.pushPrioprity(tNode, priority)
        reslove(tNode);
      } else {
        // let _index = this._stackName.hasPriprity(popName)
        //  //栈里面有这个数据，尝试获取_stackComponent里的节点
        // if ( _index >= 0) {
        //   let tNode :cc.Node  = this._stackComponent.byIndexToFindEl(_index).el;
        //   reslove(tNode)
        // } else { 
        // }

        //TODO:具体情况在进行具体处理
        //eg:隐藏之前的栈顶
        //console.log(this._stackComponent.peekPrioprity());
        //this._stackComponent.peekPrioprity().active = false;

        //上面的应该是不会走的，因为在弹窗关闭的时候 都会弹栈。除非是用那个不清除栈的stack。根据具体需求进行修改即可。
        if (isBundle) {
          tNode = await this.InsPerfabByRes(refComponent, popName, isBundle.isBundle, isBundle.BundleName);
        } else {
          tNode = await this.InsPerfabByRes(refComponent, popName);
        }
        if (!tNode) { reject(null); this.closeShade(); return; }
        tNode.scale = 0.5;
        tNode.active = true;
        this._stackName.pushPrioprity(popName, priority);
        this._stackComponent.pushPrioprity(tNode, priority)
        reslove(tNode);
      }
      if (tNode) {
        this.openEffect(UiEffects.DEFAULT_STATUS, tNode);
      } else {
        this.closeShade();
      }
    })

  }

  /** 隐藏当前栈顶的弹窗--并不会弹栈--一般用在多级弹窗时 */
  HidePop() {
    if (this._stackComponent.sizePrioprity() > 0) {
      this._stackComponent.peekPrioprity().active = false;
    }
  }

  /**
   * 关闭弹窗 
   * @param des 是否删除
   */
  ClosePop(des: boolean, isMoreLayer: boolean = true) {
    if (true) {//一层弹窗
      let tNode: cc.Node = this._stackComponent.peekPrioprity();
      if (des) {
        //减少引用计数在具体的component中
        tNode.destroy();
      } else {
        this._stackComponent.peekPrioprity().active = false;
      }

      this._stackName.popPrioprity();
      this._stackComponent.popPrioprity();
    } else { //多级弹窗

    }

    //如果栈中还有数据，显示栈中下一个
    if (this._stackComponent.isEmptyPrioprity()) {
      return null;
    }
    else {
      this._stackName.popPrioprity();
      this._stackComponent.popPrioprity().active = true;
    }

  }

  /** 获取当前显示的UI  */
  GetCurrentPop(): cc.Node {
    return this._stackComponent.peekPrioprity();
  }

  //打开弹窗时的效果
  openEffect(effect: UiEffects, node: cc.Node) {
    if (effect == UiEffects.DEFAULT_STATUS) {
      //果冻 由屏幕中间 从缩放0.1 到 1.2 再到 0.9 再到1.1 再到1 ; 0.5s内完成
      cc.tween(node).to(0.3, { scale: 1.2 }).to(0.2, { scale: 1 }).call(() => {
        this.closeShade();
      }).start();
    }
  }

  //关闭弹窗时的效果
  closeEffect(effect: UiEffects, node: cc.Node) {
    if (effect == UiEffects.DEFAULT_STATUS) {
      //果冻
      cc.tween(node).to(0.15, { scale: 1.2 }).to(0.35, { scale: 0 }).call(() => {
        this.closeShade();
      }).start();
    }
  }

  //打开uiMask 遮罩
  openShade() {
    if (this.shaderFather.getChildByName('uiMask')) {
      this.shaderFather.getChildByName('uiMask').active = true;
    } else {
      let tNode = new cc.Node('uiMask');
      tNode.addComponent(cc.BlockInputEvents);
      tNode.width = 1080;
      tNode.height = 1920;
      this.shaderFather.addChild(tNode, cc.macro.MAX_ZINDEX)
      this.shaderFather.getChildByName('uiMask').active = true;
    }
  }

  //关闭uiMask
  closeShade() {
    if (this.shaderFather.getChildByName('uiMask')) {
      this.shaderFather.getChildByName('uiMask').active = false;
    } else {
      this.shaderFather.getChildByName('uiMask').active = false;
    }
  }


}
