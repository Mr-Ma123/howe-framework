import EventManager, { Event_Name } from "../../framework/manager/event-manager";

const { ccclass, property } = cc._decorator;

//按钮倒计时效果
@ccclass
export default class CutDownBtn extends cc.Component {
    private _packingTime = 0;
    private _packingTimeMax = 3;
    @property(cc.Node)
    imgNode: cc.Node = null; //一般是进度条的图片-加个blockinput组件就好
    @property(cc.Node)
    barValueNode: cc.Node = null; //要遮挡的节点

    _maskNode: cc.Node = null; //mask
    start() {
        //没有自己加一个
        this._maskNode = this.imgNode.getChildByName('mask-node');
        this._maskNode.active = false;

        //自己定义的触发事件-根据自己的项目调用this.startPacking方法就行
        EventManager.getInstance().add(Event_Name.CUTDOWN_BTN_EFFER, this.startPacking, this);
    }
    protected onDestroy(): void {
        //EventManager.getInstance().remove(Event_Name.CUTDOWN_BTN_EFFER, this.startPacking, this);
    }

    updatePacking(dt) {
        //cc.log('updatePacking', dt);
        if (this._packingTime < this._packingTimeMax) {
            this._packingTime = dt + this._packingTime;
            const width = this.barValueNode.width;
            this.imgNode.width = width * (this._packingTime / this._packingTimeMax);
        } else {
            this.endPacking();
        }
    }

    endPacking() {
        this.unschedule(this.updatePacking);
        //Dosomething
        this._maskNode.active = false;
        this.imgNode.width = 0;
        this._packingTime = 0;
    }

    startPacking() {
        this._maskNode.active = true;
        this.schedule(this.updatePacking);
    }
}
