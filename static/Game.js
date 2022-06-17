
console.log("game");
class Game {
    constructor() {
        this.board = [
            // 0 - biały 1 - czerwony , 2 - niebieski , 3 - żółty, 4 - zielony
            // dodajemy do wartości powyżej: +0 wókół pól początkowych, +4 pola startu, +8 pola końcowe
            [2, 2, 2, 2, 0, 0, 0, 3, 3, 3, 3],
            [2, 0, 0, 2, 0, 11, 7, 3, 0, 0, 3],
            [2, 0, 0, 2, 0, 11, 0, 3, 0, 0, 3],
            [2, 2, 2, 2, 0, 11, 0, 3, 3, 3, 3],
            [0, 6, 0, 0, 0, 11, 0, 0, 0, 0, 0],
            [0, 10, 10, 10, 10, 0, 12, 12, 12, 12, 0],
            [0, 0, 0, 0, 0, 9, 0, 0, 0, 8, 0],
            [1, 1, 1, 1, 0, 9, 0, 4, 4, 4, 4],
            [1, 0, 0, 1, 0, 9, 0, 4, 0, 0, 4],
            [1, 0, 0, 1, 5, 9, 0, 4, 0, 0, 4],
            [1, 1, 1, 1, 0, 0, 0, 4, 4, 4, 4],
        ];
        this.pionki = [
            // 1 - czerwony, 2 - niebieski, 3 - żółty, 4 - zielony

            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 2, 0, 0, 0, 0, 0, 3, 3, 0],
            [0, 2, 2, 0, 0, 0, 0, 0, 3, 3, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 0, 4, 4, 0],
            [0, 1, 1, 0, 0, 0, 0, 0, 4, 4, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];

        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        this.myTurn = false;
        this.rolled = false;
        this.cylinder = null;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x90ee90);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.set(0, 500, 501);
        this.camera.lookAt(this.scene.position);
        this.geometry = new THREE.BoxGeometry(50, 5, 50);

        this.checkers = [];
        this.path = [];
        this.pola = [];
        this.inGamePawns = [];

        this.geometrycylinder = new THREE.CylinderGeometry(20, 20, 7, 100);

        this.makeBoard();
        this.makePawns();
        this.rand();
        this.skip();
        this.scene.add(this.cylinder);

        console.log(this.path);

        document.getElementById("root").append(this.renderer.domElement);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        window.addEventListener("mousedown", (e) => {
            this.onClick(e);
        });

        this.clock = new Clock(90);
        this.clock.onTimeEnd = () => {
            game.timeEnd();
        };

        this.timeEndBool = false;
        this.end = false;

