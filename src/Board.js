import './Board.css';
import { useRef, useState } from 'react';

const mapNum = (num, mapFunc) => Array(num).fill(0).map(mapFunc);

const CELL_SIZE_PX = 100;
const PIECE_SIZE_PX = 90;
const GRID_SIZE = 8;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

const num = () => Math.floor(Math.random() * GRID_SIZE);
const piece = pieceIndex => ({
  row: num(),
  col: num(),
  color: ['red', 'green', 'blue'][pieceIndex % 3],
});
const PIECE_COUNT = 2;

export function Board({ mouseX, mouseY }) {
  const [holdingPiece, setHoldingPiece] = useState(undefined);
  const [activePiece, setActivePiece] = useState(undefined);
  const [pieces, setPieces] = useState(mapNum(PIECE_COUNT, (_, i) => piece(i)));
  const boardRef = useRef(null);

  const movePieceTo = (piece, row, col) => {
    setPieces(pieces => {
      const newPieces = [...pieces];
      newPieces[piece].row = row;
      newPieces[piece].col = col;
      return newPieces;
    });
  };

  return (
    <div
      className={'board'}
      ref={boardRef}
      onMouseUp={event => {
        if (!holdingPiece) return;
        setHoldingPiece(undefined);

        const bounds = boardRef.current.getBoundingClientRect();
        const row = Math.floor((event.clientX - bounds.left) / CELL_SIZE_PX);
        const col = Math.floor((event.clientY - bounds.top) / CELL_SIZE_PX);
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;

        movePieceTo(holdingPiece.pieceIndex, row, col);
      }}
    >
      {mapNum(GRID_SIZE, (_, r) => (
        <Row
          key={`row-${r}`}
          row={r}
          onCellClick={(row, col) => {
            if (activePiece === undefined) return;

            movePieceTo(activePiece, row, col);
            setActivePiece(undefined);
          }}
        />
      ))}

      {pieces.map((piece, i) => {
        let x, y;

        const isHeld = holdingPiece?.pieceIndex === i;
        if (isHeld) {
          const bounds = boardRef.current.getBoundingClientRect();
          x = mouseX - bounds.left - holdingPiece.pieceOffset[0];
          y = mouseY - bounds.top - holdingPiece.pieceOffset[1];
        } else {
          x = piece.row * CELL_SIZE_PX + PIECE_PAD_PX;
          y = piece.col * CELL_SIZE_PX + PIECE_PAD_PX;
        }

        return (
          <Piece
            key={i}
            isHeld={isHeld}
            x={x}
            y={y}
            color={piece.color}
            onClick={() => setActivePiece(i)}
            onMouseDown={(event, piece) => {
              setHoldingPiece({
                pieceIndex: i,
                piece: piece.current,
                pieceOffset: [
                  event.nativeEvent.offsetX,
                  event.nativeEvent.offsetY,
                ],
              });
            }}
          />
        );
      })}
    </div>
  );
}

export function Row({ row, onCellClick }) {
  return (
    <div className={'row'}>
      {mapNum(GRID_SIZE, (_, col) => (
        <Cell
          key={`cell-${col}-${row}`}
          onClick={() => onCellClick(col, row)}
          color={(row + col) % 2 === 0 ? '#f0d9b5' : '#b58863'}
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

export function Piece({ x, y, color, isHeld, onMouseDown, onClick }) {
  const pieceRef = useRef(null);

  return (
    <div
      ref={pieceRef}
      className={'piece'}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        backgroundColor: color,
        transition: !isHeld ? 'transform 0.1s ease' : undefined,
      }}
      onClick={onClick}
      onMouseDown={event => onMouseDown(event, pieceRef)}
    />
  );
}
