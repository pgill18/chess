import { game, board, controls, onDrop } from './script.js'
import { commands } from './commands.js'
import { speech } from './speech1.js'

const content = {
	verb0: [{'use':'use'}, {'pick':'pick'}, {'select':'select'}, {'play':'play'}],
	verb2: [{'take':'take'}, {'capture':'capture'}, {'target':'target'}],

	file0: [{'':''}, {'first':'a'}, {'second':'b'}, {'third':'c'}, {'fourth':'d'}, {'fifth':'e'}, {'sixth':'f'}, {'seventh':'g'}, {'eighth':'h'}],
	file2: [{'':''}, {'first':'a'}, {'second':'b'}, {'third':'c'}, {'fourth':'d'}, {'fifth':'e'}, {'sixth':'f'}, {'seventh':'g'}, {'eighth':'h'}],

	color0: [{'':''}, {'white':'white'}, {'black':'black'}],
	color2: [{'':''}, {'white':'white'}, {'black':'black'}],

	sqcolor0: [{'':''}, {'white':'white'}, {'black':'black'}],
	sqcolor2: [{'':''}, {'white':'white'}, {'black':'black'}],

	direction0: [{'':''}, {'front':'front'}, {'behind':'behind'}, {'left':'left'}, {'right':'right'}],
	direction2: [{'':''}, {'front':'front'}, {'behind':'behind'}, {'left':'left'}, {'right':'right'}],

	name0: [{'king':'k'}, {'queen':'q'}, {'bishop':'b'}, {'knight':'n'}, {'rook':'r'}, {'pawn':'p'}],
	name2: [{'king':'k'}, {'queen':'q'}, {'bishop':'b'}, {'knight':'n'}, {'rook':'r'}, {'pawn':'p'}],

	verb1: [{'move':'move'}, {'push':'push'}, {'play':'play'}],
	inc11: [{'1':1},{'2':2},{'3':3},{'4':4},{'5':5},{'6':6},{'7':7}],
	dir11: dupkv([{'forward':'k'}, {'back':'q'}, {'left':'b'}, {'right':'n'}, {'forward-right':'r'}, {'forward-left':'p'}, {'back-right':'r'}, {'back-left':'p'}, {'backward-right':'r'}, {'backward-left':'p'}]),
	inc12: [{'':''},{'1':1},{'2':2},{'3':3},{'4':4},{'5':5},{'6':6},{'7':7}],
	dir12: [{'':''}, {'left':'left'}, {'right':'right'}],
};
function dupkv(list) {
	return list.map(a => {return{[a_key(a)]:a_key(a)}});
}

addList('list00', [{'use':'use'}, {'pick':'pick'}, {'select':'select'}], "", {}, list1Handler);
addList('list01', [{'':''}, {'first':'a'}, {'second':'b'}, {'third':'c'}, {'fourth':'d'}, {'fifth':'e'}, {'sixth':'f'}, {'seventh':'g'}, {'eighth':'h'}], "", {}, list1Handler);
addList('list02', [{'':''}, {'white':'white'}, {'black':'black'}], "", {}, list1Handler);
addList('list03', [{'king':'k'}, {'queen':'q'}, {'bishop':'b'}, {'knight':'n'}, {'rook':'r'}, {'pawn':'p'}], "", {}, list1Handler);
addList('list04', [{'':''}, {'front':'f'}, {'behind':'b'}, {'left':'l'}, {'right':'r'}], "the one on the", {dup:1}, list1Handler);
addList('list05', [{'':''}, {'black':'black'}, {'white':'white'}], "on square colored", {}, list1Handler);

addList('list10', [{'move':'move'}, {'push':'push'}], "", {}, list1Handler);
addList('list11', [{'1':1},{'2':2},{'3':3},{'4':4},{'5':5},{'6':6},{'7':7}], "", {}, list1Handler);
addList('list12', [{'forward':'k'}, {'back':'q'}, {'left':'b'}, {'right':'n'}, {'forward-right':'r'}, {'forward-left':'p'}, {'back-right':'r'}, {'back-left':'p'}], "", {dup:1}, list1Handler);
addList('list13', [{'':''},{'1':1},{'2':2},{'3':3},{'4':4},{'5':5},{'6':6},{'7':7}], "", {}, list1Handler);
addList('list14', [{'':''}, {'left':'left'}, {'right':'right'}], "", {}, list1Handler);
// addList('list15', [{'':''}, {'front':'b'}, {'behind':'w'}, {'left':'b'}, {'right':'n'}], "the one on the", list1Handler);
// addList('list16', [{'':''}, {'black':'b'}, {'white':'w'}], "on square colored", list1Handler);

