import { createServer } from "node:http"
import { Server as SocketIOServer } from "socket.io"
import prisma from "../helpers/prismaHelper.ts"
import { verifyToken } from "../utils/jwt.ts"
import { config as dotenvConfig } from "dotenv"
import next from "next"

dotenvConfig({ path: ".env" })

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  })

  io.on("connection", async (socket) => {
    console.log("a user connected")

    const token = socket.handshake.auth.token

    if (token) {
      var user = verifyToken(token, process.env.JWT_SECRET)

      await prisma.userSession.create({
        data: {
          userId: user.id,
          socketId: socket.id,
        },
      })
    }

    socket.on("post-like", async (data) => {
      data.socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("post-like", data)
      })
    })

    socket.on("comment-like", async (data) => {
      data.socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("comment-like", data)
      })
    })

    socket.on("mention", async (data) => {
      data.socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("mention", data)
      })
    })

    socket.on("new-follow", async (data) => {
      data.socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("new-follow", data)
      })
    })

    socket.on("disconnect", async () => {
      console.log("a user disconnected")

      if (!user) return
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastSeen: new Date(),
          online: false,
        },
      })

      await prisma.userSession.delete({
        where: {
          socketId: socket.id,
        },
      })
    })
  })

  httpServer
    .once("error", async (err) => {
      console.error(err)
      await prisma.userSession.deleteMany()
      await prisma.$disconnect()
      process.exit(1)
    })
    .listen(port, () => {
      dev
        ? console.log(
            `> Development server running at http://${hostname}:${port}`
          )
        : console.log(
            `> Production server running at http://${hostname}:${port}`
          )
    })
})
