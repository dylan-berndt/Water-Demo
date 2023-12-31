#version 330 core
out vec4 FragColor;

in vec3 FragPos;

#define WATER_COLOR vec3(0.05, 0.1, 0.1)

#define AMBIENT_LIGHT 0.6
#define LIGHT_DIRECTION normalize(vec3(1.0, -0.1, 1.0))

uniform vec3 lightColor = vec3(1.0, 0.9, 0.8);
uniform float time;
uniform vec3 camera;

#define SAMPLES 32
#define DRAG_MULT 0.2

vec2 wavedx(vec2 position, vec2 direction, float frequency, float timeshift) {
    float x = dot(direction, position) * frequency + timeshift;
    float wave = exp(sin(x) - 1.0);
    float dx = wave * cos(x);
    return vec2(wave, -dx);
}

float getWaves(vec2 position) {
    float iter = 0.0;
    float frequency = 1.0;
    float timeMultiplier = 2.0;
    float weight = 1.0;
    float sumOfValues = 0.0;
    float sumOfWeights = 0.0;
    for(int i = 0; i < SAMPLES; i++) {
        vec2 p = vec2(sin(iter), cos(iter));
        vec2 res = wavedx(position, p, frequency, time * timeMultiplier);

        position += p * res.y * weight * DRAG_MULT;

        sumOfValues += res.x * weight;
        sumOfWeights += weight;

        weight *= 0.82;
        frequency *= 1.18;
        timeMultiplier *= 1.07;

        iter += 1232.399963;
    }
    return sumOfValues / sumOfWeights;
}

vec3 normal(vec2 pos, float e, float depth) {
    vec2 ex = vec2(e, 0);
    float H = getWaves(pos.xy) * depth;
    vec3 a = vec3(pos.x, H, pos.y);
    vec3 d1 = a - vec3(pos.x - e, getWaves(pos.xy - ex.xy) * depth, pos.y);
    vec3 d2 = a - vec3(pos.x, getWaves(pos.xy + ex.yx) * depth, pos.y + e);
    return normalize(cross(d1, d2));
}

void main() {
    vec3 ambient = AMBIENT_LIGHT * lightColor;

    vec3 lightDir = LIGHT_DIRECTION;

    vec3 normal = normal(FragPos.xz, 0.001, -10.0);

    float specularStrength = 1.0;
    vec3 viewDir = normalize(camera - FragPos);
    vec3 reflectDir = reflect(-lightDir, normal);

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 4);
    vec3 specular = specularStrength * spec * lightColor;

    float diffuse = max(dot(normal, -lightDir) / 2.0 + 0.5, 0.0);

    vec3 result = (ambient + diffuse + specular) * WATER_COLOR;

    vec3 general = normal(FragPos.xz, 0.01, -10.0);
    float num = 1.0 - dot(general, normal);
    num = max(0.0, min(1.0, 0.25 * pow(num, 0.125)));
    float height = max(0.0, getWaves(FragPos.xz) - 0.4);
    result = mix(result, vec3(1.0), num + height);

    FragColor = vec4(result, 1.0);
}