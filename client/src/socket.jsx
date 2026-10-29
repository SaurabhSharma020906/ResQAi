import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.error("Unable to parse user", err);
    }

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token,
      },
    });

    socketInstance.on("connect", () => {
      console.log(
        "🟢 Socket Connected:",
        socketInstance.id
      );

      switch (user?.role) {
        case "Admin":
          socketInstance.emit("join-admin");
          break;

        case "Responder":
          socketInstance.emit(
            "join-responder",
            user._id
          );
          break;

        case "Citizen":
          if (user?._id || user?.id) {
            socketInstance.emit(
              "join-citizen",
              user._id || user.id
            );
          }
          break;

        default:
          break;
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
    });

    // Store the external socket instance for consumers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}