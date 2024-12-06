import { useEffect, useCallback, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useCollaboration = (sessionId, onCodeUpdate) => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const userId = useRef(uuidv4()).current;
  const initialLoadRef = useRef(false);

  // Initial fetch of session data
  useEffect(() => {
    if (!sessionId || initialLoadRef.current) return;

    const fetchInitialSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');

        const data = await response.json();
        onCodeUpdate(data.code, data.language);
        setLastUpdate(data.updatedAt);
        initialLoadRef.current = true;
      } catch (error) {
        console.error('Error fetching initial session:', error);
      }
    };

    fetchInitialSession();
  }, [sessionId, onCodeUpdate]);

  // Share changes with others
  const shareChanges = useCallback(async (code, language) => {
    if (!sessionId) return { success: false, error: 'No session ID' };

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      const data = await response.json();
      setLastUpdate(data.updatedAt);
      return { success: true, data };
    } catch (error) {
      console.error('Error sharing changes:', error);
      return { success: false, error: error.message };
    }
  }, [sessionId]);

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    if (!sessionId) return { hasUpdates: false, error: 'No session ID' };

    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }

      const data = await response.json();
      const hasNewUpdates = data.updatedAt !== lastUpdate;

      if (hasNewUpdates) {
        onCodeUpdate(data.code, data.language);
        setLastUpdate(data.updatedAt);
      }

      return { hasUpdates: hasNewUpdates, data };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { hasUpdates: false, error: error.message };
    }
  }, [sessionId, lastUpdate, onCodeUpdate]);

  return {
    userId,
    shareChanges,
    checkForUpdates,
    lastUpdate
  };
};
