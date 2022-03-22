var x = 50, y = 300; //coordenadas do jogador
var onscreen = []; //vetor que recebe as verificações de que os inimigos estão na tela ou nao
var disparo = false; //variavel usada na verificação do disparo
var vida = 3;
var pontos = 0;
var colisao = false; //para verificar colisao do jogador com os inimigos
var impacto = false; //para verificar a colisao da bala com o inimigo
var colisao2 = false; //para verificar a colisao do jogador com o bonus da vida
var raio_e = 30; //variaveis com o valor do raio dos objetos
var raio_q = 20;
var raio_b = 5;
var raio_vb = 10;
var tiro, tiro2;
var InimigoX = []; //vetor com as coordenadas x do inimigo
var InimigoY = []; //vetor com as coordenadas y do inimigo
var contI = 5; //quantidade de inimigos
var velocidade = 4; //velocidade inicial
var tempo = 0;
var fundoImg, persoImg, bonusImg, inimigoImg; //variaveis que recebem as imagens
var inicioImg, gameoverImg, recordImg, aboutImg; //variaveis que recebem as imagens das telas
var largura = 1000; 
var altura = 600;
var i; 
var d = []; //vetor que recebe o calculo da colisao entre o personagem e as naves inimigas
var d1 = []; //vetor que recebe o calculo da colisao entre a bala e as naves inimigas
var d2 = []; //vetor que recebe o calculo da colisao entre o personagem e a vida bonus(trevo)
var vbx; //variavel que recebe as coordenadas x da vida bonus
var vby; //variavel que recebe as coordenadas y da vida bonus
var vbnatela = true; 
var start = true; //variavel para receber condição das telas
var play = false; //variavel para receber condição das telas
var over = false; //variavel para receber condição das telas
var about = false;
var time = 0;
var maiortime = 0;
var gameSound;

//funcao que carrega as imagens usadas no programa
function preload(){
	fundoImg = loadImage('png/telas/bgt.png');
	persoImg = loadImage('png/Plane/Fly1.png');
	inimigoImg = loadImage('png/naveinimiga.png');
	bonusImg = loadImage('png/trevo.png');
	inicioImg = loadImage('png/telas/iniciot2.png');
	gameoverImg = loadImage('png/telas/gameovert3.png');
	aboutImg = loadImage('png/telas/about.png');
	gameSound = loadSound('sound/gameplay.mp3');
}

//funcao que inicializa so uma vez
function setup() {
	createCanvas(1000, 600); //cria a area do jogo
	
	vbx = 4000; //coordenadas iniciais do objeto bonus
	vby = random(580);
	
	for(i = 0; i < contI; i++){ //for para as naves inimigas, cada uma vai receber sua coordenada x e y
		InimigoX[i] = 1000 + random(800);
		InimigoY[i] = random(580);
		onscreen[i] = true; //inicializa true pq elas comecam entrando na tela
	}
	gameSound.setVolume(0.1);
	gameSound.play();
	gameSound.loop();
}

function infos(){ //funcao que contem as informações do jogo que irao aparecer pro usuario quando ele estiver jogando
	textSize(23); //tamanho da letra
	fill(255); //cor da letra
	text("Vidas: "+ vida, 40, 30); 
	text("Tempo: "+ (Math.floor(tempo/60)), 180, 30)
	time = (Math.floor(tempo/60));
}

function movimentos(){ //funcao responsavel pelos movimentos do personagem
	if(keyIsDown(LEFT_ARROW)){
		x-=5;
	}
	if(keyIsDown(RIGHT_ARROW)){
		x+=5;
	}
	if(keyIsDown(UP_ARROW)){
		y-=5;
	}
	if(keyIsDown(DOWN_ARROW)){
		y+=5;
	}
}

function limite(){ //funcao responsavel pela limitaçao de tela, onde o personagem nao pode sair da area do jogo que nem os inimigos saem 
	if(x > 910){
		x = 910;
	}
	if(x < 10){
		x = 10;
	}
	if(y > 540){
		y = 540;
	}
	if(y < 30){
		y = 30;
	}
}

function inimigos(){ //funcao que cria as naves inimigas
	for(var i = 0; i < contI; i++){
		if(onscreen[i]==true){ //se na tela for verdade, eles comecam a andar 
		InimigoX[i] -= velocidade; //pq eles comecarao no final da coordenada x, por isso eles tem q ser -
	}else{ //se os inimigos nao estiverem na tela
		InimigoY[i] = random(580); //entao o vetor coordenada y recebe um valor random 
		InimigoX[i] = 1000; //e o do x recebe o valor inicial
		onscreen[i] = true; //e eles entraram na tela, pq onscreen se torna verdade
	}
  
	if(InimigoX[i] < 0) { //se as naves inimigas sairem da tela, a coordenada x fica menos q 0
		onscreen[i] = false; //entao recebe falso, pq eles nao estao mais na tela
	}
		fill(65, 105, 225); 
		image(inimigoImg,InimigoX[i],InimigoY[i],45,40); //imagem das naves, nas coordenadas e com seu tamanho (raio)
	}
}

