class Point {
    constructor(x, y) {
        if (typeof (x) == "number" && typeof (y) == "number") {
            this._x = x;
            this._y = y;
        } else {
            throw "Invalid parameter : must be number"
        }
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

class Droite {
    constructor(a, b) {
        if (a instanceof Point && b instanceof Point) {
            this._a = (b.y - a.y) / (b.x - a.x);
            this._b = a.y - this._a * a.x;
        } else if (typeof (a) == "number" && typeof (b) == "number") {
            this._a = a;
            this._b = b;
        } else {
            throw "Invalid parameter : must be number or Point"
        }
    }

    get a() {
        return this._a;
    }

    get b() {
        return this._b;
    }
}

class Ellipse {
    constructor(a, b) {
        if (typeof (a) == "number" && typeof (b) == "number") {
            this._a = a;
            this._b = b;
        } else {
            throw "Invalid parameter : must be number"
        }
    }

    get a() {
        return this._a;
    }

    get b() {
        return this._b;
    }

    intersection(droite){
        if(droite instanceof Droite){
            const pow = Math.pow;
            const a = (pow(this._b,2)+pow(this._a,2)*pow(droite.a,2))/(pow(this._a,2)*pow(this._b,2));
            const b = (2*droite.b*droite.a)*pow(this._b,2);
            const c = pow(droite.b,2)/pow(this._b,2)-1
            const discriminant = pow(b,2)-4*a*c;
            if(discriminant>0){
                const x1 = (-b + Math.sqrt(discriminant))/(2*a);
                const x2 = (-b - Math.sqrt(discriminant))/(2*a);
                const y1 = droite.a*x1+droite.b;
                const y2 = droite.a*x2+droite.b;
                const p1 = new Point(x1,y1);
                const p2 = new Point(x2,y2);
                return {p1,p2};
            }
        }else{
            throw "Invalid parameter : mus be a Droite"
        }
    }
}