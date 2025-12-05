import React, { useEffect, useRef, useState } from "react";
import { NotificacionService } from "./services/NotificacionService";
import type { Notificacion } from "./services/NotificacionService";
import "./NotificationContainer.css";

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const timeoutsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = NotificacionService.suscribir(
      (notification: Notificacion) => {
        setNotifications((prev) => [...prev, notification]);

        if (notification.duracion) {
          const tid = window.setTimeout(() => {
            removeNotification(notification.id);
            delete timeoutsRef.current[notification.id];
          }, notification.duracion);
          timeoutsRef.current[notification.id] = tid;
        }
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch {
        /* noop */
      }
      Object.values(timeoutsRef.current).forEach((tid) => clearTimeout(tid));
      timeoutsRef.current = {};
    };
  }, []);

  const removeNotification = (id: string) => {
    const tid = timeoutsRef.current[id];
    if (tid) {
      clearTimeout(tid);
      delete timeoutsRef.current[id];
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIconAndColor = (tipo: Notificacion["tipo"]) => {
    switch (tipo) {
      case "success":
        return {
          icon: "✓",
          bgClass: "nc-bg-success",
          borderClass: "nc-border-success",
        };
      case "error":
        return {
          icon: "✕",
          bgClass: "nc-bg-error",
          borderClass: "nc-border-error",
        };
      case "warning":
        return {
          icon: "⚠",
          bgClass: "nc-bg-warning",
          borderClass: "nc-border-warning",
        };
      case "info":
      default:
        return {
          icon: "ℹ",
          bgClass: "nc-bg-info",
          borderClass: "nc-border-info",
        };
    }
  };

  return (
    <div className="nc-container" role="status" aria-live="polite">
      {notifications.map((notification) => {
        const { icon, bgClass, borderClass } = getIconAndColor(
          notification.tipo
        );

        return (
          <div
            key={notification.id}
            className={`nc-card ${bgClass} ${borderClass}`}
          >
            <div className="nc-body">
              <div className="nc-icon">{icon}</div>

              <div className="nc-content">
                <h3 className="nc-title">{notification.titulo}</h3>
                <p className="nc-message">{notification.mensaje}</p>
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                className="nc-close"
                aria-label="Cerrar notificación"
              >
                <svg
                  className="nc-close-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {notification.duracion && (
              <div
                className="nc-progress"
                style={{
                  animation: `nc-shrink ${notification.duracion}ms linear forwards`,
                }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContainer;
