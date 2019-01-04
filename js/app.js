let time = 0;

//Tamagotchi Class
class Tamagotchi {
    constructor(name) {
        this.name = name;
        this.hungry = 0;
        this.sleep = 0;
        this.bored = 0;
        this.age = 0;
        this.species = getRandomBetween(1,4);
        this.death = false;
        this.tickChart = {
            hungry: {
                threshold: getRandomBetween(7, 10),
                curCount: 0
            },
            sleep: {
                threshold: getRandomBetween(10, 12),
                curCount: 0
            },
            bored: {
                threshold: getRandomBetween(10, 12),
                curCount: 0
            },
            age: {
                threshold: 60,
                curCount: 0
            }
        }
    }
    render() {
        return `
            <article>
                <h2>${this.name}</h2>
                <div class="tamaButtons">
                    <button data-name="${this.name}" data-action="eat"><ion-icon name="nutrition"></ion-icon></button>
                    <button data-name="${this.name}" data-action="rest"><ion-icon name="cloudy-night"></ion-icon></button>
                    <button data-name="${this.name}" data-action="play"><ion-icon name="tennisball"></ion-icon></button>
                </div>
                <div id="${this.name}Stats">
                    <p>Age: ${this.age}<br>
                    Hunger: ${this.hungry}<br>
                    Sleep: ${this.sleep}<br>
                    Bored: ${this.bored}</p>
                </div>
                <img id="${this.name}Img" src="https://i.imgur.com/67lgkOQ.png">
                <div id="${this.name}MessageBox" class="messageBox"></div>
            </article>
        `;
    }
    updateStats() {
        let html = `
            <p>Age: ${this.age}<br>
            Hunger: ${this.hungry}<br>
            Sleep: ${this.sleep}<br>
            Bored: ${this.bored}</p>
        `;
        $(`#${this.name}Stats`).html(html);
    }
    displayMessage(trait) {
        switch (trait) {
            case 'hungry':
                if (this.hungry === 5) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is getting hungry!</p>`);
                } else if (this.hungry === 8) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is starving!</p>`);
                } else if (this.hungry === 10) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} has starved to death!</p>`);
                    this.deathRender();
                }
                break;
            case 'sleep':
                if (this.sleep === 5) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is getting sleepy!</p>`);
                } else if (this.sleep === 8) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} really needs to sleep!</p>`);
                } else if (this.sleep === 10) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} has died from lack sleep!</p>`);
                    this.deathRender();
                }
                break;
            case 'bored':
                if (this.bored === 5) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is getting bored!</p>`);
                } else if (this.bored === 8) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is horribly bored!</p>`);
                } else if (this.bored === 10) {
                    $(`#${this.name}MessageBox`).prepend(`<p>${this.name} has died of boredom!</p>`);
                    this.deathRender();
                }
                break;
        }
    }
    eat() {
        if(this.hungry < 2){
            $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is not hungry right now!</p>`);
            return;
        } else {
            this.hungry -= 2;
            $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is eating vegan food!</p>`);
        }
    }
    rest() {
        if(this.sleep < 2){
            $(`#${this.name}MessageBox`).prepend(`<p>${this.name} does not want to rest right now!</p>`);
            return;
        } else {
            this.sleep -= 2;
            $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is getting some rest!</p>`);
        }
    }
    play() {
        if(this.bored < 2){
            $(`#${this.name}MessageBox`).prepend(`<p>${this.name} does not want to play right now!</p>`);
            return;
        } else {
            this.bored -= 2;
            $(`#${this.name}MessageBox`).prepend(`<p>${this.name} is playing around!</p>`);
        }
    }
    deathRender() {
        this.death = true;
        $(`#${this.name}Img`).velocity({
            rotateX: [-90, 0],
            opacity: [1, 0]
        }, {
            duration: 1000,
            delay: 500
        });
        $(`#${this.name}Img`).replaceWith($('<img src="https://i.imgur.com/PsxRMtw.png">').velocity({
            rotateX: [90, 0],
            opacity: [0, 1]
        }, {
            duration: 1000,
            delay: 500
        }));
    }
}

//Game Object
const game = {

    tamagotchies: [],
    init() {
        let newName = prompt("Please enter your Tamagotchi's name.");
        this.tamagotchies.push(new Tamagotchi(newName));
        this.render();

    },
    render() {
        let html;
        game.tamagotchies.forEach(t => {
            if (t.rendered) {
                // update just the values
                t.updateStats();
            } else {
                html = t.render();
                t.rendered = true;
                $('#tamaDisplay').append(html);
            }
        });
    },
    timer() {
        window.setInterval(function() {
            time += 1;
            $('#clock').text(`Timer: ${time}`)
            for (let i = 0; i < game.tamagotchies.length; i++){
                if (!game.tamagotchies[i].death){
                    for (let trait in game.tamagotchies[i].tickChart) {
                        game.tamagotchies[i].tickChart[trait].curCount++;
                        if (game.tamagotchies[i].tickChart[trait].curCount === game.tamagotchies[i].tickChart[trait].threshold) {
                            game.tamagotchies[i][trait]++;
                            game.tamagotchies[i].tickChart[trait].curCount = 0;
                            game.tamagotchies[i].displayMessage(trait);
                        }
                    }
                    game.render();
                }
            }  
        } , 1000);
    }
}


game.timer();
game.init();

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//Event Listeners

$('.tamaButtons').on('click', 'button', (e) => {
    let name = $(e.target).attr('data-name');
    let action = $(e.target).attr('data-action');
    let t = game.tamagotchies.find(t => t.name === name);
    t[action]();
});
