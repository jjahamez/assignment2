const form = document.getElementById("cubic-form") as HTMLFormElement;

const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const scale = 25;

function graph(a: 0, b: 0, c: 0, d: 0, roots: number[] = []) { 
  if (!ctx) return;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = "DarkGrey";
  ctx.lineWidth = 1;

  for (let x = centerX % scale; x < width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = centerY % scale; y < height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  // grid 

  ctx.strokeStyle = "Black"; 
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();
  // axis 

  if (a !== 0 || b !== 0 || c !== 0 || d !== 0) {
    ctx.strokeStyle = "Red";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      const y = a * x ** 3 + b * x ** 2 + c * x + d;
      const py = centerY - y * scale;

      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();
  }
  // function  

  ctx.fillStyle = "Blue";
  roots.forEach(root => {
    const px = centerX + root * scale;
    const py = centerY;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI)
    ctx.fill();
  });
  // zeroes

}

graph();

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const a: number = Number(formData.get("a"));
  const b: number = Number(formData.get("b"));
  const c: number = Number(formData.get("c"));
  const d: number = Number(formData.get("d"));

  const equationDisplay = document.getElementById("equation") as HTMLParagraphElement;
  const equation = `y = ${a}x³ ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x² ${c >= 0 ? "+" : "-"} ${Math.abs(c)}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}`;
  equationDisplay.textContent = equation;

  const p = (3 * a * c - b * b) / (3 * a * a); // depressed cubic, refer to mr q 
  const q = (27 * a * a * d - 9 * a * b * c + 2 * b * b * b) / (27 * a * a * a);
  const discriminant = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3); // Math.pow(q / 2, 2) + Math.pow(p / 3, 3); breaks in certain cases (1,-1,0,0) 

  const h = -b / (3 * a); // to equate y and x, adjuster 

  const u = Math.cbrt(-q / 2 + (Math.sqrt(discriminant)));
  const v = Math.cbrt(-q / 2 - (Math.sqrt(discriminant))); // for cardano's method 

  const rootOne = document.getElementById("root-1") as HTMLInputElement;
  const rootTwo = document.getElementById("root-2") as HTMLInputElement;
  const rootThree = document.getElementById("root-3") as HTMLInputElement;
  const message = document.getElementById("message") as HTMLParagraphElement;

  const roots: number[] = []; // fit the roots into an array 

  if (a === 0) {
    message.textContent = "*NOT a Cubic Function*";
    rootOne.value = "";
    rootTwo.value = "";
    rootThree.value = "";
    (document.getElementById("p-value") as HTMLInputElement).value = "";
    (document.getElementById("q-value") as HTMLInputElement).value = "";
    (document.getElementById("discriminant") as HTMLInputElement).value = "";

  } else {
    message.textContent = "";
    (document.getElementById("p-value") as HTMLInputElement).value = p.toFixed(4);
    (document.getElementById("q-value") as HTMLInputElement).value = q.toFixed(4);
    (document.getElementById("discriminant") as HTMLInputElement).value = discriminant.toFixed(4);

    if (discriminant < 0) {
      const theta = Math.acos(((-q / (2 * Math.sqrt((-p / 3) ** 3))))) / 3;
      const k = 2 * Math.sqrt(-p / 3);

      const root1 = k * Math.cos(theta) + h;
      const root2 = k * Math.cos(theta + 2 * Math.PI / 3) + h;
      const root3 = k * Math.cos(theta + 4 * Math.PI / 3) + h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = root2.toFixed(4);
      rootThree.value = root3.toFixed(4);

      roots.push(root1, root2, root3);

      // trig method 

    } else if (discriminant > 0) {

      const root1 = u + v + h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = "Complex Root";
      rootThree.value = "Complex Root";

      roots.push(root1);

    } else if (discriminant === 0 && p === 0 && q === 0) {

      const root1 = h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = root1.toFixed(4);
      rootThree.value = root1.toFixed(4);

      roots.push(root1);

      // cardano's method 

    } else {
      const r = Math.cbrt(q / 2);

      const root1 = r + h; // double root 
      const root2 = -2 * r + h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = root1.toFixed(4);
      rootThree.value = root2.toFixed(4);

      roots.push(root1, root1, root2);
    }
  }

  graph(a, b, c, d, roots);
})  