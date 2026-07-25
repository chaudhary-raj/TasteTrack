
const cron = require('node-cron');
const User = require('../models/User'); // Ensure this path points to your User model

const startCronJobs = () => {
    // '0 0 * * *' tells it to run exactly at midnight every day
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily database cleanup...');
        
        try {
            // Calculate the exact date and time 10 days ago
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

            // Find and delete users who are NOT verified AND were created before tenDaysAgo
            const result = await User.deleteMany({
                isVerified: false,
                createdAt: { $lt: tenDaysAgo }
            });

            if (result.deletedCount > 0) {
                console.log(`Cleanup complete: Deleted ${result.deletedCount} unverified ghost users.`);
            } else {
                console.log('Cleanup complete: No unverified users needed deletion.');
            }

        } catch (error) {
            console.error('Error during database cleanup:', error);
        }
    });
};

module.exports = startCronJobs;