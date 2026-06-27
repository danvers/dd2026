(function () {
  var canvas = document.getElementById("network-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var COLORS = { ink: "#0b0b0b", grey: "#bdbdbd", accent: "#c6ff02", paper: "#f5f5f2" };
  var nodes = [];
  var mouse = { x: -9999, y: -9999 };
  var glitch = { active: false, until: 0, bandY: 0, bandH: 0, shift: 0 };

  function size() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * DPR;
    canvas.height = rect.height * DPR;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { w: rect.width, h: rect.height };
  }

  var dims = size();

  function makeNodes() {
    var count = Math.max(28, Math.floor((dims.w * dims.h) / 4500));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * dims.w,
        y: Math.random() * dims.h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        cls: Math.random() < 0.18 ? "accent" : "grey",
      });
    }
  }
  makeNodes();

  function triggerGlitch() {
    glitch.active = true;
    glitch.until = performance.now() + 160;
    glitch.bandY = Math.random() * dims.h;
    glitch.bandH = 18 + Math.random() * 26;
    glitch.shift = (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 16);
  }

  setInterval(triggerGlitch, 3400);
  canvas.addEventListener("click", triggerGlitch);
  canvas.addEventListener("mousemove", function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener("mouseleave", function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  window.addEventListener("resize", function () {
    dims = size();
    makeNodes();
  });

  function draw() {
    ctx.clearRect(0, 0, dims.w, dims.h);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > dims.w) n.vx *= -1;
      if (n.y < 0 || n.y > dims.h) n.vy *= -1;

      var dx = n.x - mouse.x, dy = n.y - mouse.y;
      var dist = Math.hypot(dx, dy);
      if (dist < 70) {
        var force = (70 - dist) / 70;
        n.x += (dx / (dist || 1)) * force * 1.6;
        n.y += (dy / (dist || 1)) * force * 1.6;
      }
    }

    // links
    ctx.lineWidth = 0.6;
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var p = nodes[a], q = nodes[b];
        var d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 75) {
          ctx.strokeStyle = "rgba(11,11,11," + (0.22 - d / 480) + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (var k = 0; k < nodes.length; k++) {
      var node = nodes[k];
      ctx.fillStyle = node.cls === "accent" ? COLORS.accent : COLORS.ink;
      ctx.globalAlpha = node.cls === "accent" ? 1 : 0.55;
      ctx.fillRect(node.x - 1.5, node.y - 1.5, 3, 3);
      ctx.globalAlpha = 1;
    }

    // glitch slice
    if (glitch.active) {
      if (performance.now() > glitch.until) {
        glitch.active = false;
      } else {
        var img = ctx.getImageData(0, glitch.bandY, dims.w, glitch.bandH);
        ctx.fillStyle = COLORS.paper;
        ctx.fillRect(0, glitch.bandY, dims.w, glitch.bandH);
        ctx.putImageData(img, glitch.shift, glitch.bandY);
        ctx.fillStyle = COLORS.accent;
        ctx.fillRect(0, glitch.bandY, dims.w, 1.5);
        ctx.fillRect(0, glitch.bandY + glitch.bandH - 1.5, dims.w, 1.5);
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();
