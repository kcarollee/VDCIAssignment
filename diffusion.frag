// Fragment shader
precision mediump float;

uniform sampler2D tex0; // The current texture
uniform vec2 resolution; // Canvas resolution

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    // Sample the current pixel and its neighbors
    vec4 center = texture2D(tex0, uv);
    vec4 left = texture2D(tex0, uv + vec2(-1.0 / resolution.x, 0.0));
    vec4 right = texture2D(tex0, uv + vec2(1.0 / resolution.x, 0.0));
    vec4 up = texture2D(tex0, uv + vec2(0.0, -1.0 / resolution.y));
    vec4 down = texture2D(tex0, uv + vec2(0.0, 1.0 / resolution.y));

    // Average color to diffuse
    vec4 diffusion = (center + left + right + up + down) / 5.0;
    diffusion.y = 1.0;
    // Slight decay to avoid infinite diffusion
    gl_FragColor = vec4(uv.x, .0, .0, 1.0);
}
