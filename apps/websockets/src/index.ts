import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { PrismaClient } from '@repo/db';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

function getRandomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomEmail() {
  return `${getRandomString(8)}@example.com`;
}

function getRandomPassword() {
  return getRandomString(12);
}

function getRandomName() {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];
  return names[Math.floor(Math.random() * names.length)];
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', async (ws) => {
  const name = getRandomName();
  const email = getRandomEmail();
  const password = getRandomPassword();

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    ws.send(`User created: ${name}, ${email}`);
  } catch (err) {
    ws.send('Error creating user');
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
