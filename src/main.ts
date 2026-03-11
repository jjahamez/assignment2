const form = document.getElementById("cubic-form") as HTMLFormElement;

const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!; // will never be null, if (!ctx) return; unnecessary 

const width: number = canvas.width;
const height: number = canvas.height;
const scale: number = 21;

function graph(a: number, b: number, c: number, d: number, roots: number[] = []) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  const centerX: number = width / 2;
  const centerY: number = height / 2;

  ctx.strokeStyle = "DarkGrey";
  ctx.lineWidth = 1;

  for (let x: number = centerX % scale; x < width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y: number = centerY % scale; y < height; y += scale) {
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
      const x: number = (px - centerX) / scale;
      const y: number = a * x ** 3 + b * x ** 2 + c * x + d;
      const py: number = centerY - y * scale;

      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();
  }
  // function  

  ctx.fillStyle = "Blue";
  roots.forEach(root => {
    const px: number = centerX + root * scale;
    const py: number = centerY;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
  // zeroes

}

graph(0, 0, 0, 0, []);

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const a: number = Number(formData.get("a"));
  const b: number = Number(formData.get("b"));
  const c: number = Number(formData.get("c"));
  const d: number = Number(formData.get("d"));

  const equationDisplay = document.getElementById("equation") as HTMLParagraphElement;
  const equation =
    (`${a === 1 ? "" : a === -1 ? "-" : a}x³ `) +
    (b !== 0 ? `${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x² ` : "") +
    (c !== 0 ? `${c > 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x ` : "") +
    (d !== 0 ? `${d > 0 ? "+" : "-"} ${Math.abs(d)}` : "")
  equationDisplay.textContent = equation;

  const message = document.getElementById("message") as HTMLParagraphElement;
  const p: number = (3 * a * c - b * b) / (3 * a * a); // depressed cubic, refer to mr q 
  const q: number = (27 * a * a * d - 9 * a * b * c + 2 * b * b * b) / (27 * a * a * a);
  const discriminant: number = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3); // Math.pow(q / 2, 2) + Math.pow(p / 3, 3); breaks in certain cases (1,-1,0,0) 

  const h: number = -b / (3 * a); // to equate y and x, adjuster 

  const u: number = Math.cbrt(-q / 2 + (Math.sqrt(discriminant)));
  const v: number = Math.cbrt(-q / 2 - (Math.sqrt(discriminant))); // for cardano's method 

  const rootOne = document.getElementById("root-1") as HTMLInputElement;
  const rootTwo = document.getElementById("root-2") as HTMLInputElement;
  const rootThree = document.getElementById("root-3") as HTMLInputElement;

  const roots: number[] = []; // fit the roots into array 

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
    (document.getElementById("p-value") as HTMLInputElement).value = p.toFixed(5);
    (document.getElementById("q-value") as HTMLInputElement).value = q.toFixed(5);
    (document.getElementById("discriminant") as HTMLInputElement).value = discriminant.toFixed(5);

    if (discriminant < 0) {
      const theta: number = Math.acos((-q / (2 * Math.sqrt((-p / 3) ** 3)))) / 3;
      const k: number = 2 * Math.sqrt(-p / 3);

      const root1: number = k * Math.cos(theta) + h;
      const root2: number = k * Math.cos(theta + 2 * Math.PI / 3) + h;
      const root3: number = k * Math.cos(theta + 4 * Math.PI / 3) + h;

      rootOne.value = `(${root1.toFixed(2)}, 0)`;
      rootTwo.value = `(${root2.toFixed(2)}, 0)`;
      rootThree.value = `(${root3.toFixed(2)}, 0)`;

      roots.push(root1, root2, root3);

      // trig method 

    } else if (discriminant > 0) {

      const root1: number = u + v + h;

      rootOne.value = `(${root1.toFixed(2)}, 0)`;
      rootTwo.value = "Complex Root";
      rootThree.value = "Complex Root";

      roots.push(root1);

    } else if (discriminant === 0 && p === 0 && q === 0) {

      const root1: number = h;

      rootOne.value = `(${root1.toFixed(2)}, 0)`;
      rootTwo.value = `(${root1.toFixed(2)}, 0)`;
      rootThree.value = `(${root1.toFixed(2)}, 0)`;

      roots.push(root1);

      // cardano's method 

    } else {
      const r: number = Math.cbrt(q / 2);

      const root1: number = r + h; // double root 
      const root2: number = -2 * r + h;

      rootOne.value = `(${root1.toFixed(2)}, 0)`;
      rootTwo.value = `(${root1.toFixed(2)}, 0)`;
      rootThree.value = `(${root2.toFixed(2)}, 0)`;

      roots.push(root1, root1, root2);
    }
  }

  graph(a, b, c, d, roots);
})  