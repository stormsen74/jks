/**
 * Created by STORMSEN on 16.08.2016.
 */

// @ https://developer.tizen.org/community/tip-tech/creating-pixi.js-filters-using-webgl

function NoRedFilter() {
    var vertexShader = null;
    var fragmentShader = [
        'precision mediump float;',
        '',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler;',
        '',
        'void main(void)',
        '{',
        '    vec4 pixel = texture2D(uSampler, vTextureCoord);',
        '    pixel.r = 0.0;',
        '    gl_FragColor = pixel;',
        '}'
    ].join('\n');
    var uniforms = {};

    PIXI.AbstractFilter.call(this,
        vertexShader,
        fragmentShader,
        uniforms
    );
}

NoRedFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
NoRedFilter.prototype.constructor = NoRedFilter;


function OffsetFilter() {
    var vertexShader = null;

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
        '    vec2 pixelSize = vec2(1.0) / dimensions.xy;',
        '    vec2 coord = vTextureCoord.xy - pixelSize.xy * offset;',
        '',
        '    if (coord.x < 0.0 || coord.y < 0.0 || coord.x > 1.0 || coord.y > 1.0) {',
        '        gl_FragColor = vec4(0.0);',
        '    } else {',
        '        gl_FragColor = texture2D(uSampler, coord);',
        '    }',
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

OffsetFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
OffsetFilter.prototype.constructor = OffsetFilter;

Object.defineProperties(OffsetFilter.prototype, {
    offset: {
        get: function () {
            return this.uniforms.offset.value;
        },
        set: function (value) {
            this.uniforms.offset.value = value;
        }
    }
});


/*--------------------------------------------
 ~ TRESHHOLD
 --------------------------------------------*/
// @ https://github.com/genekogan/Processing-Shader-Examples/blob/master/TextureShaders/data/threshold.glsl

function TresholdFilter() {
    var vertexShader = null;

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
        '    vec2 pixelSize = vec2(1.0) / dimensions.xy;',
        '    vec2 coord = vTextureCoord.xy - pixelSize.xy * offset;',
        'vec4 pixel = texture2D(uSampler, vTextureCoord);',
        'float bright = .33333 * (pixel.r + pixel.g + pixel.b);',
        'float b = mix(0.0, 1.0, step(offset.x, bright));',
        '',

        'gl_FragColor = vec4(vec3(b),1.0);',
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