function Entry(value, parent) {

  this.value = value;
  this.left = null;
  this.right = null;
  this.parent = parent;
  this.toString = () => {
    let strEntry = this.value;
    return strEntry;
  };
}

function BinaryTree() {
  this.root = null;
}

BinaryTree.prototype.empty = function () {
  this.root = null;
}

BinaryTree.prototype.toArray = function () {

  let result = [];
  let entry = this.root;
  let traverse = function (entry) {
    entry.left && traverse(entry.left);
    result.push(entry.value);
    entry.right && traverse(entry.right);
  };
  traverse(entry);
  return result;
}

BinaryTree.prototype.toString = function () {

  let arrEntryValue = this.toArray();
  let outEntryString = '';

  arrEntryValue.forEach(function (element) {
    outEntryString += element + ", ";
  });
  outEntryString = outEntryString.slice(0, -2);
  outEntryString='\u0022' + outEntryString + '\u0022';
  return outEntryString;
}

BinaryTree.prototype.insert = function (value) {

  if (this.root === null) {
    this.root = new Entry(value, null);
    return this.root;
  } else {
    return recInsert(value, this.root);
  }

  function recInsert(value, entry) {
    if (value > entry.value) {
      if (entry.right === null) {
        entry.right = new Entry(value, entry);
        return entry.right;
      } else {
        return recInsert(value, entry.right);
      }
    } else {
      if (entry.left === null) {
        entry.left = new Entry(value, entry);
        return entry.left;
      } else {
        return recInsert(value, entry.left);
      }
    }
  }
}

BinaryTree.prototype.find = function (value) {

  if (this.root === null) {
    return null;
  } else {
    return recFind(value, this.root);
  }

  function recFind(value, entry) {
    if (JSON.stringify(entry.value) === JSON.stringify(value)) {
      return entry;
    }
    if (value > entry.value) {
      if (entry.right === null) {
        return null;
      } else {
        return recFind(value, entry.right);
      }
    } else {
      if (entry.left === null) {
        return null;
      } else {
        return recFind(value, entry.left);
      }
    }
  }
}

BinaryTree.prototype.remove = function (value) {
  let delElement = this.find(value);
  if (delElement === this.root) {
    this.root = null;
    let resElements = [];
    let childArr = [];
    if (delElement.left != null) {
      childArr.push(delElement.left);
    }
    if (delElement.right != null) {
      childArr.push(delElement.right);
    }

    while (childArr.length > 0) {
      let newArr = [];
      for (let i = 0; i < childArr.length; i++) {
        let el = childArr[i];
        resElements.push(this.insert(el.value));
        if (el.left !== null) {
          newArr.push(el.left);
        }
        if (el.right !== null) {
          newArr.push(el.right);
        }
      }
      childArr = newArr;
    }
    return {
      delElement: delElement,
      movedArr: resElements
    };
    //return{delElement:delElement,movedArr:[]};
  }
  if (delElement.parent.left == delElement) {
    delElement.parent.left = null;
  } else if (delElement.parent.right == delElement) {
    delElement.parent.right = null;
  }
  delElement.parent = null;

  let resElements = [];
  let childArr = [];
  if (delElement.left != null) {
    childArr.push(delElement.left);
  }
  if (delElement.right != null) {
    childArr.push(delElement.right);
  }

  while (childArr.length > 0) {
    let newArr = [];
    for (let i = 0; i < childArr.length; i++) {
      let el = childArr[i];
      resElements.push(this.insert(el.value));
      if (el.left !== null) {
        newArr.push(el.left);
      }
      if (el.right !== null) {
        newArr.push(el.right);
      }
    }
    childArr = newArr;
  }
  return {
    delElement: delElement,
    movedArr: resElements
  };
}
