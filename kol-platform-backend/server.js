const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */

const db = new sqlite3.Database("./chat.db", (err) => {
  if (err) console.error(err.message);
  else console.log("SQLite connected ✅");
});

// create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId TEXT,
    sender TEXT,
    text TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

/* ================= HTTP SERVER ================= */

const server = http.createServer(app);

/* ================= SOCKET.IO ================= */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ JOIN ROOM
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  // ✅ SEND MESSAGE
  socket.on("send_message", (data) => {
    const { chatId, sender, text } = data;

    // 🔴 SAVE TO DATABASE
    db.run(
      `INSERT INTO messages (chatId, sender, text) VALUES (?, ?, ?)`,
      [chatId, sender, text],
      function (err) {
        if (err) {
          console.error(err);
          return;
        }

        const message = {
          id: this.lastID,
          chatId,
          sender,
          text,
        };

        // 🔴 EMIT ONLY TO ROOM (important fix!)
        io.to(chatId).emit("receive_message", message);
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ================= API ================= */

// ✅ GET CHAT HISTORY
app.get("/messages/:chatId", (req, res) => {
  const { chatId } = req.params;

  db.all(
    `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt ASC`,
    [chatId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ================= START SERVER ================= */

server.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});