function draw(){
	if(play){ //se play for verdade
		setPlay(); //é chamada a função responsavel pela tela onde o usuario pode jogar 
	}
	else{
		if(start){ //se start for verdade
			setStart();	//é chamada a funcao responsavel pela tela inicial do jogo
		}
		else{
			if(over){ //se over for verdade 
				setOver(); //é chamada a funcao responsavel pela tela de game over
			}else{
				if(about){
					setAbout();
				}
			}
		}
	}
}

function tiros(){ //funcao dos tiros
	if (keyIsDown(32) && (! disparo)){ //se a barra espaço for apertada e a variavel aleatoria for falsa
		disparo = true; //disparo se torna verdadeiro
		tiro = new Bala(x+60,y+40); //e é criado uma bala de acordo com as caracteristicas q tem na funcao bala 
		tiro2 = new Bala(x+60,y+25); //e a bala sai na posicao que o personagem ta 
	}
	if (disparo) { //se disparo for verdade
		tiro.mover(); //o tiro vai se mover
		tiro2.mover(); //o outro tiro tambem
		if (tiro.xb > width) { //se o tiro passar da tela
			disparo = false; //entao disparo se torna falso, para que se possa atirar novamente
		}
	}
	if (disparo) { //se disparo for verdade
		tiro.desenhar(); //tiro 1 é desenhado
		tiro2.desenhar(); //o 2 tambem
	}
}

function colidiu(){ //funcao sobre as colisoes entre personagem, naves inimigas, objeto bonus
	for(var i = 0; i < contI; i++){ //o for vai passar por todo o vetor para calcular o negocio da distancia entre os objetos
		d[i] = int(dist(x+60, y+30, InimigoX[i]+20, InimigoY[i]+20));//vetor que recebe o calculo da distancia entre o personagem e as naves 
		
		if(disparo){ //se disparo for verdade a distancia entre as balas e as naves inimigas
			d1[i] = int(dist(tiro.xb, tiro.yb, InimigoX[i]+20, InimigoY[i]+20)); 
			d2[i] = int(dist(tiro2.xb, tiro2.yb, InimigoX[i]+20, InimigoY[i]+20));
		}
	}
  
	var d3 = int(dist(x+60, y+30, vbx+20, vby+20)); //variavel que recebe o calculo da distancia entre o personagem e o bonus da vida
	
	for(var i = 0; i < contI; i++){ //for para conferir os valores dos vetores que tem o calculo das distancias dos objetos
		if(d[i] < raio_e + raio_q && colisao==false){ //se a distancia for menor que a soma dos raios dos objetos, entao houve colisao
			colisao = true; //dessa forma, colisao se torna verdadeira
			onscreen[i] = false; //na tela recebe falso, assim o inimigo sai da tela, e volta pra sua posiçao inicial
			vida = vida - 1; //com a colisao, o jogador perde uma vida
			x = 50; //o jogador volta pra posição inicial
			y = 300; 
			InimigoY[i] = random(580); //nave inimiga volta pra posicao inicial tambem
			InimigoX[i] = 1000;
		}
		if(d[i] > raio_e + raio_q && colisao==true){ //se a distancia for maior que a soma dos raios, entao nao houve colisao
			colisao = false; //desse modo, colisao recebe falso
		}
		if(d1[i] < raio_b+raio_q && impacto == false){ //vai verificar se houve colisao entre a bala e os inimigos
			impacto = true; 
			onscreen[i] = false;
			pontuacao = true;
			InimigoY[i] = random(580); 
			InimigoX[i] = 1000;
			disparo = false; //disparo recebe falso, que assim o tiro desaparece da tela e pode atirar novamente
		}
		if(d1[i] > raio_b+raio_q && impacto == true){ //se nao houve colisao
			impacto = false; //impacto recebe falso
		}
		if(d2[i] < raio_b+raio_q && impacto == false){ //mesma coisa de verificar, o outro tiro
			impacto = true;
			onscreen[i] = false;
			InimigoY[i] = random(580); 
			InimigoX[i] = 1000;
			disparo = false;
		}
		if(d2[i] > raio_b+raio_q && impacto == true){
			impacto = false;
		}
	}
	if(d3 < raio_e+raio_vb && colisao2 == false){ //verifica se teve colisao entre o jogador e o objeto bonus
		colisao2 = true; 
		vbnatela = false; //se torna falso, que aí ela some da tela
		vida+=1; //aumenta a vida
		vby = random(580); //recebe as coordenadas iniciais
		vbx = 4000;
	}
	if(d3 > raio_e+raio_vb && colisao2 == true){ //se nao teve colisao
			colisao2 = false; //entao a outra variavel de colisao recebe falso
	}
}

