cc.Class({
    extends: cc.Component,

    properties: {
        giveCardSpeed: 1,              //发牌速度
        beginScene: cc.Node,
        startScene: cc.Node,

        enemyCards_1: cc.Node,
        enemyCards_2: cc.Node,
        cardPre: cc.Prefab,
        selfCards: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.loader.loadRes("jsons/cardIcon", (err, json) => {
            let arr = [], cardIcons = null;
            for (let i = 0; i < json.length; i++) {
                cardIcons = new CardInfomation();
                cardIcons.loadFromJson(json[i]);
                arr.push(cardIcons);
            }
            player.CardInfomations = arr;
            console.log(player.CardInfomations);

            this.cardIcons = {};
            for (let i = 1; i < player.CardInfomations.length; i++) {
                cc.loader.loadRes("cards/card_" + i, cc.SpriteFrame, (err, data) => {
                    if (!err) {
                        this.cardIcons[data.name.toString()] = data;
                    }
                })
            }
        });
    },

    onEnable: function () {
        this.beginScene.active = true;
        this.beginScene.x = 0;
        this.startScene.active = false;
    },

    startGame: function () {
        this.beginScene.active = false;
        this.beginScene.x = -2000;
        this.startScene.active = true;
        this.giveCard();
    },

    giveCard: function () {
        var cardNum = 0;
        var arr = [];
        for (let i = 1; i < 55; i++) {
            arr.push(i);
        }
        arr.sort(function () {
            return 0.5 - Math.random();                             //打乱数组
        });
        // console.log(arr);
        var act = cc.repeat(cc.sequence(cc.delayTime(this.giveCardSpeed), cc.callFunc(() => {
            cardNum++;
            if (cardNum % 3 === 1) {
                this.enemyCards_1.addChild(cc.instantiate(this.cardPre));
                player.enemyCards_1.push(arr[cardNum - 1]);
            } else if (cardNum % 3 === 2) {
                this.enemyCards_2.addChild(cc.instantiate(this.cardPre));
                player.enemyCards_2.push(arr[cardNum - 1]);
            } else {
                var newCard = cc.instantiate(this.cardPre);
                this.selfCards.addChild(newCard);
                newCard.getChildren()[0].getComponent(cc.Sprite).spriteFrame = this.cardIcons[player.getCardInfo(arr[cardNum - 1]).icon];
                player.selfCards.push(arr[cardNum - 1]);
            }
        })), 54)
        this.node.runAction(act);
    },


    // update: function (dt) {

    // },
});
