// author:Howe.Ma

const { ccclass, property } = cc._decorator;

/**
 * resources资源管理器
 * 动态加载 的资源必须手动卸载，卸载方式
    ① 通过引用计数：addRef 和 decRef
    ② 直接释放：releaseAsset

 * 场景勾选自动释放 
 */
@ccclass
export default class ResourceManager {
    //分析资源加载功能 --只负责资源的加载释放
    //0：首先你要有资源，并把这个资源放到约定的位置-resources文件夹下
    //0.1： ab包的话的需要设置成assetsbundle文件。 先加载ab包文件 在加载具体内容
    //0.2.加载成功与失败的处理

    //1：加载了的时候 加上引用计数，进行资源释放管理 ，
    //系统的引用计数只能处理静态的引用，动态的引用还需要自己处理

    //2.资源释放，使用自动引用的和 自己记录的进行释放资源


    private static _instance: ResourceManager = null;
    private constructor() { }

    public static getInstance(): ResourceManager {
        if (!this._instance) {
            this._instance = new ResourceManager();
        }
        return this._instance;
    }


    //#region ------加载本地数据------

    //#region 01加载reources下资源
    /**
     *  加载图片--异步async
     * @param path 路径
     * @param oherArg1 是否需要自动释放
     * @param othrArg 预留参数
     */
    public async LoadResImg(path: string, otherArg1?: any, othrArg2?: any): MPromise<cc.SpriteFrame> {//
        return new MPromise((reslove, reject) => {
            cc.resources.load(path, cc.SpriteFrame, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                // console.log("finsh: " + finsh);
                // console.log("total: " + total);
                // console.log("item: " + item);
            }, (err, spFrame: cc.SpriteFrame) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);
                }

                reslove(spFrame);
            });
        })
    }

    /**
     *  加载图集
     * @param path 路径
     * @param oherArg1 是否需要自动释放
     * @param othrArg 预留参数
     */
    public LoadResImgAtals(path: string, oherArg1: boolean = true, othrArg2?: any): MPromise<cc.SpriteAtlas> {
        return new MPromise((reslove, reject) => {
            cc.resources.load(path, cc.SpriteAtlas, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
            }, (err, spAtlasFrame) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);
                }
                reslove(spAtlasFrame);
            });
        })

    }


    /**
     *  加载文本
     * @param path 路径
     * @param oherArg1 是否需要自动释放
     * @param othrArg 预留参数
     */
    public LoadResText(path: string, oherArg1: boolean = true, othrArg2?: any): MPromise<cc.TextAsset> {
        return new MPromise((reslove, reject) => {
            cc.resources.load(path, cc.TextAsset, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
            }, (err, txtRes) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);

                }
                reslove(txtRes);
            });
        })

    }

    /**
     *  加载音频
     * @param path 路径
     * @param oherArg1 是否需要自动释放
     * @param othrArg 预留参数
     */
    public LoadResAudio(path: string, oherArg1: boolean = true, othrArg2?: any): MPromise<cc.AudioClip> {
        return new MPromise((reslove, reject) => {

            cc.resources.load(path, cc.AudioClip, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                // console.log("finsh: " + finsh);
                // console.log("total: " + total);
                // console.log("item: " + item);
            }, (err, audioRes) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);
                }
                reslove(audioRes);
            });
        })

    }


    /**
     *  加载预制体
     * @param path 路径
     * @param oherArg1 是否需要自动释放
     * @param othrArg 预留参数
     */
    public LoadResPerfab(path: string, oherArg1: boolean = true, othrArg2?: any): MPromise<cc.Prefab> {
        return new MPromise((reslove, reject) => {
            cc.resources.load(path, cc.Prefab, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                // console.log("finsh: " + finsh);
                // console.log("total: " + total);
                // console.log("item: " + item);
            }, (err, perfabRes: cc.Prefab) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);
                }
                reslove(perfabRes)
            });
        })
    }

    /**
     *  加载动画animator
     * @param path 路径
     * @param oherArg1 是否需要自动释放
     * @param othrArg 预留参数
     */
    public LoadResAnimator(path: string, oherArg1: boolean = true, othrArg2?: any): MPromise<cc.AnimationClip> {
        return new MPromise((reslove, reject) => {

            cc.resources.load(path, cc.AnimationClip, (finsh: number, total: number, item: cc.AssetManager.RequestItem) => {
                // console.log("finsh: " + finsh);
                // console.log("total: " + total);
                // console.log("item: " + item);
            }, (err, animationRes) => {
                if (err) {
                    console.log("Err: " + err);
                    reject(err);
                }
                reslove(animationRes);
            });
        })

    }




    //加载图片--同步例子---------------------↓
    //参考：https://blog.csdn.net/weixin_43644044/article/details/109805797?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-109805797-blog-110056144.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-109805797-blog-110056144.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=1
    public async SyncLoadAssets(path: string, oherArg1: boolean = true, othrArg2?: any) {
        const img = await this.LoadResImg(path);
        return img;//为空需要自行处理
    }
    //----------------------------------------↑
    //#endregion

    //#region 02加载assetbundle下资源
    /**
     * 加载Bundle文件--并不是加载bundle下资源
     * @param path 路径or Url
     * @param config  一般是远程加入指定md5版本更新 :{version:"md5值"}
     * @returns 
     */
    public LoadBundle(path: string, config?: Record<string, any>): MPromise<cc.AssetManager.Bundle> {
        return new MPromise((reslove, reject) => {
            if (config) {//
                cc.assetManager.loadBundle(path, config, (err, bundle: cc.AssetManager.Bundle) => {
                    if (err) {
                        reject(err);
                    }
                    reslove(bundle);
                });
            } else {
                cc.assetManager.loadBundle(path, (err, bundle: cc.AssetManager.Bundle) => {
                    if (err) {
                        reject(err);
                    }
                    reslove(bundle);
                });
            }
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
    LoadBundleAssets<T extends cc.Asset>(abNamePath: cc.AssetManager.Bundle | string, abAssetsPath: string, type: typeof cc.Asset, config?: Record<string, any>): MPromise<T> {
        return new MPromise((resolve, reject, options) => {
            const callBack = (err: Error, assets: T) => {
                if (options.cancellend) { return; }
                if (err) { reject(err); }
                else {
                    resolve(assets);
                }
            }

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


    //#endregion



    //#endregion



    //#region ------加载远程数据-直接url-TODO:后续完善----

    //#endregion



}





