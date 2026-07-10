/**
 * useConversations.js
 * Manages all chat history in localStorage.
 *
 * Conversation shape:
 *   { id: string, title: string, messages: Message[], createdAt: number, updatedAt: number }
 *
 * Message shape:
 *   { role: "user" | "model", text: string, timestamp: number }
 */
import { useState, useCallback } from "react";

const STORAGE_KEY = "campusai_conversations";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (convs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch {
    /* storage full or unavailable */
  }
};

/** Derive a short title from the first user message */
const deriveTitle = (messages) => {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const t = first.text.trim();
  return t.length > 52 ? t.slice(0, 52) + "…" : t;
};

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function useConversations() {
  const [conversations, setConversations] = useState(() => load());
  const [activeId, setActiveId] = useState(() => {
    const stored = load();
    return stored.length > 0 ? stored[0].id : null;
  });

  /** Returns the active conversation object (or null) */
  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  /** Create a fresh conversation and set it as active */
  const createConversation = useCallback(() => {
    const newConv = {
      id: uuid(),
      title: "New conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => {
      const updated = [newConv, ...prev];
      save(updated);
      return updated;
    });
    setActiveId(newConv.id);
    return newConv;
  }, []);

  /** Update the messages for the active conversation (called on every send/reply) */
  const updateMessages = useCallback(
    (newMessages) => {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: newMessages,
            title: deriveTitle(newMessages),
            updatedAt: Date.now(),
          };
        });
        save(updated);
        return updated;
      });
    },
    [activeId]
  );

  /** Switch to an existing conversation */
  const selectConversation = useCallback((id) => {
    setActiveId(id);
  }, []);

  /** Delete a conversation; auto-select another or null */
  const deleteConversation = useCallback(
    (id) => {
      setConversations((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        save(updated);

        if (id === activeId) {
          setActiveId(updated.length > 0 ? updated[0].id : null);
        }

        return updated;
      });
    },
    [activeId]
  );

  return {
    conversations,
    activeId,
    activeConversation,
    createConversation,
    updateMessages,
    selectConversation,
    deleteConversation,
  };
}
