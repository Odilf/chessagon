let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @param {number} color
* @returns {boolean}
*/
export function should_flip(color) {
    _assertNum(color);
    const ret = wasm.should_flip(color);
    return ret !== 0;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
*/
export const Alignment = Object.freeze({ Vertical:0,"0":"Vertical",Horizontal:1,"1":"Horizontal", });
/**
*/
export const PieceType = Object.freeze({ Pawn:0,"0":"Pawn",Knight:1,"1":"Knight",Bishop:2,"2":"Bishop",Rook:3,"3":"Rook",Queen:4,"4":"Queen",King:5,"5":"King", });
/**
*/
export const Color = Object.freeze({ White:0,"0":"White",Black:1,"1":"Black", });
/**
*/
export class Board {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Board.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_board_free(ptr);
    }
    /**
    * @param {Vector} position
    * @returns {Piece | undefined}
    */
    piece_at(position) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(position, Vector);
        if (position.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.board_piece_at(this.__wbg_ptr, position.__wbg_ptr);
        return ret === 0 ? undefined : Piece.__wrap(ret);
    }
    /**
    */
    constructor() {
        const ret = wasm.board_new();
        return Board.__wrap(ret);
    }
}
/**
* A 2D vector with floating point coordinates in canonical (or cartesian or standard) basis.
*/
export class CanonicalVector {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CanonicalVector.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_canonicalvector_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_canonicalvector_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        wasm.__wbg_set_canonicalvector_x(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_canonicalvector_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        wasm.__wbg_set_canonicalvector_y(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} alignment
    * @param {number} radius
    * @returns {string}
    */
    svg_points(alignment, radius) {
        let deferred1_0;
        let deferred1_1;
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.__wbg_ptr);
            _assertNum(alignment);
            wasm.canonicalvector_svg_points(retptr, this.__wbg_ptr, alignment, radius);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
/**
*/
export class GameState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GameState.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gamestate_free(ptr);
    }
    /**
    * @returns {Board}
    */
    get board() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_gamestate_board(this.__wbg_ptr);
        return Board.__wrap(ret);
    }
    /**
    * @param {Board} arg0
    */
    set board(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(arg0, Board);
        if (arg0.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_gamestate_board(this.__wbg_ptr, ptr0);
    }
    /**
    */
    constructor() {
        const ret = wasm.gamestate_new();
        return GameState.__wrap(ret);
    }
    /**
    * @param {Vector} origin
    * @param {Vector} target
    * @returns {boolean}
    */
    can_move(origin, target) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(origin, Vector);
        if (origin.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(target, Vector);
        if (target.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.gamestate_can_move(this.__wbg_ptr, origin.__wbg_ptr, target.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {Vector} origin
    * @param {Vector} target
    * @returns {Piece | undefined}
    */
    try_move(origin, target) {
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.__wbg_ptr);
            _assertClass(origin, Vector);
            if (origin.__wbg_ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            _assertClass(target, Vector);
            if (target.__wbg_ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            wasm.gamestate_try_move(retptr, this.__wbg_ptr, origin.__wbg_ptr, target.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 === 0 ? undefined : Piece.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number}
    */
    turn() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.gamestate_turn(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    current_color() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.gamestate_current_color(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    status_code() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.gamestate_status_code(this.__wbg_ptr);
        return ret;
    }
}
/**
*/
export class Move {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Move.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_move_free(ptr);
    }
    /**
    * @returns {Vector}
    */
    get origin() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_move_origin(this.__wbg_ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} arg0
    */
    set origin(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(arg0, Vector);
        if (arg0.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_move_origin(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {Vector}
    */
    get target() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_move_target(this.__wbg_ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} arg0
    */
    set target(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(arg0, Vector);
        if (arg0.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_move_target(this.__wbg_ptr, ptr0);
    }
    /**
    * @param {Vector} origin
    * @param {Vector} target
    */
    constructor(origin, target) {
        _assertClass(origin, Vector);
        if (origin.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(target, Vector);
        if (target.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.move_new_wasm(origin.__wbg_ptr, target.__wbg_ptr);
        return Move.__wrap(ret);
    }
    /**
    * @returns {Vector}
    */
    delta() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.move_delta(this.__wbg_ptr);
        return Vector.__wrap(ret);
    }
}
/**
*/
export class Piece {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Piece.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            typ: this.typ,
            position: this.position,
            color: this.color,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_piece_free(ptr);
    }
    /**
    * @returns {number}
    */
    get typ() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_piece_typ(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set typ(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_piece_typ(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {Vector}
    */
    get position() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_piece_position(this.__wbg_ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} arg0
    */
    set position(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(arg0, Vector);
        if (arg0.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_piece_position(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {number}
    */
    get color() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_piece_color(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set color(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_piece_color(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} color
    * @param {number} typ
    * @param {Vector} position
    */
    constructor(color, typ, position) {
        _assertNum(color);
        _assertNum(typ);
        _assertClass(position, Vector);
        if (position.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = position.__destroy_into_raw();
        const ret = wasm.piece_new(color, typ, ptr0);
        return Piece.__wrap(ret);
    }
}
/**
* A 2D vector with integer coordinates in hexagonal basis.
*/
export class Vector {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vector.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vector_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_vector_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_vector_x(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_vector_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_vector_y(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    constructor(x, y) {
        _assertNum(x);
        _assertNum(y);
        const ret = wasm.vector_new(x, y);
        return Vector.__wrap(ret);
    }
    /**
    * @param {number} alignment
    * @param {boolean} flip
    * @returns {CanonicalVector}
    */
    to_canonic(alignment, flip) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(alignment);
        _assertBoolean(flip);
        const ret = wasm.vector_to_canonic(this.__wbg_ptr, alignment, flip);
        return CanonicalVector.__wrap(ret);
    }
    /**
    * @param {number} color
    * @returns {Vector}
    */
    normalized(color) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(color);
        const ret = wasm.vector_normalized(this.__wbg_ptr, color);
        return Vector.__wrap(ret);
    }
    /**
    * Returns the vertical component of the vector if it is vertical, otherwise returns `None`.
    *
    * In hexagonal coords, a vector is vertical if its x and y components are equal.
    * @returns {number | undefined}
    */
    vertical() {
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.__wbg_ptr);
            wasm.vector_vertical(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Vector} factor
    * @returns {number | undefined}
    */
    multiplicity_of(factor) {
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.__wbg_ptr);
            _assertClass(factor, Vector);
            if (factor.__wbg_ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            wasm.vector_multiplicity_of(retptr, this.__wbg_ptr, factor.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

