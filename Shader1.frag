#version 100
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D texture;
uniform sampler2D imgTexture;
uniform sampler2D backbuffer;
uniform bool stepmode;
uniform bool bloommode;
uniform float stepTh; // step threshold

varying vec2 vTexCoord;

float circle(vec2 uv, vec2 pos, float r){
	return 1.0 - step(r, length(uv - pos));	
}

vec2 pc(vec2 d){
  vec2 uv = ((vTexCoord * resolution) - d) / resolution;
  return uv;
}

vec3 bloom(){
  float bstr = 20.0;
  float bint = 50.0;
  
  vec3 sum = vec3(.0);
  for (float i = 1.0; i < 10000.0; i += 1.0){
    if (i > bstr) break;
    sum += texture2D(texture, pc(vec2(i, .0))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(-i, .0))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(.0, i))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(.0, -i))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(i, -i))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(-i, i))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(i, i))).rgb / (bint * i);
    sum += texture2D(texture, pc(vec2(-i, -i))).rgb / (bint * i);
  }
  return sum;
}


void main( void ) {
  vec2 uv = vTexCoord;
  //uv.x *= resolution.x / resolution.y;
  vec3 outCol = texture2D(texture, uv).rgb;
  vec3 imgTex = texture2D(imgTexture, vec2(uv.x, 1.0 - uv.y)).rgb;
  float g = (outCol.g );
  //g = pow(g, 3.0);
  /*
  if (outCol.r > .0) outCol *= vec3(0.7 + 0.2 * sin(outCol.r * 50.0), 
                                    0.6 + 0.3 * cos(outCol.g * 50.0), 
                                    0.8 + 0.2 * sin(outCol.b * 50.0));
  if (stepmode) outCol = step(stepTh, outCol);
  if (bloommode) outCol += bloom();
  */
  
  // if (outCol.r > 0.9) gl_FragColor = vec4(vec3(.0), 1.0);
  // else {
  //   vec3 sinCol = vec3(sin(g * 5.0), sin(g * 3.0), sin(g * 13.0));
  //   gl_FragColor = vec4(sinCol, 1.0);
  // }

  vec3 greyScale = vec3(1.0 - outCol.r);
  greyScale = step(0.2, greyScale);
  vec3 final = vec3(1.0);
  
  gl_FragColor = vec4(greyScale * imgTex, 1.0);
}