#version 300 es

precision mediump float;

out vec4 output_color;

// reference: https://github.com/3b1b/manim/tree/master/manimlib/shaders/mandelbrot_fractal

// size of canvas, in pixels
uniform vec2 u_resolution;
// boundaries of viz, [left, top, right, bottom]
uniform vec4 bounds;

// whether to draw mandelbrot or julia set
const bool MANDELBROT = true;
// stop after this many steps
const int ITERATIONS = 100;
// number of colors provided
const int COLORS = 8;
// if z exceeds this, point has "escaped" (diverged)
const float bound = 2.0f;

// provided c value used when rendering a julia set
uniform vec2 parameter;
// color palette for gradient
uniform vec4 colors[COLORS];

// multiply complex numbers
vec2 multiply(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

// map [0, 1] t to color gradient
vec4 get_color(float t) {
    t = clamp(t, 0.0f, 1.0f);
    float blend = t * float(COLORS);
    int aIndex = int(floor(t * float(COLORS)));
    int bIndex = (aIndex + 1);
    vec4 aColor = colors[aIndex];
    vec4 bColor = colors[bIndex];
    return mix(aColor, bColor, blend);
}

void main() {
    // pixel coord
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // flip y
    uv.y = 1.0f - uv.y;
    // apply transform
    uv.x = bounds[0] + uv.x * (bounds[2] - bounds[0]);
    uv.y = bounds[1] + uv.y * (bounds[3] - bounds[1]);

    // mandelbrot vs julia start values
    vec2 z = MANDELBROT ? vec2(0.0f, 0.0f) : uv;
    vec2 c = MANDELBROT ? uv : parameter;

    // default bg color
    output_color = vec4(0.0f, 0.0f, 0.0f, 1.0f);

    // iterate
    for(float n = 0.0f; n < float(ITERATIONS); n++) {
        // iterate z = z² + c
        z = multiply(z, z) + c;
        // if z exceeds "escape", point diverges
        if(length(z) > bound) {
            // transform n to make gradient nicer
            n += log(bound) / log(length(z));
            n += 0.5f * length(c);
            n = sqrt(n);
            n = (n - 1.5f) / (float(COLORS - 1) - 1.5f);
            // look up final color
            output_color = get_color(n);
            break;
        }
    }
}