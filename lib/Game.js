
const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function() {

    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));
    
    this.currentEnemy = this.enemies[0];

    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?' 
        })
        //destructure name from the prompt object 
        .then(({name}) => {
            this.player = new Player(name);
        
        //test the object creation
        //console.log(this.currentEnemy, this.player);
            this.startNewBattle();
    });
}

Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());

    this.battle();
};

Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        inquirer 
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use Potion']
            })
            .then(({action}) => {
                if (action === 'Use Potion') {
                    if (!this.player.getInventory()) {
                        console.log("You don't have any potions!");
                        return this.checkEndOfBattle();
                    }

                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which potion would you like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then(({action}) => {
                            const potionDetails = action.split(': ');
                            //end user sees 1: health, but since health is the 0th index, we subract 1 to keep consistency
                            this.player.usePotion(potionDetails[0] - 1);
                            console.log(`You used a ${potionDetails[1]} potion.`)

                            this.checkEndOfBattle();
                        })
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);

                    this.checkEndOfBattle();

                    console.log(`You attacked the ${this.currentEnemy.name}`)
                    //display enemy health
                    console.log(this.currentEnemy.getHealth());
                }
            });
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);

        //display player health 
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
}

Game.prototype.checkEndOfBattle = function() {
    //battle will end base on:
    //player uses potion
    //player attempts to use potion but inventory is empty 
    //player attacks enemy 
    //enemy attacks player

    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        //switch who will attack next
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);

        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('CONGRATS! YOU WON!');
        }
    } else {
        console.log("YOU'VE BEEN DEFEATED!");
    }
};

module.exports = Game;