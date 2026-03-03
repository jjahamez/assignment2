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
  const discriminant = Math.pow(q/2, 2) + Math.pow(p/3, 3);

  const h = -b / (3 * a); /* to equate y and x, adjuster */

  const u = Math.cbrt(-q / 2 + (Math.sqrt(discriminant)));
  const v = Math.cbrt(-q / 2 - (Math.sqrt(discriminant)));

  if (discriminant < 0) { 
    const theta = Math.acos(((-q / (2 * Math.sqrt((-p/3)**3))))) / 3;
    const k = 2 * Math.sqrt(-p/3);  

    const root1 = k * Math.cos(theta) + h;
    const root2 = k * Math.cos(theta + 2 * Math.PI / 3) + h;
    const root3 = k * Math.cos(theta + 4 * Math.PI / 3) + h; 
    
    (document.getElementById("result") as HTMLInputElement).value = `x1=${root1.toFixed(4)}, x2=${root2.toFixed(4)}, x3=${root3.toFixed(4)}`; 
    /* trig method */ 
    
  } else if (discriminant > 0) {
    
    const root1 = u + v + h; 

    (document.getElementById("result") as HTMLInputElement).value = `x1=${root1.toFixed(4)}, x2=Complex Root, x3=Complex Root`;
  
  } else {  
    
    (document.getElementById("result") as HTMLInputElement).value = "Repeated roots (Triple or Double/Single";
  }

})  