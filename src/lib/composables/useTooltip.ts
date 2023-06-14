export const useTooltip = (element: HTMLElement) => {
  let div: HTMLDivElement;
  let title: string;

  const mouseOver = (event: MouseEvent) => {
    title = element.getAttribute('title') || '';
    element.removeAttribute('title');

    div = document.createElement('div');
    div.textContent = title;
    div.style.cssText = `
        border: 1px solid #ddd;
        box-shadow: 1px 1px 1px #ddd;
        background: white;
        border-radius: 4px;
        padding: 4px;
        position: absolute;
        top: ${event.pageX + 5}px;
        left: ${event.pageY + 5}px;
      `;
    document.body.appendChild(div);
  };

  const mouseMove = (event: MouseEvent) => {
    if (div) {
      div.style.left = `${event.pageX + 5}px`;
      div.style.top = `${event.pageY + 5}px`;
    }
  };

  const mouseLeave = () => {
    if (div && div.parentNode) {
      document.body.removeChild(div);
      element.setAttribute('title', title);
    }
  };

  element.addEventListener('mouseover', mouseOver);
  element.addEventListener('mouseleave', mouseLeave);
  element.addEventListener('mousemove', mouseMove);

  return {
    destroy: () => {
      element.removeEventListener('mouseover', mouseOver);
      element.removeEventListener('mouseleave', mouseLeave);
      element.removeEventListener('mousemove', mouseMove);
    }
  };
};
