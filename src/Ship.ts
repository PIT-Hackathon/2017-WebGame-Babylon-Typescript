import * as BABYLON from 'babylonjs';
import {Controller} from './Controller';

export class Ship extends BABYLON.Mesh {

    public lookAtPosition : BABYLON.AbstractMesh;
    public engineParticles : BABYLON.ParticleSystem;
    public weaponParticles : BABYLON.ParticleSystem;
    public controller : Controller;

    constructor(name : string, scene : BABYLON.Scene, controller : Controller) {
        super(name, scene);

        BABYLON.SceneLoader.ImportMesh("ship", "assets/", "ship.babylon", scene, (newMeshes, particleSystems) => {
            for(let mesh of newMeshes) {
                mesh.position.addInPlace(this.position);
                mesh.setParent(this);
            }
        });

        this.setBoundingInfo( new BABYLON.BoundingInfo(new BABYLON.Vector3(-4,-2,-4), new BABYLON.Vector3(4,2,4)) );

        this.lookAtPosition = new BABYLON.Mesh(name + "_LookAt",scene, this);
        this.lookAtPosition.position.set(0,10,0);
        
        this.engineParticles = new BABYLON.ParticleSystem(name + "_Particles", 2000, scene);
        this.engineParticles.particleTexture = new BABYLON.Texture("assets/smoke.png", scene);
        this.engineParticles.emitter = this;
        this.engineParticles.minEmitBox = new BABYLON.Vector3(-1, -0.5, -3);
        this.engineParticles.maxEmitBox = new BABYLON.Vector3(1, 0.5, -3);
        this.engineParticles.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        this.engineParticles.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        this.engineParticles.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        this.engineParticles.minSize = 0.1;
        this.engineParticles.maxSize = 0.5;
        this.engineParticles.minLifeTime = 0.3;
        this.engineParticles.maxLifeTime = 1.5;
        this.engineParticles.emitRate = 1000;
        this.engineParticles.direction1 = new BABYLON.Vector3(-4, 0, 0);
        this.engineParticles.direction2 = new BABYLON.Vector3(4, 0, -3);
        this.engineParticles.minAngularSpeed = 0;
        this.engineParticles.maxAngularSpeed = Math.PI;

        this.weaponParticles = new BABYLON.ParticleSystem(name + "_Particles", 1000, scene);
        this.weaponParticles.particleTexture = new BABYLON.Texture("assets/smoke.png", scene);
        this.weaponParticles.emitter = this;
        this.weaponParticles.minEmitBox = new BABYLON.Vector3(0, 0, 3);
        this.weaponParticles.maxEmitBox = new BABYLON.Vector3(0, 0, 3);
        this.weaponParticles.color1 = new BABYLON.Color4(1.0, 1.0, 0.0, 1.0);
        this.weaponParticles.color2 = new BABYLON.Color4(1.0, 1.0, 0.0, 1.0);
        this.weaponParticles.colorDead = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0);
        this.weaponParticles.minSize = 0.3;
        this.weaponParticles.maxSize = 0.3;
        this.weaponParticles.minLifeTime = 2.0;
        this.weaponParticles.maxLifeTime = 2.0;
        this.weaponParticles.emitRate = 5;
        this.weaponParticles.direction1 = new BABYLON.Vector3(0, 0, 150);
        this.weaponParticles.direction2 = new BABYLON.Vector3(0, 0, 150);
        this.weaponParticles.minAngularSpeed = 0;
        this.weaponParticles.maxAngularSpeed = Math.PI;

        this.controller = controller;
        
        scene.registerBeforeRender(() => this.update());
    }

    update() : void {  
        let foreward = this.getDirection(BABYLON.Vector3.Forward());
        
        if (this.controller.isUpPressed) {
            this.engineParticles.start();
            this.position.addInPlace(foreward);
        }
        else {
            this.engineParticles.stop();
        }

        if (this.controller.isDownPressed) {
            this.position.addInPlace(foreward.negate());
        }

        if (this.controller.isLeftPressed) {
            this.rotate(BABYLON.Vector3.Up(),-.03, BABYLON.Space.LOCAL);
        }

        if (this.controller.isRightPressed) {
            this.rotate(BABYLON.Vector3.Up(),.03, BABYLON.Space.LOCAL);
        }

        if(this.controller.isWeaponPressed) {
            this.weaponParticles.start();
        }
        else {
            this.weaponParticles.stop();
        }

        this.lookAtPosition.rotationQuaternion = this.rotationQuaternion;
    }

    getBullets() : BABYLON.Particle[] {
        return <BABYLON.Particle[]>(<any> this.weaponParticles).particles;
    }

    destroyBullet(bullet : BABYLON.Particle) : void {
        this.weaponParticles.recycleParticle(bullet);
    }
}