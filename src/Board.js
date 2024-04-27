import './Board.css';
import { useEffect, useRef, useState } from 'react';

const CELL_SIZE_PX = 160;
const PIECE_SIZE_PX = 100;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

const r = () => Math.floor(Math.random() * 3);
const piece = col => ({
  row: r(),
  col: r(),
  color: ['red', 'green', 'blue'][col],
});
const count = 3;

export function Board() {
  const [holdingPiece, setHoldingPiece] = useState(undefined);
  const [mousePosition, setMousePosition] = useState([-1, -1]);
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
      onMouseMove={event => {
        const bounds = boardRef.current.getBoundingClientRect();

        setMousePosition([
          event.clientX - bounds.left,
          event.clientY - bounds.top,
        ]);
      }}
    >
      {Array(3)
        .fill(0)
        .map((_, r) => (
          <Row key={`row-${r}`} row={r} />
        ))}

      {pieces.map((piece, i) => {
        const isHeld = holdingPiece?.pieceIndex === i;
        const x = isHeld
          ? mousePosition[0] - holdingPiece.pieceOffset[0]
          : piece.row * CELL_SIZE_PX + PIECE_PAD_PX;
        const y = isHeld
          ? mousePosition[1] - holdingPiece.pieceOffset[1]
          : piece.col * CELL_SIZE_PX + PIECE_PAD_PX;

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
