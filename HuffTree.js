class HuffTree {
  constructor(val, code, char) {
    this.val = val || null;
    this.code = code || '';
    this.char = char || '';
    this.left = this.right = null;
  }
}

export default HuffTree;