addList('list20', [{'take':'take'}, {'capture':'capture'}, {'target':'target'}], "", {}, list1Handler);
addList('list21', [{'':''}, {'first':'a'}, {'second':'b'}, {'third':'c'}, {'fourth':'d'}, {'fifth':'e'}, {'sixth':'f'}, {'seventh':'g'}, {'eighth':'h'}], "", {}, list1Handler);
addList('list22', [{'':''}, {'black':'black'}, {'white':'white'}], "", {}, list1Handler);
addList('list23', [{'king':'k'}, {'queen':'q'}, {'bishop':'b'}, {'knight':'n'}, {'rook':'r'}, {'pawn':'p'}], "", {}, list1Handler);
addList('list24', [{'':''}, {'front':'f'}, {'behind':'b'}, {'left':'l'}, {'right':'r'}], "the one on the", {dup:1}, list1Handler);
addList('list25', [{'':''}, {'black':'black'}, {'white':'white'}], "on square colored", {}, list1Handler);

addList('lang', [{'english':'en'}, {'punjabi':'pb'}], "", {}, list1Handler);

document.getElementById("goBtnSelCmd").addEventListener("click", go);
document.getElementById("goBtnTextCmd").addEventListener("click", go);
document.getElementById("goBtnVoiceCmd").addEventListener("click", startSpeech);

function startSpeech() {
	console.log(`startSpeech()`)
	speech.startSpeech(go)
}

function go(text) {
	console.log(`go()`)
	let cmd = $('#cmd').val();
	if(typeof text!=='string') text='';
	console.log({cmd, text})
	let user_color = game.board.getPlayingColor();
	let turn_color = game.board.configuration.turn;
	let other_color = turn_color==='white' ? 'black' : 'white';
	let ai_color = user_color==='white' ? 'black' : 'white';
	console.log({user_color, ai_color, turn_color, other_color})
	let color = user_color || turn_color;
	let ocolor = color==='white' ? 'black' : 'white';
	// read option 01, 02, 03, 04 for source loc
	// read option 20, 21, 22, 23 for target loc
	// read option 1* for movement locs
	// read option 3 for language
	let list0 = [readlist('list00'),readlist('list01'),readlist('list02'),readlist('list03'),readlist('list04'),readlist('list05')]
	let list1 = [readlist('list10'),readlist('list11'),readlist('list12'),readlist('list13'),readlist('list14')]
	let list2 = [readlist('list20'),readlist('list21'),readlist('list22'),readlist('list23'),readlist('list24'),readlist('list25')]
	if(cmd) [list0, list1, list2] = parseCommand(cmd)
	if(text) [list0, list1, list2] = parseCommand(text)
	let language = readlist('lang');
	let flip = user_color==='black';
	console.log({list0, list1, list2, language})
	let piece1 = getPiece(list0, color, flip);
	let piece2 = getPiece(list2, ocolor, flip);
	let move = getMove(list1, piece1, flip);
	console.log({piece1, piece2, move});
	// game.move(move.from, move.to)
	onDrop(move.from, move.to)
}
function parseCommand(text) {
	text = commands.parseText(text)
	console.log({text}, typeof text)
	let parts = text.split(/\s*,\s*/);
	console.log({parts})
	let list0 = parts[0].split(/\s+/);
	let list1 = [], list2 = [];
	if(parts.length > 2) {
		list1 = parts[1].split(/\s+/);
		list2 = parts[2].split(/\s+/);
	} else {
		list2 = parts[1].split(/\s+/);
	}
	console.log({list0, list1, list2})
	list0 = lookupPiece(list0);
	list1 = lookupMove(list1);
	list2 = lookupPiece(list2);
	console.log({list0, list1, list2})
	return [list0, list1, list2];
}

function getPiece(list, icolor) {
	console.log(`getPiece(list, icolor)`, list, icolor);
	// let {verb, color, file, piece, direction, sqcolor} = list;
	// let bcolor='white', bfile, bpiece, bdirection, bsqcolor='black';
	let pieces = getAllPieces(list, icolor);
	console.log(`return ... getPiece(list, icolor)`, {pieces});
	// console.log({pieces})
	return pieces;
}

