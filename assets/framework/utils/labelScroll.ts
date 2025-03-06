
const { ccclass, property } = cc._decorator;

@ccclass
export default class labelScroll extends cc.Component {

    @property(cc.Node)
    labelNode: cc.Node = null;

    @property({ displayName: "间隔（像素）" })
    labDist: number = 20

    @property({ displayName: "滚动速度（像素/秒）" })
    speed: number = 50

    /** 复制的label节点 */
    cpLabelNode: cc.Node = null

    /** 遮罩 */
    labelMask: cc.Mask = null

    /** 循环滚动 */
    labelTween: cc.Tween = null

    /** label初始位置 */
    originX = 0

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.labelNode.on(cc.Node.EventType.SIZE_CHANGED, this.onLabelSizeChanged, this);
        this.originX = this.labelNode.x
    }

    onLabelSizeChanged() {
        if (this.labelNode.width > this.node.width) {
            //增加mask
            if (!this.labelMask) this.labelMask = this.node.addComponent(cc.Mask)

            //增加label
            if (!this.cpLabelNode) {
                this.cpLabelNode = cc.instantiate(this.labelNode)
                this.cpLabelNode.setParent(this.labelNode)
            }
            this.cpLabelNode.getComponent(cc.Label).string = this.labelNode.getComponent(cc.Label).string
            this.cpLabelNode.scale = 1 / this.labelNode.scale
            this.cpLabelNode.x = this.labelNode.width + this.labDist

            //增加缓动动画
            if (this.labelTween) this.labelTween.stop()
            let dist = this.labelNode.width + this.labDist
            let t = dist / this.speed
            let endX = this.originX - dist
            this.labelTween = cc.tween(this.labelNode).repeatForever(cc.tween().set({ x: this.originX }).to(t, { x: endX }))
            this.labelTween.start()
        }
        else {
            // if (this.labelMask)
            // {
            //     this.labelMask.destroy()
            //     this.labelMask=null
            // }

            if (this.cpLabelNode) {
                this.cpLabelNode.destroy()
                this.cpLabelNode = null
            }
            if (this.labelTween) {
                this.labelTween.stop()
            }
            this.labelNode.x = this.originX
        }
    }

}
