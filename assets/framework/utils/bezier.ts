
export default class Bezier {

    // 三次贝塞尔曲线
    createSmoothLineControlPoint(p1: cc.Vec2, pt: cc.Vec2, p2: cc.Vec2, ratio: number = 0) {
        let vec1T: cc.Vec2 = this.vector2dMinus(p1, pt);
        let vec2T: cc.Vec2 = this.vector2dMinus(p2, pt);
        const len1 = Math.hypot(vec1T.x, vec1T.y);
        const len2 = Math.hypot(vec2T.x, vec2T.y);
        const v: number = len1 / len2;
        let delta = new cc.Vec2();
        //cc.log(v, "===");
        if (v > 1) {
            delta = this.vector2dMinus(
                p1,
                this.vector2dPlus(pt, this.vector2dMinus(p2, pt).scale(cc.v2(1 / v, 1 / v))));
        } else {
            delta = this.vector2dMinus(
                this.vector2dPlus(pt, this.vector2dMinus(p1, pt).scale(cc.v2(v, v))),
                p2)
        }
        delta = delta.scale(cc.v2(ratio, ratio));
        const control1 = this.vector2dPlus(pt, delta);
        const control2 = this.vector2dMinus(pt, delta);

        return { control1, control2 }
    }

    private vector2dMinus(vec1: cc.Vec2, vec2: cc.Vec2) {
        return cc.v2(vec1.x + vec2.x, vec1.y + vec2.y);
    }
    private vector2dPlus(vec1: cc.Vec2, vec2: cc.Vec2) {
        return cc.v2(vec1.x - vec2.x, vec1.y - vec2.y);
    }

}
