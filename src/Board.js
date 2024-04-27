import './Board.css';
import { useEffect, useRef, useState } from 'react';

const CELL_SIZE_PX = 100;
const PIECE_SIZE_PX = 90;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

const num = () => Math.floor(Math.random() * 3);
const piece = pieceIndex => ({
  row: num(),
  col: num(),
  color: ['red', 'green', 'blue'][pieceIndex % 3],
});
const count = 2;

export function Board({ mouseX, mouseY }) {
  const [holdingPiece, setHoldingPiece] = useState(undefined);
  const [activePiece, setActivePiece] = useState(undefined);
  const [pieces, setPieces] = useState(
    Array(count)
      .fill(0)
      .map((_, i) => piece(i)),
  );
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
        if (row < 0 || row >= 3 || col < 0 || col >= 3) return;

        movePieceTo(holdingPiece.pieceIndex, row, col);
      }}
    >
      {Array(3)
        .fill(0)
        .map((_, r) => (
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
      {Array(3)
        .fill(0)
        .map((_, col) => (
          <Cell
            key={`cell-${col}-${row}`}
            onClick={() => onCellClick(col, row)}
          />
        ))}
    </div>
  );
}

export function Cell({ onClick }) {
  return <div className={'cell'} onClick={onClick} />;
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
