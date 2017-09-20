import * as BABYLON from 'babylonjs';

export class Controller {

    public isUpPressed : boolean = false;
    public isDownPressed : boolean = false;
    public isLeftPressed : boolean = false;
    public isRightPressed : boolean = false;
    public isWeaponPressed : boolean = false;

    constructor() {
        window.addEventListener("keydown",(keyEvent) => this.keyDown(keyEvent));
        window.addEventListener("keyup", (keyEvent) => this.keyUp(keyEvent));
    }

    keyDown(keyEvent) {
        if(keyEvent.key == "ArrowUp") {
            this.isUpPressed = true;
        }
        else if(keyEvent.key == "ArrowDown") {
            this.isDownPressed = true;
        }
        else if(keyEvent.key == "ArrowLeft") {
            this.isLeftPressed = true;
        }
        else if(keyEvent.key == "ArrowRight") {
            this.isRightPressed = true;
        }
        else if(keyEvent.key == " ") {
            this.isWeaponPressed = true;
        }
    }

    keyUp(keyEvent) {
        if(keyEvent.key == "ArrowUp") {
            this.isUpPressed = false;
        }
        else if(keyEvent.key == "ArrowDown") {
            this.isDownPressed = false;
        }
        else if(keyEvent.key == "ArrowLeft") {
            this.isLeftPressed = false;
        }
        else if(keyEvent.key == "ArrowRight") {
            this.isRightPressed = false;
        }
        else if(keyEvent.key == " ") {
            this.isWeaponPressed = false;
        }
    }
}