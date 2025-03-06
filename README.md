author: Howe.Ma

## TODO
 - [ ] 更新原生代码
 - [x] 更新音频管理器
 - [ ] 添加加密
 - [x] 完善框架

# V1.0.0
##  HOWE-FRAMEWORK说明
 * 基于Cocos Creator 2.4.3版本
 * 3.x的请移步- https://github.com/Mr-Ma123/howe-frameworkd-3.7up
 
## 基本管理器说明及使用
 1. AdManager 调用播放插屏及激励视频
    > AdManager.getInstance().showInsertAd();
 2. EvnetManager 事件管理器
    > //发送事件
    > EventManager.getInstance().fireEvent('事件名',?参数);
    > //移除事件
    > EventManager.getInstance().remove('事件名',调用的方法,this);
    > 详见：event-tool.ts
 3. GameConfig 游戏的一些配置
 4. NativeManager 原生管理器 内含GP登录流程
 5. PoolManager 对象池管理器
    > 添加节点 addPoolToMap(), 获取节点 getNodeByMap(), 节点放回 putNodeToMap()
 6. PopManager 弹窗管理器
   > 常用功能都有,支持 A.一级弹窗 B.多级弹窗--通过优先级处理 越低的越先出
   > B1.和上一级同时显示 B2.上一级的隐藏显示
 7. ResourceManager 资源管理器
   > 本地资源加载图片、图集、文本、音频、预制体、动画、bundle加载、资源引用计数
 8. SceneManager 场景管理器
   > 预加载、正常加载、bundle加载、切换场景效果

## 其他说明
 1. mPromise 异步未完成时支持取消异步
 2. CutDownBtn 按钮倒计时效果


# V2.0.0 功能变化
##  HOWE-FRAMEWORK说明
 * 升级基于Cocos Creator 2.4.10版本
 
## 基本管理器说明及使用
 1. FigureUtils.ts 增加新的数字工具
 2. 增加简用Toast工具 --toast预制体需放到resources目录下
 3. 增加常用触摸管理 MapTouchController ，左右上下移动缩放
 4. 增加文本滚动 labelScroll ，类ios原生文本滚动效果
 5. 增加简易音频播放管理器 AudioManager
 6. 增加本地数据管理器 LocalDataManager
 7. 增加资源管理器 ResManager  图片、音频等动态加载
 8. 事件管理器 EvnetManager  
    >新增功能 允许事件先发射后监听，监听时直接触发事件 fireWaitAddEvent

## 其他说明
   暂无
