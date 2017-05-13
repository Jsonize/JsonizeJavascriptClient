import { AbstractJsonize } from './AbstractJsonize';
import {JsonizeTransactionSend} from "./JsonizeTransaction";

export class SocketJsonize extends AbstractJsonize {

    private xhr: XMLHttpRequest;
    private processedText: string = "";

    constructor(xhr: XMLHttpRequest) {
        super();
        this.xhr = xhr;
        this.once = true;
        var self = this;
        this.xhr.onreadystatechange = function () {
            var deltaText = self.xhr.responseText.substring(self.processedText.length);
            while (deltaText.indexOf("\n") >= 0) {
                const i = deltaText.indexOf("\n");
                const received = deltaText.substring(0, i);
                self.receive(JSON.parse(received));
                self.processedText += received + "\n";
                deltaText = deltaText.substring(i + 1);
            }
        };
    }

    static createByURL(url: string, method: string = "POST") {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        return new SocketJsonize(xhr);
    }

    public terminate(transactionId: string) {
        this.xhr.abort();
    }

    public destroy() {
        this.xhr.abort();
        super.destroy();
    }

    protected send(data: JsonizeTransactionSend): boolean {
        this.xhr.send(JSON.stringify(data));
        return true;
    }

}