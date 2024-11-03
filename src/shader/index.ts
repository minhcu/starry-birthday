export const vertext = `
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += sin(modelPosition.x * 5.0 - uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}
`;

export const fragment = `
uniform sampler2D uTexture;
uniform float uTouch;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 texture = texture2D(uTexture, vUv);
    vec3 gray = vec3((texture.r + texture.g + texture.b) * 0.3);

    float strength = distance(vUv, vec2(1.2, 0.5));
    strength -= - sin(uTouch - 0.5) * 3.0;

    vec3 color = mix(texture.rgb, gray.rgb, smoothstep(strength, strength - 0.2, uTouch));

    gl_FragColor = vec4(color, 1.0);
}
`;