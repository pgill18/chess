function parseText(text) {
	if(!text) return text;
	text = text.replace(/\s*,\s*/g, " ");
	// let parts = text.split(/\s+/);
	let verbs = [
		['challo', 'khedo', 'varto', 'agge karo', 'halao'],
		['play', 'move', 'push'],
		['take', 'capture', 'grab', 'catch', 'seize'],
	];
	// parts[0] = adjust(parts[0], ['move', 'use', 'push'], {'move':'use', 'push':'use'});
	// parts[2] = adjust(parts[0], ['move', 'push', 'play'], {'move':'use'});
	// if(!verbs[1].includes(parts[2])) parts.splice(2, 0, 'move')
	// parts.push(',')
	// text = parts.join(' ');

	let [text2, piece] = getPiece(text);
	console.log(`........ [text2, piece]`, text2, piece)
	let [text3, move] = getMove(text2);
	console.log(`........ [text3, move]`, text3, move)
	if(!piece || !move) return;

	text = piece.join(" ") + ", " + move.join(" ") + ","
	console.log({text})
	return text;
}

// <verb> <file> <sqcolor> <piece>
// <verb> <file> <piece>
// <verb> <sqcolor> <piece>
// <file> <piece>
// <sqcolor> <piece>
// <piece>
// <piece> on <sqcolor> [square]
// <piece> on [the] <direction>
function getPiece(text) {
	console.log(`........ getPiece(text)`, text)
	let dict = {
		'<verb>': ['varto', 'chakko', 'khedo', 'challo', 'halao'],
		'<file>': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
		'<pos>': ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'],
		'<sqcolor>': ['black', 'white'],
		'<piece>': ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'],
	}
	// let [otext, piece] = match(text, `<verb> <file> <sqcolor> <piece>`, dict);
	// if(piece) return [otext, piece];
	let otext, piece;
	[otext, piece] = match(text, `<piece> nu <verv>`, dict);	if(piece) return [otext, piece];
	[otext, piece] = match(text, `<pos> <piece> nu <verb>`, dict);	if(piece) return [otext, piece];
	[otext, piece] = match(text, `<verb> <pos> <piece> nu`, dict);	if(piece) return [otext, piece];
	[otext, piece] = match(text, `<verb> <piece> nu`, dict);	if(piece) return [otext, piece];
	[otext, piece] = match(text, `<verb> <pos> <piece>`, dict);	if(piece) return [otext, piece];
	[otext, piece] = match(text, `<verb> <piece>`, dict);	if(piece) return [otext, piece];
	return [];
}

// <verb> <file> <sqcolor> <piece>
// <verb> <file> <piece>
// <verb> <sqcolor> <piece>
// <file> <piece>
// <sqcolor> <piece>
// <piece>
// <piece> on <sqcolor> [square]
// <piece> on [the] <direction>
function getMove(text) {
	console.log(`........ getMove(text)`, text)
	let dict = {
		'<verb>': ['play', 'move', 'push'],
		'<count>': ['1', '2', '3', '4', '5', '6', '7', '8', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'],
		'<counted>': ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'],
		'<direction>': ['forward', 'back', 'backward', 'left', 'right', 'forward-left', 'forward-right', 'backward-left', 'backward-right', 'back-left', 'back-right'],
		// '<direction>': ['agge', 'back', 'pichhe', 'khabbe', 'sajje', 'agge-khabbe', 'forward-sajje', 'pichhe-khabbe', 'pichhe-sajje', 'pichhe-khabbe', 'pichhe-sajje'],
	}
	// let [otext, piece] = match(text, `<verb> <file> <sqcolor> <piece>`, dict);
	// if(piece) return [otext, piece];
	// let [otext, move] = match(text, `<verb> <count> <direction>`, dict);
	// if(move) return [otext, move];
	let otext, move;
	[otext, move] = match(text, `<verb> <direction> <count> <direction> <count>`, dict, [0,2,1,4,3]);	if(move) return [otext, move];
	[otext, move] = match(text, `<verb> <count> <direction> <count> <direction>`, dict, [0,1,2,3,4]);	if(move) return [otext, move];
	[otext, move] = match(text, `<direction> <count> <direction> <count>`, dict, [1,0,3,2]);	if(move) return [otext, move];
	[otext, move] = match(text, `<count> <direction> <count> <direction>`, dict, [0,1,2,3]);	if(move) return [otext, move];
	[otext, move] = match(text, `<verb> <count> <direction>`, dict);	if(move) return [otext, move];
	[otext, move] = match(text, `<verb> <direction> <count>`, dict);	if(move) return [otext, move];
	[otext, move] = match(text, `<count> <direction>`, dict);	if(move) return [otext, move];
	[otext, move] = match(text, `<direction> <count>`, dict);	if(move) return [otext, move];
	return [];
}

function match(text, template, dict, seq) {
	if(!text) return [];
	let textWords = text.split(/\s+/);
	let templateWords = template.split(/\s+/);
	let dictWordLists = templateWords.map(a => sub(a,dict[a]));
	console.log(`........ match(text, istr, dict)`, {textWords, templateWords, dictWordLists})
	let parts = [];
	for(let i=0; i<templateWords.length; i++) {
		let textWord = textWords[i];
		console.log(`begin ... textWord=${textWord} ...`)
		if(textWord) textWord = pa2en(textWord);
		console.log(`end ... textWord=${textWord} ...`)
		let templateWord = templateWords[i]
		let dictWordList = dictWordLists[i];
		let foundMatch;
		for(let dictWord of dictWordList) {
			if(textWord===dictWord) foundMatch = textWord;
			console.log(`trying match textWord=${textWord}, dictWord=${dictWord} ... foundMatch=${foundMatch}`)
		}
		if(!foundMatch) return [];
		else parts.push( foundMatch );
	}
	textWords = textWords.slice(templateWords.length);
	// console.log(`1........ match()`, parts)
	if(seq) parts = seq.map(index => parts[index])
	parts = parts.map(word => pa2en(word))
	// console.log(`2........ match()`, parts)
	text = textWords.join(" "); // return remainder of the text
	console.log(`........ match(text, istr, dict)`, {text}, parts)
	return [text, parts];
}

function pa2en(word) {
	let dict = {
		chitta: 'white', kaala: 'black',
		agge: 'forward', pichhe: 'backward', sajje: 'right', khabbe: 'left',
		raja: 'king', rani: 'queen', hathi: 'rook', ush: 'bishop', ghora: 'knight', piada: 'pawn',
		raje: 'king', rani: 'queen', hathi: 'rook', ush: 'bishop', ghore: 'knight', piade: 'pawn',
		pehla: 'first', dooja: 'second', teeja: 'third', chautha: 'fourth', panjva: 'fifth', sheva: 'sixth', sattva: 'seventh', athva: 'eighth',
		pehle: 'first', dooje: 'second', teeje: 'third', chauthe: 'fourth', panjve: 'fifth', sheve: 'sixth', sattve: 'seventh', athve: 'eighth',
		ik: '1', do: '2', tin: '3', chaar: '4', panj: '5', shey: '6', satt: '7', ath: '8',
	};
	if(dict[word]) return dict[word];
	Object.entries(dict).map(([key,value]) => word = word.replace(key, value));
	return word;
}
function sub(a, b) {
	console.log(typeof a, a)
	return a.match(/^\<.*\>$/) ? b : [a];
}

function gur2en(word) {

}
// <verb> <count> <direction> <count> <direction>
// <verb> <count> <direction>
// <verb> <direction>

const commands_pa = { parseText }

export { commands_pa }
