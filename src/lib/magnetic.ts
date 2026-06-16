export function magnetic(node: HTMLElement) {
    let boundingRect = node.getBoundingClientRect();
    
    const onMouseMove = (e: MouseEvent) => {
        boundingRect = node.getBoundingClientRect();
        
        const x = e.clientX - boundingRect.left - boundingRect.width / 2;
        const y = e.clientY - boundingRect.top - boundingRect.height / 2;
        
        node.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`; 
    };
    
    const onMouseLeave = () => {
        node.style.transform = 'translate(0px, 0px)';
    };

    node.addEventListener('mousemove', onMouseMove);
    node.addEventListener('mouseleave', onMouseLeave);

    return {
        destroy() {
            node.removeEventListener('mousemove', onMouseMove);
            node.removeEventListener('mouseleave', onMouseLeave);
        }
    };
}