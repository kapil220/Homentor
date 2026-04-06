// socket.js or socket.ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL); // Make sure this matches your backend URL

export default socket;
