import type { PlayerColor, GameStatus } from './chess';

export type RoomStatus = 'waiting' | 'playing' | 'finished' | 'abandoned';
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface RoomPlayer {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  color: PlayerColor;
  isReady: boolean;
  isConnected: boolean;
  timeRemaining: number;
}

export interface GameRoom {
  id: string;
  code: string;
  host: string;
  players: RoomPlayer[];
  status: RoomStatus;
  fen: string;
  pgn: string;
  timeControl: { initial: number; increment: number };
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  drawOffer?: PlayerColor;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
  type: 'message' | 'system' | 'emoji';
}

// WebSocket event types for online multiplayer
export type WsEventType =
  | 'create-room'
  | 'join-room'
  | 'leave-room'
  | 'make-move'
  | 'sync-board'
  | 'resign'
  | 'offer-draw'
  | 'accept-draw'
  | 'decline-draw'
  | 'rematch'
  | 'chat-message'
  | 'player-connected'
  | 'player-disconnected'
  | 'game-start'
  | 'game-end'
  | 'time-update';

export interface WsEvent<T = unknown> {
  type: WsEventType;
  roomId: string;
  playerId: string;
  data: T;
  timestamp: number;
}

// API response types
export interface CreateRoomResponse {
  room: GameRoom;
  playerId: string;
  token: string;
}

export interface JoinRoomResponse {
  room: GameRoom;
  playerId: string;
  token: string;
}

export interface MakeMovePayload {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameEndPayload {
  status: GameStatus;
  winner?: PlayerColor;
  reason: string;
  pgn: string;
}

// Mock API layer (replace with real backend)
export const MOCK_ROOM_CODES = ['ABCD', 'EFGH', 'WXYZ', 'QRST'];

export interface MatchmakingState {
  status: 'idle' | 'searching' | 'found' | 'failed';
  estimatedWait?: number;
  opponent?: Partial<RoomPlayer>;
}
