// socket.js or socket.ts
import { io } from "socket.io-client";

const socket = io("https://homentor-backend.onrender.com"); // Make sure this matches your backend URL

export default socket;
