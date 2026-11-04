/**
 * CampusConnect API Service Client
 * Directly targets the 5 required endpoints:
 * 1. GET  /api/events
 * 2. GET  /api/events/{id}
 * 3. POST /api/registrations (201 or 409)
 * 4. GET  /api/me/registrations
 * 5. GET  /api/events/{id}/registrations
 */

import { storage } from './storage';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';
const FORCE_MOCK = import.meta.env?.VITE_USE_MOCK_API === 'true';

// Helper to simulate realistic network delay
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * Endpoint 1: GET /api/events
   * Browse events with optional search, category, and status filters.
   */
  async getEvents({ search = '', category = 'All', status = 'All' } = {}) {
    // If real backend configured and not force-mock, try fetch first
    if (!FORCE_MOCK) {
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category && category !== 'All') query.append('category', category);
        if (status && status !== 'All') query.append('status', status);

        const res = await fetch(`${API_BASE_URL}/events?${query.toString()}`);
        if (!res.ok) {
          const error = new Error(`Request failed with status ${res.status}`);
          error.status = res.status;
          throw error;
        }
        return await res.json();
      } catch (err) {
        if (err.status) throw err;
        console.warn('[CampusConnect API] Live backend unavailable, falling back to local mock store:', err);
      }
    }

    // Mock API Implementation
    await delay(180);
    let events = storage.getEvents();

    if (search.trim()) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q)) ||
          e.venue?.toLowerCase().includes(q) ||
          e.organizer?.name?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      events = events.filter((e) => e.status.toLowerCase() === status.toLowerCase());
    }

    return events;
  },

  /**
   * Endpoint 2: GET /api/events/{id}
   * Get detailed information for a single event.
   */
  async getEventById(id) {
    if (!FORCE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${id}`);
        if (!res.ok) {
          const error = new Error(
            res.status === 404 ? 'Event not found' : `Request failed with status ${res.status}`
          );
          error.status = res.status;
          throw error;
        }
        return await res.json();
      } catch (err) {
        if (err.status) throw err;
        console.warn(`[CampusConnect API] Falling back to mock for event ${id}`);
      }
    }

    await delay(150);
    const events = storage.getEvents();
    const event = events.find((e) => e.id === id);
    if (!event) {
      const error = new Error(`Event with ID "${id}" was not found.`);
      error.status = 404;
      throw error;
    }
    return event;
  },

  /**
   * Endpoint 3: POST /api/registrations
   * Create registration: returns 201 Created or 409 Conflict.
   */
  async createRegistration({ eventId, fullName, email, studentId, department, year, specialNotes }) {
    if (!FORCE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, fullName, email, studentId, department, year, specialNotes }),
        });

        const data = await res.json();
        if (res.status === 201) return { status: 201, data };
        if (res.status === 409) {
          const err = new Error(data.message || 'Registration Conflict');
          err.status = 409;
          err.data = data;
          throw err;
        }
        const error = new Error(data.message || `Request failed with status ${res.status}`);
        error.status = res.status;
        throw error;
      } catch (err) {
        if (err.status) throw err;
        console.warn('[CampusConnect API] Live POST failed, executing via persistent local engine.');
      }
    }

    // Mock API Engine (Accurate HTTP status codes: 201 vs 409)
    await delay(300);

    const events = storage.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.status = 404;
      throw error;
    }

    const myRegistrations = storage.getMyRegistrations();
    const attendeesMap = storage.getAttendeesMap();
    const eventAttendees = attendeesMap[eventId] || [];

    // Conflict Check 1: User already registered for this event
    const alreadyRegistered =
      myRegistrations.some((r) => r.eventId === eventId) ||
      eventAttendees.some(
        (a) => a.studentId?.toLowerCase() === studentId?.toLowerCase() || a.email?.toLowerCase() === email?.toLowerCase()
      );

    if (alreadyRegistered) {
      const conflictError = new Error(
        `Conflict: You are already registered for "${event.title}" with student ID ${studentId}.`
      );
      conflictError.status = 409;
      conflictError.code = 'ALREADY_REGISTERED';
      conflictError.data = {
        error: 'Conflict',
        code: 'ALREADY_REGISTERED',
        message: `Student ${studentId} is already registered for this event.`,
        eventId,
      };
      throw conflictError;
    }

    // Conflict Check 2: Event capacity reached
    if (event.registeredCount >= event.capacity) {
      const fullError = new Error(`Conflict: Event "${event.title}" has reached its maximum capacity of ${event.capacity} attendees.`);
      fullError.status = 409;
      fullError.code = 'CAPACITY_REACHED';
      fullError.data = {
        error: 'Conflict',
        code: 'CAPACITY_REACHED',
        message: 'This event is completely booked out.',
        capacity: event.capacity,
      };
      throw fullError;
    }

    // Generate new registration ticket
    const regId = `reg-${Date.now().toString().slice(-6)}`;
    const ticketCode = `CC-${event.id.replace('evt-', '').toUpperCase()}-${studentId.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`;

    const newRegistration = {
      id: regId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      category: event.category,
      coverImage: event.coverImage,
      fullName,
      email,
      studentId,
      department: department || 'General Studies',
      year: year || '1st Year',
      specialNotes: specialNotes || '',
      registeredAt: new Date().toISOString(),
      status: 'Confirmed',
      ticketCode,
      seatNumber: `Seat ${event.registeredCount + 1}`,
      qrData: `CAMPUSCONNECT:PASS:${event.id}:${regId}:${studentId}`,
      checkedIn: false,
    };

    // Update attendees map
    attendeesMap[eventId] = [...eventAttendees, newRegistration];
    storage.saveAttendeesMap(attendeesMap);

    // Update user registrations
    myRegistrations.unshift(newRegistration);
    storage.saveMyRegistrations(myRegistrations);

    // Increment event count
    event.registeredCount += 1;
    storage.saveEvents(events);

    return {
      status: 201,
      data: {
        success: true,
        registration: newRegistration,
        message: 'Registration confirmed successfully!',
      },
    };
  },

  /**
   * Endpoint 4: GET /api/me/registrations
   * Registrations, optionally filtered by student ID.
   */
  async getMyRegistrations() {
    if (!FORCE_MOCK) {
      try {
        const studentId = storage.getUser().studentId;
        const query = studentId
          ? `?${new URLSearchParams({ studentId }).toString()}`
          : '';
        const res = await fetch(`${API_BASE_URL}/me/registrations${query}`);
        if (!res.ok) {
          const error = new Error(`Request failed with status ${res.status}`);
          error.status = res.status;
          throw error;
        }
        return await res.json();
      } catch (err) {
        if (err.status) throw err;
        console.warn('[CampusConnect API] Falling back to mock for /api/me/registrations');
      }
    }

    await delay(160);
    return storage.getMyRegistrations();
  },

  /**
   * Endpoint 5: GET /api/events/{id}/registrations
   * Public attendee list.
   */
  async getEventRegistrations(eventId) {
    if (!FORCE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}/registrations`);
        if (!res.ok) {
          const error = new Error(`Request failed with status ${res.status}`);
          error.status = res.status;
          throw error;
        }
        return await res.json();
      } catch (err) {
        if (err.status) throw err;
        console.warn(`[CampusConnect API] Falling back to mock for event ${eventId} registrations`);
      }
    }

    await delay(200);

    const events = storage.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.status = 404;
      throw error;
    }

    const attendeesMap = storage.getAttendeesMap();
    const attendees = attendeesMap[eventId] || [];

    const checkedInCount = attendees.filter((a) => a.checkedIn).length;

    return {
      eventId: event.id,
      eventTitle: event.title,
      organizerName: event.organizer.name,
      totalCapacity: event.capacity,
      totalRegistrations: attendees.length,
      checkedInCount,
      checkInPercentage: attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0,
      attendees,
    };
  },

  /**
   * Helper: Toggle Check-in status at gate
   */
  async toggleCheckIn(eventId, attendeeId) {
    await delay(120);
    const attendeesMap = storage.getAttendeesMap();
    const list = attendeesMap[eventId] || [];

    const updated = list.map((att) => {
      if (att.id === attendeeId) {
        const nextState = !att.checkedIn;
        return {
          ...att,
          checkedIn: nextState,
          checkedInAt: nextState ? new Date().toISOString() : null,
        };
      }
      return att;
    });

    attendeesMap[eventId] = updated;
    storage.saveAttendeesMap(attendeesMap);
    return updated.find((a) => a.id === attendeeId);
  },

  /**
   * Helper: Cancel user registration
   */
  async cancelRegistration(registrationId) {
    await delay(150);
    const myRegistrations = storage.getMyRegistrations();
    const target = myRegistrations.find((r) => r.id === registrationId);
    if (!target) return false;

    // Remove from my registrations
    const updatedMyRegs = myRegistrations.filter((r) => r.id !== registrationId);
    storage.saveMyRegistrations(updatedMyRegs);

    // Remove from attendees list
    const attendeesMap = storage.getAttendeesMap();
    if (attendeesMap[target.eventId]) {
      attendeesMap[target.eventId] = attendeesMap[target.eventId].filter((a) => a.id !== registrationId);
      storage.saveAttendeesMap(attendeesMap);
    }

    // Decrement event counter
    const events = storage.getEvents();
    const event = events.find((e) => e.id === target.eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      storage.saveEvents(events);
    }

    return true;
  },

  /**
   * Helper: Create a new event (for Organizers)
   */
  async createEvent(eventData, currentUser) {
    await delay(250);
    const events = storage.getEvents();
    const newId = `evt-${Date.now().toString().slice(-4)}`;

    const newEvent = {
      id: newId,
      title: eventData.title,
      category: eventData.category || 'Tech Talks',
      type: eventData.isOnline ? 'Virtual' : 'In-Person',
      shortDescription: eventData.shortDescription || eventData.description?.slice(0, 100),
      description: eventData.description,
      date: eventData.date || new Date(Date.now() + 86400000 * 7).toISOString(),
      endDate: eventData.endDate || new Date(Date.now() + 86400000 * 7 + 10800000).toISOString(),
      timeString: eventData.timeString || 'TBA',
      venue: eventData.venue || 'Campus Auditorium',
      isOnline: !!eventData.isOnline,
      onlineUrl: eventData.onlineUrl || '',
      coverImage: eventData.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
      organizerId: currentUser?.organizerProfile?.id || 'org-acm',
      organizer: {
        id: currentUser?.organizerProfile?.id || 'org-acm',
        name: currentUser?.organizerProfile?.name || 'ACM Student Chapter',
        email: currentUser?.email || 'organizer@campus.edu',
        role: 'Host Club',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        badge: 'Verified Organizer',
      },
      capacity: Number(eventData.capacity) || 100,
      registeredCount: 0,
      registrationDeadline: eventData.registrationDeadline || new Date(Date.now() + 86400000 * 6).toISOString(),
      status: 'Upcoming',
      featured: false,
      price: 'Free',
      tags: eventData.tags || ['Campus', 'Community'],
      timeline: eventData.timeline || [
        { time: '10:00 AM', title: 'Welcome & Introduction', desc: 'Main Hall' },
        { time: '11:00 AM', title: 'Main Session', desc: 'Presentation Stage' },
        { time: '01:00 PM', title: 'Networking & Refreshments', desc: 'Foyer' },
      ],
      speakers: eventData.speakers || [],
      requirements: eventData.requirements || ['Valid student ID required'],
    };

    events.unshift(newEvent);
    storage.saveEvents(events);
    return newEvent;
  },
};
