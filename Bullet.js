class Bullet {
    constructor(scene) {

        this._bullet = new PIXI.Sprite(loader.resources['bullet'].texture);
        this._bullet.name = "bullet";
        this._bullet.anchor.set(0.5);

        scene.addChild(this._bullet);
        return this._bullet;


    }
}