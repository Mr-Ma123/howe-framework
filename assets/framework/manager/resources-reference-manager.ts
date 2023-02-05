
/**
 * 资源引用管理器--以component为主体
 * @auto Howe.Ma
 */
export abstract class ResourcesReferenceManager {
    private static resourecesRefCountMap: Map<cc.Component, Array<cc.Asset>> = new Map();

    //已每个组件为引用对象
    public static addRefByAssets(assetsKey: cc.Component, assetsValue: cc.Asset) {
        let assetArray = ResourcesReferenceManager.resourecesRefCountMap.get(assetsKey)
        if (!assetArray) {
            assetArray = new Array();
            ResourcesReferenceManager.resourecesRefCountMap.set(assetsKey, assetArray);
        } else {
            for (let index = 0; index < assetArray.length; index++) {
                if (assetArray[index] == assetsValue) {
                    // web-moble打印可能会崩溃
                    //cc.log('find', assetArray);
                    return;
                }
            }
        }
        assetsValue.addRef();
        assetArray.push(assetsValue)
        //cc.log(ResourcesReferenceManager.resourecesRefCountMap.get(assetsKey));
        //cc.log(ResourcesReferenceManager.resourecesRefCountMap);
    }


    /**
     * 以component为键，对asset引用计数-1
     * 同一个component只会-1一次，多次调用，不会再减少计数
     * @param component Key
     * @param asset 调用decRef()
     */
    public static decRefByComponent(assetsKey: cc.Component, assetsValue: cc.Asset) {
        let assetArray = ResourcesReferenceManager.resourecesRefCountMap.get(assetsKey)
        if (!assetArray) {
            //cc.log('node 已经释放');
            return;
        }
        for (let index = 0; index < assetArray.length; index++) {
            if (assetArray[index] == assetsValue) {
                assetArray[index].decRef();
                return
            }
        }
        //cc.log('node 未addRef 此资源', assetsValue);
    }

    /**
     * 对component绑定的所有asset引用计数-1 并将component移除map,
     * 多次调用，只会第一次有效
     * @param component Key
     */
    public static decRefAllByComponent(assetsKey: cc.Component) {
        let assetArray = ResourcesReferenceManager.resourecesRefCountMap.get(assetsKey)
        if (!assetArray) {
            //cc.log('资源已经释放或不存在');
            return;
        }
        for (let index = 0; index < assetArray.length; index++) {
            assetArray[index].decRef();
            cc.log("自己的计数： " + assetArray[index]?.refCount);
        }
        ResourcesReferenceManager.resourecesRefCountMap.delete(assetsKey);
    }


}




// /**
//  * @auto zhanglei
//  */

// export abstract class AssetReleaseManager {
//     private static resourecesRefCount: Map<cc.Asset, Array<cc.Asset>> = new Map();

//     public static addRefByAssetsImg(assetsKey: cc.Asset, assetsValue: cc.Asset) {
//         let assetArray = AssetReleaseManager.resourecesRefCount.get(assetsKey)
//         if (!assetArray) {
//             assetArray = new Array();
//             AssetReleaseManager.resourecesRefCount.set(assetsKey, assetArray);
//         } else {
//             for (let index = 0; index < assetArray.length; index++) {
//                 if (assetArray[index] == assetsValue) {
//                     // web-moble打印会崩溃
//                     cc.log('find', assetArray);
//                     break;
//                 }
//             }
//         }
//         assetsValue.addRef();
//         assetArray.push(assetsValue)
//         cc.log(AssetReleaseManager.resourecesRefCount.get(assetsKey));
//         cc.log(AssetReleaseManager.resourecesRefCount);
//     }


//     /**
//      * 对component绑定的所有asset引用计数-1 并将component移除map,
//      * 多次调用，只会第一次有效
//      * @param component Key
//      */
//      public static decRefAllByImg(assetsKey: cc.Asset) {
//         let assetArray = AssetReleaseManager.resourecesRefCount.get(assetsKey)
//         if (!assetArray) {
//             cc.log('资源已经释放');
//             return;
//         }
//         for (let index = 0; index < assetArray.length; index++) {
//             assetArray[index].decRef();
//             cc.log("自己的计数： " + assetArray[index]?.refCount);
//         }
//         AssetReleaseManager.resourecesRefCount.delete(assetsKey);
//     }


//     //单一弹窗预制体的

//     public static addRefByAssets(assetsKey: cc.Asset, assetsValue: cc.Asset) {
//         let assetArray = AssetReleaseManager.resourecesRefCount.get(assetsKey)
//         if (!assetArray) {
//             assetArray = new Array();
//             AssetReleaseManager.resourecesRefCount.set(assetsKey, assetArray);
//         } else {
//             for (let index = 0; index < assetArray.length; index++) {
//                 if (assetArray[index] == assetsValue) {
//                     // web-moble打印会崩溃
//                     // cc.log('find', assetArray);
//                     return;
//                 }
//             }
//         }
//         assetsValue.addRef();
//         assetArray.push(assetsValue)
//         cc.log(AssetReleaseManager.resourecesRefCount.get(assetsKey));
//         cc.log(AssetReleaseManager.resourecesRefCount);
//     }


//     /**
//      * 以component为键，对asset引用计数-1
//      * 同一个component只会-1一次，多次调用，不会再减少计数
//      * @param component Key
//      * @param asset 调用decRef()
//      */
//     public static decRefByComponent(assetsKey: cc.Asset, assetsValue: cc.Asset) {
//         let assetArray = AssetReleaseManager.resourecesRefCount.get(assetsKey)
//         if (!assetArray) {
//             //cc.log('node 已经释放');
//             return;
//         }
//         for (let index = 0; index < assetArray.length; index++) {
//             if (assetArray[index] == assetsValue) {
//                 assetArray[index].decRef();
//                 return
//             }
//         }
//         cc.log('node 未addRef 此资源', assetsValue);
//     }

//     /**
//      * 对component绑定的所有asset引用计数-1 并将component移除map,
//      * 多次调用，只会第一次有效
//      * @param component Key
//      */
//     public static decRefAllByComponent(assetsKey: cc.Asset) {
//         let assetArray = AssetReleaseManager.resourecesRefCount.get(assetsKey)
//         if (!assetArray) {
//             cc.log('资源已经释放');
//             return;
//         }
//         for (let index = 0; index < assetArray.length; index++) {
//             assetArray[index].decRef();
//             cc.log("自己的计数： " + assetArray[index]?.refCount);
//         }
//         AssetReleaseManager.resourecesRefCount.delete(assetsKey);
//     }


// }