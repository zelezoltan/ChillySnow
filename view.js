import { Model } from './model.js'


//const $ = (selector) => document.querySelector(selector);

export class View{
	constructor(model, canvas){
		console.log('view');
		this.model = model;

		this.canvas = canvas;
		this.lastRunTime = Date.now();
		
		console.log(canvas);
		this.setSize(400,700);
		this.context = this.canvas.getContext('2d');
	}

	setSize(width, height){
		this.canvas.width = width;
		this.canvas.height = height;
		this.model.setSize(width, height);
		this.model.setPlayerPosition(width/2, 150);
	}

	drawPlayer(){
		this.context.beginPath();
		this.context.fillStyle = 'green';
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
		for(let t in this.model.trail){
			this.context.beginPath();
			this.context.fillStyle = 'white';
			this.context.arc(
							t.x,
							t.y,
							t.radius,
							0,
							Math.PI*2
				);
			this.context.fill();
			this.context.closePath();
			//console.log(this.model);
		}
		
	}

	drawTrees(){

	}

	drawFps(dt){
		const fps = Math.round(1000/dt);
		this.context.font = '30px Consolas';
		this.context.fillText(fps,10,50);
	}

	render(){
		const dt = Date.now() - this.lastRunTime;
		this.lastRunTime = Date.now();
		this.context.fillStyle = 'black';
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
		this.drawTrail();
		this.drawPlayer();
		this.drawTrees();
		this.drawFps(dt);
	}

}