        this.render(); // wywołanie metody render
    }
    skip = () => {
        document.getElementById("skipTurn").addEventListener("click", () => {
            this.endTurn();
            socket.emit("endTurn");
        })

    }
    rand = () => {
        document.getElementById("random").addEventListener("click", () => {
            if (!this.myTurn || this.rolled) return;
            let roll = Math.floor(Math.random() * 6 + 1);

            if (roll == 1) {
                random.innerHTML = "<img style='width:100%;height:100%;' src='img/1.png'>";
            } else if (roll == 2) {
                random.innerHTML = "<img style='width:100%;height:100%;' src='img/2.png'>";
            } else if (roll == 3) {
                random.innerHTML = "<img style='width:100%;height:100%;' src='img/3.png'>";
            } else if (roll == 4) {
                random.innerHTML = "<img style='width:100%;height:100%;' src='img/4.png'>";
            } else if (roll == 5) {
                random.innerHTML = "<img style='width:100%;height:100%;' src='img/5.png'>";
            } else if (roll == 6) {
                random.innerHTML = "<img style='width:100%;height:100%;' src='img/6.png'>";
            }

            this.roll = roll;
            this.rolled = true;

            if (this.inGamePawns.length == 0 && this.roll != 6) {
                this.myTurn = false;
                // random.innerHTML = ""
                // this.roll = 0;
                socket.emit("endTurn");
            }
        });
    };

    timeEnd() {
        this.timeEndBool = true;
        socket.emit("timeEnd");
        this.myTurn = false;
        socket.emit("endTurn");
    }

    endGame() {
        this.end = true;
        let RedPawns = 0;
        let YellowPawns = 0;
        if (this.pionki[5][6] == 1) {
            RedPawns++;
        }
        if (this.pionki[5][7] == 1) {
            RedPawns++;
        }
        if (this.pionki[5][8] == 1) {
            RedPawns++;
        }
        if (this.pionki[5][9] == 1) {
            RedPawns++;
        }
        if (this.pionki[5][1] == 3) {
            YellowPawns++;
        }
        if (this.pionki[5][2] == 3) {
            YellowPawns++;
        }
        if (this.pionki[5][3] == 3) {
            YellowPawns++;
        }
        if (this.pionki[5][4] == 3) {
            YellowPawns++;
        }
        alert("Game ended!");
        if (RedPawns > YellowPawns) {
            alert("Red won and Yellow lost!");
            socket.emit("RedWin");
        }
        else if (RedPawns < YellowPawns) {
            alert("Yellow won and Red lost!");
            socket.emit("YellowWin");
        }
        else if (RedPawns == YellowPawns) {
            alert("Draw!")
            socket.emit("Draw");
        }


        //check if you are a winer
    }

    startTurn() {
        if (this.end) return;
        if (this.timeEndBool) {
            socket.emit("endTurn");
            return;
        }
        this.clock.start();
        this.myTurn = true;
        this.rolled = false;
        banner.innerHTML = "<br><center><h1 style='color: lightgreen;'>Twoja tura!<h1></center>";

        //my turn
    }

    endTurn() {
        this.clock.stop();
        this.myTurn = false;
        banner.innerHTML = "<br><center><h1 style='color: lightgreen;'>Tura przeciwnika!<h1></center>";
        //enemy turn
    }
    onClick(event) {
        if (!this.myTurn || !this.rolled) return;

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVector, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        console.log(intersects.length);
        if (intersects.length == 0) return;
        let clickedObject = intersects[0].object;
        console.log(clickedObject);
        if ((this.camera.position.z == 500 && clickedObject.color == "red") || (this.camera.position.z == -500 && clickedObject.color == "yellow")) {
            console.log(clickedObject.height);
            console.log(clickedObject.width);
            if (clickedObject instanceof Pionek) {
                if (this.camera.position.z == 500 && clickedObject.color == "red") {
                    for (let checker of this.checkers) {
                        if (checker != clickedObject) continue;
                        console.log(this.roll);
                        console.log(this.pionki[this.path[clickedObject.number + this.roll].width][this.path[clickedObject.number + this.roll].height]);
                        if (this.roll == 6 && (this.pionki[4][9] == 0 || this.pionki[4][9] == 3) && ((clickedObject.height == 8 && clickedObject.width == 1) || (clickedObject.height == 8 && clickedObject.width == 2) || (clickedObject.height == 9 && clickedObject.width == 1) ||(clickedObject.height == 9 && clickedObject.width == 2)))

        {
                            console.log(this.roll);
                            console.log("przeniesienie");

                           

                            // this.pionki[clickedObject.width][clickedObject.height] = 0;
                            // clickedObject.height = 9;
                            // clickedObject.width = 4;
                            // this.pionki[4][9] = 1;

                            // clickedObject.position.x = -250 + clickedObject.width * 50;
                            // clickedObject.position.z = -250 + clickedObject.height * 50;
                            this.inGamePawns.push(clickedObject);
                            socket.emit("move", this.checkers.indexOf(clickedObject), 9, 4, 1, 0);
                            this.setPawnPosition(this.checkers.indexOf(clickedObject), 9, 4, 1, 0);
                        } else if (
                            this.pionki[this.path[clickedObject.number + this.roll].width][this.path[clickedObject.number + this.roll].height] != 1 &&
                            (clickedObject.height != 8 || clickedObject.width != 1) &&
                            (clickedObject.height != 8 || clickedObject.width != 2) &&
                            (clickedObject.height != 9 || clickedObject.width != 1) &&
                            (clickedObject.height != 9 || clickedObject.width != 2)
                        ) {
                            console.log(this.path[clickedObject.number + this.roll]);
                            console.log("path width:" + this.path[clickedObject.number + this.roll].width);
                            if (
                                (clickedObject.number == 13 && this.roll >= 6) ||
                                (clickedObject.number == 14 && this.roll >= 5) ||
                                (clickedObject.number == 15 && this.roll >= 4) ||
                                (clickedObject.number == 16 && this.roll >= 3) ||
                                (clickedObject.number == 17 && this.roll >= 2) ||
                                (clickedObject.number == 18 && this.roll >= 1)
                            ) {
                                clickedObject.number = clickedObject.number + 4;
                            }
                            if (this.pionki[this.path[clickedObject.number + this.roll].width][this.path[clickedObject.number + this.roll].height] == 3) {
                                for (let i = 0; i < this.checkers.length; i++) {
                                    console.log(this.checkers[i].width);
                                    console.log(this.path[clickedObject.number + this.roll].width);
                                    console.log(this.checkers[i].height);
                                    console.log(this.path[clickedObject.number + this.roll].height);
                                    if (this.checkers[i].width == this.path[clickedObject.number + this.roll].width && this.checkers[i].height == this.path[clickedObject.number + this.roll].height) {
                                        let startHeight;
                                        let startWidth;
                                        let removedObject = this.checkers[i];
                                        if (this.pionki[1][8] == 0) {
                                            startHeight = 1;
                                            startWidth = 8;
                                        } else if (this.pionki[2][8] == 0) {
                                            startHeight = 2;
                                            startWidth = 8;
                                        } else if (this.pionki[1][9] == 0) {
                                            startHeight = 1;
                                            startWidth = 9;
                                        } else if (this.pionki[2][9] == 0) {
                                            startHeight = 2;
                                            startWidth = 9;
                                        }
                                        socket.emit("move", this.checkers.indexOf(removedObject), startHeight, startWidth, 3, 0);
                                        socket.emit("beat", this.checkers.indexOf(removedObject));
                                        this.setPawnPosition(this.checkers.indexOf(removedObject), startHeight, startWidth, 3, 0);
                                    }
                                }
                            }
                            if (clickedObject.number + this.roll > 46) {
                                return;
                            }
                            socket.emit(
                                "move",
                                this.checkers.indexOf(clickedObject),
                                this.path[clickedObject.number + this.roll].height,
                                this.path[clickedObject.number + this.roll].width,
                                1,
                                clickedObject.number + this.roll
                            );
                            this.setPawnPosition(
                                this.checkers.indexOf(clickedObject),
                                this.path[clickedObject.number + this.roll].height,
                                this.path[clickedObject.number + this.roll].width,
                                1,
                                clickedObject.number + this.roll
                            );
                        }
                    }
                } else if (this.camera.position.z == -500 && clickedObject.color == "yellow") {
                    for (let checker of this.checkers) {
                        if (checker != clickedObject) continue;
                        else if (
                            this.roll == 6 &&
                            (this.pionki[6][1] == 0 || this.pionki[6][1] == 1) &&
                            ((clickedObject.height == 1 && clickedObject.width == 8) ||
                                (clickedObject.height == 2 && clickedObject.width == 8) ||
                                (clickedObject.height == 1 && clickedObject.width == 9) ||
                                (clickedObject.height == 2 && clickedObject.width == 9))
                        ) {
                            console.log(this.roll);
                            console.log("przeniesienie");

                            
                            // clickedObject.height = 1;
                            // clickedObject.width = 6;
                            // this.pionki[clickedObject.width][clickedObject.height] = 0;
                            // this.pionki[6][1] = 3;
                            // clickedObject.position.x = -250 + clickedObject.width * 50;
                            // clickedObject.position.z = -250 + clickedObject.height * 50;
                            this.inGamePawns.push(clickedObject);
                            socket.emit("move", this.checkers.indexOf(clickedObject), 1, 6, 3, 24);
                            this.setPawnPosition(this.checkers.indexOf(clickedObject), 1, 6, 3, 24);
                        } else if (
                            this.pionki[this.path[(clickedObject.number + this.roll) % 48].width][this.path[(clickedObject.number + this.roll) % 48].height] != 3 &&
                            (clickedObject.height != 1 || clickedObject.width != 8) &&
                            (clickedObject.height != 2 || clickedObject.width != 8) &&
                            (clickedObject.height != 1 || clickedObject.width != 9) &&
                            (clickedObject.height != 2 || clickedObject.width != 9)
                        ) {
                            // console.log(this.path[clickedObject.number + this.roll])
                            // console.log("path width:" + this.path[clickedObject.number + this.roll].width)
                            console.log(clickedObject.number)
                            console.log(this.roll)
                            if ((clickedObject.number == 17 && this.roll == 6) || (clickedObject.number == 18 && (this.roll == 5 || this.roll == 6)) ||  (clickedObject.number == 19 && (this.roll == 4 ||this.roll == 5 || this.roll == 6)) || (clickedObject.number == 20 && (this.roll == 3 || this.roll == 4 ||this.roll == 5 || this.roll == 6)) || (clickedObject.number == 21 && (this.roll == 2 || this.roll == 3 || this.roll == 4 ||this.roll == 5 || this.roll == 6)) || (clickedObject.number == 22 && (this.roll == 1 || this.roll == 2 || this.roll == 3 || this.roll == 4 || this.roll == 5 || this.roll == 6)) ) {
                                console.log("return")
                                return;
                            }
                            if (
                                (clickedObject.number == 37 && this.roll >= 6) ||
                                (clickedObject.number == 38 && this.roll >= 5) ||
                                (clickedObject.number == 39 && this.roll >= 4) ||
                                (clickedObject.number == 40 && this.roll >= 3) ||
                                (clickedObject.number == 41 && this.roll >= 2) ||
                                (clickedObject.number == 42 && this.roll >= 1)
                            ) {
                                clickedObject.number = clickedObject.number + 4;
                            }
                            if (this.pionki[this.path[(clickedObject.number + this.roll) % 48].width][this.path[(clickedObject.number + this.roll) % 48].height] == 1) {
                                console.log("if pierwszy")
                                for (let i = 0; i < this.checkers.length; i++) {
                                    console.log("pętla")
                                    console.log(this.checkers[i].width);
                                    console.log(this.path[clickedObject.number + this.roll].width);
                                    console.log(this.checkers[i].height);
                                    console.log(this.path[clickedObject.number + this.roll].height);
                                    if (this.checkers[i].width == this.path[(clickedObject.number + this.roll) % 48].width && this.checkers[i].height == this.path[(clickedObject.number + this.roll) % 48].height) {
                                        console.log("if drugi")
                                        let startHeight;
                                        let startWidth;
                                        let removedObject = this.checkers[i];
                                        if (this.pionki[8][1] == 0) {
                                            console.log("8 1")
                                            startHeight = 8;
                                            startWidth = 1;
                                        } else if (this.pionki[8][2] == 0) {
                                            console.log("8 2")
                                            startHeight = 8;
                                            startWidth = 2;
                                        } else if (this.pionki[9][1] == 0) {
                                            console.log("9 1")
                                            startHeight = 9;
                                            startWidth = 1;
                                        } else if (this.pionki[9][2] == 0) {
                                            console.log("9 2")
                                            startHeight = 9;
                                            startWidth = 2;
                                        }
                                        socket.emit("move", this.checkers.indexOf(removedObject), startHeight, startWidth, 1, 0);
                                        socket.emit("beat", this.checkers.indexOf(removedObject));
                                        this.setPawnPosition(this.checkers.indexOf(removedObject), startHeight, startWidth, 1, 0);
                                    }
                                }
                            }
                            ;
                            console.log(clickedObject.number + this.roll);

                            socket.emit(
                                "move",
                                this.checkers.indexOf(clickedObject),
                                this.path[(clickedObject.number + this.roll) % 48].height,
                                this.path[(clickedObject.number + this.roll) % 48].width,
                                3,
                                (clickedObject.number + this.roll) % 48
                            );
                            this.setPawnPosition(
                                this.checkers.indexOf(clickedObject),
                                this.path[(clickedObject.number + this.roll) % 48].height,
                                this.path[(clickedObject.number + this.roll) % 48].width,
                                3,
                                (clickedObject.number + this.roll) % 48
                            );
                        }
                    }
                }
                if (this.camera.position.z == 500 && clickedObject.color == "red") {
                }
                if (this.camera.position.z == 500 && clickedObject.color == "red") {
                } else if (this.camera.position.z == -500 && clickedObject.color == "yellow") {
                }

                console.log("kliknięty pionek");
            }
        }
    }

    beat(index) {
        let checker = this.checkers[index];
        let toRemove = this.inGamePawns.indexOf(checker);
        if (toRemove != -1) {
            this.inGamePawns.splice(toRemove, 1);
        }
    }

    setPawnPosition(id, height, width, color, number) {
        let clickedObject = this.checkers[id];
        this.pionki[clickedObject.width][clickedObject.height] = 0;
        clickedObject.height = height;
        clickedObject.width = width;
        clickedObject.number = number;
        this.pionki[width][height] = color;

        clickedObject.position.x = -250 + clickedObject.width * 50;
        clickedObject.position.z = -250 + clickedObject.height * 50;
    }

    makeBoard = () => {
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                this.materialRed = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialRed2 = new THREE.MeshBasicMaterial({
                    color: 0xff7f7f,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialRed3 = new THREE.MeshBasicMaterial({
                    color: 0xdc143c,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialBlue = new THREE.MeshBasicMaterial({
                    color: 0x0000ff,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialYellow = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialYellow2 = new THREE.MeshBasicMaterial({
                    color: 0xf1eb9c,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialYellow3 = new THREE.MeshBasicMaterial({
                    color: 0xfdda0d,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialGreen = new THREE.MeshBasicMaterial({
                    color: 0x228b22,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                this.materialWhite = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1,
                });
                let cube = null;
                if (this.board[i][j] == 0) {
                    // 0 - białe pole
                    cube = new Pole(this.geometry, this.materialWhite, "white", i, j);
                } else if (this.board[i][j] % 4 == 1) {
                    // 1 - czerwone pole

                    if (this.board[i][j] == 5) {
                        cube = new Pole(this.geometry, this.materialRed2, "red", i, j);
                    } else if (this.board[i][j] == 9) {
                        cube = new Pole(this.geometry, this.materialRed3, "red", i, j);
                    } else {
                        cube = new Pole(this.geometry, this.materialRed, "red", i, j);
                    }
                } else if (this.board[i][j] % 4 == 2) {
                    // 2 - niebieskie pole
                    cube = new Pole(this.geometry, this.materialBlue, "blue", i, j);
                } else if (this.board[i][j] % 4 == 3) {
                    // 3 - żółte pole
                    if (this.board[i][j] == 7) {
                        cube = new Pole(this.geometry, this.materialYellow2, "yellow", i, j);
                    } else if (this.board[i][j] == 11) {
                        cube = new Pole(this.geometry, this.materialYellow3, "red", i, j);
                    } else {
                        cube = new Pole(this.geometry, this.materialYellow, "yellow", i, j);
                    }
                } else if (this.board[i][j] % 4 == 0) {
                    // 4 - zielone pole
                    cube = new Pole(this.geometry, this.materialGreen, "green", i, j);
                }
                console.log("x: " + cube.height + " , z: " + cube.width);

                cube.position.set(-250 + j * 50, 0, -250 + i * 50);

                this.scene.add(cube);

                this.pola.push(cube);
                console.log(this.pola);
            }
        }
        this.path.push(this.pola[103]);
        this.path.push(this.pola[92]);
        this.path.push(this.pola[81]);
        this.path.push(this.pola[70]);
        this.path.push(this.pola[69]);
        this.path.push(this.pola[68]);
        this.path.push(this.pola[67]);
        this.path.push(this.pola[66]);
        this.path.push(this.pola[55]);
        this.path.push(this.pola[44]);
        this.path.push(this.pola[45]);
        this.path.push(this.pola[46]);
        this.path.push(this.pola[47]);
        this.path.push(this.pola[48]);
        this.path.push(this.pola[37]);
        this.path.push(this.pola[26]);
        this.path.push(this.pola[15]);
        this.path.push(this.pola[4]);
        this.path.push(this.pola[5]);
        this.path.push(this.pola[16]); // żółte końcowe
        this.path.push(this.pola[27]); // żółte końcowe
        this.path.push(this.pola[38]); // żółte końcowe
        this.path.push(this.pola[49]); // żółte końcowe
        this.path.push(this.pola[6]);
        this.path.push(this.pola[17]);
        this.path.push(this.pola[28]);
        this.path.push(this.pola[39]);
        this.path.push(this.pola[50]);
        this.path.push(this.pola[51]);
        this.path.push(this.pola[52]);
        this.path.push(this.pola[53]);
        this.path.push(this.pola[54]);
        this.path.push(this.pola[65]);
        this.path.push(this.pola[76]);
        this.path.push(this.pola[75]);
        this.path.push(this.pola[74]);
        this.path.push(this.pola[73]);
        this.path.push(this.pola[72]);
        this.path.push(this.pola[83]);
        this.path.push(this.pola[94]);
        this.path.push(this.pola[105]);
        this.path.push(this.pola[116]);
        this.path.push(this.pola[115]);
        this.path.push(this.pola[104]); //czerwone końcowe
        this.path.push(this.pola[93]); //czerwone końcowe
        this.path.push(this.pola[82]); //czerwone końcowe
        this.path.push(this.pola[71]); //czerwone końcowe
        this.path.push(this.pola[114]);

        console.log("before for", this.path.length);
        // for (let i = 0; i < this.path.length; i++) {
        //     console.log(i);
        //     this.path[i].material.color.setHex(0x000000)
        // }
    };

    makePawns = () => {
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                this.materialcylinderRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                this.materialcylinderBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                this.materialcylinderYellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                this.materialcylinderGreen = new THREE.MeshBasicMaterial({ color: 0x228b22 });
                if (this.pionki[i][j] == 1 && this.board[i][j] == 0) {
                    let cylinder = new Pionek(this.geometrycylinder, this.materialcylinderRed, "red", i, j, 0);
                    cylinder.position.set(-250 + j * 50, 10, -250 + i * 50);
                    this.scene.add(cylinder);
                    this.checkers.push(cylinder);
                }
                // else if (this.pionki[i][j] == 2 && this.board[i][j] == 0) {
                //     let cylinder = new Pionek(this.geometrycylinder, this.materialcylinderBlue, "blue", i, j);
                //     cylinder.position.set(-250 + j * 50, 10, -250 + i * 50);
                //     this.scene.add(cylinder);
                //     this.checkers.push(cylinder);

                // }
                else if (this.pionki[i][j] == 3 && this.board[i][j] == 0) {
                    let cylinder = new Pionek(this.geometrycylinder, this.materialcylinderYellow, "yellow", i, j, 24);
                    cylinder.position.set(-250 + j * 50, 10, -250 + i * 50);
                    this.scene.add(cylinder);
                    this.checkers.push(cylinder);
                }
                // else if (this.pionki[i][j] == 4 && this.board[i][j] == 0) {
                //     let cylinder = new Pionek(this.geometrycylinder, this.materialcylinderGreen, "green", i, j);
                //     cylinder.position.set(-250 + j * 50, 10, -250 + i * 50);
                //     this.scene.add(cylinder);
                //     this.checkers.push(cylinder);

                // }
            }
        }
    };
    render = () => {
        requestAnimationFrame(this.render);
        //this.cube.rotation.y += 0.03;

        this.camera.fov = 50;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
        console.log("render leci");
    };
}
