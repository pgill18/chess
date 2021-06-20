// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
import * as jsChessEngine from './lib/js-chess-engine.mjs'

const game = new jsChessEngine.Game()
// const game = new Game()

var board = null
var $board = $('#myBoard')
var $status = $('#myStatus')
// var game = new Chess()

var Level = { User: 0, AI: 0 }
var Color = { User: 'white', AI: 'black' }
var MaxHints = 2;
var MinHints = 1; // min hints from selected level
var squareToHighlight = null
var squareClass = 'square-55d63'

function removeHighlights (color) {
  $board.find('.' + squareClass)
    .removeClass('highlight-' + color)
}
function addHighlights (pos, tag='z') {
  ['x','y','z'].map(tag => removeHighlights(tag));
  pos = pos.toLowerCase()
  $board.find('.square-' + pos).addClass('highlight-'+tag)
}
function select(color, piece, square) {
  let pieces = game.getPiece(color, piece, square);
  pieces.map(piece => addHighlights(piece[0]))
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  // if (game.game_over()) return false
  if(game.exportJson().isFinished) return false;

  // // only pick up pieces for White
  // if (piece.search(/^b/) !== -1) return false
  // only pick up pieces for Color.User
  if(Color.User==='white') {
    if (piece.search(/^b/) !== -1) return false
  } else {
    if (piece.search(/^w/) !== -1) return false
  }
}

function makeRandomMove () {
  var possibleMoves = game.possibleMoves({
    verbose: true
  })
  // game over
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  var move = possibleMoves[randomIdx]
  game.move(move.from, move.to)
  console.log(`Opponent's Random move`, move, {Level})

  // highlight black's move
  removeHighlights(Color.AI)
  $board.find('.square-' + move.from.toLowerCase()).addClass('highlight-'+Color.AI)
  squareToHighlight = move.to.toLowerCase()
  console.log({move})
  // update the board to the new position
  board.position(game.exportFEN())
}
function makeAiMove () {
  let move = game.aiMove(Level.AI, true)
  if (!move) return alert(`Game over! You Won.`);
  console.log(`Opponent's AI move`, move, {Level})
  // highlight black's move
  removeHighlights(Color.AI)
  $board.find('.square-' + move.from.toLowerCase()).addClass('highlight-'+Color.AI)
  squareToHighlight = move.to.toLowerCase()
  console.log({move})
  // update the board to the new position
  board.position(game.exportFEN())
}
function makeNextMove () {
  if(Level.AI < 0) { makeRandomMove(); }
  else { makeAiMove( Level.AI ) }
  if(!updateStatus()) return; // game over
  showNextMove (Level.User)
}

function showNextMove (level=0) {
  // var possibleMoves = game.possibleMoves({ verbose: true })
  // var possibleMoves = [0,0,0,0,0].map(level => game.aiMove(level, false)).filter(a=>a);
  // var possibleMoves = [0,1,2].map(level => game.aiMove(level, false));
  var possibleMoves = getPossibleMoves(level)
  console.log({possibleMoves})
  let text = possibleMoves.map(move => `[${move.from},${move.to},${move.score}]`).join(' ')
  if (possibleMoves.length === 0) text = `Can't think of anything!`;
  console.log(`Hints for next move`, text, {Level})
  console.log({text})
  $('#myHints').text( text )
  removeHighlights(Color.User);
  [0,1,2,3,4,5,6,7,8,9].forEach((a,i) => removeHighlights(''+i));
  // for(let i=0; i<possibleMoves.length; i++) {
  for(let i=possibleMoves.length-1; i>=0; i--) {
    let move = possibleMoves[i];
    $board.find('.square-' + move.from.toLowerCase()).addClass('highlight-'+i)
    $board.find('.square-' + move.to.toLowerCase()).addClass('highlight-'+i)
    console.log({move})
  }
}

