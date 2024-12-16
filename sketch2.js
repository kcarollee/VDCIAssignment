let userFontSize;
let padding = 30;
let lineSpacing = 0.3; // Line spacing multiplier (1.5 = 150% of font size)
let sketchMode = true;
let sketch2 = (p) => {
    p.setup = () => {
        canvasWidth = p.min(p.windowWidth / 2, p.windowHeight) * 0.9;
        canvasHeight = p.min(p.windowWidth / 2, p.windowHeight) * 0.9;
        p.createCanvas(canvasWidth, canvasHeight);
        p.background(2);
        p.smooth();
        p.textSize(canvasWidth / 40);
        //p.blendMode(p.MULTIPLY);
        userFontSize = calculateFontSize(p, textContent, canvasWidth); // Recalculate font size on resize
    };

    p.windowResized = () => {
        canvasWidth = p.min(p.windowWidth / 2, p.windowHeight) * 0.9;
        canvasHeight = p.min(p.windowWidth / 2, p.windowHeight) * 0.9;
        p.resizeCanvas(canvasWidth, canvasHeight);
        p.background(0); // Reset the background
        p.textSize(canvasWidth / 40);
    };

    p.draw = () => {
        //p.clear();
        p.background(0);
        if (pg1 != undefined && sketchMode) {
            //p.push();
            p.blendMode(p.ADD);
            p.fill(255);
            drawWrappedText(p, textContent, padding, padding, canvasWidth - 2 * padding); // Add padding of 10px
            //p.pop();

            p.blendMode(p.MULTIPLY);
            p.image(pg1, 0, 0, canvasWidth, canvasHeight);
        } else {
            p.blendMode(p.BLEND);
            p.fill(255);
            drawWrappedText(p, textContent, padding, padding, canvasWidth - 2 * padding);
        }
    };

    p.mouseClicked = () => {
        p.clear();
        sketchMode = !sketchMode;
    };

    // Calculate the maximum font size that fits the text within the square canvas
    function calculateFontSize(p, text, maxWidth) {
        let minFontSize = 1;
        let maxFontSize = 100;
        let userFontSizeTemp = maxFontSize;

        while (maxFontSize - minFontSize > 0.5) {
            userFontSizeTemp = (minFontSize + maxFontSize) / 2;
            p.textSize(fontSize);
            let lines = wrapText(p, text, maxWidth - 2 * padding); // Account for padding
            let textHeight = lines.length * userFontSizeTemp * lineSpacing; // 1.2 for line spacing
            if (textHeight > maxWidth - 2 * padding) {
                maxFontSize = userFontSizeTemp; // Too large, reduce font size
            } else {
                minFontSize = userFontSizeTemp; // Fits, try increasing font size
            }
        }
        return minFontSize;
    }

    // Wrap the text into lines that fit within the specified width
    function wrapText(p, text, maxWidth) {
        let words = text.split(" ");
        let lines = [];
        let currentLine = "";

        for (let word of words) {
            let testLine = currentLine + (currentLine === "" ? "" : " ") + word;
            if (p.textWidth(testLine) > maxWidth) {
                if (currentLine !== "") {
                    lines.push(currentLine);
                }
                currentLine = word; // Start new line
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine !== "") {
            lines.push(currentLine); // Add the last line
        }
        return lines;
    }

    // Draw wrapped text within the canvas
    function drawWrappedText(p, text, x, y, maxWidth) {
        let lines = wrapText(p, text, maxWidth);
        for (let i = 0; i < lines.length; i++) {
            p.text(lines[i], x, y + i * userFontSize * lineSpacing); // 1.2 for line spacing
        }
    }
};

new p5(sketch2, "canvas2");
