import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-500 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border ${
              notif.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{notif.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>
              {!notif.is_read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-blue-500 text-sm hover:underline ml-4"
                >
                  Mark read
                </button>
              )}
            </div>
            {notif.link && (
              <Link
                to={notif.link}
                className="text-blue-500 text-sm hover:underline mt-2 inline-block"
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No notifications yet
        </div>
      )}
    </div>
  );
};

export default Notifications;
