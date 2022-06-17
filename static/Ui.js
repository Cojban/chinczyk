console.log("ui")
class Ui {
    constructor(game) {
        let pulling = false;
        document.getElementById("confirm").onclick = async () => {
            console.log(document.getElementById("login").value)
            let json = await net.login(document.getElementById("login").value)
            if (json.added) {
                log.innerHTML = "<br><h1 style='color: lightgreen;'>Oczekiwanie na drugiego gracza<h1><center><img style='width:30%;height:30%;' src='img/loading.gif'><center>";
                let awaitForSecondPlayer = await net.playerslog();
                log.style.display = "none";
                socket.emit("ready");
                if (json.twoplayers) {
                    game.myTurn = false;
                    console.log("2 players")
                    game.camera.position.set(0, 500, -500)
                    game.camera.lookAt(game.scene.position)
                }
                // else if(json.threeplayers){
                //     game.camera.position.set(0, 500, 0)
                //     game.camera.lookAt(game.scene.position)
                // }
                // else if(json.fourplayers){
                //     game.camera.position.set(0, 500, -2000)
                //     game.camera.lookAt(game.scene.position)
                // }
                else {
                    game.myTurn = true;
                    game.camera.position.set(0, 500, 500)
                    game.camera.lookAt(game.scene.position)
                }
            }
            else if (json.TooManyPlayers) {
                alert("Błąd logowania: Jest już zalogowana maksymalna liczba graczy")
            }
            else if (json.RepeatLogin) {
                alert("Błąd logowania: Istnieje już gracz o takim loginie")
            }

            console.log(json)
            //   this.interval = setInterval
        }
        document.getElementById("reset").onclick = async () => {
            let json = await net.reset()
            console.log(json)
        }

        // document.getElementById("zacznij").onclick = async () => {
        //     if(pulling){
        //     let json = await net.zacznij()
        //     console.log(json)}
        //     pulling = true;
        //     log.innerHTML = "<br><h1 style='color: lightgreen;'>Oczekiwanie na drugiego gracza<h1><center>";
        // }
    }




}