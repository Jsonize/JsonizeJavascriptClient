export interface JsonizeTransactionCallbacks {
    event?: (payload: any) => void;
    error?: (payload: any) => void;
    success?: (payload: any) => void;
}

export interface JsonizeTransaction {
    callbacks: JsonizeTransactionCallbacks
}

export interface JsonizeTransactionSend {
    type: string;
    transaction: string;
    payload?: any;
}

export interface JsonizeTransactionReceive {
    type: string;
    transaction: string;
    payload?: any;
}