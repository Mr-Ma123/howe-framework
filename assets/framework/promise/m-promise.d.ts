/**
 * 可取消回调处理的Promise
 * @author Howe.Ma
 */
declare class MPromise<T> extends Promise {
    /**
     * 继承Promise  增加options，包含取消状态cancellend。
     * 当Promise有取消需求时，请再异步完结处，判断options.cancellend
     * 如果为true，就阻止回调后的操作，也不要再调用resolve 和 reject 
     * @param executor 执行器
     */
    constructor(executor: (resolve: (value: unknown) => void, reject: (reason?: any) => void,
        options: ?{ cancellend: boolean }) => void): Mpromise<T>;

    /**
     * 取消promise
     */
    cancel();

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;

}


