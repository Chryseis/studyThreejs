uniform vec3 currentCol;
uniform vec3 newCol;
uniform float animRatio;
uniform float hideRatio;
varying vec3 vPos;

void main()
{
    float opacity = smoothstep(0.0, 1500.0, vPos.z) * 1.9;
    opacity *= 1.8 - hideRatio;

    vec4 color = vec4(currentCol * 1.2, opacity);
    vec4 color2 = vec4(newCol * 1.2, opacity);
    float r = animRatio * .5;
    vec4 finalColor = mix (color, color2, r);

    gl_FragColor = finalColor;
}
