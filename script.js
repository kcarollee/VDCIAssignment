function adjustLayout() {
    const container = document.getElementById("container");
    if (window.innerHeight > window.innerWidth) {
        // Vertical layout: canvases stacked top to bottom
        container.style.flexDirection = "column";
    } else {
        // Horizontal layout: canvases side by side
        container.style.flexDirection = "row";
    }
}

window.addEventListener("resize", adjustLayout);

// Initial layout adjustment
adjustLayout();
