// LocalStorage persistence for CampusConnect frontend
import {
  INITIAL_CURRENT_USER,
  INITIAL_EVENTS,
  INITIAL_USER_REGISTRATIONS,
  INITIAL_EVENT_ATTENDEES
} from './mockData';

const KEYS = {
  USER: 'campusconnect_current_user',
  EVENTS: 'campusconnect_events',
  MY_REGISTRATIONS: 'campusconnect_my_registrations',
  ATTENDEES: 'campusconnect_event_attendees',
  ROLE: 'campusconnect_active_role' // 'student' | 'organizer'
};

export const storage = {
  getUser() {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_CURRENT_USER;
    } catch {
      return INITIAL_CURRENT_USER;
    }
  },

  setUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getActiveRole() {
    return localStorage.getItem(KEYS.ROLE) || 'student';
  },

  setActiveRole(role) {
    localStorage.setItem(KEYS.ROLE, role);
  },

  getEvents() {
    try {
      const data = localStorage.getItem(KEYS.EVENTS);
      if (!data) {
        localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  saveEvents(events) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  },

  getMyRegistrations() {
    try {
      const data = localStorage.getItem(KEYS.MY_REGISTRATIONS);
      if (!data) {
        localStorage.setItem(KEYS.MY_REGISTRATIONS, JSON.stringify(INITIAL_USER_REGISTRATIONS));
        return INITIAL_USER_REGISTRATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER_REGISTRATIONS;
    }
  },

  saveMyRegistrations(regs) {
    localStorage.setItem(KEYS.MY_REGISTRATIONS, JSON.stringify(regs));
  },

  getAttendeesMap() {
    try {
      const data = localStorage.getItem(KEYS.ATTENDEES);
      if (!data) {
        localStorage.setItem(KEYS.ATTENDEES, JSON.stringify(INITIAL_EVENT_ATTENDEES));
        return INITIAL_EVENT_ATTENDEES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EVENT_ATTENDEES;
    }
  },

  saveAttendeesMap(map) {
    localStorage.setItem(KEYS.ATTENDEES, JSON.stringify(map));
  },

  resetAll() {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.EVENTS);
    localStorage.removeItem(KEYS.MY_REGISTRATIONS);
    localStorage.removeItem(KEYS.ATTENDEES);
    localStorage.removeItem(KEYS.ROLE);
  }
};
