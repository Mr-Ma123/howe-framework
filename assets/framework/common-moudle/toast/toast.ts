import NativeManager from "../manager/native-manager";

const { ccclass, property } = cc._decorator;

interface ShowOption {
    duration?: number;
    icon?: string;
}

const enum Pos {
    bottom,
    mid,
    top
}

@ccclass
export default class Toast extends cc.Component {
    private static toastNode = null;
    private static isInstantiating = false; // 是否正在实例化prefab

    /**
     * @description 展示 toast
     * @param text toast 中的文本内容
     * @param options 其他展示选项，包含以下内容：
     * duration：toast 停留时间
     * icon：toast 图标
     */
    public static show(text, options: ShowOption = { duration: 1, icon: 'textures/Rectangle' }) {
        if (text == undefined || text == null) {
            return;
        }
        if (text.length < 1) {
            return;
        }

        if (CC_JSB) {
            NativeManager.nativeToast(text);
        } else {
            if (!Toast.toastNode && !cc.isValid(Toast.toastNode) && !Toast.isInstantiating) {
                Toast.isInstantiating = true;
                let height = Math.ceil(text.length / 11);
                cc.resources.load('prefabs/Toast', function (err, prefab) {
                    Toast.isInstantiating = false;
                    Toast.toastNode = cc.instantiate(prefab);
                    let scene = cc.director.getScene().getChildByName('Canvas');
                    scene.addChild(Toast.toastNode);
                    Toast.toastNode.height = 55 * height;
                    let toast = Toast.toastNode.getComponent('toast');
                    if (!toast) {
                        console.log('CRITICAL: toast script is not attached!');
                        return;
                    }
                    if (!options) {
                        options = {};
                    }
                    if (options.duration) {
                        toast.leftTime = options.duration;
                    }
                    toast.setContent({
                        text: text,
                        icon: options.icon
                    });
                    toast.display();

                });
            } else if (cc.isValid(Toast.toastNode)) {
                let toast = Toast.toastNode.getComponent('toast');
                if (toast) {
                    // 已有Toast正在关闭，则先干掉原来的Toast，重新展示一个新的
                    Toast.toastNode.stopAllActions();
                    if (cc.isValid(Toast.toastNode)) Toast.toastNode.destroy();
                    Toast.toastNode = null;
                    this.show(text, options);
                    return;
                }
                if (options.duration) {
                    toast.leftTime = options.duration;
                }
                toast.setContent({
                    text: text,
                    icon: options.icon
                });
                toast.scheduleDismiss();
            }
        }

    }

    @property(cc.Label)
    private content: cc.Label = null;
    @property(cc.Node)
    private iconNode: cc.Node = null;

    private dismissing = false;
    private leftTime = 2;
    private lastIcon = undefined;

    private setContent(args) {
        if (!cc.isValid(this.node)) {
            return;
        }
        if (args) {
            if (args.text) {
                this.content.string = args.text;
                if (args.text.length > 11) {
                    this.content.lineHeight = 50;
                }
            }
            if (args.icon && args.icon != this.lastIcon) {
                this.iconNode.active = true;
                cc.resources.load(args.icon, (err, img) => {
                    if (img) {
                        //this.iconNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
                    }
                });
                this.lastIcon = args.icon;
            } else {
                this.iconNode.active = false;
            }
        }
    }

    /**
     * @description 展示CCMToast
     */
    private display() {
        this.node.scale = 1.4;
        let anim = cc.scaleTo(0.15, 1);
        this.node.y = 0;//cc.view.getVisibleSize().height + this.node.height;
        this.node.runAction(cc.sequence(anim, cc.callFunc(() => {
            this.scheduleDismiss();
        })));
    }

    /**
     * @description 结束CCMToast
     */
    private dismiss() {
        if (this.dismissing) return;
        this.dismissing = true;
        let anim = cc.moveBy(0.5, cc.v2(0, 0));
        let anim2 = cc.fadeTo(0.15, 0);
        let action = cc.spawn(anim, anim2);
        this.node.runAction(cc.sequence(action, cc.callFunc(() => {
            if (!cc.isValid(this.node)) {
                return;
            }
            this.dismissing = false;
            this.node.destroy();
            Toast.toastNode = null;
        })));
    }

    private scheduleDismiss() {
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => {
            if (cc.isValid(this.node)) {
                this.dismiss();
            }
        }, this.leftTime);
    }
}
