import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    namespace: '/',
  },
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();

  afterInit(/* server: Server */) {
    console.log('Socket.io server initialized');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  sendMessage(event: string, message: any) {
    this.server.emit(event, message);
  }

  // Optional: Method to send a message to a specific client
  sendMessageToClient(clientId: string, event: string, message: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit(event, message);
    }
  }
}
