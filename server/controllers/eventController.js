import Event from "../models/event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const cancelEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Find event by ID and update its status to 'cancelled'
    const event = await Event.findByIdAndUpdate(eventId, { status: 'cancelled' }, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event cancelled successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel event', error: error.message });
  }
};
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Event Status Function
export const updateEventStatus = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { status } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event status updated", event: updatedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

