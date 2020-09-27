
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
		this.velocity = 0;
	}

	step(){
		this.x = this.x+this.velocity/1000;
	}

	moveRight(){
		this.velocity++;
	}

	moveLeft(){
		this.velocity--;
	}
}

export class Model{
	constructor(){
		console.log('model');
		this.width = 0;
		this.height = 0;
		this.trail = [];
		this.trees = [];
		this.time = 0;
		this.player = new Player();
		this.slideSpeed = 10/1000;
		this.score = 0;

		this.gameOver = new Event('gameOver');
		this.gameStarted = new Event('gameStarted');

		console.log(this.player.y);
		console.log(document);
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
	}

	movePlayerRight(){
		this.player.moveRight();
	}

	addTree(x,y,radius){
		this.trees.push(new CircularGameObject(x,y,radius));
	}

	addTrail(x,y){
		this.trail.push(new CircularGameObject(x,y,1));
	}

	stepGame(){
		/*for(let tree in this.trees){
			tree.y -= this.slideSpeed;
		}*/
		for(let t in this.trail){
			t.y -= this.slideSpeed;
			console.log(t);
		}
		this.addTrail(this.player.x, this.player.y);
		this.player.step();

		/*if(this.detectCollision()){
			document.dispatchEvent(this.gameOver);
			return;
		}*/

		//this.time++;
		//this.generateTrees();
		this.removeOverflow();
	}

	detectCollision(){
		if(this.player.x < 0 || this.player.x > this.width) return true;
		for(let tree in this.trees){
			if(this.player.collidesWidth(tree)) return true;
		}
		return false;
	}

	generateTrees(){
		const n = Math.floor(this.time/100);
		for(let i=0; i<n; ++i){
			const x = Math.floor(Math.random()*this.width);
		}
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