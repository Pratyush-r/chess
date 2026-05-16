'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PromotionModalProps {
  isOpen: boolean;
  color: 'white' | 'black';
  onSelect: (piece: string) => void;
  onCancel: () => void;
}

const PIECES = [
  { symbol: 'q', label: 'Queen', unicode: { white: '♕', black: '♛' } },
  { symbol: 'r', label: 'Rook', unicode: { white: '♖', black: '♜' } },
  { symbol: 'b', label: 'Bishop', unicode: { white: '♗', black: '♝' } },
  { symbol: 'n', label: 'Knight', unicode: { white: '♘', black: '♞' } },
];

export default function PromotionModal({ isOpen, color, onSelect, onCancel }: PromotionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 border border-gray-600 rounded-2xl p-4 shadow-2xl"
          >
            <h3 className="text-white font-bold text-center mb-3 text-sm">Promote pawn to:</h3>
            <div className="grid grid-cols-4 gap-2">
              {PIECES.map((piece) => (
                <motion.button
                  key={piece.symbol}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(piece.symbol)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-800 hover:bg-primary-500/20 border border-gray-700 hover:border-primary-500/50 transition-all"
                  title={piece.label}
                >
                  <span className="text-3xl">{piece.unicode[color]}</span>
                  <span className="text-xs text-gray-400">{piece.label}</span>
                </motion.button>
              ))}
            </div>
            <button
              onClick={onCancel}
              className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
