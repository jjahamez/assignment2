const form = document.getElementById("cubic-form") as HTMLFormElement;

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const a: number = Number(formData.get("a"));
  const b: number = Number(formData.get("b"));
  const c: number = Number(formData.get("c"));
  const d: number = Number(formData.get("d"));

  if (a === 0) {

  } else {

    const p = (3 * a * c - b * b) / (3 * a * a); /* depressed cubic, refer to mr q */
    const q = (27 * a * a * d - 9 * a * b * c + 2 * b * b * b) / (27 * a * a * a);
    const discriminant = Math.pow(q / 2, 2) + Math.pow(p / 3, 3);

    const h = -b / (3 * a); /* to equate y and x, adjuster */

    const u = Math.cbrt(-q / 2 + (Math.sqrt(discriminant)));
    const v = Math.cbrt(-q / 2 - (Math.sqrt(discriminant)));

    const rootOne = document.getElementById("root-1") as HTMLInputElement;
    const rootTwo = document.getElementById("root-2") as HTMLInputElement;
    const rootThree = document.getElementById("root-3") as HTMLInputElement; 
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

      /* trig method */

    } else if (discriminant > 0) {

      const root1 = u + v + h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = "Complex Root";
      rootThree.value = "Complex Root";

    } else if (discriminant === 0 && p == 0 && q == 0) {

      const root1 = h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = root1.toFixed(4);
      rootThree.value = root1.toFixed(4);

      /* cardano's method */

    } else {
      const r = Math.cbrt(q / 2);

      const root1 = r + h; /* double root */
      const root2 = -2 * r + h;

      rootOne.value = root1.toFixed(4);
      rootTwo.value = root1.toFixed(4);
      rootThree.value = root2.toFixed(4);
    }

  }

})  