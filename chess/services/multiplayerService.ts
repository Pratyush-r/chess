import type {
  GameRoom, WsEvent, WsEventType, CreateRoomResponse,
  JoinRoomResponse, MakeMovePayload, ChatMessage, MatchmakingState,
} from '@/types/multiplayer';
import type { PlayerColor } from '@/types/chess';
import { v4 as uuidv4 } from 'uuid';

type EventHandler<T = unknown> = (event: WsEvent<T>) => void;

class MultiplayerService {
  private ws: WebSocket | null = null;
  private handlers: Map<WsEventType, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private roomId: string | null = null;
  private playerId: string | null = null;
  private token: string | null = null;

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };
        this.ws.onmessage = (event) => this.handleMessage(event);
        this.ws.onclose = () => this.handleDisconnect(url);
        this.ws.onerror = (err) => reject(err);
      } catch (err) {
        reject(err);
      }
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const wsEvent: WsEvent = JSON.parse(event.data);
      const handlers = this.handlers.get(wsEvent.type) ?? [];
      handlers.forEach((h) => h(wsEvent));
    } catch (err) {
      console.error('Failed to parse WS message:', err);
    }
  }

  private handleDisconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(url), delay);
    }
  }

  on<T>(type: WsEventType, handler: EventHandler<T>) {
    const handlers = this.handlers.get(type) ?? [];
    this.handlers.set(type, [...handlers, handler as EventHandler]);
  }

  off(type: WsEventType, handler: EventHandler) {
    const handlers = this.handlers.get(type) ?? [];
    this.handlers.set(type, handlers.filter((h) => h !== handler));
  }

  private emit<T>(type: WsEventType, data: T) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const event: WsEvent<T> = {
      type,
      roomId: this.roomId ?? '',
      playerId: this.playerId ?? '',
      data,
      timestamp: Date.now(),
    };
    this.ws.send(JSON.stringify(event));
  }

  // Mock implementations (replace with real API calls)
  async createRoom(timeControl: { initial: number; increment: number }): Promise<CreateRoomResponse> {
    const playerId = uuidv4();
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const room: GameRoom = {
      id: uuidv4(),
      code: roomCode,
      host: playerId,
      players: [{
        id: playerId,
        username: 'You',
        rating: 800,
        color: 'white',
        isReady: false,
        isConnected: true,
        timeRemaining: timeControl.initial,
      }],
      status: 'waiting',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pgn: '',
      timeControl,
      createdAt: Date.now(),
    };
    this.roomId = room.id;
    this.playerId = playerId;
    return { room, playerId, token: uuidv4() };
  }

  async joinRoom(code: string): Promise<JoinRoomResponse> {
    // Mock — in production this would be an API call
    const playerId = uuidv4();
    const room: GameRoom = {
      id: uuidv4(),
      code,
      host: 'opponent-id',
      players: [
        {
          id: 'opponent-id',
          username: 'Opponent',
          rating: 900,
          color: 'white',
          isReady: true,
          isConnected: true,
          timeRemaining: 600,
        },
        {
          id: playerId,
          username: 'You',
          rating: 800,
          color: 'black',
          isReady: false,
          isConnected: true,
          timeRemaining: 600,
        },
      ],
      status: 'waiting',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pgn: '',
      timeControl: { initial: 600, increment: 0 },
      createdAt: Date.now(),
    };
    this.roomId = room.id;
    this.playerId = playerId;
    return { room, playerId, token: uuidv4() };
  }

  makeMove(move: MakeMovePayload) {
    this.emit('make-move', move);
  }

  resign() {
    this.emit('resign', {});
  }

  offerDraw() {
    this.emit('offer-draw', {});
  }

  acceptDraw() {
    this.emit('accept-draw', {});
  }

  sendChatMessage(content: string) {
    const message: ChatMessage = {
      id: uuidv4(),
      playerId: this.playerId ?? '',
      playerName: 'You',
      content,
      timestamp: Date.now(),
      type: 'message',
    };
    this.emit('chat-message', message);
  }

  leaveRoom() {
    this.emit('leave-room', {});
    this.roomId = null;
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

let mpInstance: MultiplayerService | null = null;
export function getMultiplayerService(): MultiplayerService {
  if (!mpInstance) mpInstance = new MultiplayerService();
  return mpInstance;
}

export default MultiplayerService;
