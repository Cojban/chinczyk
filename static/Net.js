console.log("net");

class Net {
    constructor() {
        socket.on("startTurn", () => {
            game.startTurn();
        });

        socket.on("move", (id, height, width, color,) => {
            console.log("move");
            game.setPawnPosition(id, height, width, color);
            game.startTurn();
        });

        socket.on("endTurn", () => {
            game.endTurn();
        });
        socket.on("RedWin", () => {

        });
        socket.on("YellowWin", () => {

        });
        socket.on("Draw", () => {

        });

        socket.on("beat", (index) => {
            game.beat(index);
        });

        socket.on("end", () => {
            game.endGame();
        });
    }

    login = async (nick) => {
        const data = JSON.stringify({
            user: nick,
        });

        const options = {
            method: "POST",
            body: data,
        };

        let response = await fetch("/ADD_USER", options);

        if (!response.ok) return response.status;
        else return await response.json(); // response.json
    };

    gamelogin = async (nick) => {
        const data = JSON.stringify({
            user: nick,
        });

        const options = {
            method: "POST",
            body: data,
        };

        let response = await fetch("/GAME_USER", options);

        if (!response.ok) return response.status;
        else return await response.json(); // response.json
    };
    reset = async () => {
        const data = JSON.stringify({});

        const options = {
            method: "POST",
            body: data,
        };

        let response = await fetch("/DELETE_USERS", options);

        if (!response.ok) return response.status;
        else return await response.json(); // response.json
    };
    // zacznij = async () => {

    //     const data = JSON.stringify({

    //     })

    //     const options = {
    //         method: "POST",
    //         body: data,
    //     };

    //     let response = await fetch("/GAME_PULL", options)

    //     if (!response.ok)
    //         return response.status
    //     else
    //         return await response.json() // response.json

    // }

    playerslog = async () => {
        const data = JSON.stringify({});

        const options = {
            method: "POST",
            body: data,
        };

        let response = await fetch("/PLAYERS_LOG", options);

        if (!response.ok) return response.status;
        else return await response.json(); // response.json
    };

    /*  przyjmij = async () => {
          const przyjmij1 = JSON.parse()
          log.innerHTML = ""
          console.log("przyjmij1"+przyjmij1)
      }*/
}
