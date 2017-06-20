import HuffTree from "HuffTree";

class HuffCoder {
  constructor() {}

  huffEncode(bytes) {
    this.code = {};
    let table = this.countBytes(bytes);
    this.tree = this.genHuffTree(table);

    let encoded = this.encode(bytes);
    let compressed = this.genArray(encoded);
    let code = this.traverseTree(this.tree);
    //let meta = this.genMeta(encoded);
    console.log(this.tree);
    console.log(code);
    return code;
  }

  huffDecode(code) {
    this.codeCursor = code;
    this.tree = this.rebuildTree();
    console.log(this.tree);
  }

  countBytes(bytes) {
    let freq = {};
    let freqArr = [];
    for (let byte of bytes) {
      freq[byte] = freq[byte] ? freq[byte] + 1 : 1;
    }
    for (let char in freq) {
      freqArr.push([freq[char], char]);
    }

    freqArr.sort();
    return this.combineTable(freqArr);
  }

  encode(bytes) {
    let encoded = '';
    for (let byte of bytes) {
      encoded += this.code[byte];
    }
    return encoded;
  }

  genMeta(binString) {
    let len = binString.length;
    this.traverseTree(this.tree);
  }

  traverseTree(root) {
    let code = '';
    if (!root)
      return code;
    if (root.left || root.right) {
      code += '0';
    } else {    // leaf node
      code += '1';
      let ascii = root.char.charCodeAt(0).toString(2);
      while (ascii.length < 8)
        ascii = '0' + ascii;
      code += ascii;
    }
    return code + this.traverseTree(root.left) + this.traverseTree(root.right);
  }

  rebuildTree(val) {
    val = val || null;
    let root = new HuffTree(val);
    if (this.codeCursor[0] === '0') {    // mid node
      this.codeCursor = this.codeCursor.slice(1);
      root.left = this.rebuildTree('0');
      root.right = this.rebuildTree('1');
    } else {    // leaf node
      root.char = parseInt(this.codeCursor.slice(1, 9), 2);
      this.codeCursor = this.codeCursor.slice(9);
    }
    return root;
  }

  genArray(binString) {
    let array = new Uint8Array((binString.length+1)/8);
    for (let i = 0, len = binString.length; i < len; i++) {
      let byte = binString.slice(i, i+8);
      if (byte.length < 8)    // TODO performance
        byte = (byte + '00000000').slice(0, 8);
      array[i] = parseInt(byte, 2);
    }
    return array;
  }

  genHuffTree(table, val, code) {
    val = val || null;
    code = code || '';
    let root = new HuffTree(val, code);

    if (typeof table[1] === 'string') {
      let char = table[1];
      root.char = char;
      this.code[char] = root.code;
    }
    else {
      let first = table[1][0];
      let second = table[1][1];
      root.left = this.genHuffTree(first, '0', root.code+'0');
      root.right = this.genHuffTree(second, '1', root.code+'1');
    }
    return root;
  }

  combineTable(table) {
    while (table.length > 1) {
      let first = table.shift();
      let second = table.shift();
      table.push([first[0] + second[0], [first, second]]);
      table.sort();
    }
    return table[0];
  }
}