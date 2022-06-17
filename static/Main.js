console.log("main");

const socket = io();

let game;
let net;
let ui;

window.onload = () => {
    game = new Game();
    net = new Net();
    ui = new Ui(game);
};
