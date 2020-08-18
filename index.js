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
				console.log(col)
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
				console.log(col)
				grid[col][row] = 2;
			}
		}
	}
	return grid;
}
let grid = buildGrid();

//atualiza a tela usando a função update
requestAnimationFrame(update);

//função que atualizada a cada frame
function update() {
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
	  else{
		  ctx.fillStyle = 'red'
	  }
      ctx.fill();
      // ctx.stroke();
    }
  }
}