function getAllPieces(list, icolor) {
	console.log(`getAllPieces(list, icolor)`, list, icolor);
	let [verb, file, color, name, direction, sqcolor] = list;
	if(!color) color = icolor;
	name = setCase(name, color);
	let pieces = getPiecesWithSqcolor(color, name, sqcolor);
	console.log({color, pieces})
	pieces = getPiecesOnFile(color, name, file, pieces);
	console.log({file, pieces})
	return pieces;
}

function getPiecesOnFile(color, name, file, pieces) {
	console.log(`getPiecesOnFile(color, name, file, pieces)`, color, name, file, pieces);
	let output = [];
	// let pieces = game.getPiece(color, name);
	for(let piece of pieces) {
		let [ploc, pname] = piece;
		let pfile = getFileLetter(ploc);
		console.log({file, pfile})
		if(file && pfile!==file) continue;
		if(pname===name) output.push(piece);
	}
	function getFileLetter(file) {
		return file ? file.split('')[0].toLowerCase() : file;
	}
	return output;
}

function getPiecesWithSqcolor(color, name, sqcolor) {
	console.log(`getPiecesWithSqcolor(color, name, sqcolor)`, color, name, sqcolor);
	let output = [];
	let pieces = game.getPiece(color, name);
	for(let piece of pieces) {
		let [ploc, pname] = piece;
		let psqcolor = getSquareColor(ploc);
		console.log({sqcolor, psqcolor})
		if(sqcolor && psqcolor!==sqcolor) continue;
		if(pname===name) output.push(piece);
	}
	return output;
}

function getSquareColor(loc="") {
	console.log(`getSquareColor(loc)`, loc);
	loc = loc.toUpperCase();
	let sqcolor = 'black';
	for(let file of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
		for(let x=1; x<=8; x++) {
			let bloc = file + x;
			if(bloc===loc) return sqcolor;
			sqcolor = sqcolor==='black' ? 'white' : 'black'; // reverse at the start of new row
		}
	}
	return sqcolor;
}

function getMove(list, piece, reverse) {
	console.log(`getMove(list, piece)`, {list, piece})
	let [verb, inc1, dir1, inc2, dir2] = list;
	if(!piece.length) return;
	let loc = piece[0][0];
	console.log({piece})
	loc = calcMove(loc, inc1, dir1, reverse);
	console.log({piece})
	loc = calcMove(loc, inc2, dir2, reverse);
	console.log({piece})
	return {from:piece[0][0], to:loc};
}

function calcMove(loc, inc, dir, reverse) {
	let [file, rank] = loc.split('');
	if(reverse) inc = -inc;
	rank = parseInt(rank);
	inc = parseInt(inc);
	console.log('inp:', {loc, file, rank})
	switch(dir) {
		case 'forward': rank+=inc; break;
		case 'back': rank-=inc; break;
		case 'left': file=incChar(file,-inc); break;
		case 'right': file=incChar(file,inc); ; break;
		case 'forward-right': rank+=inc; file=incChar(file,inc); break;
		case 'back-right': rank-=inc; file=incChar(file,inc); break;
		case 'forward-left': rank+=inc; file=incChar(file,-inc); break;
		case 'back-left': rank-=inc; file=incChar(file,-inc); break;
	}
	loc = file + rank;
	console.log('out:', {loc, file, rank})
	return loc;
}

function incChar(char, inc) {
	return String.fromCharCode(char.charCodeAt(0) + inc);
}

function readlist(id) {
	return $(`#${id} :selected`).val();
	// return $(`#${id} :selected`).text();
}
function setCase(name, color) {
	if(!name || !color) return name;
	return color==='white' ? name.toUpperCase() : name.toLowerCase();
}
function addList(id, list, label, opt, handler) {
	let a_value = opt.dup ? a_key : a_val;
	let values = list.map(a => `<option value="${a_value(a)}">${a_key(a)}</option>`);
	let style = label ? ` style="width:222px;text-align:right"` : "";
	// let typeNum = list.map(a => a_key(a) && isNaN(parseInt(a_key(a)))).filter(a=>a).length
	// let width = typeNum ? 125 : 100;
	let width = list.map(a => a_key(a).length).sort((a,b)=>b-a)
	console.log({width})
	width = width[0]*10 + 70
	// let width = maxlen;
	$('#'+id).html(`
		<label for="${id}"${style}>${label}</label>
		<select class="form-select" style="width:${width}px;display:inline">
			${values.join('\n')}
		</select>
	`.trim())
}

