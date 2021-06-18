import Board from './Board.mjs'
import { printToConsole, getFEN } from './utils.mjs'

export class Game {
    constructor (configuration) {
        this.board = new Board(configuration)
    }

    move (from, to) {
        // console.log(typeof from, typeof to)
        // console.log({from, to})
        console.log({board: this.board})
        from = from.toUpperCase()
        to = to.toUpperCase()
        const possibleMoves = this.board.getMoves()
        if (!possibleMoves[from] || !possibleMoves[from].includes(to)) {
            // throw new Error(`Invalid move from ${from} to ${to} for ${this.board.getPlayingColor()}`)
            console.log(`Invalid move from ${from} to ${to} for ${this.board.getPlayingColor()}`)
            return null;
        }
        this.board.addMoveToHistory(from, to)
        this.board.move(from, to)
        return { [from]: to }
    }

    moves (from = null) {
        return (from ? this.board.getMoves()[from.toUpperCase()] : this.board.getMoves()) || []
    }
    possibleMoves({verbose=true}={}) {
        let whitePieces = Object.entries(this.board.configuration.pieces).filter(([pos,name]) => name===name.toUpperCase()).map(([pos,name]) => pos)
        let blackPieces = Object.entries(this.board.configuration.pieces).filter(([pos,name]) => name===name.toLowerCase()).map(([pos,name]) => pos)
        let pieces = this.board.configuration.turn==='white' ? whitePieces: blackPieces;
        console.log({pieces, whitePieces, blackPieces})
        let moves = pieces.flatMap(from => this.moves(from).map(to => {return{from,to}}) );
        console.log({moves})
        return moves;
    }
    getPiece(color, name, square, {verbose=true}={}) {
        let whitePieces = Object.entries(this.board.configuration.pieces).filter(([pos,name]) => name===name.toUpperCase())
        let blackPieces = Object.entries(this.board.configuration.pieces).filter(([pos,name]) => name===name.toLowerCase())
        // let pieces = this.board.configuration.turn==='white' ? whitePieces: blackPieces;
        let pieces = color==='white' ? whitePieces: blackPieces;
        console.log({pieces, whitePieces, blackPieces})
        name = color==='white' ? name.toUpperCase() : name.toLowerCase();
        let namedPieces = pieces.filter(piece => name===piece[1]);
        console.log({name, namedPieces})
        return namedPieces;
    }
    setPiece (location, piece) {
        this.board.setPiece(location, piece)
    }

    removePiece (location) {
        this.board.removePiece(location)
    }

    aiMove (level = 2, perform=true) {
        const move = this.board.calculateAiMove(level)
        if(!perform || !move) return move;
        this.move(move.from, move.to)
        return move;
    }

    restart(side='white') {
        this.board.orientation(side)
        this.board.start(true)
    }

    getHistory (reversed = false) {
        return reversed ? this.board.history.reverse() : this.board.history
    }

    printToConsole () {
        printToConsole(this.board.configuration)
    }

    exportJson () {
        return this.board.exportJson()
    }

    exportFEN () {
        return getFEN(this.board.configuration)
    }
}

export function moves (config) {
    if (!config) {
        throw new Error('Configuration param required.')
    }
    const game = new Game(config)
    return game.moves()
}

export function status (config) {
    if (!config) {
        throw new Error('Configuration param required.')
    }
    const game = new Game(config)
    return game.exportJson()
}

export function getFen (config) {
    if (!config) {
        throw new Error('Configuration param required.')
    }
    const game = new Game(config)
    return game.exportFEN()
}

export function move (config, from, to) {
    if (!config) {
        throw new Error('Configuration param required.')
    }
    const game = new Game(config)
    game.move(from, to)
    if (typeof config === 'object') {
        return game.exportJson()
    } else {
        return game.exportFEN()
    }
}

export function aiMove (config, level = 2) {
    if (!config) {
        throw new Error('Configuration param required.')
    }
    const game = new Game(config)
    const move = game.board.calculateAiMove(level)
    return { [move.from]: move.to }
}
