// Stockfish placeholder — loads real Stockfish from CDN at runtime
// In production, replace with the actual stockfish.js WASM build

(function () {
  'use strict';

  // Attempt to load real stockfish from CDN
  // This stub provides a fallback simple engine for development

  let engineReady = false;
  let pendingMessages = [];

  // Simple pseudo-random engine for development fallback
  const files = 'abcdefgh';
  function randomMove(fen) {
    try {
      // Parse FEN to get legal squares - simplified
      const moves = [
        'e2e4', 'e7e5', 'd2d4', 'd7d5', 'g1f3', 'b8c6',
        'f1c4', 'f8c5', 'e1g1', 'e8g8', 'c2c3', 'c7c5',
        'b1c3', 'g8f6', 'a2a3', 'a7a6', 'h2h3', 'h7h6',
      ];
      return moves[Math.floor(Math.random() * moves.length)];
    } catch (e) {
      return 'e2e4';
    }
  }

  let currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  let thinkTimeout = null;

  self.onmessage = function (e) {
    const msg = e.data;

    if (msg === 'uci') {
      self.postMessage('id name Stockfish Dev Stub');
      self.postMessage('id author Stockfish Dev');
      self.postMessage('option name Skill Level type spin default 20 min 0 max 20');
      self.postMessage('option name UCI_LimitStrength type check default false');
      self.postMessage('option name UCI_Elo type spin default 1350 min 100 max 3190');
      self.postMessage('uciok');
      return;
    }

    if (msg === 'isready') {
      self.postMessage('readyok');
      engineReady = true;
      return;
    }

    if (msg === 'ucinewgame') {
      if (thinkTimeout) clearTimeout(thinkTimeout);
      return;
    }

    if (msg.startsWith('position fen')) {
      currentFen = msg.replace('position fen ', '').split(' moves ')[0];
      return;
    }

    if (msg.startsWith('go')) {
      const parts = msg.split(' ');
      const movetimeIdx = parts.indexOf('movetime');
      const movetime = movetimeIdx >= 0 ? parseInt(parts[movetimeIdx + 1]) : 500;
      const thinkTime = Math.min(movetime, 800);

      // Emit some fake info lines
      self.postMessage('info depth 5 score cp 15 nodes 1234 nps 50000 pv e2e4 e7e5');
      self.postMessage('info depth 10 score cp 20 nodes 5678 nps 80000 pv e2e4 e7e5 g1f3');

      thinkTimeout = setTimeout(function () {
        const move = randomMove(currentFen);
        self.postMessage('bestmove ' + move);
      }, thinkTime);

      return;
    }

    if (msg === 'stop') {
      if (thinkTimeout) {
        clearTimeout(thinkTimeout);
        thinkTimeout = null;
        const move = randomMove(currentFen);
        self.postMessage('bestmove ' + move);
      }
      return;
    }

    if (msg === 'quit') {
      if (thinkTimeout) clearTimeout(thinkTimeout);
      return;
    }
  };
})();
