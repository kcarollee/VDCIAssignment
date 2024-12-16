let pg0, pg1, pg2, pg3, bb;
let shd0, shd1, bbshd;
let mouseVel;
let mousePosPrev, mousePosCur;
let canvDiagonal;
let font;

let stepmode, stepTh;
let diffuseClar, diffuseCoef;
let bloommode;

let step = 0;

let brush = 0.0;

let fontSize;
let canvasWidth, canvasHeight;

let img;

let sketch1 = (p) => {
    p.preload = () => {
        shd0 = p.loadShader("Shader0.vert", "Shader0.frag");
        shd1 = p.loadShader("Shader1.vert", "Shader1.frag");
        img = p.loadImage(imgURL);
    };

    p.setup = () => {
        //p.pixelDensity(1);
        canvasWidth = p.windowWidth;
        canvasHeight = p.windowHeight;
        p.setAttributes("antialias", true);
        p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);

        pg0 = p.createGraphics(canvasWidth, canvasHeight, p.WEBGL);
        pg1 = p.createGraphics(canvasWidth, canvasHeight, p.WEBGL);
        bb = p.createGraphics(canvasWidth, canvasHeight, p.WEBGL);

        mousePosCur = [canvasWidth * 0.5, canvasHeight * 0.5];
        mousePosPrev = mousePosCur;
        canvDiagonal = p.sqrt(p.pow(canvasWidth, 2) + p.pow(canvasHeight, 2));
        mouseVel = 0.001;

        stepmode = false;
        stepTh = p.random(0.5, 0.8);

        diffuseClar = p.random(0.5, 1);
        diffuseCoef = p.random(0.1, 0.2);

        bloommode = false;
        p.smooth();
    };

    p.windowResized = () => {
        canvasWidth = p.windowWidth;
        canvasHeight = p.windowHeight;

        p.resizeCanvas(canvasWidth, canvasHeight);
        p.clear();
        // pg0 = p.createGraphics(canvasWidth, canvasHeight, p.WEBGL);
        // pg1 = p.createGraphics(canvasWidth, canvasHeight, p.WEBGL);
        // bb = p.createGraphics(canvasWidth, canvasHeight, p.WEBGL);

        // pg0.size(canvasWidth, canvasHeight);
        // pg1.size(canvasWidth, canvasHeight);
        // bb.size(canvasWidth, canvasHeight);

        pg0.clear();
        pg1.clear();
        bb.clear();
        pg0.width = canvasWidth;
        pg0.height = canvasHeight;

        pg1.width = canvasWidth;
        pg1.height = canvasHeight;

        bb.width = canvasWidth;
        bb.height = canvasHeight;

        pg0.resetMatrix();
        pg0._renderer._update();

        pg1.resetMatrix();
        pg1._renderer._update();

        bb.resetMatrix();
        bb._renderer._update();

        // pg0.background(0);
        // pg1.background(0);
        // bb.background(0);
        p.pixelDensity(1);
        console.log(img);
        img.resize(canvasWidth, canvasHeight);
    };

    p.draw = () => {
        step++;

        pg0.background(0);
        pg0.shader(shd0);
        shd0.setUniform("resolution", [canvasWidth, canvasHeight]);
        shd0.setUniform("stepmod", step % 100);
        shd0.setUniform("time", p.frameCount * 0.01);
        shd0.setUniform("backbuffer", bb);
        shd0.setUniform("mouse", [p.map(p.mouseX, 0, canvasWidth, 0, 1), p.map(p.mouseY, 0, canvasHeight, 0, 1)]);
        shd0.setUniform("mouseVel", mouseVel);
        shd0.setUniform("diffuseClar", diffuseClar);
        shd0.setUniform("diffuseCoef", diffuseCoef);
        shd0.setUniform("brush", brush);
        pg0.rect(0, 0, canvasWidth, canvasHeight);
        pg0.resetMatrix();
        pg0._renderer._update();

        pg1.background(0);
        pg1.shader(shd1);
        shd1.setUniform("resolution", [canvasWidth, canvasHeight]);
        shd1.setUniform("time", p.frameCount * 0.01);
        shd1.setUniform("texture", pg0);
        shd1.setUniform("imgTexture", img);
        shd1.setUniform("backbuffer", bb);
        shd1.setUniform("mouse", [p.map(p.mouseX, 0, canvasWidth, 0, 1), p.map(p.mouseY, 0, canvasHeight, 0, 1)]);
        shd1.setUniform("stepmode", stepmode);
        shd1.setUniform("stepTh", stepTh);
        shd1.setUniform("bloommode", bloommode);
        pg1.rect(0, 0, canvasWidth, canvasHeight);
        pg1.resetMatrix();
        pg1._renderer._update();

        p.image(pg1, -canvasWidth * 0.5, -canvasHeight * 0.5);

        // backbuffer
        bb.background(0);
        bb.rotateX(Math.PI);
        bb.image(pg0, -canvasWidth * 0.5, -canvasHeight * 0.5);
        bb.resetMatrix();
        bb._renderer._update();
    };

    p.mouseMoved = () => {
        brush = 1.0;
        mousePosPrev = mousePosCur;
        mousePosCur = [p.mouseX, p.mouseY];
        let d = p.dist(mousePosPrev[0], mousePosPrev[1], mousePosCur[0], mousePosCur[1]);
        mouseVel = p.map(d, 0, canvDiagonal, 0, 1.0);
    };

    p.mouseClicked = () => {
        window.location.href = "./pages/index_1.html";
    };
};

new p5(sketch1, "canvas1");
