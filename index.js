const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//Configuração de resolução e tamanho da tela
const resolution = 2;
canvas.width = 1200;
canvas.height = 600;

//isso define o tamanho do grip
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

//função para gerar numero aleatorio entre min e max
function randomNums(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//classe responsável por ser um PMC
class Pmc{
	constructor(l,x,y,s) {
		this.largura=l;
		this.posX=x;
		this.posXAnt=x;
		this.posY=y;
		this.posYAnt=y;
		this.speed=s;	
	}
	
	checaMovimento(grid,x,y,l){
		for(let i=Math.max(x-l,0); i<x+l; i++){
			for(let j=Math.max(y-l,0); j<y+l; j++){
				if(grid[i][j]===1){
						return false;
				}
			}	
		}
		return true
	}
	//funções de movimento
	moveCima(grid){
		if(this.checaMovimento(grid,this.posX,this.posY-this.speed,this.largura)){
			this.posYAnt = this.posY;
			this.posY = this.posY - this.speed;
		}
	}
	moveBaixo(grid){
		if(this.checaMovimento(grid,this.posX,this.posY+this.speed,this.largura)){
			this.posYAnt = this.posY;
			this.posY = this.posY + this.speed;
		}
	}
	moveEsquerda(grid){
		if(this.checaMovimento(grid,this.posX - this.speed,this.posY,this.largura)){
			this.posXAnt = this.posX;
			this.posX = this.posX - this.speed;
		}
	}
	moveDireita(grid){
		if(this.checaMovimento(grid,this.posX + this.speed,this.posY,this.largura)){
			this.posXAnt = this.posX;
			this.posX = this.posX + this.speed;
		}
	}
	
	//atualiza a posição do pmc no grid
	atualizaGridPMC(grid){
		
		//limpa a posição anterior do pmc
		for(let i=Math.max(this.posXAnt-this.largura,0); i<this.posXAnt+this.largura; i++){
			for(let j=Math.max(this.posYAnt-this.largura,0); j<this.posYAnt+this.largura; j++){
				grid[i][j]=0;
			}	
		}
		//realmente desenha o pmc
		for(let i=Math.max(this.posX-this.largura,0); i<this.posX+this.largura; i++){
			for(let j=Math.max(this.posY-this.largura,0); j<this.posY+this.largura; j++){
				grid[i][j]=3;
			}	
		}
		return grid;
	}
}
	
	
//cria o grid
function buildGrid() {
	const grid = new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
      .map(() => 0));
	
	//cria bloqueios
	maxTamBloqueioX=50;
	maxTamBloqueioY=50;
	minTamBloqueioX=10;
	minTamBloqueioY=10;
	maxQuantBloqueios = 100;
	minQuantBloqueios = 25;
	quantBloqueios = randomNums(minQuantBloqueios,maxQuantBloqueios)
	for(let bloq=0; bloq<quantBloqueios; bloq++){
		xTam = randomNums(minTamBloqueioX,maxTamBloqueioX);
		yTam = randomNums(minTamBloqueioY,maxTamBloqueioY);
		yI = randomNums(0,grid[0].length-yTam);
		xI = randomNums(0,grid.length-xTam);
		for (let col = xI; col < xI+xTam; col++) {
			for (let row = yI; row < yI+yTam; row++) {
				grid[col][row] = 1;
			}
		}
	}
	
	//cria loots
	maxQuantLoots = 10;
	minQuantLoots = 2;
	quantLoots = randomNums(minQuantLoots,maxQuantLoots)
	for(let bloq=0; bloq<quantLoots; bloq++){
		xTam = 4;
		yTam = 4;
		yI = randomNums(0,grid[0].length-yTam);
		xI = randomNums(0,grid.length-xTam);
		for (let col = xI; col < xI+xTam; col++) {
			for (let row = yI; row < yI+yTam; row++) {
				grid[col][row] = 2;
			}
		}
	}
	return grid;
}
let grid = buildGrid();
let pmc1 = new Pmc(3,2,2,2);
//atualiza a tela usando a função update
requestAnimationFrame(update);

//função que atualizada a cada frame
function update() {
	pmc1.moveBaixo(grid);
	grid = pmc1.atualizaGridPMC(grid);
	render(grid);
	requestAnimationFrame(update);
}

//renderiza as informaçoes na tela
function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
	  if(cell==0){
		  ctx.fillStyle = 'white'
	  }
	  else if(cell==1){
		  ctx.fillStyle = 'black'
	  }
	  else if(cell==2){
		  ctx.fillStyle = 'red'
	  }
	  else if(cell==3){
		  ctx.fillStyle = 'blue'
	  }
      ctx.fill();
      // ctx.stroke();
    }
  }
}