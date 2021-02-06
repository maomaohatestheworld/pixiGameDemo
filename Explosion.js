class Explosion {
    constructor(scene) {


        this.sprite = new PIXI.Sprite(loader.resources['explosion1'].texture);
        this.sprite.name = "enemy";
        this.sprite.anchor.set(0.5);//錨點置中
        this.sprite.scale.set(0.7);


        this.sprite.state = this; //!!!!
        this.startFire = 1;



        this.intervalEvent = setInterval(() => {
            this.sprite.texture = loader.resources[`explosion${this.startFire}`].texture;
            this.startFire++;
            if (this.startFire >= 15) {
                scene.removeChild(this.sprite);
                clearInterval(this.intervalEvent);
            }
            console.log(this.startFire);

        }, 100)








        scene.addChild(this.sprite);



        return this.sprite;//封裝後丟出



    }
}