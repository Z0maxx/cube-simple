varying vec3 vViewDirTangent;
varying vec2 vUv;

uniform samplerCube cubeMap;
uniform vec3 tintColor;
uniform float tintStrength;

float min3 (vec3 v) {
  return min (min (v.x, v.y), v.z);
}

void main()
{
    vec2 uv = fract(vUv);
    vec3 sampleDir = normalize(vViewDirTangent);

    sampleDir *= vec3(-1.,-1.,1.);
    vec3 viewInv = 1. / sampleDir;

    vec3 pos = vec3(uv * 2.0 - 1.0, -1.0);
    
    float fmin = min3(abs(viewInv) - viewInv * pos);
    sampleDir = sampleDir * fmin + pos;

    vec4 texColor = texture(cubeMap, sampleDir);

    vec3 tinted = texColor.rgb * tintColor;
    texColor.rgb = mix(texColor.rgb, tinted, 1.0);

    gl_FragColor = texColor;
}