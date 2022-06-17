var express = require("express");
var app = express();
app.use(express.text());
const PORT = process.env.PORT || 3000;
let loginarray = [];
let sockets = [];
let FirstPlayer;
let SecondPlayer;
// let PlayersPulling = 0;
let toResponse = null;
let doc;
let timeEnd = [];
const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});



// coll1.update({ login: "a" }, { $set: 1 }, {}, function (err, numUpdated) {
//     console.log("zaktualizowano " + numUpdated)
//  });
app.post("/ADD_USER", (req, res) => {
    console.log("post", req.body);
    let body = JSON.parse(req.body);
    let added = false;
    let twoplayers = false;
    // let threeplayers = false;
    // let fourplayers = false;
    let RepeatLogin = false;
    let TooManyPlayers = false;
    if (loginarray.lenght == 0) {
        FirstPlayer = body.user;
    }

    if (loginarray.length == 2) {
        TooManyPlayers = true;
    } else if (loginarray.length < 2 && loginarray[0] != body.user) {
        if (loginarray.lenght == 1) {
            SecondPlayer = body.user;
        }
        doc = {
            login: body.user,
            wins: 0,
            losses: 0,
            draws: 0
        };
        coll1.count({ login: body.user }, function (err, count) {
            console.log("dokumentów jest: ", count)
            if (count == 0) {
                coll1.insert(doc, function (err, newDoc) {
                    console.log("dodano dokument (obiekt):")
                    console.log(newDoc)
                });
            }
        });



        loginarray.push(body.user);
        added = true;
        if (loginarray.length == 2) {
            twoplayers = true;
            toResponse.end(JSON.stringify({}));
        }
    }
    // else if(loginarray.lenght < 3 && loginarray[0] != body.user && loginarray[1] != body.user){
    //     loginarray.push(body.user);
    //     added = true;
    //     if (loginarray.length == 3) {
    //         threeplayers = true;
    //         toResponse.end(JSON.stringify({}))
    //     }
    // }
    // else if(loginarray.lenght < 4 && loginarray[0] != body.user && loginarray[1] != body.user && loginarray[2] != body.user){
    //     loginarray.push(body.user);
    //     added = true;
    //     if (loginarray.length == 4) {
    //         fourplayers = true;
    //         toResponse.end(JSON.stringify({}))
    //     }
    // }
    else if (loginarray.length < 2) {
        RepeatLogin = true;
    }

    console.log(loginarray);
    //    console.log("JSON  " + JSON.stringify(req.body))
    res.end(
        JSON.stringify({
            added: added,
            twoplayers: twoplayers,
            // threeplayers: threeplayers,
            // fourplayers: fourplayers,
            RepeatLogin: RepeatLogin,
            TooManyPlayers: TooManyPlayers,
        })
    );
});
app.post("/DELETE_USERS", (req, res) => {
    console.log("post", req.body);
    loginarray = [];
    sockets = [];
    timeEnd = [];
    console.log(loginarray);
});
app.post("/PLAYERS_LOG", (req, res) => {
    if (loginarray.length == 2) {
        res.end(JSON.stringify({}));
        return;
    }
    toResponse = res;
});
app.post("/GAME_USER", (req, res) => {
    let playerone = false;
    let playertwo = false;
    // let playerthree = false;
    // let playerfour = false;
    if (loginarray.length == 1) {
        playerone = true;
    } else if (loginarray.length == 2) {
        playertwo = true;
    }
    // else if(loginarray.length == 3){
    //     playerthree = true;
    // }
    // else if(loginarray.length == 4){
    //     playerfour = true;
    // }
    res.end(
        JSON.stringify({
            playerone: playerone,
            playertwo: playertwo,
            // playerthree: playerthree,
            // playerfour: playerfour
        })
    );
});

const server = app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
});
const io = require("socket.io")(server);
io.on("connection", (socket) => {
    socket.on("ready", () => {
        console.log("ready");
        sockets.push(socket);
    });

    socket.on("endTurn", () => {
        socket.emit("endTurn");
        getOppositeSocket(socket).emit("startTurn");
    });
    socket.on("RedWin", () => {
        console.log("redwin")
    });
    socket.on("YellowWin", () => {
        console.log("yellowwin")
    });
    socket.on("Draw", () => {
        console.log("draw")
        doc = {
            login: FirstPlayer,
            wins: 0,
            losses: 0,
            draws: 0
        };
        coll1.remove({ login: FirstPlayer }, {}, function (err, numRemoved) {
            console.log("usunięto dokumentów: ", numRemoved)
        });
        coll1.remove({ login: SecondPlayer }, {}, function (err, numRemoved) {
            console.log("usunięto dokumentów: ", numRemoved)
        });
    });



    socket.on("move", (id, height, width, color) => {
        socket.emit("endTurn");
        getOppositeSocket(socket).emit("move", id, height, width, color);
    });

    socket.on("beat", (index) => {
        getOppositeSocket(socket).emit("beat", index);
    });

    socket.on("timeEnd", () => {
        timeEnd.push("end is here");
        if (timeEnd.length >= 2) {
            socket.emit("end");
            getOppositeSocket(socket).emit("end");
        }
    });
});

function getOppositeSocket(socket) {
    return socket == sockets[0] ? sockets[1] : sockets[0];
}

app.use(express.static("static"));
