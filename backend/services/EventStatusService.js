
const Event = require('../models/Event');
const cron = require('node-cron');

class EventStatusService {
  static async updateAllEventStatuses() {
    try {
      const now = new Date();
      console.log('Updating event statuses...');
      
      // Update events that should be ongoing
      const ongoingResult = await Event.updateMany(
        { 
          startTime: { $lte: now },
          endTime: { $gte: now },
          status: { $ne: 'ongoing' }
        },
        { status: 'ongoing' }
      );

      // Update events that should be completed
      const completedResult = await Event.updateMany(
        { 
          endTime: { $lt: now },
          status: { $ne: 'completed' }
        },
        { status: 'completed' }
      );

      // Update events that should be upcoming (in case time travel happens)
      const upcomingResult = await Event.updateMany(
        { 
          startTime: { $gt: now },
          status: { $ne: 'upcoming' }
        },
        { status: 'upcoming' }
      );

      console.log(`Status update: ${ongoingResult.modifiedCount} → ongoing, ${completedResult.modifiedCount} → completed, ${upcomingResult.modifiedCount} → upcoming`);
      
      return { ongoingResult, completedResult, upcomingResult };
    } catch (error) {
      console.error('Error updating event statuses:', error);
      throw error;
    }
  }

  static start() {
    // Run every minute to keep statuses accurate
    cron.schedule('* * * * *', () => {
      this.updateAllEventStatuses();
    });
    
    // Run once on server start
    this.updateAllEventStatuses();
    
    console.log('Event status service started');
  }
}

module.exports = EventStatusService;