import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [role, setRoleState] = useState(() => storage.getActiveRole());
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-tickets' | 'organizer'
  
  // Modals & Drawers
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [attendeeModalEvent, setAttendeeModalEvent] = useState(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isApiDrawerOpen, setIsApiDrawerOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // Global Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', title = '') => {
    setToast({ id: Date.now(), message, type, title });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const setRole = (newRole) => {
    setRoleState(newRole);
    storage.setActiveRole(newRole);
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    storage.setUser(updatedUser);
    showToast(
      newRole === 'organizer'
        ? 'Switched to Organizer Mode (ACM Chapter Lead). You can now view attendee rosters!'
        : 'Switched to Student Mode. You can browse and register for events.',
      'info',
      `Role: ${newRole.toUpperCase()}`
    );
  };

  const value = {
    user,
    setUser,
    role,
    setRole,
    activeTab,
    setActiveTab,
    selectedEventId,
    setSelectedEventId,
    registeringEvent,
    setRegisteringEvent,
    attendeeModalEvent,
    setAttendeeModalEvent,
    isCreateEventOpen,
    setIsCreateEventOpen,
    isApiDrawerOpen,
    setIsApiDrawerOpen,
    activeTicket,
    setActiveTicket,
    toast,
    setToast,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
