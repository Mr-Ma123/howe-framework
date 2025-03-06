// author:Howe.Ma
export type MyEventHandler = (...params: any) => void;

class MyEventListeners {
    public handlers: MyEventHandler[];
    public targets: any[];
    public isInvoking: boolean; //是否有调用的-监听者
    private containCancled: boolean; //包含取消

    constructor() { //如果构造中有参数，则在声明变量时加上 declare
        this.handlers = [];
        this.targets = [];
        this.isInvoking = false;
        this.containCancled = false;
    }

    add(handler: MyEventHandler, target: any) {
        this.handlers.push(handler);
        this.targets.push(target);
    }

    remove(index: number) {
        this.handlers.splice(index, 1);
        this.targets.splice(index, 1);
    }

    removeByTarget(target: any) {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = targets.length - 1; i >= 0; i--) {
            if (targets[i] === target) {
                targets.splice(i, 1);
                handlers.splice(i, 1);
            }
        }
    }

    removeByHandler(handler: MyEventHandler) {
        //加深理解：https://www.zhihu.com/question/453889983/answer/2100978041
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i] === handler) {
                handlers.splice(i, 1);
                targets.splice(i, 1);
            }
        }

    }

    removeByHandlerTarget(handler: MyEventHandler, target: any) {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i] === handler && targets[i] === target) {
                handlers.splice(i, 1);
                targets.splice(i, 1);
            }
        }
    }

    removeAll() {
        this.handlers.length = 0;
        this.targets.length = 0;
    }


    cancel(index: number) {
        this.handlers[index] = null;
        this.targets[index] = null;
        this.containCancled = true;
    }

    cancelByTarget(target: any) {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = targets.length - 1; i >= 0; i--) {
            if (targets[i] === target) {
                targets[i] = null;
                handlers[i] = null;
            }
        }
        this.containCancled = true;
    }

    cancelByHandler(handler: MyEventHandler) {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i] === handler) {
                targets[i] = null;
                handlers[i] = null;
            }
        }
        this.containCancled = true;
    }

    cancelByHandlerTarget(handler: MyEventHandler, target: any) {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i] === handler && targets[i] === target) {
                targets[i] = null;
                handlers[i] = null;
            }
        }
        this.containCancled = true;
    }

    cancelAll() {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
            handlers[i] = null;
            targets[i] = null;
        }
        this.containCancled = true;
    }

    /**
     * 检查事件目标对象 是否存在在的事件注册的回调中。
     * @param handler 
     * @param target 
     */
    has(handler: MyEventHandler, target: any) {
        const targets = this.targets;
        const handlers = this.handlers;
        for (let i = handlers.length; i >= 0; i--) {
            if (handlers[i] == handler && targets[i] === target) {
                return true;
            }
        }
        return false;
    }

    /**  清理取消--状态重置 */
    purgeCanceled() {
        if (this.containCancled) {
            this.removeByHandler(null);//清楚this.target /handlers 里的值
            this.containCancled = false
        }

    }

    /** 查看handles是否是空的 */
    isEmpty() {
        return this.handlers.length === 0;
    }

}

/** 事件名称在这里注册 */
export enum Event_Name {
    /* 游戏开始 */
    GAME_START = 'GAME_START',
    /* 游戏暂停 */
    GAME_PAUSE = 'GAME_PAUSE',
    /* 弹窗显示 */
    POP_SHOW = 'POP_SHOW',
    /* 弹窗隐藏 */
    POP_HIDE = 'POP_HIDE',
    /* 语言切换 */
    LANGUAGE_CHANGE = 'LANGUAGE_CHANGE',
    /* 远程资源更新 */
    REMOTE_ASSETS_UPDATED = 'REMOTE_ASSETS_UPDATED',
    /* 配置更新 */
    CONFIG_UPDATE = 'CONFIG_UPDATE',
    /* 切换场景效果 */
    CHANGE_SCENE_EFFER = 'CHANGE_SCENE_EFFER',
    /* 按钮倒计时效果 */
    CUTDOWN_BTN_EFFER = 'CUTDOWN_BTN_EFFER',
    /* GP登录回调数据 */
    GPLoginCallBack = 'GPLoginCallBack',
    /* GP登录回调是否显示按钮 */
    GPLoginCallBack_showBtn = 'GPLoginCallBack_showBtn',

}




//尝试编写不基于引擎的事件系统 
//参考：https://github.com/caochao/cocos_creator_proj_base/blob/master/event/event_mgr.ts#L72

export default class EventManager {
    private static instance: EventManager;
    private eventMap: Map<Event_Name | string, MyEventListeners>;
    private eventWaitMap: Map<Event_Name | string, MyEventListeners>;

    private constructor() {
        this.eventMap = new Map();
        this.eventWaitMap = new Map();
    }

    static getInstance(): EventManager {
        if (!this.instance) {
            this.instance = new EventManager();
        }
        return this.instance;
    }

