var Human_Player;
var AI_Player;
const Board = [];
const WinCombos = [
	[1,2,3],
	[4,5,6],
	[7,8,9],
	[1,4,7],
	[2,5,8],
	[3,6,9],
	[3,5,7],
	[1,5,9]
];
var xplayer_query = document.querySelector(".xsymbol");
var oplayer_query = document.querySelector(".osymbol");
var table_query = document.querySelectorAll(".col");

xplayer_query.addEventListener('click', () => {
	Human_Player = "X";
	AI_Player = "O";
	xplayer_query.disabled = true;
	oplayer_query.disabled = true;
})

oplayer_query.addEventListener('click', () => {
	Human_Player = "O";
	AI_Player = "X";
	xplayer_query.disabled = true;
	oplayer_query.disabled = true;
})

OrgGame();
function OrgGame() {
	Human_Player = "";
	xplayer_query.disabled = false;
	oplayer_query.disabled = false;
	document.querySelector(".result").style.display = "none";
	document.querySelector(".table").style.opacity = "100%";
	
	for(let i = 0; i < 10; i++)
		Board[i] = i;
	
	for(var i = 0; i < table_query.length; i++)
	{
		table_query[i].innerText = "";
		table_query[i].style.removeProperty('background-color');
		table_query[i].addEventListener('click', clickEvent);
	}
}

function clickEvent(Event) {
	if(!Human_Player || !AI_Player)
	{
		alert('Please Select Your Symbol!!!');
		return;
	}
	Board[Event.target.id] = Human_Player;
	document.getElementById(Event.target.id).innerText = Human_Player;
	document.getElementById(Event.target.id).removeEventListener('click', clickEvent);
	
	let IsHumanOwn = IsOwn();
	if(IsHumanOwn)
	{
		EndGame(IsHumanOwn);
		return;
	}
	
	if(Tie())
	{
		BotEvent();
		let IsAIOwn = IsOwn();
		if(IsAIOwn)
			EndGame(IsAIOwn);
	}
}

function EmptySpot() {
	let Empty = [];
	for(let i = 1; i < Board.length; i++)
	{
		if((Board[i] >= 1 && Board[i] <= 9))
			Empty.push(i);
	}
	return Empty;
}

function BotEvent() {
	let BotRandClick = MinMax(Board, AI_Player);
	Board[BotRandClick.index] = AI_Player;
	document.getElementById(BotRandClick.index).innerText = AI_Player;
	document.getElementById(BotRandClick.index).removeEventListener('click', clickEvent);
}

function MinMax(Board, player) {
	let IsEmpty = EmptySpot();
	let WhichPlayer = IsOwn();
	
	if(WhichPlayer && WhichPlayer.player == Human_Player)
	{
		return {score: -10};
	}
	else if(WhichPlayer && WhichPlayer.player == AI_Player)
	{
		return {score: 10};
	}
	else if(IsEmpty.length === 0)
	{
		return {score: 0};
	}
	
	let moves = [];
	for(let i = 0; i < IsEmpty.length; i++)
	{
		let move = {};
		move.index = Board[IsEmpty[i]];
		Board[IsEmpty[i]] = player;
		
		if(player === AI_Player) {
			let result = MinMax(Board, Human_Player);
			move.score = result.score;
		} else {
			let result = MinMax(Board, AI_Player);
			move.score = result.score;
		}
		
		Board[IsEmpty[i]] = move.index;
		moves.push(move);
	}
	
	let bestMove;
	if(player === AI_Player)
	{
		let HighScore = -1000;
		for(let i = 0; i < moves.length; i++)
		{
			if(moves[i].score > HighScore)
			{
				HighScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let HighScore = 1000;
		for(let i = 0; i < moves.length; i++)
		{
			if(moves[i].score < HighScore)
			{
				HighScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	
	return moves[bestMove];
}

function Tie() {
	let EmptyCount = 0;
	for(let i = 1; i < Board.length; i++)
	{
		if(Board[i] >= 1 && Board[i] <= 9)
			EmptyCount++;
	}
	if(EmptyCount)
	{
		return true;
	}
	for(let i = 0; i < table_query.length; i++)
	{
		table_query[i].style.backgroundColor = "green";
		table_query[i].removeEventListener('click', clickEvent);
	}
	declareWinner("Tie Game!");
	return false;
}

function IsOwn() {
	let GameOwn = null;
	for(let i = 0; i < WinCombos.length; i++)
	{
		let WhichPlayer = Board[WinCombos[i][0]];
		let WhichPlayer1 = Board[WinCombos[i][1]];
		let WhichPlayer2 = Board[WinCombos[i][2]];
		
			if(WhichPlayer1 === WhichPlayer && WhichPlayer2 === WhichPlayer)
			{
				GameOwn = {index: i, player: WhichPlayer};
				break;
			}
	}
	return GameOwn;
}

function EndGame(GameOwn) {
	for(let index of WinCombos[GameOwn.index]) {
		document.getElementById(index).style.backgroundColor = "Green";
	}
	
	for(let i = 0; i < table_query.length; i++)
	{
		table_query[i].removeEventListener('click', clickEvent);
	}
	
	(GameOwn.player === Human_Player) ? declareWinner("You Win!") : declareWinner("You Lose!");
}

function declareWinner(WhoseWin) {
	document.querySelector(".result .resulttext").innerText = WhoseWin;
	document.querySelector(".table").style.opacity = "50%";
	document.querySelector(".result").style.display = "block";
}

















