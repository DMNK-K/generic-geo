/**Class for representing 2 dimensional vectors, useful both for points and for vectors representing translation/movement/direction.*/
class V2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.dims = [x, y];

        //binding this for all methods that are non-static
        for(let property in this)
        {
            if (this.hasOwnProperty(property) && typeof this[property] == "function")
            {
                this[property] = this[property].bind(this);
            }
        }

    }

    /**Returns true when this vector is equal to other. Tolerance is used for V2s with floating point values for dimensions.
     * For vectors inteded for integers, keep the tolerance = 0, as it is by default. If vectors are floats, values between 0.001 and 0.00001 are recommended.
     */
    equal(other, tolerance = 0)
    {
        const absDiff = this.diff(other).abs();
        return (absDiff.x <= tolerance && absDiff.y <= tolerance);
    }

    /**Returns a new V2 that is the result of making both dimensions of this vector absolute.*/
    abs()
    {
        return new V2(Math.abs(this.x), Math.abs(this.y));
    }

    /**Adds v2 to this vector, returning a new instance of V2. */
    add(v2)
    {
        return new V2(this.x + v2.x, this.y + v2.y);
    }

    /**Returns a new V2 that is the sum of all passed vectors. */
    static sum(...vectors)
    {
        const result = new V2(0, 0);
        for(let i = 0; i < vectors.length; i++)
        {
            result.add(vectors[i]);
        }
        return result;
    }

    /**Subtracts v2 from this vector, returning a new V2. */
    sub(v2)
    {
        return new V2(this.x - v2.x, this.y - v2.y);
    }


    /**Returns a result of a - b. */
    static diff(a, b)
    {
        return a.sub(b);
    }

    /**Multiplies this vector by a number and returns a new V2. */
    mult(multiplier)
    {
        return new V2(this.x * multiplier, this.y * multiplier);
    }

    /**Divides this vector by a number and returns a new V2. */
    divide(divider)
    {
        if (divider == 0) {return new V2(NaN, NaN);}
        return new V2(this.x / divider, this.y / divider);
    }

    //shorthands
    /**Shorthand for writing new V2(0, 0) */
    static get zero() {return new V2(0, 0);}
    /**Shorthand for writing new V2(0, 0) */
    static get one() {return new V2(1, 1);}
    /**A vector pointing up. Shorthand for writing new V2(1, 1) */
    static get u() {return new V2(0, 1);}
    /**A vector pointing down. Shorthand for writing new V2(0, 1) */
    static get d() {return new V2(0, -1);}
    /**A vector pointing left. Shorthand for writing new V2(-1, 0) */
    static get l() {return new V2(-1, 0);}
    /**A vector pointing right. Shorthand for writing new V2(1, 0) */
    static get r() {return new V2(1, 0);}

    //clockwise array of basic directions
    static get adjDirs() {return [V2.u, V2.r, V2.d, V2.l];}
    static get diagDirs() {return [new V2(1, 1), new V2(1, -1), new V2(-1, -1), new V2(-1, 1)];}
    static get baseDirs()
    {
        return[
            V2.u,
            new V2(1, 1),
            V2.r,
            new V2(1, -1),
            V2.d,
            new V2(-1, -1),
            V2.l,
            new V2(-1, 1),
        ];
    }

    /**Returns a new V2 that is a clone of this one. */
    clone()
    {
        return new V2(this.x, this.y);
    }

    /**Returns a new V2 that is a clone of other. */
    static cloneFrom(other)
    {
        return new V2(other.x, other.y);
    }

    /**Returns the squared euclidian distance between points a and b. */
    static sqDist(a, b)
    {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    }

    /**Returns the euclidian distance between point a and b.*/
    static dist(a, b)
    {
        return Math.sqrt(V2.sqDist(a, b));
    }

    /**Returns the Manhattan distance between points a and b. */
    static mhDist(a, b)
    {
        const v = b.sub(a);
        return Math.abs(v.x) + Math.abs(v.y);
    }

    /**Returns the magnitude (also called length) of this vector.*/
    magnitude()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**Returns normalized instance of this V2, which means it makes it have magnitude = 1, preserving the direction. Returns V2.zero() when current magnitude is 0.*/
    normalize()
    {
        const mag = this.magnitude();
        if (mag === 0){console.log("Tried normalizing vector with 0 magnitude."); return V2.zero;}
        return new V2(this.x / mag, this.y / mag);
    }

    /**Returns the dot product of a and b.*/
    static dot(a, b)
    {
        return a.x * b.x + a.y * b.y;
    }

    /**Returns the dot product of a and b after normalizing both of them.*/
    static normDot(a, b)
    {
        const nA = a.normalize();
        const nB = b.normalize();
        return V2.dot(nA, nB);
    }
  
    /**Returns the signed angle of this vector in degrees in relation to the x axis. This means V2.right() will return 0 degrees.
     * V2.up() will return -90, V2.down() 90, etc. The range of return values is between -180 and 180.
     */
    angleRaw()
    {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }

    /**Returns the unsigned angle of this vector in degrees, from 0 to 360, starting at V2.up() and going clockwise. */
    angle()
    {
        const angle = this.angleRaw();
        return (angle >= -90 && angle <= 180) ? angle + 90 : angle + 450;
    }

    /**Returns the unsigned angle between 2 vectors a and b. The range of return values is between 0 and 180 */
    static angleBetween(a, b)
    {
        return Math.abs(Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x) * 180 / Math.PI);
    }

    /**Returns a new V2 with x and y being rounded from this vector. */
    round()
    {
        return new V2(Math.round(this.x), Math.round(this.y));
    }

    /**Returns a new V2 with x and y being rounded up from this vector. */
    ceil()
    {
        return new V2(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**Returns a new V2 with x and y being rounded down from this vector. */
    floor()
    {
        return new V2(Math.floor(this.x), Math.floor(this.y));
    }

    /**Returns a new V2 of which y is the x of this one, and of which x is the y of this one */
    swapDimensions()
    {
        return new V2(this.y, this.x);
    }

    /**Scales this vector to a set magnitude, returning a new instance of V2. Might be prone to floating point innacuracies. */
    setMagnitude(target)
    {
        if (target < 0) {console.error("Trying to set magnitude to a negative value, this is not possible."); return V2.zero();}
        const normalized = this.normalize();
        return normalized.mult(target);
    }

    /**If the magnitude of this vector exceeds min and max, forces it to be within range. Returns a new V2. */
    clampMagnitude(min, max)
    {
        if (min < 0){min = 0;}
        const mag = this.magnitude();
        if (mag < min) {return this.setMagnitude(min);}
        if (mag > max) {return this.setMagnitude(max);}
        return this;
    }

    /**Returns a new V2 that is the result of multiplying this vector and another component-wise. */
    scale(v2)
    {
        return new V2(this.x * v2.x, this.y * v2.y);
    }

    /**Returns a new V2 that is made up of the smallest x and the smallest y found within passed vectors. Returns null if none passed.*/
    static min(...vectors)
    {
        if (!vectors || vectors.length <= 0){return null;}
        let minX, minY = Number.POSITIVE_INFINITY;
        for(let i = 0; i < vectors.length; i++)
        {
            if (vectors[i].x < minX) {minX = vectors[i].x;}
            if (vectors[i].y < minY) {minY = vectors[i].y;}
        }
        return new V2(minX, minY);
    }

    /**Returns a new V2 that is made up of the biggest x and the biggest y found within passed vectors. Returns null if none passed.*/
    static max(...vectors)
    {
        if (!vectors || vectors.length <= 0){return null;}
        let maxX, maxY = Number.NEGATIVE_INFINITY;
        for(let i = 0; i < vectors.length; i++)
        {
            if (vectors[i].x > maxX) {maxX = vectors[i].x;}
            if (vectors[i].y > maxY) {maxY = vectors[i].y;}
        }
        return new V2(maxX, maxY);
    }

    /**Returns a new V2 representing the ranges between minimal and maximal values of x and of y occuring within passed vectors. Returns null if none passed.*/
    static rangeDimensionally(...vectors)
    {
        if (!vectors || vectors.length <= 0){return null;}
        const min = V2.min(...vectors);
        const max = V2.max(...vectors);
        return new V2(max.x - min.x, max.y - min.y);
    }

    /**Returns a point that is a frac fraction of the way between points a and b, eg. if the fraction is 0.5, returns the halfway point.*/
    static getPointBetween(a, b, frac = 0.5)
    {
        const dir = b.sub(a);
        return a.add(dir.mult(frac));
    }

    /**Returns an array of n points spaced equally between points a and b. Eg. if n = 3, points are 1/4 of the way, 1/2 of the way and 3/4 of the way.
     * If includeEnds is true, the array also includes point a at [0], and point b at [last], in that case the length of the return array is n + 2.
     */
    static getPointsBetween(a, b, n, includeEnds)
    {
        const returnArray = [];
        if (includeEnds) {returnArray.push(V2.cloneFrom(a));}
        const fracBase = 1 / (1 + Math.abs(n));
        let frac;
        for(let i = 0; i < n; i++)
        {
            frac = fracBase * (i + 1);
            returnArray.push(V2.getPointBetween(a, b, frac));
        }
        if (includeEnds) {returnArray.push(V2.cloneFrom(b));}
        return returnArray;
    }

    /**Returns true if this vector is perpendicular to other (angled at 90 degrees). Tolerance is used to determine how precisely the 2 vectors need to be perpendicular for it to be considered true.
     * A value of 0 means only exactly perpendicular vectors will be considered as such. Values in the range of 0.001 to 0.00001 are recommended.*/
    isPerpendicular(other, tolerance = 0.0001)
    {
        return (Math.abs(V2.normDot(this, other)) <= tolerance);
    }

    /**Returns true if this vector is paralell to other. Tolerance is used to determine how precisely the 2 vectors need to be paralell for it to be considered true.
     * A value of 0 means only exactly paralell vectors will be considered as such. Values in the range of 0.001 to 0.00001 are recommended.
    */
    isParallel(other, tolerance = 0.0001)
    {
        return (Math.abs(V2.normDot(this, other) - 1) <= tolerance) || (Math.abs(V2.normDot(this, other) + 1) <= tolerance);
    }

    /**Returns true if all the vectors passed in are parallel. Tolerance is used to determine how precisely the 2 vectors need to be paralell for it to be considered true.
     * A value of 0 means only exactly paralell vectors will be considered as such. Values in the range of 0.001 to 0.00001 are recommended. If there's no vectors for comparison returns true.
     */
    static areParallel(tolerance = 0.0001, ...vectors)
    {
        if (!vectors || vectors.length < 2){return true;}
        for(let i = 1; i < vectors.length; i++)
        {
            if (!vectors[i - 1].isParallel(vectors[i], tolerance))
            {
                return false;
            }
        }
        return true;
    }

    /**Returns a new V2 perpendicular to this one. Y axis is always positive and the magnitude is preserved.*/ 
    getPerpendicular()
    {
        return (this.x >= 0) ? new V2(-this.y, this.x) : new V2(this.y, -this.x);
    }

    /**Returns an array of integer points adjacent to this point. Adjacent means north, south, east, west.*/
    getAdj()
    {
        const rounded = this.round();
        return [rounded.add(V2.u), rounded.add(V2.r), rounded.add(V2.d), rounded.add(V2.l)];
    }

    /**Returns an array of integer points diagonal to this point.*/
    getDiag()
    {
        const rounded = this.round();
        return [rounded.add(new V2(1, 1)), rounded.add(new V2(1, -1)), rounded.add(new V2(-1, -1)), rounded.add(new V2(-1, 1))];
    }

    /**Returns an array of integer points adjacent and diagonal to this point. */
    getSurrounding()
    {
        const rounded = this.round();
        return [
            rounded.add(V2.u),
            rounded.add(new V2(1, 1)),
            rounded.add(V2.r),
            rounded.add(new V2(1, -1)),
            rounded.add(V2.d),
            rounded.add(new V2(-1, -1)),
            rounded.add(V2.l),
            rounded.add(new V2(-1, 1)),
        ];
    }

    /**Returns true if this integer point is adjacent to to. Adjacent means north, south, east, west. */
    isAdj(to)
    {
        for(let i = 0; i < V2.adjDirs.length; i++)
        {
            if (this.add(V2.adjDirs[i]).equal(to))
            {
                return true;
            }
        }
        return false;
    }

    /**Returns true if this integer point is diagonal to to.*/
    isDiag(to)
    {
        for(let i = 0; i < V2.diagDirs.length; i++)
        {
            if (this.add(V2.diagDirs[i]).equal(to))
            {
                return true;
            }
        }
        return false;
    }

    /**Returns true if this integer point is diagonal or adjacent to to.*/
    isSurr(to)
    {
        for(let i = 0; i < V2.baseDirs.length; i++)
        {
            if (this.add(V2.baseDirs[i]).equal(to))
            {
                return true;
            }
        }
        return false;
    }

    /**Returns a string representation of this vector that looks like this: [x; y] */
    toString()
    {
        return "[" + this.x.toString() + "; " + this.y.toString() + "]";
    }
}

export default V2