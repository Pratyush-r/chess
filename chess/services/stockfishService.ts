import type { EvaluationData } from '@/types/chess';
import { DIFFICULTY_SETTINGS, type Difficulty } from '@/types/chess';

type StockfishCallback = (evaluation: EvaluationData) => void;
type BestMoveCallback = (move: string) => void;

class StockfishService {
  private worker: Worker | null = null;
  private isReady = false;
  private messageQueue: string[] = [];
  private onEvaluation: StockfishCallback | null = null;
  private onBestMove: BestMoveCallback | null = null;
  private currentDepth = 15;

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Stockfish requires browser environment'));
        return;
      }

      try {
        // Use stockfish.js from public directory
        this.worker = new Worker('/stockfish/stockfish.js');

        this.worker.onmessage = (event: MessageEvent<string>) => {
          this.handleMessage(event.data);
        };

        this.worker.onerror = (err) => {
          console.error('Stockfish worker error:', err);
          reject(err);
        };

        // Init sequence
        this.send('uci');

        const timeout = setTimeout(() => {
          reject(new Error('Stockfish init timeout'));
        }, 5000);

        const originalHandler = this.worker.onmessage;
        this.worker.onmessage = (event: MessageEvent<string>) => {
          if (event.data === 'uciok') {
            clearTimeout(timeout);
            this.isReady = true;
            this.send('isready');
          }
          if (event.data === 'readyok') {
            this.send('ucinewgame');
            this.worker!.onmessage = originalHandler;
            // Flush queue
            this.messageQueue.forEach((msg) => this.worker!.postMessage(msg));
            this.messageQueue = [];
            resolve();
          }
          this.handleMessage(event.data);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private send(command: string) {
    if (this.worker && this.isReady) {
      this.worker.postMessage(command);
    } else {
      this.messageQueue.push(command);
    }
  }

  private handleMessage(message: string) {
    if (message.startsWith('info')) {
      const evaluation = this.parseInfo(message);
      if (evaluation && this.onEvaluation) {
        this.onEvaluation(evaluation);
      }
    } else if (message.startsWith('bestmove')) {
      const parts = message.split(' ');
      if (parts[1] && parts[1] !== '(none)' && this.onBestMove) {
        this.onBestMove(parts[1]);
      }
    }
  }

  private parseInfo(message: string): EvaluationData | null {
    const depthMatch = message.match(/depth (\d+)/);
    const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
    const pvMatch = message.match(/pv (.+)/);
    const bestMoveMatch = message.match(/ ([a-h][1-8][a-h][1-8][qrbn]?)\b/);

    if (!depthMatch || !scoreMatch) return null;

    const depth = parseInt(depthMatch[1]);
    const scoreType = scoreMatch[1];
    const scoreValue = parseInt(scoreMatch[2]);

    let score = 0;
    let mate: number | null = null;

    if (scoreType === 'cp') {
      score = scoreValue / 100;
    } else if (scoreType === 'mate') {
      mate = scoreValue;
      score = scoreValue > 0 ? 10 : -10;
    }

    const pv = pvMatch ? pvMatch[1].split(' ').slice(0, 5) : undefined;
    const bestMove = pv?.[0];

    return { score, depth, bestMove, pv, mate };
  }

  setDifficulty(difficulty: Difficulty) {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    this.currentDepth = settings.depth;
    this.send(`setoption name Skill Level value ${settings.skillLevel}`);
    // Limit strength for lower difficulties
    if (difficulty === 'beginner' || difficulty === 'easy') {
      this.send('setoption name UCI_LimitStrength value true');
      this.send(`setoption name UCI_Elo value ${settings.elo}`);
    } else {
      this.send('setoption name UCI_LimitStrength value false');
    }
  }

  getBestMove(fen: string, difficulty: Difficulty, callbacks: { onBestMove: BestMoveCallback; onEvaluation?: StockfishCallback }) {
    this.onBestMove = callbacks.onBestMove;
    this.onEvaluation = callbacks.onEvaluation ?? null;

    this.setDifficulty(difficulty);
    this.send('stop');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${DIFFICULTY_SETTINGS[difficulty].depth} movetime 1000`);
  }

  analyzePosition(fen: string, depth: number, callback: StockfishCallback) {
    this.onEvaluation = callback;
    this.send('stop');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
  }

  stop() {
    this.send('stop');
  }

  destroy() {
    this.send('quit');
    this.worker?.terminate();
    this.worker = null;
    this.isReady = false;
  }
}

// Singleton instance
let stockfishInstance: StockfishService | null = null;

export function getStockfish(): StockfishService {
  if (!stockfishInstance) {
    stockfishInstance = new StockfishService();
  }
  return stockfishInstance;
}

export default StockfishService;
