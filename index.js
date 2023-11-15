const axios = require('axios');
const EventEmitter = require('events');

async function checkOnline(urlToPing = 'https://httpbin.org/status/200') {
    try {
        // Send a GET request to check online status
        await axios.get(urlToPing);
        return { status: true, error: null }; // Success, you are online!
    } catch (error) {
        return { status: false, error: error.message };
    }
}

// Class to represent the online status checker
class OnlineStatusChecker extends EventEmitter {
    constructor(options = {}) {
        super();

        const {
            checkOnlineInterval = 30000,
            checkOfflineInterval = 10000,
            urlToPing = 'https://httpbin.org/status/200',
        } = options;

        this.isOnline = { status: false, error: undefined }; // Initial status
        this.checkOnlineTimeoutId = null; // Store the timeout ID for cleanup
        this.checkOfflineTimeoutId = null; // Store the timeout ID for cleanup
        this.checkOnlineInterval = checkOnlineInterval; // Store the interval value
        this.checkOfflineInterval = checkOfflineInterval; // Store the interval value
        this.stop = false;
        this.onlineIntervalActive = false;
        this.offlineIntervalActive = false;

        if (checkOnlineInterval <= checkOfflineInterval) {
            throw new Error('checkOnlineInterval must be greater than checkOfflineInterval');
        }


        // Function to check and emit online status
        const checkAndEmitStatusWhenOnline = async () => {
            if (this.stop || this.onlineIntervalActive) {
                return;
            }
            this.onlineIntervalActive = true;

            const onlineStatus = await checkOnline(urlToPing);
            if (!onlineStatus.status) {
                this.isOnline = onlineStatus;
                this.emit('status', this.isOnline);
            }

            this.onlineIntervalActive = false;
        };

        // Function to check and emit offline status
        const checkAndEmitStatusWhenOffline = async () => {
            if (this.stop || this.offlineIntervalActive) {
                return;
            }
            this.offlineIntervalActive = true;

            const offlineStatus = await checkOnline(urlToPing); // Use checkBackOnline here
            if (offlineStatus.status) {
                this.isOnline = offlineStatus;
                this.emit('status', this.isOnline);
            }

            this.offlineIntervalActive = false;
        };

        // Start with online check
        this.checkOnlineTimeoutId = setInterval(() => {
            if (this.onlineIntervalActive) {
                return;
            }
            checkAndEmitStatusWhenOnline();
        }, checkOnlineInterval);

        // Start with offline check
        this.checkOfflineTimeoutId = setInterval(() => {
            if (this.offlineIntervalActive) {
                return;
            }
            checkAndEmitStatusWhenOffline();
        }, checkOfflineInterval);
    }

    // Function to get the current online status
    getStatus() {
        return this.isOnline;
    }

    listenForChanges(callback) {
        this.on('status', callback);
    }

    // Method to stop checking and clear the timeout
    stopChecking() {
        this.stop = true;
        clearInterval(this.checkOnlineTimeoutId);
        clearInterval(this.checkOfflineTimeoutId);
    }
}

function OnlineStatus(options = {}) {
    return new OnlineStatusChecker(options);
}

module.exports = OnlineStatus;
