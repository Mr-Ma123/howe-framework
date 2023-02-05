// author:Howe.Ma

import ResourceManager from "./resource-manager";
import { ResourcesReferenceManager } from "./resources-reference-manager";

export enum Pool_Name {
    /* 默认对象池--eg:红包 */
    DEFAULT_POOL = 'DEFAULT_POOL',
    /* 子弹对象池- */
    BULLET_POOL = 'BULLET_POOL',
    /* 鸟格子对象池 */
    BIRD_POOL = 'BIRD_POOL',
    /* 熊格子对象池-*/
    BEAR_POOL = 'BEAR_POOL',
    /* 狐狸格子对象池- */
    FOX_POOL = 'FOX_POOL',
    /* 猫头鹰格子对象池 */
    OWL_POOL = 'OWL_POOL',
}

//资源的引用,切换场景的时候就没了
/** 对象池管理器 省的老是各个地方new 方便管理对象池 */
export default class PoolManager {
    private static instance: PoolManager;

    private poolMap: Map<string | Pool_Name, cc.NodePool>;
    private poolMapPerfab: Map<string | Pool_Name, cc.Prefab>;
    private poolNodeFlag: string = '_poolFlag';

    private constructor() {
        this.poolMap = new Map();
        this.poolMapPerfab = new Map();
    }

    static getInstance(): PoolManager {
        if (!this.instance) {
            this.instance = new PoolManager();
        }
        return this.instance;
    }


    /**
     * 添加对象池到map中，内含初始化池子
     * @param poolname 对象池名称
     * @param perfabs  对象池预制体路径/预制体
     * @param poolSize? 对象池的大小
     * @param poolScript?  您可以传递一个组件类型或名称，用于处理节点回收和复用时的事件逻辑。
     * 该组件类型会调用 unuse/reuse方法。可以参考：https://blog.csdn.net/qq_45021180/article/details/104484744 加深理解
     */
    addPoolToMap(poolname: string | Pool_Name, perfabs: cc.Prefab | string, poolSize: number = 10, poolScript?: string | { prototype: cc.Component; }): MPromise<boolean> {
        return new MPromise((reslove, reject) => {
            let tempPool = new cc.NodePool(poolScript);
            if (typeof perfabs === 'string') {
                ResourceManager.getInstance().LoadResPerfab(perfabs).then(
                    (res) => {
                        for (let i = 0; i < poolSize; i++) {
                            let tNode = cc.instantiate(res);
                            tNode[PoolManager.instance.poolNodeFlag] = poolname + PoolManager.instance.poolNodeFlag;
                            //加入该池子中。
                            tempPool.put(cc.instantiate(res));
                        }
                        PoolManager.instance.poolMap.set(poolname, tempPool);
                        PoolManager.instance.poolMapPerfab.set(poolname, res);
                        reslove(true);
                    }
                )
                    .catch(err => { console.error(err); reject(false); });
            } else {
                for (let i = 0; i < poolSize; i++) {
                    //加入该池子中。
                    let tNode = cc.instantiate(perfabs);
                    tNode[PoolManager.instance.poolNodeFlag] = poolname + PoolManager.instance.poolNodeFlag;
                    tempPool.put(cc.instantiate(tNode));
                }
                PoolManager.instance.poolMap.set(poolname, tempPool);
                PoolManager.instance.poolMapPerfab.set(poolname, perfabs);
                reslove(true);
            }

        });


    }

    /**
     * 获取池子中的节点
     * @param poolname 
     */
    getNodeByMap(poolname: string | Pool_Name): cc.Node {
        //Map中有该节点对象池
        if (PoolManager.instance.poolMap.has(poolname)) {
            //池子里没了-生成新的
            if (PoolManager.instance.poolMap.get(poolname).size() <= 0) {
                let TPerfab: cc.Prefab = PoolManager.instance.poolMapPerfab.get(poolname);
                if (TPerfab) {
                    let tNode: cc.Node = cc.instantiate(TPerfab);
                    tNode.active = true;
                    tNode[PoolManager.instance.poolNodeFlag] = poolname + PoolManager.instance.poolNodeFlag;
                    PoolManager.instance.poolMap.get(poolname).put(tNode);
                    tNode = null;
                }
                else {
                    cc.error("map中未找到该预制体"); return null;
                }
            }
            return PoolManager.instance.poolMap.get(poolname).get();
        } else {
            cc.error("请先调用“addPoolToMap”进行初始化");
            return null;
        }
    }

    /**
     * 把节点放回池子里。
     * @param poolname 
     * @param node 
     */
    putNodeToMap(poolname: string | Pool_Name, node: cc.Node) {
        let isSameNode: boolean = node.hasOwnProperty(PoolManager.instance.poolNodeFlag) && node[PoolManager.instance.poolNodeFlag] == poolname + PoolManager.instance.poolNodeFlag;
        if (PoolManager.instance.poolMap.has(poolname) || isSameNode) {
            PoolManager.instance.poolMap.get(poolname).put(node);
            node.active = false;//获取后记得激活
        } else {
            cc.error("池子不存在或放入的节点错误");
        }
    }

    /**
     * 获取Map中的对象池
     * @param poolname 对象池名称
     * @returns 对象池
     */
    getPoolToMap(poolname: string | Pool_Name): cc.NodePool {
        if (PoolManager.instance.poolMap.has(poolname)) {
            return PoolManager.instance.poolMap.get(poolname);
        }
        return null;
    }

    /**
     * 获取Map中的 对象池的可用对象数量
     * @param poolname 对象池名称
     * @returns 对象池
     */
    getPoolSizeToMap(poolname: string | Pool_Name): number {
        if (PoolManager.instance.poolMap.has(poolname)) {
            return PoolManager.instance.poolMap.get(poolname).size();
        }
        return null;
    }

    /**
     * 清除map中的对象池
     * @param poolname 对象池名称
     */
    clearPoolToMap(poolname: string | Pool_Name) {
        if (PoolManager.instance.poolMap.has(poolname)) {
            PoolManager.instance.poolMap.get(poolname).clear();
            PoolManager.instance.poolMap.delete(poolname);
        }
    }

    /**
     * 清除map
     */
    clearPoolMap() {
        PoolManager.instance.poolMap.clear();
    }

}