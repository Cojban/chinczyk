class Pionek extends THREE.Mesh {
    constructor(geometry, material, color, height, width, number,) {
        super(geometry, material)
        this.color = color;
        this.width = width;
        this.height = height;
        this.number = number;
    }

}