function updateStatus() {
  var status = ''
  var moveColor = 'White'
  var state = game.exportJson()
  if (state.turn==='black') { moveColor = 'Black' }
  // checkmate?
  if (state.checkMate) { status = 'Game over, ' + moveColor + ' is in checkmate.' }
  // draw?
  else if (state.isFinished) { status = 'Game over, drawn position' }
  // game still on
  else {
    status = moveColor + ' to move'
    // check?
    if (state.check) {
      status += ', ' + moveColor + ' is in check'
    }
  }
  $status.html(status)
  if(state.checkMate||state.isFinished) {
    window.setTimeout(() => alert(status), 100)
  }
  return !state.checkMate && !state.isFinished;
}
function log(level, count) {
  console.log(`level=${level} ... count=${count}`)
}
function getPossibleMoves(level, max=10) {
  var hints = MaxHints;
  var allPossibleMoves = [];
  // if(level>=4) { allPossibleMoves[4] = getPossibleMovesAtLevel(4, 1); log(4, 1); hints -= 1; }
  // if(level>=3) { allPossibleMoves[3] = getPossibleMovesAtLevel(3, Math.min(1,hints)); log(3, Math.min(1,hints)); hints -= Math.min(1,hints); }
  // if(level>=2) { allPossibleMoves[2] = getPossibleMovesAtLevel(2, Math.min(1,hints)); log(2, Math.min(1,hints)); hints -= Math.min(1,hints); }
  // if(level>=1) { allPossibleMoves[1] = getPossibleMovesAtLevel(1, Math.min(3,hints)); log(1, Math.min(3,hints)); hints -= Math.min(3,hints); }
  // if(level>=0) { allPossibleMoves[0] = getPossibleMovesAtLevel(0, Math.max(10,hints)); log(0, Math.max(10,hints)); }
  if(level>=4) { allPossibleMoves[4] = getPossibleMovesAtLevel(4, 1); hints = remHints(); }
  if(level>=3) { allPossibleMoves[3] = getPossibleMovesAtLevel(3, minHints(1,hints), allPossibleMoves); hints = remHints(); }
  if(level>=2) { allPossibleMoves[2] = getPossibleMovesAtLevel(2, minHints(1,hints), allPossibleMoves); hints = remHints(); }
  if(level>=1) { allPossibleMoves[1] = getPossibleMovesAtLevel(1, minHints(3,hints), allPossibleMoves); hints = remHints(); }
  if(level>=0) { allPossibleMoves[0] = getPossibleMovesAtLevel(0, minHints(10,hints), allPossibleMoves); }
  if(level<0)  { allPossibleMoves[0] = getPossibleMovesAtLevel(level, hints); }
  console.log(JSON.stringify(allPossibleMoves))
  console.log({allPossibleMoves})
  let possibleMovesRaw = allPossibleMoves.reverse().flatMap(moves => moves); //.slice(0,MaxHints);
  let possibleMoves = [];
  for(let move of possibleMovesRaw) {
    if(!containsMove(move,possibleMoves)) possibleMoves.push(move);
  }
  // let possibleMoves = [], hash = {};
  // for(let move of possibleMovesRaw) {
  //   if(!move) continue;
  //   if(!hash[move.from+move.to]) possibleMoves.push(move);
  //   hash[move.from+move.to] = 1;
  // }
  possibleMoves = possibleMoves.slice(0, max).reverse() // back to having high-level moves at the end
  return possibleMoves;
  function minHints(n, hints, min=MinHints) { n = Math.max(n, min); return Math.min(n, hints); }
  function remHints() { return MaxHints - allPossibleMoves.flatMap(moves => moves).length; }
}
function getPossibleMovesAtLevel(level, count=1, allPossibleMoves=[], max=5) {
  console.log(`level=${level} ... count=${count}`)
  if(count<=0) return [];
  if(level<0) return game.possibleMoves({ verbose: true }).slice(0,max);
  let possibleMovesMined = allPossibleMoves.flatMap(moves => moves);
  let possibleMoves = [], hash = {};
  if(level<3) max = 10;
  for(let i=0; i<Math.max(max,count); i++) {
    let move = game.aiMove(level, false);
    console.log(move);
    if(!move) continue;
    if(!hash[move.from+move.to] && !containsMove(move, possibleMovesMined)) possibleMoves.push(move);
    hash[move.from+move.to] = 1;
    if(possibleMoves.length>=count) break;
  }
  console.log(possibleMoves.map(move => move.from+'.'+move.to));
  return possibleMoves;
}
function containsMove(imove, list, hash={}) {
  for(let move of list) {
    if(move && move.from===imove.from && move.to===imove.to) return true;
  }
  return 0;
}
function sameMove(a, b) {
  return JSON.stringify(a)===JSON.stringify(b)
}
function invertColor(color) {
  if(!color) return color;
  else color = color.toLowerCase();
  return color==='white' ? 'black' : 'white';
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move(source, target)

  // illegal move
  if (move === null) return 'snapback'

  // highlight white's move
  removeHighlights(Color.User)
  $board.find('.square-' + source).addClass('highlight-'+Color.User)
  $board.find('.square-' + target).addClass('highlight-'+Color.User)
  console.log({source, target})
  if(!updateStatus()) return; // game over
  // make random move for black
  // window.setTimeout(makeRandomMove, 250)
  window.setTimeout(makeNextMove, 100)
}

