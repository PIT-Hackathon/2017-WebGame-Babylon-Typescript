import * as BABYLON from 'babylonjs';
import { Controller } from './Controller';
import { Ship } from './Ship';
import { Rock } from './Rock';

export class Game {

    private canvas : HTMLElement;
    private engine : BABYLON.Engine;
    
    private scene : BABYLON.Scene;

    private controller : Controller;
    private ship : Ship;
    private explosionParticles : BABYLON.ParticleSystem;

    private rockMesh : BABYLON.Mesh;
    private rocks : Rock[] = [];
    private totalRocks : number = 0;

    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);

        this.createScene();

        this.engine.runRenderLoop(() => this.render());
        window.addEventListener("resize", () => this.resize());
    }

    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1.0);
        
        this.controller = new Controller();
        this.ship = new Ship("Ship", this.scene, this.controller);

        let skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, this.scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/space", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
                
        let camera = new BABYLON.FollowCamera("Camera1", new BABYLON.Vector3(0, 100, 0), this.scene, this.ship.lookAtPosition);
        camera.radius = 40;        
        camera.heightOffset = 4;        
        camera.rotationOffset = 180;        
        camera.cameraAcceleration = 0.05;        
        camera.maxCameraSpeed = 1000;
        this.scene.activeCamera = camera;
        
        let light1 = new BABYLON.HemisphericLight("Light1", new BABYLON.Vector3(0.25, 1, 0.75), this.scene);
        light1.intensity = 1;

        let light2 = new BABYLON.HemisphericLight("Light2", new BABYLON.Vector3(0, -1, 0), this.scene);
        light2.diffuse = new BABYLON.Color3(0.5,0.5,1);
        light2.intensity = 0.2;

        this.rocks = [];

        BABYLON.SceneLoader.ImportMesh("Rock", "assets/", "rock.babylon", this.scene, (newMeshes, particleSystems) => {
            this.rockMesh = <BABYLON.Mesh> newMeshes[0];
            this.rockMesh.isVisible = false;

            this.totalRocks = 0;
            for (var index = 0; index < 20; index++) {
                this.createRock(this.ship.position);
            }
        });
                
        this.explosionParticles = new BABYLON.ParticleSystem("Explosion_Particles", 20000, this.scene);
        this.explosionParticles.particleTexture = new BABYLON.Texture("assets/smoke.png", this.scene);
        this.explosionParticles.emitter = BABYLON.Vector3.Zero();
        this.explosionParticles.minEmitBox = new BABYLON.Vector3(-2, -2, -2);
        this.explosionParticles.maxEmitBox = new BABYLON.Vector3(2, 2, 2);
        this.explosionParticles.color1 = new BABYLON.Color4(1.0, 0.8, 0.7, 1.0);
        this.explosionParticles.color2 = new BABYLON.Color4(1.0, 0.5, 0.2, 1.0);
        this.explosionParticles.colorDead = new BABYLON.Color4(0.2, 0, 0, 0.0);
        this.explosionParticles.minSize = 0.1;
        this.explosionParticles.maxSize = 0.5;
        this.explosionParticles.minLifeTime = 0.3;
        this.explosionParticles.maxLifeTime = 1.5;
        this.explosionParticles.emitRate = 4000;
        this.explosionParticles.direction1 = new BABYLON.Vector3(-20, -20, -20);
        this.explosionParticles.direction2 = new BABYLON.Vector3(20, 20, 20);
        this.explosionParticles.minAngularSpeed = 0;
        this.explosionParticles.maxAngularSpeed = Math.PI;
        this.explosionParticles.manualEmitCount = 4000;
        this.explosionParticles.preventAutoStart = true;
    }

    createRock(origin) {  
        this.totalRocks++;     
        let rock = new Rock(`Rock_${this.totalRocks}`,this.scene, this.rockMesh.createInstance(`Rock_${this.totalRocks}`));
        
        var rockPosition = new BABYLON.Vector3(Math.random() - .5,0,Math.random() - .5).normalize(); // Direction
        rockPosition.scaleInPlace(Math.random() * 300 + 100); // Distance 100 - 400
        rockPosition.addInPlace(origin);
        
        rock.position.copyFrom(rockPosition);
        this.rocks.push(rock);
    }

    render() {
        let destroyedRocks = [];

        let bullets = this.ship.getBullets();

        for (let index = 0; index < this.rocks.length; index++) {
            let rock = this.rocks[index];
            for(let bullet of bullets) {
                if(rock.intersectsPoint(bullet.position)) {
                    (<BABYLON.Vector3>this.explosionParticles.emitter).copyFrom(rock.getAbsolutePosition());         
                    this.explosionParticles.manualEmitCount = 4000;       
                    this.explosionParticles.start();
                    
                    destroyedRocks.push(index);
                    this.ship.destroyBullet(bullet);
                    break; // Continue with next rock
                }
            }
        }

        for (let index = 0; index < destroyedRocks.length; index++) {
            this.createRock(this.ship.position);
        }

        while(destroyedRocks.length > 0) {
            let index = destroyedRocks.pop(); // Remove rocks in reverse order
            let rock = this.rocks[index];
            rock.dispose();
            this.rocks.splice(index,1);
        }

        this.scene.render();
    }

    resize() {
        this.engine.resize();
    }
}

const game = new Game();