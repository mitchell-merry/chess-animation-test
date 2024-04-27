import black_king from './black_king.svg';
import black_queen from './black_queen.svg';
import black_rook from './black_rook.svg';
import black_bishop from './black_bishop.svg';
import black_knight from './black_knight.svg';
import black_pawn from './black_pawn.svg';
import white_king from './white_king.svg';
import white_queen from './white_queen.svg';
import white_rook from './white_rook.svg';
import white_bishop from './white_bishop.svg';
import white_knight from './white_knight.svg';
import white_pawn from './white_pawn.svg';

export const ASSETS = {
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

export const STARTING_PIECES = [
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
