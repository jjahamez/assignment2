const form = document.getElementById("cubic-form") as HTMLFormElement;

form?.addEventListener("submit", (event) => {
  event.preventDefault();


  const formData = new FormData(form);

  const a: number = Number(formData.get("a"));
  const b: number = Number(formData.get("b"));
  const c: number = Number(formData.get("c"));
  const d: number = Number(formData.get("d"));

  const p = (3 * a * c - b * b) / (3 * a * a); /* depressed cubic, refer to mr q */
  const q = (27 * a * a * d - 9 * a * b * c + 2 * b * b * b) / (27 * a * a * a);
  const discriminant = -4 * Math.pow(p, 3) - 27 * Math.pow(q, 2);

  if (discriminant > 0) {
    (document.getElementById("result") as HTMLInputElement).value = "3 real roots";
  } else if (discriminant < 0) {
    (document.getElementById("result") as HTMLInputElement).value = "1 real root, 2 complex";
  } else {
    (document.getElementById("result") as HTMLInputElement).value = "Repeated roots (Triple or Double/Single";
  }

})