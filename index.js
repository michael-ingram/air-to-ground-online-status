const axios = require('axios');
const EventEmitter = require('events');

async function checkOnlineStatus (urlToPing = 'https://www.google.com', maxRetries = 3, retryInterval = 1000)  {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            // Send a GET request to Google's homepage
            await axios.get(urlToPing);
            return true; // Success, you are online!
        } catch (error) {
            console.error('Attempt', retries + 1, 'Failed:', error.message);
            retries++;
            await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Wait before retrying
        }
    }
    return false;
}

// Class to represent the online status checker
class OnlineStatusChecker extends EventEmitter {
    constructor( options = {}) {
        super();

        const {
            checkInterval = 5000,
            maxRetries = 3,
            urlToPing = 'https://www.google.com',
            retryInterval = 1000
        } = options;

        this.isOnline = false; // Initial status

        // Function to check and emit online status
        const checkAndEmitStatus = async () => {
            const onlineStatus = await checkOnlineStatus(urlToPing, maxRetries, retryInterval);
            if (onlineStatus !== this.isOnline) {
                this.isOnline = onlineStatus;
                this.emit('status', this.isOnline); // Emit the boolean status directly
            }
        };

        checkAndEmitStatus(); // Check immediately

        // Set up an interval to continuously check and emit online status changes
        setInterval(checkAndEmitStatus, checkInterval);
    }

    // Function to get the current online status
    getStatus() {
        return this.isOnline;
    }

    listenForChanges(callback) {
        this.on('status', callback);
    }
}

function OnlineStatus(options = {}) {
    return new OnlineStatusChecker(options);
}


module.exports = OnlineStatus;