import {
    JsonizeTransaction, JsonizeTransactionCallbacks, JsonizeTransactionReceive,
    JsonizeTransactionSend
} from './JsonizeTransaction';

interface JsonizeTransactions {
    [key: string]: JsonizeTransaction;
}

export abstract class AbstractJsonize {

    public once: boolean = true;

    constructor() {}

    public destroy() {
    }

    protected abstract send(data: JsonizeTransactionSend): boolean;

    private lastTransactionId: number = 0;
    private openTransactions: JsonizeTransactions = {};

    public invoke(data: any, callbacks: JsonizeTransactionCallbacks): string {
        this.lastTransactionId++;
        const id: string = 'id' + this.lastTransactionId;
        this.openTransactions[id] = {
            callbacks: callbacks
        };
        this.send({
            type: "invoke",
            transaction: id,
            payload: data
        });
        return id;
    }

    public terminate(transactionId: string) {
        delete this.openTransactions[transactionId];
        this.send({
            type: "terminate",
            transaction: transactionId
        });
    }

    protected serverError(error: any) {
        for (let transactionId in this.openTransactions) {
            this.receiveError(transactionId, this.openTransactions[transactionId], error);
        }
        if (this.once)
            this.destroy();
    }

    protected receive(result: JsonizeTransactionReceive) {
        const transactionId: string = result.transaction;
        const transaction: JsonizeTransaction = this.openTransactions[transactionId];
        if (!transaction)
            return;
        const type: string = result.type;
        const payload: any = result.payload;
        if (type === "event")
            this.receiveEvent(transactionId, transaction, payload);
        else if (type === "error")
            this.receiveError(transactionId, transaction, payload);
        else if (type === "success")
            this.receiveSuccess(transactionId, transaction, payload);
    }

    private receiveEvent(transactionId: string, transaction: JsonizeTransaction, payload: any) {
        if (transaction.callbacks.event)
            transaction.callbacks.event(payload);
    }

    private receiveError(transactionId: string, transaction: JsonizeTransaction, payload: any) {
        if (transaction.callbacks.error)
            transaction.callbacks.error(payload);
        delete this.openTransactions[transactionId];
        if (this.once)
            this.destroy();
    }

    private receiveSuccess(transactionId: string, transaction: JsonizeTransaction, payload: any) {
        if (transaction.callbacks.success)
            transaction.callbacks.success(payload);
        delete this.openTransactions[transactionId];
        if (this.once)
            this.destroy();
    }

}
