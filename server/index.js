import { Server } from "socket.io";

const PORT = 9000;
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log({ socket });
  console.log(`Connected at port ${PORT}`);
});