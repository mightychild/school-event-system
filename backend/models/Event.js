const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(endTime) {
        // FIX: Use the current value of startTime from the document being validated
        // During updates, 'this' might not have the updated startTime
        const startTime = this.startTime;
        
        // If startTime is not available (during updates), we can't validate
        if (!startTime) {
          console.log('VALIDATION: startTime not available, skipping validation');
          return true;
        }
        
        console.log('SCHEMA VALIDATION - Start:', startTime, 'End:', endTime);
        console.log('SCHEMA VALIDATION - Is valid:', new Date(endTime) > new Date(startTime));
        
        return new Date(endTime) > new Date(startTime);
      },
      message: 'End time must be after start time'
    }
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    maxlength: [100, 'Venue cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['upcoming', 'ongoing', 'completed'],
      message: 'Invalid status value'
    },
    default: 'upcoming'
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration (in hours)
EventSchema.virtual('duration').get(function() {
  return (this.endTime - this.startTime) / (1000 * 60 * 60); // hours
});

// Middleware to automatically update status based on current time
EventSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (now < this.startTime) {
    this.status = 'upcoming';
  } else if (now >= this.startTime && now <= this.endTime) {
    this.status = 'ongoing';
  } else {
    this.status = 'completed';
  }
};

// Pre-save middleware to auto-update status
EventSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

module.exports = mongoose.model('Event', EventSchema);