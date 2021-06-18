import jsChessEngine from 'js-chess-engine'
import readline from 'readline'

const game = new jsChessEngine.Game()
const bestmove = {};
play(false)

function play (auto) {
    game.printToConsole()
    if(auto) {
        const aimove = game.aiMove(1, true)
        console.log('AI Played: ', aimove); 
        return play(!auto);
    } else {
        console.log('Your move ...');
        bestmove.l0 = game.aiMove(0, false)
        console.log('Best move L0: ', bestmove.l0)
        bestmove.l1 = game.aiMove(1, false)
        console.log('Best move L1: ', bestmove.l1)
        bestmove.l2 = game.aiMove(2, false)
        console.log('Best move L2: ', bestmove.l2)
        bestmove.l3 = game.aiMove(3, false)
        console.log('Best move L3: ', bestmove.l3)
        bestmove.l4 = game.aiMove(4, false)
        console.log('Best move L4: ', bestmove.l4)
    }

    let rl = getInput()
    rl.question('From? ', from => {
        rl.close()
        if(selection(from)) return run(from, auto);
        const moves = game.moves(from)
        console.log('Your options: ', moves)
        rl = getInput()
        rl.question('To? ', to => {
            rl.close()
            console.log('You Played: ', {from,to})
            try {
                game.move(from, to)
            } catch (error) {
                console.log(`Skipping: ${error}`)
            }
            if (game.exportJson().isFinished) {
                console.log('Game over')
            } else {
                play(!auto)
            }
        })
    })
}

function selection(option) {
    option = option.toLowerCase();
    switch(option) {
        case 'l0': case 'l1': case 'l2': case 'l3': case 'l4': return bestmove[option];
    }
    return false;
}
function run(move, auto) {
    move = move.toLowerCase();
    if(!move.to) move = bestmove[move]; // move is l0 or l1 or l2 etc.
    let {from, to} = move;
    console.log('You Played: ', {from,to})
    try {
        game.move(from, to)
    } catch (error) {
        console.log(`Skipping: ${error}`)
    }
    if (game.exportJson().isFinished) {
        console.log('Game over')
    } else {
        play(!auto)
    }
}

function getInput () {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
}
