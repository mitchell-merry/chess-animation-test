import './Board.css';
import { useEffect, useRef, useState } from 'react';
import black_king from './assets/black_king.svg';
import black_queen from './assets/black_queen.svg';
import black_rook from './assets/black_rook.svg';
import black_bishop from './assets/black_bishop.svg';
import black_knight from './assets/black_knight.svg';
import black_pawn from './assets/black_pawn.svg';
import white_king from './assets/white_king.svg';
import white_queen from './assets/white_queen.svg';
import white_rook from './assets/white_rook.svg';
import white_bishop from './assets/white_bishop.svg';
import white_knight from './assets/white_knight.svg';
import white_pawn from './assets/white_pawn.svg';

const mapNum = (num, mapFunc) => Array(num).fill(0).map(mapFunc);

const CELL_SIZE_PX = 100;
const PIECE_SIZE_PX = 90;
const GRID_SIZE = 8;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

const assets = {
  black: {
    king: black_king,
    queen: black_queen,
    rook: black_rook,
    bishop: black_bishop,
    knight: black_knight,
    pawn: black_pawn,
  },
  white: {
    king: white_king,
    queen: white_queen,
    rook: white_rook,
    bishop: white_bishop,
    knight: white_knight,
    pawn: white_pawn,
  },
};

const STARTING_PIECES = [
  { rank: 0, file: 0, color: 'black', type: 'rook' },
  { rank: 0, file: 1, color: 'black', type: 'knight' },
  { rank: 0, file: 2, color: 'black', type: 'bishop' },
  { rank: 0, file: 3, color: 'black', type: 'queen' },
  { rank: 0, file: 4, color: 'black', type: 'king' },
  { rank: 0, file: 5, color: 'black', type: 'bishop' },
  { rank: 0, file: 6, color: 'black', type: 'knight' },
  { rank: 0, file: 7, color: 'black', type: 'rook' },
  { rank: 1, file: 0, color: 'black', type: 'pawn' },
  { rank: 1, file: 1, color: 'black', type: 'pawn' },
  { rank: 1, file: 2, color: 'black', type: 'pawn' },
  { rank: 1, file: 3, color: 'black', type: 'pawn' },
  { rank: 1, file: 4, color: 'black', type: 'pawn' },
  { rank: 1, file: 5, color: 'black', type: 'pawn' },
  { rank: 1, file: 6, color: 'black', type: 'pawn' },
  { rank: 1, file: 7, color: 'black', type: 'pawn' },
  { rank: 6, file: 0, color: 'white', type: 'pawn' },
  { rank: 6, file: 1, color: 'white', type: 'pawn' },
  { rank: 6, file: 2, color: 'white', type: 'pawn' },
  { rank: 6, file: 3, color: 'white', type: 'pawn' },
  { rank: 6, file: 4, color: 'white', type: 'pawn' },
  { rank: 6, file: 5, color: 'white', type: 'pawn' },
  { rank: 6, file: 6, color: 'white', type: 'pawn' },
  { rank: 6, file: 7, color: 'white', type: 'pawn' },
  { rank: 7, file: 0, color: 'white', type: 'rook' },
  { rank: 7, file: 1, color: 'white', type: 'knight' },
  { rank: 7, file: 2, color: 'white', type: 'bishop' },
  { rank: 7, file: 3, color: 'white', type: 'queen' },
  { rank: 7, file: 4, color: 'white', type: 'king' },
  { rank: 7, file: 5, color: 'white', type: 'bishop' },
  { rank: 7, file: 6, color: 'white', type: 'knight' },
  { rank: 7, file: 7, color: 'white', type: 'rook' },
];

export function Board({ mouseX, mouseY }) {
  const [holdingPiece, setHoldingPiece] = useState(undefined);
  const [activePiece, setActivePiece] = useState(undefined);
  const [pieces, setPieces] = useState(STARTING_PIECES.map(p => ({ ...p })));
  const boardRef = useRef(null);

  useEffect(() => {
    console.log('Active piece:', activePiece);
  }, [activePiece]);

  useEffect(() => {
    console.log('Holding piece:', holdingPiece);
  }, [holdingPiece]);

  const movePieceTo = (piece, rank, file) => {
    setPieces(pieces => {
      const newPieces = [...pieces];
      newPieces[piece].rank = rank;
      newPieces[piece].file = file;
      return newPieces;
    });
  };

  const onCellClick = (rank, file) => {
    if (activePiece === undefined) return;

    movePieceTo(activePiece, rank, file);
    setActivePiece(undefined);
  };

  return (
    <div
      className={'board'}
      ref={boardRef}
      // onMouseUp={event => {
      //   if (!holdingPiece) return;
      //   setHoldingPiece(undefined);
      //
      //   const bounds = boardRef.current.getBoundingClientRect();
      //   const rank = Math.floor((event.clientY - bounds.top) / CELL_SIZE_PX);
      //   const file = Math.floor((event.clientX - bounds.left) / CELL_SIZE_PX);
      //   if (rank < 0 || rank >= GRID_SIZE || file < 0 || file >= GRID_SIZE)
      //     return;
      //
      //   movePieceTo(holdingPiece.pieceIndex, rank, file);
    >
      {mapNum(GRID_SIZE, (_, r) => (
        <Rank key={`rank-${r}`} rank={r} onCellClick={onCellClick} />
      ))}

      {pieces.map((piece, i) => {
        let x, y;

        const isHeld = holdingPiece?.pieceIndex === i;
        if (isHeld) {
          const bounds = boardRef.current.getBoundingClientRect();
          x = mouseX - bounds.left - holdingPiece.pieceOffset[0];
          y = mouseY - bounds.top - holdingPiece.pieceOffset[1];
        } else {
          x = piece.file * CELL_SIZE_PX + PIECE_PAD_PX;
          y = piece.rank * CELL_SIZE_PX + PIECE_PAD_PX;
        }

        return (
          <Piece
            key={i}
            isHeld={isHeld}
            x={x}
            y={y}
            color={piece.color}
            type={piece.type}
            // onMouseDown={event => {
            //   setHoldingPiece({
            //     pieceIndex: i,
            //     pieceOffset: [
            //       event.nativeEvent.offsetX,
            //       event.nativeEvent.offsetY,
            //     ],
            //   });
            // }}
            onClick={() => {
              if (activePiece !== undefined) {
                movePieceTo(activePiece, piece.rank, piece.file);
                setActivePiece(undefined);
              } else {
                setActivePiece(i);
              }
            }}
          />
        );
      })}
    </div>
  );
}

export function Rank({ rank, onCellClick }) {
  return (
    <div className={'rank'}>
      {mapNum(GRID_SIZE, (_, file) => (
        <Cell
          key={`cell-${rank}-${file}`}
          onClick={() => onCellClick(rank, file)}
          color={(rank + file) % 2 === 0 ? '#f0d9b5' : '#b58863'}
        />
      ))}
    </div>
  );
}

export function Cell({ onClick, color }) {
  return (
    <div
      className={'cell'}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}

export function Piece({ x, y, color, type, isHeld, onMouseDown, onClick }) {
  return (
    <img
      src={assets[color][type]}
      alt={`${color} ${type}`}
      className={'piece'}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: !isHeld ? 'transform 0.1s ease' : undefined,
      }}
      draggable={false}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
}
