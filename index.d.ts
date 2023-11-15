declare module 'air-to-ground-online-status' {
    export interface OnlineStatusResult {
        status: boolean;
        error: string[] | null;
    }

    export function checkOnline(
        urlToPing?: string,
    ): Promise<OnlineStatusResult>;

    export class OnlineStatusChecker extends EventEmitter {
        constructor(options?: {
            checkOnlineInterval?: number;
            checkOfflineInterval?: number;
            urlToPing?: string;
        });

        getStatus(): OnlineStatusResult;
        listenForChanges(callback: (isOnline: OnlineStatusResult) => void): void;
        stopChecking(): void;
    }

    export default function OnlineStatus(options?: {
        checkOnlineInterval?: number;
        checkOfflineInterval?: number;
        urlToPing?: string;
    }): OnlineStatusChecker;
}
