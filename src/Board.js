import { useRef, useState } from 'react';
import './Board.css';
import { ASSETS, STARTING_PIECES } from './assets/data';

const mapNum = (num, mapFunc) => Array(num).fill(0).map(mapFunc);

const CELL_SIZE_PX = 100;
const PIECE_SIZE_PX = 100;
const GRID_SIZE = 8;
const PIECE_PAD_PX = (CELL_SIZE_PX - PIECE_SIZE_PX) / 2;

export function Board({ mouseX, mouseY }) {
  const [holdingPieceUUID, setHoldingPieceUUID] = useState(undefined);
  const [activePieceUUID, setActivePieceUUID] = useState(undefined);
  const [pieces, setPieces] = useState(
    STARTING_PIECES.map(p => ({ ...p, uuid: `${Math.random()}` })),
  );
  const boardRef = useRef(null);

  const pieceAt = (rank, file) =>
    pieces.find(piece => piece.rank === rank && piece.file === file);

  const movePieceTo = (pieceUuid, rank, file) => {
    setActivePieceUUID(undefined);

    // exit early if the piece is already in the correct position
    if (pieceAt(rank, file)?.uuid === pieceUuid) {
      return;
    }

    setPieces(pieces => {
      const newPieces = pieces
        .map(p => ({ ...p }))
        .filter(piece => !(piece.rank === rank && piece.file === file));

      const pieceToMove = newPieces.find(piece => piece.uuid === pieceUuid);
      pieceToMove.rank = rank;
      pieceToMove.file = file;

      return newPieces;
    });
  };

  const onCellClick = (rank, file) => {
    if (activePieceUUID === undefined) return;

    movePieceTo(activePieceUUID, rank, file);
  };

  const releasePiece = event => {
    if (!holdingPieceUUID) return;
    setHoldingPieceUUID(undefined);

    const bounds = boardRef.current.getBoundingClientRect();
    const rank = Math.floor((event.clientY - bounds.top) / CELL_SIZE_PX);
    const file = Math.floor((event.clientX - bounds.left) / CELL_SIZE_PX);
    if (rank < 0 || rank >= GRID_SIZE || file < 0 || file >= GRID_SIZE) return;

    const holdingPiece = pieces.find(p => p.uuid === holdingPieceUUID);
    if (holdingPiece.rank === rank && holdingPiece.file === file) {
      return;
    }

    movePieceTo(holdingPieceUUID, rank, file);
  };

  return (
    <div className={'board'} ref={boardRef} onMouseUp={releasePiece}>
      {mapNum(GRID_SIZE, (_, rankIndex) => (
        <Rank
          key={`rank-${rankIndex}`}
          rankIndex={rankIndex}
          activePiece={pieces.find(piece => piece.uuid === activePieceUUID)}
          onCellClick={onCellClick}
        />
      ))}

      {pieces.map((piece, i) => {
        let x, y;

        const isHeld = holdingPieceUUID === piece.uuid;
        if (isHeld) {
          const bounds = boardRef.current.getBoundingClientRect();
          x = mouseX - bounds.left - PIECE_SIZE_PX / 2;
          y = mouseY - bounds.top - PIECE_SIZE_PX / 2;
        } else {
          x = piece.file * CELL_SIZE_PX + PIECE_PAD_PX;
          y = piece.rank * CELL_SIZE_PX + PIECE_PAD_PX;
        }

        return (
          <Piece
            key={piece.uuid}
            isHeld={isHeld}
            x={x}
            y={y}
            color={piece.color}
            type={piece.type}
            onMouseDown={event => {
              if (activePieceUUID !== undefined) {
                movePieceTo(activePieceUUID, piece.rank, piece.file);
                return;
              }

              setHoldingPieceUUID(piece.uuid);
              setActivePieceUUID(piece.uuid);
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
  const classes = Object.values({
    base: 'cell',
    colour: isDark ? 'cell-dark' : 'cell-light',
    active: isActive ? 'cell-active' : '',
  }).join(' ');

  return <div className={classes} onClick={onClick} />;
}

export function Piece({ x, y, color, type, isHeld, onMouseDown, onClick }) {
  const classes = Object.values({
    base: 'piece',
    held: isHeld ? 'piece-held' : 'piece-unheld',
  }).join(' ');

  return (
    <img
      src={ASSETS[color][type]}
      alt={`${color} ${type}`}
      className={classes}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      draggable={false}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
}
