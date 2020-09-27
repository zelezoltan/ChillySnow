
class Point{
	constructor(x=0,y=0){
		this.setPosition(x,y);
	}

	setPosition(x,y){
		this.x=x;
		this.y=y;
	}

	distance(other){
		return Math.sqrt((this.x-other.x)*(this.x-other.x) + 
			(this.y-other.y)*(this.y-other.y));
	}
}

class CircularGameObject extends Point{
	constructor(x=0,y=0,radius=1){
		super(x,y);
		this.radius = radius;
	}

	collidesWidth(other){
		return (this.distance(other)-this.radius-other.radius)<=0;
	}
}

class Player extends CircularGameObject{
	constructor(x=0,y=0,radius=5){
		super(x,y,radius);
		this.direction = 1;
		this.velocity = 40;
		if(Math.round(Math.random())) {
			this.velocity*=-1;
			this.direction*=-1;
		}

	}

	step(){
		this.x = this.x+this.velocity/18;
	}

	moveRight(){
		this.velocity+=2;
		/*if(this.velocity>0){
			this.direction = 1;
		}*/
	}

	moveLeft(){
		this.velocity-=2;
		/*if(this.velocity<0){
			this.direction = -1;
		}*/
		//console.log(this.velocity);
	}
}

class Model{
	constructor(){
		console.log('model');
		this.width = 0;
		this.height = 0;
		this.trail = [];
		this.trees = [];
		this.time = 0;
		this.player = new Player();
		this.slideSpeed = 3;
		this.score = 0;
		this.gameOver = false;

		this.gameOverEvent = new Event('gameOver');
		this.gameStarted = new Event('gameStarted');

		console.log(this.player.y);
		console.log(document);
		
		console.log(this.trees);
	}

	setSize(width, height){
		this.width = width;
		this.height = height;
	}

	setPlayerPosition(x,y){
		this.player.setPosition(x,y);
	}

	movePlayerLeft(){
		this.player.moveLeft();
		this.slideSpeed = 3-Math.abs(this.player.velocity/80);
	}

	movePlayerRight(){
		this.player.moveRight();
		this.slideSpeed = 3-Math.abs(this.player.velocity/80);
	}

	addTree(x,y,radius){
		this.trees.push(new CircularGameObject(x,y,radius));
	}

	addTrail(x,y){
		this.trail.push(new CircularGameObject(x,y,4));
	}

	stepGame(){
		/*for(let tree in this.trees){
			tree.y -= this.slideSpeed;
		}*/

		for(let i=0; i<this.trees.length; ++i){
			this.trees[i].y-=this.slideSpeed;
		}
		this.addTrail(this.player.x, this.player.y);
		for(let i=0; i<this.trail.length; ++i){
			//tr.y = tr.y - this.slideSpeed;
			//console.log(this.trail);
			this.trail[i].y-=this.slideSpeed;
			//console.log(this.trail[i]);
		}
		//console.log(this.trail[0].y);
		this.player.step();

		if(this.detectCollision()){
			document.dispatchEvent(this.gameOverEvent);
			//console.log('ad');
			this.gameOver = true;
		}

		//this.time++;
		this.generateTrees(this.height);
		this.removeOverflow();
		//console.log(this.trail.length);
	}

	detectCollision(){
		if(this.player.x-this.player.radius < 0 || this.player.x+this.player.radius > this.width) return true;
		for(let i=0; i<this.trees.length; ++i){
			if(this.player.collidesWidth(this.trees[i])) return true;
		}
		return false;
	}

	generateTrees(y){
		const n = Math.round(Math.random()-0.35);
		for(let i=0; i<n; ++i){
			let tree;
			do{
				const x = Math.floor(Math.random()*this.width);
				const radius = Math.floor(Math.random()*2+2);
				tree = new CircularGameObject(x,y-radius*2-1,radius)
			}while(!this.notCollidesWithAnything(tree))
			
			this.addTree(tree.x,tree.y,tree.radius);
		}
	}

	initTrees(){
		for(let i = 400; i<this.height; ++i){
			console.log(i);
			this.generateTrees(i);
		}

		document.dispatchEvent(this.gameStarted);
	}

	notCollidesWithAnything(tree){
		for(let i=0; i<this.trees.length; ++i){
			if(tree.collidesWidth(this.trees[i])) return false;
		}
		return true;
	}

	removeOverflow(){
		this.removeOverflowingElements(this.trail);
		this.removeOverflowingElements(this.trees);
	}

	removeOverflowingElements(array){
		for(let i=0; i<array.length; ++i){
			if(array[i].y<0) array.splice(i,1);
		}
	}
}


//View
//const $ = (selector) => document.querySelector(selector);

class View{
	constructor(model, canvas){
		console.log('view');
		this.model = model;

		this.canvas = canvas;
		this.lastRunTime = Date.now();
		
		console.log(canvas);
		this.setSize(400,700);
		this.context = this.canvas.getContext('2d');
		this.treeImage = new Image();
		this.treeImage.src = 'tree.png';
		this.treeShadow = new Image();
		this.treeShadow.src = 'treeshadow.png'
	}

