window.onload = () => {
    window.app = new PIXI.Application({
        width: 600, height: 800, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
    });
    document.body.appendChild(app.view);

    const scene = new PIXI.Container();
    app.stage.addChild(scene);

    console.log("準備開始加載圖片資源")
    window.loader = new PIXI.Loader();
    let assetsData = [
        { name: 'plane1', url: 'assets/plane1.png' },
        { name: 'plane2', url: 'assets/plane2.png' },
        { name: 'plane3', url: 'assets/plane3.png' },
        { name: 'enemy1', url: 'assets/Enemy1.png' },
        { name: 'enemy2', url: 'assets/Enemy2.png' },
        { name: 'enemy3', url: 'assets/Enemy3.png' },
        { name: 'bullet', url: 'assets/bullet.png' },
        { name: 'background', url: 'assets/BG.png' },

    ]
    for (i = 1; i <= 15; i++) { //爆炸的圖
        let num = i;

        if (num < 10) {
            num = '0' + num;
        }
        let obj = {
            // name: 'explosion' + i, url: 'assets/explosion0' + num + '.png'
            name: 'explosion' + i, url: `assets/explosion0${num}.png`
        }
        assetsData.push(obj);
    }


    loader.add(assetsData)
        .load(() => {

            console.log("圖片資源加載完成");
            startGame();
        })

    var player = null;
    var planeState = {
        hp: 10,//
        bullet: 100,
        const_moveSpeed: 4,
        bulletInterval: 200,//
    };
    var keyDownState = {
        "left": false,
        "up": false,
        "right": false,
        "down": false,
    };
    var BG1 = null;
    var BG2 = null;
    var BackGroundHeight = null;
    var Bullets = [];
    var Enemys = [];
    var bulletLock = false;

    function startGame() {
        //init
        BackGroundHeight = loader.resources['background'].texture.height;
        console.log(BackGroundHeight);

        //背景1
        BG1 = new PIXI.Sprite(loader.resources['background'].texture);
        scene.addChild(BG1);
        BG1.y = app.screen.height; //起始點是畫面底部
        BG1.anchor.set(0, 1);
        //背景2
        BG2 = new PIXI.Sprite(loader.resources['background'].texture);
        scene.addChild(BG2);
        BG2.y = app.screen.height - loader.resources['background'].texture.height; //起始點是畫面底部+BG1
        BG2.anchor.set(0, 1);
        // //飛機
        // player = new PIXI.Sprite(loader.resources['plane1'].texture);
        // scene.addChild(player);
        // player.anchor.set(0.5, 0.5); //錨點置中
        // player.scale.set(0.7, 0.7);

        // player.x = app.screen.width / 2;
        // player.y = app.screen.height / 2; //畫面置中
        player = new Player(scene);
        // scene.addChild(player);
        // let emeny = new Enemy(scene); //這是新增一個敵人




        regKeyboardEvent(player);

        app.ticker.add(update);
    }

    function update(dt) { //時時更新
        //背景捲動
        BG1.y += 4;
        BG2.y += 4;
        if (BG1.y > app.screen.height + loader.resources['background'].texture.height) {
            console.log("超過ㄌ");
            BG1.y = app.screen.height;
            BG2.y = app.screen.height - loader.resources['background'].texture.height;
        }
        //子彈射擊
        // Bullets[0].y = Bullets[0].y - 100; //這行會壞掉
        Bullets.forEach((bullet, BulletsIndex) => {
            bullet.y -= 10;
            if (bullet.y < 0) { //避免子彈太多，超越邊際則消除
                scene.removeChild(bullet); //移除pixi場景上的
                Bullets.splice(BulletsIndex, 1); //移除arrya內的
            } else //判斷子彈碰到敵機沒*last step
            {
                Enemys.forEach((enemy, enemyIndex) => {
                    let crash = isCollision(bullet, enemy);
                    if (crash) { //子彈碰到敵軍就消滅敵軍&子彈

                        enemy.state.hp = enemy.state.hp - 35;
                        scene.removeChild(bullet);
                        Bullets.splice(BulletsIndex, 1);
                        // console.log(enemy.state.hp);
                        if (enemy.state.hp <= 0) {
                            scene.removeChild(enemy);
                            Enemys.splice(enemyIndex, 1);

                            let explosion = new Explosion(scene);
                            explosion.x = enemy.x;
                            explosion.y = enemy.y;


                        }
                    }

                })


            }


        });



        ///敵人判斷 小於五架則新增一個敵人

        if (Enemys.length < 5) {

            let enemy = new Enemy(scene);//這是新增一個敵人
            enemy.x = Math.floor(Math.random() * (app.screen.width - enemy.width / 2)) + 0;
            Enemys.push(enemy);//複數敵機做成array
        }

        //敵機for each狀態(會前進&多的移除掉)
        Enemys.forEach((enemy, enemyIndex) => {
            enemy.y = enemy.y + enemy.state.speed; //參照LINE圖
            if (enemy.y > 1000) { //條件也可以設成小於app.screen.height
                scene.removeChild(enemy);
                Enemys.splice(enemyIndex, 1);//移除array內容
            }
        });




    }

    function shot() {
        if (bulletLock) { //true的時候避免子彈連發
            return;
        }

        let bullet = new Bullet(scene);
        bullet.x = player.x;
        bullet.y = player.y - player.height * 0.5;
        Bullets.push(bullet);//裝進array裡面
        bulletLock = true;//子彈連發打開，200毫秒後解鎖
        setTimeout(() => {
            bulletLock = false;
        }, 200)
    }


    function regKeyboardEvent(player) {
        document.onkeydown = function (e) {
            keyDownState[CFG.keyMap[e.which]] = true;
            // console.log(e.which);
        };
        document.onkeyup = function (e) {
            keyDownState[CFG.keyMap[e.which]] = false;
        };
        var KeyEventCallBack = function () {
            if (keyDownState["right"] && keyDownState["up"]) {
                player.x += planeState.const_moveSpeed / 2;
                player.y -= planeState.const_moveSpeed / 2;
            }
            else if (keyDownState["left"] && keyDownState["up"]) {
                player.x -= planeState.const_moveSpeed / 2;
                player.y -= planeState.const_moveSpeed / 2;
            }
            else if (keyDownState["left"] && keyDownState["down"]) {
                player.x -= planeState.const_moveSpeed / 2;
                player.y += planeState.const_moveSpeed / 2;
            }
            else if (keyDownState["right"] && keyDownState["down"]) {
                player.x += planeState.const_moveSpeed / 2;
                player.y += planeState.const_moveSpeed / 2;
            }
            else if (keyDownState['up'])
                player.y -= planeState.const_moveSpeed;
            else if (keyDownState['down'])
                player.y += planeState.const_moveSpeed;
            else if (keyDownState['left'])
                player.x -= planeState.const_moveSpeed;
            else if (keyDownState['right'])
                player.x += planeState.const_moveSpeed;

            if (keyDownState['space']) {
                shot();
            }

            setTimeout(KeyEventCallBack, 15);
        };
        KeyEventCallBack();
    }

    function isCollision(el1, el2) {
        if ((Math.abs(el2.x - el1.x) < el1.width / 2 + el2.width / 2) &&
            Math.abs(el2.y - el1.y) < el1.height / 2 + el2.height / 2)
            return true;
        else
            return false;
    }
}

