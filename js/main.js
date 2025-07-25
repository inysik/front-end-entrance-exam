import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

document.querySelectorAll(".editable").forEach((el, index) => {
  const storageKey = `editable_${index}_${el.className.replace(/\s+/g, '-')}`;
  
  const savedValue = localStorage.getItem(storageKey);
  if (savedValue !== null) {
    el.textContent = savedValue;
  }

  const saveToStorage = debounce(() => {
    localStorage.setItem(storageKey, el.textContent);
  }, 300);

  el.addEventListener("click", () => {
    el.setAttribute("contenteditable", "true");
    el.focus();
  });

  el.addEventListener("input", saveToStorage);
  el.addEventListener("blur", () => {
    el.removeAttribute("contenteditable");
    saveToStorage();
  });
});

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

document.querySelectorAll(".material-wave").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    this.appendChild(ripple);

    const rect = this.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});



document.getElementById("downloadBtn").addEventListener("click", () => {
  const element = document.querySelector(".resume"); 
  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    console.log(pdfHeight, pdfWidth);
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  });
});
