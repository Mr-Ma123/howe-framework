// author:Howe.Ma

/** IAnimators 是动画相关的接口封装的地方 */
/**
 * 远程spine数据结构-json格式
 */
export interface IRemoteSpine {
    /** 图片url */
    imageUrl: string,
    /** 图集url */
    atlasUrl: string,
    /** json url */
    skeletonUrl: string,
}

/**
 *  策划配置的动画组属性数据
 *  动作列表规则：
 *  分组交替随机动作行为（0，1）为一组，进行随机次数（策划配置）随机动作名称
 *  每个动作名称持续时间为随机时间（策划配置）
 */
export interface ISPineAnimatonGroup {
    id?: number,
    /** 动作分组： 0-位移(行动) 1-待机动作 */
    actionGroup: number,
    /** 动作行为  0-行走 1 -奔跑 2-休息 3-睡觉 4-喂养:用户行为  */
    actionBehavior?: number,
    /** 动作名称的-两次间隔（位移到待机的间隔次数）的随机次数 单位次 */
    actionRandomCount?: number,
    /** 动作名称 */
    actionName: string,
    /** 动作持续时间 单位秒 -1 为无限 */
    actionDuration: number,
}

/**
 * 这里用到的spine动画信息
 */
export interface ISPineAnimatonInfo extends ISPineAnimatonGroup {
    /**插槽名称 */
    resName?: string
}


const { ccclass, property } = cc._decorator;

/**
 * 资源管理器
 *  1. 动态加载 的资源必须手动 增加或减少引用计数 ，加载卸载，卸载方式
    ① 通过引用计数：addRef 和 decRef
    ② 直接释放：releaseAsset
    ③ 使用ResRefManager 添加和移除
    
 *  2. 场景勾选自动释放
 */
@ccclass
export default class ResManager {

    private static _instance: ResManager = null;

    private constructor() { }

    public static getInstance(): ResManager {
        if (!this._instance) {
            this._instance = new ResManager();
        }
        return this._instance;
    }

    //需要加载bundle, 本地及远程
    //需要加载图片, 本地及远程
    //需要加载图集, 本地 
    //需要加载文本，本地及远程
    //需要加载spine, 本地及远程
    //需要加载音频, 本地及远程
    //需要加载预制体，本地
    //需要加载AnimationClip，本地

    //需要处理远程下载缓存问题
    // 启动时获取游戏版本号，及是否需要强更
    // 如果版本号和本地的不同，则可以进行更新操作--删除bundle缓存
    // 因为项目目前看起来不大 可以放到一个bundle里，如果太大 后续要拆分更新

    //需要处理引用计数问题
    //本项目以bundle内资源为主，
    //静态资源的不用去太在意，动态引用的引用计数一般会使用在预制体中，去继承basePop,在里面进行 addRef和decRef
    //预制体会引用资源


    /**
     * 对于静态引用资源，开发者什么都不用操心，引擎自动做了所有事情；
        对于动态加载的 resources 资源，开发者只要加载时调 SpriteFrame.addRef()，
        释放时调 SpriteFrame.decRef() 就好了，引擎做了剩下所有事情；
     */

    /**
     * 加载Bundle文件--并不是加载bundle下资源
     * @param path 路径or Url
     * @param config  一般是远程加入指定md5版本更新 :{version:"md5值"}
     * @returns 
     */
    public LoadBundle(path: string, config?: Record<string, any>): Promise<cc.AssetManager.Bundle> {
        return new Promise((reslove, reject) => {
            cc.assetManager.loadBundle(path, config, (err, bundle: cc.AssetManager.Bundle) => {
                if (err) {
                    reject(err);
                } else {
                    reslove(bundle);
                }
            });
        });
    }

    /**
     * 加载Bundle文件，及文件下资源-- 主要用这个就行了
     * @param abNamePath bundle文件夹名称 or bundle文件
     * @param abAssetsPath bundle下具体文件路径 无后缀
     * @param type 加载的类型 
     * @param config 给加上md5的版本使用，加载具体的远程版本 {'version':'md5值'}
     * @returns 
     */
    LoadBundleAssets<T extends cc.Asset>(abNamePath: cc.AssetManager.Bundle | string, abAssetsPath: string, type: typeof cc.Asset, config?: Record<string, any>): Promise<T> {
        return new Promise((resolve, reject) => {
            const callBack = (err: Error, assets: T) => {
                if (err) { reject(err); }
                else {
                    resolve(assets);
                }
            }

            //说明bundle文件已加载,可以加载bundle文件内的资源了
            if (typeof abNamePath === 'string') {
                this.LoadBundle(abNamePath, config).then(
                    (res) => {
                        res.load(abAssetsPath, type, callBack);
                    }
                ).catch((err) => {
                    reject(err);
                })
            }
            else {
                abNamePath.load(abAssetsPath, type, callBack);
            }
        });
    };


