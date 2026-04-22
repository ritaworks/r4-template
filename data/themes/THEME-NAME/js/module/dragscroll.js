// dragScroll
function dragScroll() {
  let target;
  Array.from(document.querySelectorAll(this)).forEach((e, i) => {
    e.addEventListener("mousedown", (event) => {
      event.preventDefault();
      target = e;
      e.dataset.down = "true";
      e.dataset.move = "false";
      e.dataset.x = event.clientX.toString();
      e.dataset.y = event.clientY.toString();
      e.dataset.scrollLeft = e.scrollLeft.toString();
      e.dataset.scrollTop = e.scrollTop.toString();
      return false;
    });
    e.addEventListener("click", (event) => {
      if (e.dataset.move === "true") {
        return false;
      }
    });
  });
  document.addEventListener("mousemove", (event) => {
    if (target && target.dataset.down === "true") {
      event.preventDefault();
      const move_x = Number(target.dataset.x) - event.clientX;
      const move_y = Number(target.dataset.y) - event.clientY;
      if (move_x !== 0 || move_y !== 0) {
        target.dataset.move = "true";
      } else {
        return;
      }
      target.scrollLeft = Number(target.dataset.scrollLeft) + move_x;
      target.scrollTop = Number(target.dataset.scrollTop) + move_y;
      return false;
    }
  });
  document.addEventListener("mouseup", (event) => {
    if (target) {
      target.dataset.down = "false";
    }
    return false;
  });
}

dragScroll.call(".js-scrollable");