class Pole extends THREE.Mesh {

    constructor(geometry, material, color, height,width ) {
      super(geometry, material)
      this.color = color;
      this.width = width;
      this.height = height;
      
    }
  }