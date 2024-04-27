import './Board.css';
import { useEffect, useRef, useState } from 'react';

const CELL_SIZE_PX = 160;
const PIECE_SIZE_PX = 160;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

const r = () => Math.floor(Math.random() * 3);
const piece = pieceIndex => ({
  row: r(),
  col: r(),
  color: ['red', 'green', 'blue'][pieceIndex % 3],
});
const count = 2;

export function Board({ mouseX, mouseY }) {
  const [holdingPiece, setHoldingPiece] = useState(undefined);
  const [pieces, setPieces] = useState(
    Array(count)
      .fill(0)
      .map((_, i) => piece(i)),
  );
  const boardRef = useRef(null);

  useEffect(() => {
    console.log(holdingPiece?.pieceOffset);
  }, [holdingPiece]);

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

        setPieces(pieces => {
          const newPieces = [...pieces];
          newPieces[holdingPiece.pieceIndex].row = row;
          newPieces[holdingPiece.pieceIndex].col = col;

          return newPieces;
        });
      }}
    >
      {Array(3)
        .fill(0)
        .map((_, r) => (
          <Row key={`row-${r}`} row={r} />
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

export function Row({ row }) {
  return (
    <div className={'row'}>
      {Array(3)
        .fill(0)
        .map((_, c) => (
          <Cell key={`cell-${c}-${row}`} />
        ))}
    </div>
  );
}

export function Cell() {
  return <div className={'cell'} />;
}

export function Piece({ x, y, color, isHeld, onMouseDown }) {
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
      onMouseDown={event => onMouseDown(event, pieceRef)}
    />
  );
}
