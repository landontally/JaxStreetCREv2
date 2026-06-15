export function magnetic(node: HTMLElement) {
    let boundingRect = node.getBoundingClientRect();
    
    const onMouseMove = (e: MouseEvent) => {
        // Recalculate bounds in case the user scrolled
        boundingRect = node.getBoundingClientRect();
        
        // Calculate the distance from the center of the button
        const x = e.clientX - boundingRect.left - boundingRect.width / 2;
        const y = e.clientY - boundingRect.top - boundingRect.height / 2;
        
        // Apply the transform. Change 0.3 to make it pull harder or softer!
        node.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`; 
    };
    
    const onMouseLeave = () => {
        // Snap back to the center smoothly
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