var differentColours = {};

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Returns colour on the HSV colourspace that hasn't been used before
// a much nicer distribution than a more trivial approach
function differentColour(usedOn="generic", scheme) {
    if (differentColours[usedOn]) {
        // We've already picked colours for this graph and need to be careful not to pick a similar one.
        if (differentColours[usedOn].length == 0) {
            // In the cases where a lot of colours need to be chosen, we may run into a limit.
            // Hopefully there aren't more than 10 lines on a single graph, but just in case, reset the list.
            differentColours[usedOn] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        }
    }
    else {
        differentColours[usedOn] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    }
    // Fancy colour schemes!
    let h = 0;
    switch (scheme) {
        case "ocean":
            h = differentColours[usedOn].splice(Math.floor(differentColours[usedOn].length/2), 1);
            break;
        case "magic":
            h = differentColours[usedOn].pop();
            break;
        default:
            h = differentColours[usedOn].shift();
    }
    // Use the next colour on the list
    let rgb = HSVtoRGB(h, 0.6, 0.99);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}


// Converts colours for thermal cameras
function rainbow(n) {
    return 'hsl(' + n * 15 + ', 100%, 50%)';
}