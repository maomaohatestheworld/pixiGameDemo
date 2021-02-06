class Player {
    constructor(scene) {
        this.sprite = new PIXI.Sprite(loader.resources['plane1'].texture);
        this.sprite.name = "plane";
        this.sprite.anchor.set(0.5);//錨點置中
        this.sprite.scale.set(0.7);
        this.sprite.x = app.screen.width / 2;
        this.sprite.y = app.screen.height - this.sprite.height / 2;//畫面置中
        this.sprite.state = this; //!!!!

        let planeNumber = 1;

        setInterval(() => {
            this.sprite.texture = loader.resources['plane' + planeNumber].texture;
            planeNumber++;
            if (planeNumber > 3) {
                planeNumber = 1;
            }

        }, 500)




        scene.addChild(this.sprite);







        return this.sprite;//封裝後丟出


    }

}

