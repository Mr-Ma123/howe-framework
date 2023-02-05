
/** 默认栈初始容量 */
const CAPACITY: number = 10;

interface PriorityStackElement {
    el: any,
    priority: number,
}

export default class Stack<T>{

    //private elements: Array<T>;
    private _size: number;
    private priorityElements: Array<PriorityStackElement>;
    private _prioritySize: number;

    public constructor(capacityNumber: number = CAPACITY) {
        //this.elements = new Array<T>();
        this.priorityElements = new Array<PriorityStackElement>();
        this._size = 0;
        this._prioritySize = 0;
    }

    //#region 普通的栈 后进先出
    /**
        * 普通的入栈 后进先出
        * @param el 元素
        */
    // push(el: T) {
    //     this.elements.push(el);
    // }

    // //出栈
    // pop(): T {
    //     return this.elements.pop();
    // }

    // //获取栈顶
    // peek(): T {
    //     return this.elements[this.elements.length - 1];
    // }

    // //获取栈的元素数量
    // size(): number {
    //     return this.elements.length;
    // }

    // //是否是空栈
    // isEmpty(): boolean {
    //     return this.elements.length === 0;
    // }

    // //清空栈
    // clear() {
    //     delete this.elements;
    //     this.elements = new Array(CAPACITY);
    //     this._size = 0;
    // }

    // //打印栈
    // print() {
    //     console.log(this.elements.toString());
    // }

    //#endregion

    //#region 方案1： 不删除每个入栈的数据 直到clear
    // /**
    //  * 优先级入栈
    //  * @param el 元素
    //  * @param priority 优先级 升序排列 eg: 0最优先 默认10
    //  */
    //  pushPrioprity(el: T, priority: number = 10) {
    //     let tempEl: PriorityStackElement = { el, priority };
    //     //空栈直接入栈
    //     if (this.priorityElements.length === 0) {
    //         this.priorityElements[this._prioritySize] = tempEl;
    //     }
    //     else {
    //         let added = false;
    //         for (let i = 0; i < this._prioritySize; i++) {
    //             if (tempEl.priority > this.priorityElements[i].priority) {
    //                 this.priorityElements.splice(i, 0, tempEl);
    //                 added = true;
    //                 break;
    //             }
    //         }
    //         if (!added) {
    //             this.priorityElements.push(tempEl);
    //         }
    //     }
    //     this._prioritySize++;

    // }

    // /**
    //  * 
    //  * @returns 优先级出栈
    //  */
    // popPrioprity(): T {
    //     //this.elemprioprityEnts.pop();
    //     return this.priorityElements[--this._prioritySize].el;
    // }

    // //获取栈顶
    // peekPrioprity(): T {
    //     return this.priorityElements[this._prioritySize - 1].el;
    // }

    // //获取栈的元素数量
    // sizePrioprity(): number {
    //     return this._prioritySize;
    // }

    // //是否是空栈
    // isEmptyPrioprity(): boolean {
    //     return this._prioritySize === 0;
    // }

    // //清空栈
    // clearPrioprity() {
    //     delete this.priorityElements;
    //     this.priorityElements = new Array<PriorityStackElement>();
    //     this._size = 0;
    // }


    // printPriority() {
    //     console.log(this.priorityElements)
    // }
    //#endregion


    /**
     * 优先级入栈
     * @param el 元素
     * @param priority 优先级 升序排列 eg: 0最优先出 10后出 默认10
     */
    pushPrioprity(el: T, priority: number = 10) {
        let tempEl: PriorityStackElement = { el, priority };
        //空栈直接入栈
        if (this.priorityElements.length === 0) {
            this.priorityElements.push(tempEl);
        }
        else {
            let added = false;
            for (let i = 0; i < this.priorityElements.length; i++) {
                if (tempEl.priority > this.priorityElements[i].priority) {
                    this.priorityElements.splice(i, 0, tempEl);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.priorityElements.push(tempEl);
            }
        }
        //this._prioritySize++;

    }

    /**
     * 
     * @returns 优先级出栈
     */
    popPrioprity(): T {
        //this.elemprioprityEnts.pop();
        return this.priorityElements.pop().el;
    }

    //获取栈顶
    peekPrioprity(): T {
        return this.priorityElements[this.priorityElements.length - 1].el;
    }

    //获取栈的元素数量
    sizePrioprity(): number {
        return this.priorityElements.length;
    }

    //是否是空栈
    isEmptyPrioprity(): boolean {
        return this.priorityElements.length === 0;
    }

    //清空栈
    clearPrioprity() {
        delete this.priorityElements;
        this.priorityElements = new Array<PriorityStackElement>();
        this._prioritySize = 0;
    }

    //是否有该元素,并返回该元素的索引
    hasPriprity(el){
        for (let [index, item] of this.priorityElements.entries()) {
            if(item.el === el){
                return index;
            }
        }
        return -1;
    }

    byIndexToFindEl(index:number){
        return this.priorityElements[index];
    }

    printPriority() {
        console.log(this.priorityElements)
    }

}
