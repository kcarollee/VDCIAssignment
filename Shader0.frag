#version 100
#ifdef GL_ES
precision highp float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform float brush;
uniform int stepmod;

varying vec2 vTexCoord;

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


vec3 get(float x, float y){
  vec2 coords = vTexCoord * resolution;
  coords += vec2(x, y);
  coords /= resolution;
	return texture2D(backbuffer, coords).rgb;
}

float getr(float x, float y){
  vec2 coords = vTexCoord * resolution;
  coords += vec2(x, y);
  coords /= resolution;
	return texture2D(backbuffer, coords).r;
}

float getg(float x, float y){
  vec2 coords = vTexCoord * resolution;
  coords += vec2(x, y);
  coords /= resolution;
	return texture2D(backbuffer, coords).g;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}



vec3 laplacian(vec2 uv, float de){
	vec3 sum = vec3(.0);
	float d = de;
	float sideCoef = 0.2;
	float cornerCoef = 0.05;
    float flow = 1.0; // max: 1.01
    sideCoef *= flow;
    cornerCoef *= flow;
  
	sum += get(-d, 0.0) * sideCoef;
	sum += get(-d, -d) * cornerCoef;
	sum += get(-d, d) * cornerCoef;
	sum += get(d, 0.0) * sideCoef;
	sum += get(d, -d) * cornerCoef;
	sum += get(d, d) * cornerCoef;
	sum += get(0.0, -d) * sideCoef;
	sum += get(0.0, d) * sideCoef;
	sum += get(.0, .0) * -1.0;
  

    
	return sum;
}

float circle(vec2 uv){
	return 1.0 - step(0.05, length(mouse - uv));
	//return 1.0 - step(0.1, length(vec2(0.5) - uv));
}

float newAVal(vec2 uv, float a, float b, float da, float f, float k, float de){
	return a +  (da * (laplacian(uv, de).r) - a * b * b + f * (1.0 - a));
}

float newBVal(vec2 uv, float a, float b, float db, float f, float k, float de){
	return b +  (db * (laplacian(uv, de).g) + a * b * b - (k + f) * b);
}


void main( void ) {

	vec2 uv = vTexCoord;
  //uv.x *= resolution.x / resolution.y;
	vec3 outColor = vec3(.0);
    ///////////////////////////////////////////////// VORONOI
  
  /////////////////////////////////////////////////////////////////////////////////////
    
    float c = (smoothstep(0.1, 0.4, length(uv - vec2(0.5))));
	//float da = 0.5 + 0.5 * sin(uv.y) ; // 0.84
	//float da = (1.0 - length(uv -  vec2(0.5, 0.5)));
	float nc = 20.0;
	float da = noise(vec2(uv.x * nc + time * 2.0, uv.y * nc + time * 2.0));
	
	//if (stepmod == 0) discard;
	//else 
	da = map(da, 0.0, 1.0, 0.7, 0.8);

	//float db = map(c, 0.0, 1.0, 0.2, 0.8);
    float db = 0.93;
	//float dt = 1.0;
	float de = 	1.0;


	

  float f = 0.057;
  float k = 0.062;
  /*
  if (length(uv - vec2(0.5)) < 0.35 + 0.1 * sin(time)){
    f = 0.029;
    k = 0.057;
  	

  }

  else if(length(uv - vec2(0.75)) < 0.35 + 0.1 * sin(time)){
  	f = 0.0195;
  	k = 0.042;
  }

  else if(length(uv - vec2(0.25)) < 0.35 + 0.1 * sin(time)){
  	f = 0.0152;
  	k = 0.046;
  }
  else{
  db = 0.1;
    f = 0.03;
    k = 0.062;
  }
  */
	vec3 lap = laplacian(uv, de);
	vec3 v = get(.0, .0);
	

	float a = v.r ;
	float b = v.g;
 
    if (brush == 1.0) b += circle(uv);

    //if (brush == 1.0){
    	//b += step(0.7, noise(uv * 30.0));
    //}
  // b += circle(uv);
   
	float abb = a * b * b;

	

		float dt = 1.48;
		float newa;
		float newb;
    newa =  a + (da * lap.r - abb + f * (1.0 - a)) * dt;
    newb = b + (db * lap.g + abb - (f + k) * b) * dt;
    newa = clamp(newa, 0.0, 1.0);
    newb = clamp(newb, 0.0, 1.0);
    

	outColor += vec3(newa, newb, .0);

	//outColor +=  vec3(newa, newb , .0);
  
    
	
	//outColor.rg += circle(uv);
	
	
	

	gl_FragColor = vec4( outColor, 1.0 );
  //gl_FragColor = vec4( vec3(dist), 1.0 );

}