

/*--------------------------------------------
 ~ TRESHHOLD
 --------------------------------------------*/
// @ https://github.com/genekogan/Processing-Shader-Examples/blob/master/TextureShaders/data/threshold.glsl

function TresholdFilter() {
    var vertexShader = null;

    //vec3(b)
    var fragmentShader = [
        'precision mediump float;',
        '',
        'varying vec2 vTextureCoord;',
        '',
        'uniform vec4 dimensions;',
        'uniform vec2 offset;',
        'uniform sampler2D uSampler;',
        '',
        'void main(void)',
        '{',
        '   vec2 pixelSize = vec2(1.0) / dimensions.xy;',
        '   vec2 coord = vTextureCoord.xy - pixelSize.xy * offset;',
        '   vec4 pixel = texture2D(uSampler, vTextureCoord);',

        '   float bright = .33333 * (pixel.r + pixel.g + pixel.b);',
        '   float b = mix(0.0, 1.0, step(offset.x, bright));',
        '',
        '   gl_FragColor = vec4(vec3(pixel.r*b,pixel.g*b,pixel.b*b),vec3(b));',
        '}'
    ].join('\n');

    var uniforms = {
        dimensions: {
            type: '4fv',
            value: new Float32Array([0, 0, 0, 0])
        },
        offset: {
            type: 'v2',
            value: {
                x: 0,
                y: 0
            }
        }
    };

    PIXI.AbstractFilter.call(this, vertexShader, fragmentShader, uniforms);
}

TresholdFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
TresholdFilter.prototype.constructor = TresholdFilter;

Object.defineProperties(TresholdFilter.prototype, {
    offset: {
        get: function () {
            return this.uniforms.offset.value;
        },
        set: function (value) {
            this.uniforms.offset.value = value;
        }
    }
});