class Enemy {
    constructor(scene) {



        this.sprite = new PIXI.Sprite(loader.resources['enemy1'].texture);
        this.sprite.name = "enemy";
        this.sprite.anchor.set(0.5);//錨點置中
        this.sprite.scale.set(0.7);
        this.sprite.x = app.screen.width / 2;
        this.sprite.y = this.sprite.height / 2;//畫面置中
        this.sprite.angle = 180;
        this.sprite.state = this; //!!!!
        this.speed = (Math.random() * 3) + 1;//前進速度隨機
        this.hp = 100;

        let planeNumber = 1;

        setInterval(() => {
            this.sprite.texture = loader.resources['enemy' + planeNumber].texture;
            planeNumber++;
            if (planeNumber > 3) {
                planeNumber = 1;
            }

        }, 500)



        scene.addChild(this.sprite);



        return this.sprite;//封裝後丟出

    }
}