function list1Handler() {

}

function a_key(a, count=0, out=[]) {
	Object.entries(a).map(([key,val]) => out.push(key))
	return count ? out : out[0];
}
function a_val(a, count=0, out=[]) {
	Object.entries(a).map(([key,val]) => out.push(val))
	return count ? out : out[0];
}

function lookupPiece(list) {
	let verb="", file="", color="", name="", direction="", sqcolor="";
	verb = fetchValue(list[0], content.verb0) || fetchValue(list[0], content.verb2);
	file = fetchValue(list[0], content.file0) || fetchValue(list[1], content.file0);
	color = fetchValue(list[0], content.color0) || fetchValue(list[1], content.color0) || fetchValue(list[2], content.color0);
	name = fetchValue(list[0], content.name0) || fetchValue(list[1], content.name0) || fetchValue(list[2], content.name0) || fetchValue(list[3], content.name0);
	direction = fetchValue(list[0], content.direction0) || fetchValue(list[1], content.direction0) || fetchValue(list[2], content.direction0) || fetchValue(list[3], content.direction0)
			 || fetchValue(list[4], content.direction0) || fetchValue(list[5], content.direction0) || fetchValue(list[6], content.direction0) || fetchValue(list[7], content.direction0)
			 || fetchValue(list[8], content.direction0) || fetchValue(list[9], content.direction0) || fetchValue(list[10], content.direction0) || fetchValue(list[11], content.direction0) || fetchValue(list[12], content.direction0)
	sqcolor = fetchValue(list[3], content.sqcolor0) || fetchValue(list[4], content.sqcolor0) || fetchValue(list[5], content.sqcolor0) || fetchValue(list[6], content.sqcolor0) || fetchValue(list[7], content.sqcolor0)
			 || fetchValue(list[8], content.sqcolor0) || fetchValue(list[9], content.sqcolor0) || fetchValue(list[10], content.sqcolor0) || fetchValue(list[11], content.sqcolor0) || fetchValue(list[12], content.sqcolor0)
	return [verb, file, color, name, direction, sqcolor];
}
function lookupMove(list) {
	let verb="", inc1="", dir1="", inc2="", dir2="";
	verb = fetchValue(list[0], content.verb1);
	inc1 = fetchValue(list[0], content.inc11) || fetchValue(list[1], content.inc11);
	dir1 = fetchValue(list[1], content.dir11) || fetchValue(list[2], content.dir11);
	inc2 = fetchValue(list[2], content.inc12) || fetchValue(list[3], content.inc12);
	dir2 = fetchValue(list[3], content.dir12) || fetchValue(list[4], content.dir12);
	return [verb, inc1, dir1, inc2, dir2];
}

function fetchValue(str, pairs) {
	if(!str || !pairs || !pairs.length) return "";
	for(let pair of pairs) {
		if(str===a_key(pair)) return a_val(pair);
	}
	return "";
}

controls.setPlayerLevel(2)
controls.setOpponentLevel(1)

document.getElementById("startBtn").addEventListener("click", controls.startGame);

document.getElementById("playColor").addEventListener("change", selectPlayColor);
document.getElementById("prefLevel0").addEventListener("change", selectPlayerLevel);
document.getElementById("prefLevel1").addEventListener("change", selectOpponentLevel);
document.getElementById("maxHints").addEventListener("change", selectMaxHints);
document.getElementById("minHints").addEventListener("change", selectMinHints);
document.getElementById("boardTheme").addEventListener("change", selectBoardTheme);
document.getElementById("pieceTheme").addEventListener("change", selectPieceTheme);

function selectPlayColor(event) { 
	controls.setPlayColor(event.target.value); }
function selectPlayerLevel(event) { 
	controls.setPlayerLevel(parseInt(event.target.value)); }
function selectOpponentLevel(event) { 
	controls.setOpponentLevel(parseInt(event.target.value)); }
function selectMaxHints(event) { 
	controls.setMaxHints(parseInt(event.target.value)); }
function selectMinHints(event) { 
	controls.setMinHints(parseInt(event.target.value)); }
function selectBoardTheme(event) { 
	controls.setTheme({boardTheme:event.target.value}); }
function selectPieceTheme(event) { 
	controls.setTheme({pieceTheme:event.target.value}); }
