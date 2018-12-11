function A() {
    this.obj = {
        a: 1,
        b: 2
    }
    console.log(123)
}

function B() {
    this.b = 2;
}

A.prototype.a = {
    aa: '2',
    bb: '3'
}


B.prototype = new A();

B.prototype.constructor = B;

var b = new B();

console.log(b instanceof A)

console.log(B.prototype.constructor)



