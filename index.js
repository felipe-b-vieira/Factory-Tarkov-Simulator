const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//Configuração de resolução e tamanho da tela
const resolution = 2;
canvas.width = 1200;
canvas.height = 600;

//isso define o tamanho do grip
const COLS = canvas.width / resolution/2;
const ROWS = canvas.height / resolution/2;

//função para gerar numero aleatorio entre min e max
function randomNums(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//classe responsável por ser um PMC
class Pmc{
	constructor(l,x,y,s,a,c,p,e,be,bd,pe,pd) {
		//informações do desenho e posição
		this.largura=l;
		this.posX=x;
		this.posXAnt=x;
		this.posY=y;
		this.posYAnt=y;
		//informações relacionadas a velocidade de movimento
		this.speedBase=s;		
		this.speed=s;
		this.stamina=a;
		//informações relacionadas a vida das partes do corpo
		this.cabeca=c;
		this.peitoral=p;
		this.estomago=e;
		this.bracoEsq=be;
		this.bracoDir=bd;
		this.pernaEsq=pe;
		this.pernaDir=pd;
		this.cabecaAtual=c;
		this.peitoralAtual=p;
		this.estomagoAtual=e;
		this.bracoEsqAtual=be;
		this.bracoDirAtual=bd;
		this.pernaEsqAtual=pe;
		this.pernaDirAtual=pd;
	}
	movimenta(){
		if(this.stamina>0){
			this.speed = this.speedBase*2;
			this.stamina = this.stamina-1;
			this.correndo = true;
		}
		else{
			this.speed = this.speedBase;
			if(this.stamina<this.staminaBase){
				this.stamina = this.stamina+1;
			}
			this.correndo = false;
		}
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

	//função de pathfinding a*
	encontraCaminhoPFA(inicioX,inicioY, fimX,fimY,grid){
		//listas abertas dos caminhos
		let abertosX=[inicioX];
		let abertosY=[inicioY];
		
		//lista se o ponto está aberto ou não
		let aberto = new Array(grid.length).fill(null)
		.map(() => new Array(grid[0].length).fill(null)
		  .map(() => 0));;
		aberto[inicioX][inicioY]=1;

		
		//distancia do ponto inicial
		let dist = new Array(grid.length).fill(null)
		.map(() => new Array(grid[0].length).fill(null)
		  .map(() => 0));;
		dist[inicioX][inicioY]=0;

		//distancia do ponto final
		let distF = new Array(grid.length).fill(null)
		.map(() => new Array(grid[0].length).fill(null)
		  .map(() => 0));;
		distF[inicioX][inicioY]=0;

		//custo total
		let custo = new Array(grid.length).fill(null)
		.map(() => new Array(grid[0].length).fill(null)
		  .map(() => 0));;
		custo[inicioX][inicioY]=0;

		while(abertosX.length>0 && abertosY.length>0){

			//pego os valores abertos com menor f
			primValX = abertosX[0];
			abertosX.shift();
			primValY = abertosY[0];
			abertosY.shift();

			//verifica se pegou o resultado

			//pega os vizinhos

			//verifica cada vizinho
			for(let v=0;v<vizinhos.length;v++){
				//verifica se o vizinho pode ser vizitado
				if(grid[vizinhos[v].x][vizinhos[v].y]==1 || aberto[vizinhos[v].x][vizinhos[v].y]==1){
					continue
				}
				
				//calculo do g
				dist[vizinhos[v].x][vizinhos[v].y] = dist[primValX][primValY]+1
				//calculo do h
				distF[vizinhos[v].x][vizinhos[v].y] = (fimX-vizinhos[v].x)*(fimX-vizinhos[v].x) + (fimY-vizinhos[v].y)*(fimY-vizinhos[v].y)
				//calculo do f
				custo[vizinhos[v].x][vizinhos[v].y] = distF[vizinhos[v].x][vizinhos[v].y] + dist[vizinhos[v].x][vizinhos[v].y]
				//verifica se é mais barato ou melhor

				//adiciona a lista de abertos ordenado por f
			}
		}

	}
}
	
	
//cria o grid
function buildGrid() {
	const grid = new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
      .map(() => 0));
	
	//cria bloqueios
	maxTamBloqueioX=40;
	maxTamBloqueioY=40;
	minTamBloqueioX=7;
	minTamBloqueioY=7;
	maxQuantBloqueios = 25;
	minQuantBloqueios = 10;
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
let pmc1 = new Pmc(2,2,2,2,100,50,85,85,100,100,100,100);
let ajusteX = 140;
let ajusteY = 0;
//renderiza os textos do UI dos PMC
renderTextosVida(pmc1)

//atualiza a tela usando a função update
requestAnimationFrame(update);

//função que atualizada a cada frame
function update() {
	pmc1.moveBaixo(grid);
	grid = pmc1.atualizaGridPMC(grid);
	renderPMCInfos(pmc1);
	render(grid,ajusteX,ajusteY);
	requestAnimationFrame(update);
}

//renderiza as informaçoes do PMC enviado
function renderPMCInfos(pmc) {
      renderVida(pmc.cabecaAtual,pmc.cabeca,1);
      renderVida(pmc.peitoralAtual,pmc.peitoral,2);
      renderVida(pmc.estomagoAtual,pmc.estomago,3);
      renderVida(pmc.bracoDirAtual,pmc.bracoDir,4);
      renderVida(pmc.bracoEsqAtual,pmc.bracoEsq,5);
      renderVida(pmc.pernaDirAtual,pmc.pernaDir,6);
      renderVida(pmc.pernaEsqAtual,pmc.pernaEsq,7);
    
  }
//renderiza apenas os textos da vida
function renderTextosVida() {
      renderTextoVida("Cabeça",1);
      renderTextoVida("Peitoral",2);
      renderTextoVida("Estomago",3);
      renderTextoVida("Braço Direito",4);
      renderTextoVida("Braço Esquerdo",5);
      renderTextoVida("Perna Direita",6);
      renderTextoVida("Perna Esquerda",7);
    
  }
//renderiza barra de vida com os valores enviados
function renderVida(atual, total, pos) {
	
    ctx.beginPath();
	per=100*(atual/total);
	ctx.clearRect(0, pos*30, 100, 5);
    ctx.rect(0, pos*30, per, 5);
    if(per > 63){
        ctx.fillStyle="green"
    }else if(per > 37){
        ctx.fillStyle="gold"
    }else if(per > 13){
      ctx.fillStyle="orange";
    }else{
      ctx.fillStyle="red";
    }
    ctx.fill();
    ctx.closePath();
	
  }
  
//renderiza os textos acima das barras de vida
function renderTextoVida(nome,pos) {
	
    ctx.beginPath();
	ctx.font = "12px Arial";
	ctx.fillText(nome, 0, pos*30 - 3); 
    ctx.fillStyle="black";
    ctx.closePath();
    
  }
//renderiza as informaçoes na tela
function render(grid,x,y) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution + x, row * resolution+y, resolution, resolution);
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
      ctx.closePath();
      // ctx.stroke();
    }
  }
}