function onMoveEnd () {
  $board.find('.square-' + squareToHighlight)
    .addClass('highlight-'+Color.AI)
  showCaptured()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.exportFEN())
}

function getUnicode(name, wrapped=true) {
  const unicode = {
    k: '9818', q: '9819', r: '9820', b: '9821', n: '9822', p: '9823',
    K: '9812', Q: '9813', R: '9814', B: '9815', N: '9816', P: '9817',
  }
  // if(wrapped) return `<span style="font-size:50px">&#${unicode[name]};</span>`;
  if(wrapped) return `&#${unicode[name]};`;
  return unicode[name];
}
function fullSet(color) {
  const list = ['K', 'Q', 'R', 'R', 'B', 'B', 'N', 'N', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'];
  return (color==='white') ? list : list.map(a => a.toLowerCase());
}
function getCaptured(color) {
  let json = game.exportJson();
  let pieces = Object.values(json.pieces).filter(a => a===a.toUpperCase());
  if(color==="black") pieces = Object.values(json.pieces).filter(a => a===a.toLowerCase());
  let captured = fullSet(color).slice();
  pieces.map(a => captured.splice(captured.indexOf(a),1));
  console.log({pieces, captured})
  return captured.map(name => getUnicode(name))
}
function showCaptured() {
  document.getElementById("oCaptured").innerHTML = getCaptured(Color.User).reverse().join("") || "&nbsp;";
  document.getElementById("iCaptured").innerHTML = getCaptured(Color.AI).join("") || "&nbsp;";
}

var config = {
  draggable: true,
  position: 'start',
  pieceTheme: chess24_piece_theme,
  // boardTheme: leipzig_board_theme,
  // sparePieces: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd
}
// board = Chessboard('myBoard', config)
board = ChessBoard('myBoard', config)


function setTheme({pieceTheme, boardTheme}={}) {
  if(pieceTheme) config.pieceTheme = window[pieceTheme]
  if(boardTheme) config.boardTheme = window[boardTheme]
  board.resize() // redraws board
  console.log(`... changed theme ...`, pieceTheme, boardTheme)
  // console.log(window[pieceTheme], window[boardTheme])
}

function startGame() {
  if(Color.User==='white') {
    showNextMove (Level.User);
  } else {
    window.setTimeout(makeNextMove, 10)
  }
}

function setPlayerLevel(level) { Level.User = level }
function setOpponentLevel(level) { Level.AI = level }

function setPlayColor(color="") {
  if(color===Color.User) return;
  board.orientation(color);
  Color.User = color;
  Color.AI = invertColor(color);
  window.setTimeout(makeNextMove, 10)
  // let user_color = board.orientation();
  // if(user_color===color) {
  //   if(confirm(`Already playing ${color}. Start a new game?`)) {
  //     // game.restart(color);
  //   }
  // } else {
  //   if(confirm(`This will end current game! Start a new game?`)) {
  //     board.orientation(color);
  //     // game.restart(color);
  //   }
  // }
}
function setMaxHints(count=0) { MaxHints = count }
function setMinHints(count=0) { MinHints = count }

const controls = { setPlayColor, setPlayerLevel, setOpponentLevel, setMaxHints, setMinHints, setTheme, startGame }

export { game, board, controls, onDrop };