	setSize(width, height){
		this.canvas.width = width;
		this.canvas.height = height;
		this.model.setSize(width, height);
		this.model.setPlayerPosition(width/2, 200);
	}

	drawPlayer(){
		this.context.beginPath();
		this.context.fillStyle = 'blue';
		this.context.arc(
						this.model.player.x, 
						this.model.player.y,
						this.model.player.radius,
						0,
						Math.PI*2
			);
		this.context.fill();
		this.context.closePath();
	}

	drawTrail(){
		for(let i=0; i<this.model.trail.length-1; ++i){
			const f = this.model.trail[i];
			const t = this.model.trail[i+1];
			/*
			this.context.beginPath();
			this.context.fillStyle = 'grey';
			this.context.arc(
							t.x,
							t.y,
							t.radius,
							0,
							Math.PI*2
				);
			this.context.fill();
			this.context.closePath();
			//console.log(t);*/
			this.context.beginPath();
			this.context.lineWidth = f.radius;
			this.context.strokeStyle = 'grey';
			this.context.moveTo(f.x, f.y+this.model.player.radius);
			this.context.lineTo(t.x, t.y+this.model.player.radius);
			this.context.stroke();
			this.context.closePath();
		}
		
	}

	drawTrees(){
		for(let i=0; i<this.model.trees.length; ++i){
			const t = this.model.trees[i];
			this.context.beginPath();
			this.context.fillStyle = 'green';
			this.context.arc(
							t.x,
							t.y,
							t.radius,
							0,
							Math.PI*2
				);
			this.context.fill();
			this.context.drawImage(this.treeImage, t.x-12*t.radius/2, t.y-10*t.radius, 12*t.radius,12*t.radius);
			/*let x = this.canvas.width / 2;
			let y = this.canvas.height / 2;

			this.context.translate(x, y);
			this.context.rotate(8*Math.PI/3);
			this.context.drawImage(this.treeShadow, t.x-12*t.radius/2, t.y-10*t.radius, 12*t.radius,12*t.radius);
			this.context.rotate(-8*Math.PI/3);
			this.context.translate(-x, -y);*/
			
			this.context.closePath();
			//console.log(t);
		}
	}

	drawFps(dt){
		const fps = Math.round(1000/dt);
		this.context.font = '30px Consolas';
		this.context.fillText(fps,10,50);
	}

	drawSparks(){
		/*for(let i=0; i<20; ++i){
			this.context.beginPath();
			this.context.fillStyle = 'grey';
			this.context.arc(
							this.model.player.x+Math.random()*50, 
							this.model.player.y,
							this.model.player.radius/2,
							0,
							Math.PI*2
				);
			this.context.fill();
			this.context.closePath();
		}*/
		
	}

	render(){
		const dt = Date.now() - this.lastRunTime;
		this.lastRunTime = Date.now();
		this.context.fillStyle = 'white';
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
		this.controlPlayerMovement();
		this.drawTrail();
		this.drawSparks();
		this.drawPlayer();
		this.drawTrees();
		this.drawFps(dt);
	}

	controlPlayerMovement(){
		//if(key==true) return;
		if(this.model.player.velocity < 25 && this.model.player.direction==1){
			this.model.movePlayerRight();
		}else if(this.model.player.velocity > -25 && this.model.player.direction==-1){
			this.model.movePlayerLeft();
		}
	}

}

//App


class Game{
	constructor(){
		this.model = new Model();

		this.view = new View(this.model, document.querySelector('canvas'));
		this.view.setSize(400,700);
		//this.mainLoop(this);
	}

	mainLoop(){
		
			if( key && lastDirection == 1) {
				this.model.movePlayerLeft();
				this.model.player.direction = -1;
			}
			if(key && lastDirection ==-1){
				this.model.movePlayerRight();
				this.model.player.direction = 1;
			} 
			if(!this.model.gameOver){
				this.model.stepGame();
			}
			this.view.render();
	
	}

	clearLoop(){
		this.loop = undefined;
	}



	get a(){
		return this.b;
	}

	set a(v){
		this.b = v;
	}
}

let left = false;
let right = false;
let lastDirection = undefined;
let key = false;

let game = new Game();

let loop;/*loop = setInterval(function(){
	game.mainLoop();
},16);*/
//game.mainLoop(game);
//requestAnimationFrame(game.mainLoop);
lastDirection = -game.model.player.direction;
window.addEventListener('keydown',function(e){
	//console.log(e);
	/*if(e.key=='a'){
		left=true;
	} 
	if(e.key=='d') {
		right=true;
	}*/
	
	if(e.key=='r'){
		game = new Game();
		//game.model.initTrees();
		lastDirection = -game.model.player.direction;
	} 
	else key = true;
});

window.addEventListener('keyup',function(e){
	//console.log(e);
	/*if(e.key=='a') left=false;
	if(e.key=='d') right=false;*/
	key=false;
	lastDirection *=-1;
});

document.addEventListener('gameOver',function(){
	console.log('asd')
});

document.addEventListener('gameStarted', function(){
	console.log('ad');
	game.view.render();
	loop = setInterval(function(){
		game.mainLoop();
	},16);
});

game.model.initTrees();