
/** 游戏配置-按需设置 */
export default class GameConfig {

    public static Game_Version = '1.0.0';
    public static FrameWork_Version = '1.0.0';

    //开启碰撞系统
    //cc.director.getCollisionManager().enabled = true;
   
    //显示碰撞器包围盒
    //cc.director.getCollisionManager().enabledDebugDraw = true;//包围盒
    //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    
    //s时间速率 快进/慢放
    //cc.director.getScheduler().setTimeScale(1);
    
    //设置默认帧率
    //cc.game.setFrameRate(30);

    //原生交互路径-安卓
    /** 默认路径 */
    public static AppActivity = 'org/cocos2dx/javascript/AppActivity'
    /** GP相关路径 */
    public static GoogleSign =  'org/cocos2dx/javascript/GoogleSign';
    /** FB相关路径 */
    public static FaceBookSign = 'org/cocos2dx/javascript/FaceBookSign';

    /* GP登出本地记录的字段*/
    public static isGpLoginOver = 'isGpLoginOver';
}