    /**
     * 启动事件
     * @param event  事件名称
     * @param params 参数
     */
    fireEvent(event: Event_Name | string, ...params) {
        const listeners = this.eventMap.get(event);
        if (!listeners || listeners.isEmpty()) {
            return;
        }
        //事件处理函数中可能会删除事件，导致循环出错
        listeners.isInvoking = true;
        const handlers = listeners.handlers;
        const targets = listeners.targets;

        for (let i = 0, len = handlers.length; i < len; i++) {
            const handler = handlers[i];
            const target = targets[i];
            if (!handler) continue;

            //如果target是cc.Component,则在节点有效时才调用
            if (target && (<cc.Component>target).node) { //这种写法就是 target.node
                const node = (target as cc.Component).node;
                if (cc.isValid(node)) {
                    handler.call(target, ...params);
                }
                else {
                    listeners.cancelByTarget(target);
                }
            }
            else {
                handler.call(target, ...params); //监听未绑定的使用用这个
            }
        }

        //循环结束后在删除
        listeners.isInvoking = false;
        listeners.purgeCanceled();
    }
    /**
     * 允许事件先发射后监听，监听时直接触发事件，todo 加入发射时的参数
     */
    fireWaitAddEvent(event: Event_Name | string) {
        if (!this.eventMap.get(event) || this.eventMap.get(event).isEmpty()) {
            let listener;
            if (!this.eventWaitMap.get(event)) {
                listener = new MyEventListeners();
                this.eventWaitMap.set(event, listener);
            }
            // 修复快速切换rua猫场景出现的崩溃问题
            if (this.eventWaitMap.get(event) && listener != null) {
                this.eventWaitMap.get(event).add(listener.handler, listener.target);
            }
        } else {
            let listener;
            if (!this.eventWaitMap.get(event)) {
                listener = new MyEventListeners();
                this.eventWaitMap.set(event, listener);
            }
            // 修复快速切换rua猫场景出现的崩溃问题
            if (this.eventWaitMap.get(event) && listener != null) {
                this.eventWaitMap.get(event).add(listener.handler, listener.target);
            }
        }
    }

    has(event: Event_Name | string, handler: MyEventHandler = null, target: any = null) {
        let listeners = this.eventMap.get(event);
        if (!listeners) {
            return false;
        }
        if (handler) {
            return listeners.has(handler, target);
        }
        //第二次检查event是否有监听者--为了多个注册监听的 保险
        if (listeners.isInvoking) {
            const handlers = listeners.handlers;
            for (let i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i]) return true;
            }
            return false;
        } else {
            return !listeners.isEmpty();//
        }
    }

    add(event: Event_Name | string, handler: MyEventHandler, target: any = null) {
        let listeners = this.eventMap.get(event);
        if (!listeners) {
            listeners = new MyEventListeners();
            this.eventMap.set(event, listeners);
        }
        listeners.add(handler, target);
        // 等待监听事件map中有该事件，说明之前发射过了，可以直接触发了。触发结束后直接删除（一次性）。
        if (this.eventWaitMap.get(event)) {
            this.eventWaitMap.get(event).handlers.push(handler);
            let handlers = this.eventWaitMap.get(event).handlers;
            for (let i = handlers.length; i > 0; i--) {
                const handler = handlers[i];
                if (!handler) continue;
                //如果target是cc.Component,则在节点有效时才调用
                if (target && (<cc.Component>target).node) { //这种写法就是 target.node
                    const node = (target as cc.Component).node;
                    if (cc.isValid(node)) {
                        handler.call(target);
                        this.eventWaitMap.delete(event);
                    }
                    else {
                        listeners.cancelByTarget(target);
                    }
                }
                else {
                    this.eventWaitMap.delete(event);
                    handler.call(target); //监听未绑定的使用用这个
                }
            }
        }

    }

    remove(event: Event_Name | string, handler: MyEventHandler, target: any = null) {
        const listeners = this.eventMap.get(event);
        if (!listeners || listeners.isEmpty()) {
            return;
        }

        if (target) {
            if (listeners.isInvoking) {
                listeners.cancelByHandlerTarget(handler, target);
            }
            else {
                listeners.removeByHandlerTarget(handler, target);
            }
        }
        else {
            if (listeners.isInvoking) {
                listeners.cancelByHandler(handler);
            }
            else {
                listeners.removeByHandler(handler);
            }
        }
    }

    removeByTarget(target: any) {
        this.eventMap.forEach((listeners, event?) => {
            if (listeners.isEmpty()) {
                return;
            }
            if (listeners.isInvoking) {
                listeners.cancelByTarget(target);
            }
        });
    }

    removeByEvent(event: Event_Name | string) {
        const listeners = this.eventMap.get(event);
        if (!listeners || listeners.isEmpty()) {
            return;
        }
        if (listeners.isInvoking) {
            listeners.cancelAll();
        }
        else {
            listeners.removeAll();
        }
    }

    once(event: Event_Name | string, handler: MyEventHandler, target: any = null) {
        let wrapperCb: MyEventHandler;
        wrapperCb = (...params) => {
            this.remove(event, wrapperCb, target);
            handler.call(target, ...params);
        }
        this.add(event, wrapperCb, target);
    }

}
