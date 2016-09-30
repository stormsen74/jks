 precision mediump float;

        varying vec2 vTextureCoord;

        uniform vec4 dimensions;
        uniform vec2 offset;
        uniform sampler2D uSampler;

        void main(void)
        {

           vec2 pixelSize = vec2(1.0) / dimensions.xy;
           vec2 coord = vTextureCoord.xy - pixelSize.xy * offset;
           vec4 pixel = texture2D(uSampler, vTextureCoord);

           float bright = .33333 * (pixel.r + pixel.g + pixel.b);
           float b = mix(0.0, 1.0, step(offset.x, bright));

           gl_FragColor = vec4(vec3(pixel.r*b,pixel.g*b,pixel.b*b),vec3(b));;
        }