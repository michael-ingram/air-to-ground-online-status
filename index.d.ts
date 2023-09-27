
declare module 'air-to-ground-online-status' {
    export function checkOnlineStatus(urlToPing?: string, maxRetries?: number, retryInterval?: number): Promise<boolean>;

    export class OnlineStatusChecker extends EventEmitter {
        constructor(options?: {
            checkInterval?: number;
            maxRetries?: number;
            urlToPing?: string;
            retryInterval?: number;
        });

        getStatus(): boolean;
        listenForChanges(callback: (isOnline: boolean) => void): void;
    }

    export default function OnlineStatus(options?: {
        checkInterval?: number;
        maxRetries?: number;
        urlToPing?: string;
        retryInterval?: number;
    }): OnlineStatusChecker;
}
