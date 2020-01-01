import { Graphics, Application } from "pixi.js";

const HEIGHT = 450;
const WIDTH = 600;

const GRIDH = 3;
const GRIDW = 4;

const SQH = (HEIGHT-1)/GRIDH; // these both should
const SQW = (WIDTH-2)/GRIDW; // be about the same

const LEFT  = 1;
const RIGHT = 2;
const UP    = 3;
const DOWN  = 4;

export class DefaultEnvironment {

    constructor(pixiapp) {
        this.pixiapp = pixiapp;
        this.reset();
    }

    reset(){
        this.agent_X = randomInt(0, GRIDW - 1);
        this.agent_Y = randomInt(0, GRIDH - 1);
        this.target_X = 3; //randomInt(0, GRIDW - 1);
        this.target_Y = 2; //randomInt(0, GRIDH - 1);
        this.iterations = 0;
        this.terminated = false;
        this.initGraphics();
        this.display();
    }

    getObservation() {
        return [this.agent_X, this.agent_Y];
    }

    getActions() {
        const ans = []
        if (this.agent_X > 0){
            ans.push(LEFT)
        }
        if (this.agent_X < GRIDW - 1){
            ans.push(RIGHT)
        }
        if (this.agent_Y > 0) {
            ans.push(UP)
        }
        if (this.agent_Y < GRIDH - 1) {
            ans.push(DOWN)
        }
        return ans;
    }

    performAction(action) {
        this.iterations+=1;
        if (!this.getActions().includes(action)){
            setRunState(0);
            throw Error(`Action ${action} not allowed!`);
        }
        switch (action) {
            case LEFT:
                this.agent_X -= 1;
                break;
            case RIGHT:
                this.agent_X += 1;
                break;
            case UP:
                this.agent_Y -= 1;
                break;
            case DOWN:
                this.agent_Y += 1;
                break;
        }
        if (this.agent_X == this.target_X && this.agent_Y == this.target_Y){
            this.terminated = true;
            return +20;
        } else {
            return -1;
        }
    }

    initGraphics() {
        // make grid background
        const background = new Graphics();
        background.beginFill(0xffffff);
        background.drawRect(0, 0, WIDTH, HEIGHT);
        background.endFill();
        background.lineStyle(1, 0x000000, 0.3);
        for (let i = 1; i <= WIDTH; i += SQH) {
            background.moveTo(i, 0);
            background.lineTo(i, HEIGHT);
        }
        for (let i = 1; i <= HEIGHT; i += SQW) {
            background.moveTo(0, i);
            background.lineTo(WIDTH, i);
        }
        this.pixiapp.stage.addChild(background);

        // make an agent
        this.agent = new Graphics();
        this.agent.lineStyle(1, 0x000000, 1);
        this.agent.beginFill(0x22FFFF, 0.5);
        this.agent.drawCircle(SQH/2, SQW/2, Math.min(SQH, SQW)/2.2);
        this.pixiapp.stage.addChild(this.agent);
        
        // make an target
        this.target = new Graphics();
        this.target.lineStyle(1, 0x000000, 1);
        this.target.beginFill(0xFFFF00, 0.5);
        this.target.drawStar(SQH/2, SQW/2, 5, Math.min(SQH, SQW)/2.2);
        this.pixiapp.stage.addChild(this.target);
    }


    display(){
        this.agent.x = SQH * this.agent_X;
        this.agent.y = SQW * this.agent_Y;
        this.target.x = SQH * this.target_X;
        this.target.y = SQW * this.target_Y;
    }

}

// helper
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}