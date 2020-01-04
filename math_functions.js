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

    symetriqueCentre(centre) {
        if (centre instanceof Point) {
            return new Point(2 * centre.x - this.x, 2 * centre.y - this.y);
        }
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

    perpendiculaire(point) {
        if (point instanceof Point) {
            // TODO : test si point sur droite
            const a = -1 / this.a
            const b = point.y + a * point.x;
            return new Droite(a, b);
        }
    }

    intersection(droite) {
        if (droite instanceof Droite) {
            if (droite.a != this.a) {
                return new Point((droite.b - this.b) / (this.a - droite.a), ((droite.b - this.b) / (this.a - droite.a) * this.a));
            }
        }
    }

    getY(x) {
        return this.a * x + this.b;
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
        if(droite instanceof Droite) {
            const pow = Math.pow;
            const a = (pow(this.b, 2) + pow(this.a, 2) * pow(droite.a, 2)) / (pow(this.a, 2) * pow(this.b, 2));
            const b = (2 * droite.b * droite.a) * pow(this.b, 2);
            const c = pow(droite.b, 2) / pow(this.b, 2) - 1
            const discriminant = pow(b, 2) - 4 * a * c;
            if (discriminant > 0) {
                const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                const y1 = droite.a * x1 + droite.b;
                const y2 = droite.a * x2 + droite.b;
                const p1 = new Point(x1, y1);
                const p2 = new Point(x2, y2);
                return {p1, p2};
            }
        } else {
            throw "Invalid parameter : mus be a Droite"
        }
    }

    tangente(point) {
        if (point instanceof Point) {
            return new Droite(((-Math.pow(this.b, 2) * point.x) / Math.pow(this.a, 2) * point.y), Math.pow(this.b, 2) / point.y);
        } else {
            throw "Invalid parameter : mus be a Point"
        }
    }
}

function calculerRebond(ellipse, pointDeDepart, pointDeDirection) {
    const droiteTrajectoire = new Droite(pointDeDepart, pointDeDirection);
    const pointsRebond = ellipse.intersection(droiteTrajectoire);
    let res = {point: null, pointTraj: null};
    if (pointDeDepart.x < pointDeDirection.y) {
        if (pointsRebond.p1.x > pointDeDepart.x) {
            res.point = pointsRebond.p1;
        } else {
            res.point = pointsRebond.p2;
        }
    }
    const tangente = ellipse.tangente(res.point);
    const tangente0 = new Droite(tangente.a, 0);
    const axeSymetrie = tangente.perpendiculaire(res.point);
    const centreCymetrie = axeSymetrie.intersection(tangente0);
    const pointOrigine = tangente0.intersection(droiteTrajectoire);
    const newTrajectoire = new Droite(res.point, pointOrigine.symetriqueCentre(centreCymetrie));
    const pointTrajX = res.point.x + pointDeDirection.x - pointDeDepart.x;
    res.pointTraj = new Point(pointTrajX, newTrajectoire.getY(pointTrajX));
    return res;
}

/*
Renvoie une liste de points
 */
function calculerNRebonds(ellipse, pointDeDepart, pointDeDirection, n = 1) {
    let res = [pointDeDepart];
    let i = 1;
    let lastRes = calculerRebond(ellipse, pointDeDepart, pointDeDirection);
    res[i] = lastRes.point;
    for (i = 2; i < n; i++) {
        lastRes = calculerRebond(ellipse, lastRes.point, lastRes.pointTraj);
        res[i] = lastRes.point;
    }
    return res;
}