function bonus(){ //funcao responsavel pelo objeto bonus, que proporciona vidas ao jogador
	if(vbnatela==true){
			vbx -= velocidade;
		}else{ //se o objeto nao tiver na tela, entao recebe novamente as coordenadas
			vby = random(580); 
			vbx = 4000;
			vbnatela = true; //e como a variavel que verifica se ta na tela ou nao, se torna verdadeira
		}
		if(vbx < 0) { //se o objeto sair da tela, entao a variavel recebe falso
		vbnatela = false;
		}
		image(bonusImg, vbx, vby, 30, 30); //desenha a imagem, as coordenadas x e y, e o tamanho do raio
}

function nivel(){ //funcao com mudanca na velocidade com que os objetos se movem
	if(tempo > 500){ //de acordo com a passagem de tempo
		velocidade = 8;
	}
	if(tempo > 800){
		velocidade = 9;
	}
	if(tempo > 1000){
		velocidade = 10;
		contI = 6; //aumenta a quantidade de inimigos
	}
	if(tempo > 1500){
		velocidade = 12;
		contI = 7;
	}
	if(tempo > 2000){
		velocidade = 14;
		contI = 9;
	}
	if(tempo > 2500){
		velocidade = 15;
		contI = 10;
	}
}

function Bala(x,y){ //funcao responsavel pelas balas
	this.xb = x; //variavel x da bala recebe o x do jogador
	this.yb = y; //variavel y da bala recebe o y do jogador

	this.desenhar = function(){ //criacao de uma funcao desenhar 
		ellipse(this.xb, this.yb, 10, 10); //desenho da bala
	}; 

	this.mover = function(){ //funcao para mover a bala
		this.xb = this.xb + 14; //é somado +10 pixels a coordenada x da bala, que faz com que ela se mova com velocidade 10
	};
}

function setStart(){ //funcao do start/inicio do jogo
	//clear();
	background(inicioImg); //plano de fundo é uma imagem que ta na variavel
	if(keyIsPressed && keyCode === ENTER){ //se aperta a tecla enter
		play = true; //play se torna verdadeiro, o que faz o programa entrar na condicao do play verdadeiro, e inicia o jogo
		start = false; //as outras variaveis de condicao se tornam falsas 
		over = false;
		about = false;
	}
	if(keyIsPressed && keyCode === 70){ //se aperta a tecla F
		play = false; //about se torna verdadeiro, o que faz o programa entrar na condicao do about verdadeiro
		start = false; //as outras variaveis de condicao se tornam falsas 
		over = false;
		about = true;
	}
}

function setPlay(){ //funcao que chama as funcoes do play
	tempo++; //tempo comeca a rodar
	background(fundoImg); //é colocado outro fundo
	image(persoImg, x, y); //personagem
	infos(); //chama as outras funcoes do jogo
	movimentos();
	limite();
	inimigos();
	tiros();
	colidiu();
	nivel();
	bonus();
	
	if(vida == 0){ //condicao para verificar se o jogador perdeu, se o total de vidas é = 0
		if(time > maiortime){
			maiortime = time;
		}
		play=false; //se for igual a 0, a partida acaba, play se torna falso
		start=false;
		over = true; //e over se torna verdadeiro, o que faz com que entre na condicao de game over
		about = false;
	}
}

function setAbout(){ //tela com as informações sobre o jogo
	background(aboutImg);
	
	if(keyIsPressed && keyCode === 83){ //se aperta a tecla S
		play = false; 
		start = true; //start se torna verdadeira, e volta pra tela inicial
		over = false;
		about = false; //as outras variaveis se tornam falsas
	}
}

function setOver(){ //funcao chamada quando o over é verdade
	background(gameoverImg); //outra imagem no fundo
	tempo = 0; //tempo é reiniciado, volta pra 0
	velocidade = 4; //velocidade volta pra o valor inicial
	
	textSize(23); //tamanho da letra
	fill(20, 8, 115); //cor da letra
	text(maiortime, 415, 62); //texto com o numero do maior tempo
	text(time, 295, 98); //o tempo da jogada
	
	//noLoop();
	if(keyIsPressed && keyCode === 83){ //se a tecla S for pressionada, entao
		play=false; //
		start=true; //start se torna verdadeira, e faz com que volte pra tela inicial do jogo
		over = false;
		about = false;
		loop(); //faz com que esteja em loop 
		vida = 3; //reinicia a variavel vida com 3
		contI = 5; //reinicia a variavel da quantidade de naves inimigas
	}
}
