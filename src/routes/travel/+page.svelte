<script lang="ts">
  type pos = {
    x: number;
    y: number;
  };

  let from: pos = $state({ x: 50, y: 50 });
  let start: pos = { x: 50, y: 50 };
  let waypoints: pos[] = [
    { x: 150, y: 150 },
    { x: 500, y: 500 },
    { x: 300, y: 200 }
  ];
  let to = waypoints[0];

  let angle: number = $state(0.3); // curvature strength
  let t = 0;
  let animating = false;

  function getControlPoint(a: pos, b: pos, curve: number): pos {
    // midpoint
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;

    // direction vector
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    // perpendicular vector (normalized)
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;

    // offset midpoint to create curve
    return {
      x: mx + nx * length * curve,
      y: my + ny * length * curve
    };
  }

  function bezier(t: number, p0: pos, p1: pos, p2: pos): pos {
    const u = 1 - t;

    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y
    };
  }

  function move() {
    if (animating || waypoints.length === 0) return;

    animating = true;

    let segmentIndex = 0;
    let currentStart = { ...from };
    let currentEnd = waypoints[segmentIndex];
    let control = getControlPoint(currentStart, currentEnd, angle);
    let t = 0;

    function nextSegment() {
      segmentIndex++;

      if (segmentIndex >= waypoints.length) {
        animating = false;
        from = { ...currentEnd };
        return;
      }

      currentStart = { ...currentEnd };
      currentEnd = waypoints[segmentIndex];
      control = getControlPoint(currentStart, currentEnd, angle);
      t = 0;

      requestAnimationFrame(step);
    }

    function step() {
      t += 0.02;

      if (t >= 1) {
        from = { ...currentEnd };
        nextSegment();
        return;
      }

      const eased = t * t * (3 - 2 * t);
      from = bezier(eased, currentStart, control, currentEnd);

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }
</script>

<div class="test">
  <!-- SVG path visualization -->
  <svg class="overlay">
    <title>line between points</title>
    <path
      d={`M ${start.x} ${start.y} Q ${getControlPoint(start, to, angle).x} ${getControlPoint(start, to, angle).y} ${to.x} ${to.y}`}
      stroke="black"
      fill="transparent"
    />
  </svg>

  <div class="point" style="left: {from.x}px; top: {from.y}px;" />
  <div class="point target" style="left: {to.x}px; top: {to.y}px;" />
</div>

<button type="button" onclick={move}>Test Movement</button>

<style lang="scss">
  .test {
    position: relative;
    width: 1000px;
    height: 800px;
    background-color: red;
    overflow: hidden;
  }

  .point {
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: white;
    border-radius: 16px;
    transform: translate(-50%, -50%);
  }

  .target {
    background-color: yellow;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
