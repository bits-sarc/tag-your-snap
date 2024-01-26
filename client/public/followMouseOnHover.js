let isActive = false;

document.addEventListener('mousemove', e => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const targets = document.getElementsByClassName("custom-follow-mouse");
    for (let target of targets) {
      const rect = target.getBoundingClientRect();
  
      const targetR = rect.left + rect.width;
      const targetB = rect.top + rect.height;

      const targetX = rect.left + rect.width/2;
      const targetY = rect.top + rect.height/2;
  
      let activationDist = isActive ? 80 : 50;
  
      if (mouseX < targetR + activationDist && mouseX > rect.left - activationDist && mouseY < targetB + activationDist && mouseY > rect.top - activationDist) {
        const xTranslate = -(targetX - mouseX) * 0.1;
        const yTranslate = -(targetY - mouseY) * 0.1
        target.firstChild.style.transform = `translate(${xTranslate}px, ${yTranslate}px`;
        if (target.classList.contains("hero-logo")) {
          target.firstChild.style.transform = `scale(0.8) translate(${xTranslate}px, ${yTranslate}px`;
        }
        isActive = true;
      } else {
        isActive = false;
        target.firstChild.style.transform = "translate(0px)";
        if (target.classList.contains("hero-logo")) {
          target.firstChild.style.transform = `scale(1)`;
        }
      }
    }
  });