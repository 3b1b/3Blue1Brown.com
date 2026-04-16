#version 300 es

precision mediump float;

out vec4 output_color;

// size of canvas, in pixels
uniform vec2 u_resolution;
// boundaries of viz, [left, top, right, bottom]
uniform vec4 bounds;

// degree of polynomial (and number of roots)
const int DEGREE = 5;
// stop newton's method if beyond this many steps
const int ITERATIONS = 20;
// stop newton's method if step size is smaller than this
const float THRESHOLD = 0.0001f;

// roots of polynomial
uniform vec2 roots[DEGREE];
// how to color each root
uniform vec4 colors[DEGREE];
// coefficients of expanded polynomial, from lowest degree to highest
uniform vec2 coefs[DEGREE + 1];

// multiply complex numbers
vec2 multiply(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

// divide complex numbers
vec2 divide(vec2 a, vec2 b) {
    float denominator = b.x * b.x + b.y * b.y;
    return multiply(a, vec2(b.x, -b.y)) / denominator;
}

// raise complex number to power
vec2 power(vec2 a, int n) {
    vec2 result = vec2(1.0f, 0.0f);
    for(int i = 0; i < n; i++) {
        result = multiply(result, a);
    }
    return result;
}

// evaluate polynomial at complex number z
vec2 polynomial(vec2 z) {
    vec2 result = vec2(0.0f);
    for(int n = 0; n < DEGREE + 1; n++) {
        result += multiply(coefs[n], power(z, n));
    }
    return result;
}

// evaluate derivative of polynomial at complex number z
vec2 polynomial_derivative(vec2 z) {
    vec2 result = vec2(0.0f);
    for(int n = 1; n < DEGREE + 1; n++) {
        result += float(n) * multiply(coefs[n], power(z, n - 1));
    }
    return result;
}

// find root of polynomial with newton's method
vec2 find_root(vec2 z) {
    for(int i = 0; i < ITERATIONS; i++) {
        vec2 step = divide(polynomial(z), polynomial_derivative(z));
        if(length(step) < THRESHOLD)
            break;
        z = z - step;
    }
    return z;
}

void main() {
    // pixel coord
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // flip y
    uv.y = 1.0f - uv.y;
    // apply transform
    uv.x = bounds[0] + uv.x * (bounds[2] - bounds[0]);
    uv.y = bounds[1] + uv.y * (bounds[3] - bounds[1]);
    // debug: show roots
    // for(int degree = 0; degree < DEGREE; degree++) {
    //     if(distance(uv, roots[degree]) < 0.1f) {
    //         output_color = vec4(1.0f);
    //         return;
    //     }
    // }
    // find root that pixel converges to using newton's method
    vec2 root = find_root(uv);
    // default bg color
    output_color = vec4(0.0f);
    // find closest input root to found root
    float closest = 1e10f;
    for(int degree = 0; degree < DEGREE; degree++) {
        float dist = distance(roots[degree], root);
        if(dist < closest) {
            closest = dist;
            // color pixel accordingly
            output_color = colors[degree];
        }
    }
}