    /**
     *  加载图片
     * @param path 路径
     * @param isRemote 是否是远程资源
     * @param othrArg 预留参数
     */
    public LoadResImg(path: string, isRemote: boolean = false, othrArg?: any): Promise<cc.SpriteFrame> {
        return new Promise((reslove, reject) => {
            // console.time('res时间'+path)

            if (isRemote) {
                cc.assetManager.loadRemote(path, (err, texture: cc.Texture2D) => {
                    if (err) {
                        reject(err);
                    } else {
                        let newSP = new cc.SpriteFrame(texture);
                        reslove(newSP);
                        newSP = null;
                    }
                })
            } else {
                cc.resources.load(path, cc.SpriteFrame,
                //      (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                //     // console.log("finsh: " + finsh);
                //     // console.log("total: " + total);
                //     // console.log("item: " + item);
                // }, 
                (err, spFrame: cc.SpriteFrame) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(spFrame);
                    }
                });
            }
        })
    }


    /**
     *  加载图片文件夹
     * @param path 路径
     * @param isRemote 是否是远程资源
     * @param othrArg 预留参数
     */
    public LoadResImgDir(path: string, isRemote: boolean = false, othrArg?: any): Promise<cc.SpriteFrame[]> {
        return new Promise((reslove, reject) => {
            cc.resources.loadDir(path, cc.SpriteFrame, 
            //     (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
            //     // console.log("finsh: " + finsh);
            // },
             (err, assets) => {
                if (err) {
                    reject(err);
                    console.error('LoadResImgDir err ',err);
                } else {

                    // for (let i = 0; i < assets.length; i++) {
                    //     let asset = assets[i];
                    //     // 在这里对 Spine 资源进行处理
                    //     // console.log(asset.name, asset);
                    // }
                    reslove(assets);
                }
            });
        })
    }

    /**
     * 加载图集
     * 远程一般用不到需要可参考 https://github.com/zhefengzhang/load-remote-plist/blob/master/LoadRemotePlist.js
     * @param path 路径
     * @param othrArg 预留参数
     */
    public LoadResImgAtals(path: string, othrArg?: any): Promise<cc.SpriteAtlas> {
        return new Promise((reslove, reject) => {
            cc.resources.load(path, cc.SpriteAtlas, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
            }, (err, spAtlasFrame) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);
                } else {
                    reslove(spAtlasFrame);
                }
            });
        })

    }

    /**
     *  加载txt文本
     * @param path 路径
     * @param isRemote 是否是远程资源
     * @param othrArg 预留参数
     */
    public LoadResText(path: string, isRemote: boolean = false, othrArg?: any): Promise<cc.TextAsset> {
        return new Promise((reslove, reject) => {
            if (isRemote) {
                cc.assetManager.loadRemote(path, (err, TextAsset: cc.TextAsset) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(TextAsset);
                    }
                })
            } else {
                cc.resources.load(path, cc.TextAsset, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                    // console.log("finsh: " + finsh);
                }, (err, TextAsset: cc.TextAsset) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(TextAsset);
                    }
                });
            }
        })
    }

    /**
     *  加载JSON文本
     * @param path 路径，本地不需要后缀
     * @param isRemote 是否是远程资源
     * @param othrArg 预留参数
     */
    public LoadResJson(path: string, isRemote: boolean = false, othrArg?: any): Promise<cc.JsonAsset> {
        return new Promise((reslove, reject) => {
            if (isRemote) {
                cc.assetManager.loadRemote(path, (err, TextAsset: cc.JsonAsset) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(TextAsset);
                    }
                })
            } else {
                cc.resources.load(path, cc.JsonAsset, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                    // console.log("finsh: " + finsh);
                }, (err, TextAsset: cc.JsonAsset) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(TextAsset);
                    }
                });
            }
        })
    }

    /**
     * 加载远程spine动画-非bundle离散文件的方式
     * @param path 
     * @param isRemote 
     * @param remoteUrl 
     * @returns 
     */
    public LoadResSpine(path: string, isRemote: boolean = false, remoteUrl: IRemoteSpine=null): Promise<sp.SkeletonData> {
        return new Promise((reslove, reject) => {
            if (isRemote) {
                //后期可优化成zip形式
                this.LoadResImg(remoteUrl.imageUrl, true).then
                Promise.all([this.LoadResImg(remoteUrl.imageUrl, true), this.LoadResText(remoteUrl.atlasUrl, true), this.LoadResJson(remoteUrl.skeletonUrl, true)])
                    .then((res) => {
                        if (res) {
                            let asset = new sp.SkeletonData();
                            asset.skeletonJson = res[2].json;
                            asset.atlasText = res[1].text;
                            asset.textures = [res[0].getTexture()];
                            const name = remoteUrl.imageUrl.substring(remoteUrl.imageUrl.lastIndexOf('/') + 1);
                            //@ts-ignore
                            asset.textureNames = [name];
                            reslove(asset);
                        } else {
                            reject(null);
                        }
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    })
            } else {
                cc.resources.load(path, sp.SkeletonData, (err, skeData) => {
                    console.log("spine load --------------------",path)
                    if (err) {
                        reject(err);
                    } else {
                        reslove(skeData);
                    }
                })
            }
        });
    }


    /**
     *  加载音频 
     * @param path 路径
     * @param isRemote 是否是远程资源
     * @param othrArg 预留参数 cc.assetManager.loadRemote('http://example.com/background.mp3', { audioLoadMode: cc.AudioClip.LoadMode.DOM_AUDIO }, callback); 强制DOM模式
     */
    public LoadResAudio(path: string, isRemote: boolean = false, othrArg?: any): Promise<cc.AudioClip> {
        return new Promise((reslove, reject) => {
            if (isRemote) {
                cc.assetManager.loadRemote(path, (err, audioAsset: cc.AudioClip) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(audioAsset);
                    }
                })
            } else {
                cc.resources.load(path, cc.AudioClip, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                    // console.log("finsh: " + finsh);
                }, (err, audioAsset: cc.AudioClip) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(audioAsset);
                    }
                });
            }
        })
    }


    /**
     * 加载预制体 
     * @param path 路径
     * @param othrArg 预留参数
     */
    public LoadResPrefab(path: string, othrArg?: any): Promise<cc.Prefab> {
        return new Promise((reslove, reject) => {
            // console.time('res时间预制体'+path)

            cc.resources.load(path, cc.Prefab, 
            //     (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
            //     // console.log("finsh: " + finsh);
            // },
             (err, prefabRes: cc.Prefab) => {
                if (err) {
                    reject(err);
                } else {
                    reslove(prefabRes);
                }
            });
        })
    }

    /**
     *  加载动画animator
     * @param path 路径
     * @param othrArg 预留参数
     */
    public LoadResAnimator(path: string, othrArg?: any): MPromise<cc.AnimationClip> {
        return new MPromise((reslove, reject) => {
            cc.resources.load(path, cc.AnimationClip, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                // console.log("finsh: " + finsh);
            }, (err, animationRes) => {
                if (err) {
                    reject(err);
                } else {
                    reslove(animationRes);
                }
            });
        })
    }


    /**
     *  加载文件夹下所有spine资源
     * @param path 路径
     * @param othrArg 预留参数
     */
    public LoadResDirSpine(path: string, othrArg?: any): Promise<sp.SkeletonData[]> {
        return new Promise((reslove, reject) => {
            // let info={}
            cc.resources.loadDir(path, sp.SkeletonData, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                // console.log("finsh: " + JSON.stringify(item));
                // if (item.file.__type__=="sp.SkeletonData")
                // {
                //     for(let name in item.file._skeletonJson.animations) info[name]=item.info.path
                // }
            }, (err, assets) => {
                if (err) {
                    reject(err);
                    console.error('LoadResDirSpine err ',err);
                } else {
                    // console.log(JSON.stringify(info))
                    // for (let i = 0; i < assets.length; i++) {
                    //     let asset = assets[i];
                    //     // 在这里对 Spine 资源进行处理
                    //     // console.log(asset.name, asset);
                    // }
                    reslove(assets);
                }
            });

        })
    }



    /**
     * 获取已加载资源的缓存数量--非特定资源的引用数量
     */
    public GetAllAssetsRefCount() {
        cc.log('已加载的资源集合缓存数量：' + cc.assetManager.assets.count);
    }

    /**
     * 获取指定资源的引用数量,赋值资源的时候要加addRef()
     */
    public GetAssetsRefCount(tempAssets: cc.Asset) {
        cc.log('该资源目前的引用数量：' + tempAssets.refCount);
    }

    private test(bundleName) {
        //原生的缓存管理器--TODO 未测试
        let cacheFiles = cc.assetManager.cacheManager.cachedFiles;
        if (cacheFiles) {
            cacheFiles.forEach((file, key) => {
                if (file.bundle && file.bundle == bundleName) {
                    cc.assetManager.cacheManager.removeCache(key);
                }
            });
        }
    }

}
