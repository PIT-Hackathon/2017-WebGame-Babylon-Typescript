import * as BABYLON from 'babylonjs';

export class Rock extends BABYLON.Mesh {

    private rotationAxis : BABYLON.Vector3;
    private rotationSpeed : number;

    constructor(name : string, scene : BABYLON.Scene, mesh : BABYLON.AbstractMesh) {
        super(name, scene);

        mesh.position.addInPlace(this.position);
        mesh.setParent(this);
        this.setBoundingInfo( mesh.getBoundingInfo() );
        
        scene.registerBeforeRender(() => this.update());

        this.rotationAxis = new BABYLON.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
        this.rotationSpeed = Math.random() * 0.01;
    }

    update() {
        this.rotate(this.rotationAxis, this.rotationSpeed,BABYLON.Space.LOCAL);
    }
}