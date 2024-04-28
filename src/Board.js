import { useEffect, useRef, useState } from 'react';
import './Board.css';
import { ASSETS, STARTING_PIECES } from './assets/data';

const mapNum = (num, mapFunc) => Array(num).fill(0).map(mapFunc);

const CELL_SIZE_PX = 100;
const PIECE_SIZE_PX = 100;
const GRID_SIZE = 8;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

export function Board({ mouseX, mouseY }) {
  const [holdingPiece, setHoldingPiece] = useState(undefined);
  const [activePiece, setActivePiece] = useState(undefined);
  const [pieces, setPieces] = useState(STARTING_PIECES.map(p => ({ ...p })));
  const boardRef = useRef(null);

  const movePieceTo = (piece, rank, file) => {
    setPieces(pieces => {
      const newPieces = [...pieces];
      newPieces[piece].rank = rank;
      newPieces[piece].file = file;
      return newPieces;
    });
    setActivePiece(undefined);
  };

  const onCellClick = (rank, file) => {
    if (activePiece === undefined) return;

    movePieceTo(activePiece, rank, file);
  };

  const releasePiece = event => {
    if (!holdingPiece) return;
    setHoldingPiece(undefined);

    const bounds = boardRef.current.getBoundingClientRect();
    const rank = Math.floor((event.clientY - bounds.top) / CELL_SIZE_PX);
    const file = Math.floor((event.clientX - bounds.left) / CELL_SIZE_PX);
    if (rank < 0 || rank >= GRID_SIZE || file < 0 || file >= GRID_SIZE) return;

    if (
      holdingPiece.startingPosition.rank === rank &&
      holdingPiece.startingPosition.file === file
    ) {
      return;
    }

    movePieceTo(holdingPiece.index, rank, file);
  };

  return (
    <div className={'board'} ref={boardRef} onMouseUp={releasePiece}>
      {mapNum(GRID_SIZE, (_, rankIndex) => (
        <Rank
          key={`rank-${rankIndex}`}
          rankIndex={rankIndex}
          activePiece={pieces[activePiece]}
          onCellClick={onCellClick}
        />
      ))}

      {pieces.map((piece, i) => {
        let x, y;

        const isHeld = holdingPiece?.index === i;
        if (isHeld) {
          const bounds = boardRef.current.getBoundingClientRect();
          x = mouseX - bounds.left - holdingPiece.mouseOffset[0];
          y = mouseY - bounds.top - holdingPiece.mouseOffset[1];
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
            onMouseDown={event => {
              if (activePiece !== undefined) {
                movePieceTo(activePiece, piece.rank, piece.file);
                return;
              }

              setHoldingPiece({
                index: i,
                mouseOffset: [
                  event.nativeEvent.offsetX,
                  event.nativeEvent.offsetY,
                ],
                startingPosition: { rank: piece.rank, file: piece.file },
              });
              setActivePiece(i);
            }}
          />
        );
      })}
    </div>
  );
}

export function Rank({ rankIndex, activePiece, onCellClick }) {
  return (
    <div className={'rank'}>
      {mapNum(GRID_SIZE, (_, file) => (
        <Cell
          key={`cell-${rankIndex}-${file}`}
          onClick={() => onCellClick(rankIndex, file)}
          isDark={(rankIndex + file) % 2 === 0}
          isActive={
            activePiece?.rank === rankIndex && activePiece?.file === file
          }
        />
      ))}
    </div>
  );
}

export function Cell({ onClick, isDark, isActive }) {
  const cellColourClass = isDark ? 'cell-dark' : 'cell-light';
  const cellClass = `${cellColourClass} ${isActive ? 'cell-active' : ''}`;

  return <div className={`cell ${cellClass}`} onClick={onClick} />;
}

export function Piece({ x, y, color, type, isHeld, onMouseDown, onClick }) {
  return (
    <img
      src={ASSETS[color][type]}
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
