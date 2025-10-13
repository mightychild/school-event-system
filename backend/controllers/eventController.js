// controllers/eventController.js - UPDATED VERSION
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);
    
    // Validate required fields
    if (!req.body.title || !req.body.venue || !req.body.startTime || !req.body.endTime) {
      return res.status(400).json({ 
        error: 'Title, venue, start time, and end time are required'
      });
    }

    // Validate end time is after start time
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    if (endTime <= startTime) {
      return res.status(400).json({ 
        error: 'End time must be after start time' 
      });
    }

    // Validate event is not in the past
    if (endTime < new Date()) {
      return res.status(400).json({ 
        error: 'Cannot create events in the past' 
      });
    }

    const event = new Event({
      ...req.body,
      createdBy: req.user._id
    });

    await event.save();
    
    console.log('Event created successfully:', event);
    res.status(201).json(event);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(400).json({ 
      error: 'Event creation failed',
      details: err.message 
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { status, populate } = req.query;
    const filter = {};
    
    if (status && status !== 'all') filter.status = status;
    
    const query = Event.find(filter).sort({ startTime: 1 });
    
    if (populate) {
      const populateFields = populate.split(',');
      populateFields.forEach(field => query.populate(field));
    }
    
    const events = await query.exec();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FIXED: Update event function with proper time validation
exports.updateEvent = async (req, res) => {
  try {
    console.log('UPDATE EVENT - Request body:', req.body);
    
    // Find the event first
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Validate time if provided in the update
    if (req.body.startTime || req.body.endTime) {
      const startTime = new Date(req.body.startTime || existingEvent.startTime);
      const endTime = new Date(req.body.endTime || existingEvent.endTime);
      
      
      if (endTime <= startTime) {
        return res.status(400).json({ 
          error: 'End time must be after start time',
          details: `Start: ${startTime}, End: ${endTime}, Difference: ${(endTime - startTime) / (60 * 1000)} minutes`
        });
      }
    }

    // Use findByIdAndUpdate with proper options
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true, // This ensures schema validations run
        context: 'query' // This helps with validation context
      }
    ).populate('createdBy attendees');

    console.log('UPDATE - Event updated successfully:', event);
    res.json(event);
  } catch (err) {
    console.error('UPDATE EVENT ERROR:', err);
    
    // Better error handling for validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        error: 'Event validation failed',
        details: messages.join(', ')
      });
    }
    
    res.status(400).json({ 
      error: 'Event update failed',
      details: err.message 
    });
  }
};

// Add this function to get current event status
exports.getEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.updateStatus(); // Update status based on current time
    await event.save();

    res.json({ status: event.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// registerForEvent function in eventController.js
exports.registerForEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Find event within transaction
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot register for completed or ongoing events' });
    }

    // Check capacity
    if (event.capacity && event.attendees.length >= event.capacity) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Event has reached maximum capacity' });
    }

    // Check if already registered
    const isRegistered = event.attendees.some(attendeeId => 
      attendeeId.toString() === userId.toString()
    );
    if (isRegistered) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Update Event within transaction
    event.attendees.push(userId);
    await event.save({ session });

    // Update User within transaction
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { eventsAttended: eventId } },
      { session, new: true }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Return populated event
    const populatedEvent = await Event.findById(eventId)
      .populate('attendees', 'name email')
      .populate('createdBy', 'name');
      
    res.json({
      success: true,
      message: 'Successfully registered for event',
      event: populatedEvent
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register for event' });
  }
};

// UPDATED unregisterFromEvent function
exports.unregisterFromEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot unregister from completed or ongoing events' });
    }

    // Check if actually registered
    const isRegistered = event.attendees.some(attendeeId => 
      attendeeId.toString() === userId.toString()
    );
    if (!isRegistered) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Not registered for this event' });
    }

    // Update Event
    event.attendees = event.attendees.filter(
      attendeeId => attendeeId.toString() !== userId.toString()
    );
    await event.save({ session });

    // Update User
    await User.findByIdAndUpdate(
      userId,
      { $pull: { eventsAttended: eventId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedEvent = await Event.findById(eventId)
      .populate('attendees', 'name email')
      .populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Successfully unregistered from event',
      event: populatedEvent
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Unregistration error:', err);
    res.status(500).json({ error: 'Failed to unregister from event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to delete event',
      details: err.message 
    });
  }
};

exports.getTeacherEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { createdBy: req.user.id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    const events = await Event.find(filter)
      .populate('attendees', 'name email')
      .sort({ startTime: 1 });

    res.json(events);
  } catch (err) {
    console.error('Error fetching teacher events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};