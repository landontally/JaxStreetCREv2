export function tilt(node: HTMLElement) {
    const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = node.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        // Adjust the multiplier to make the tilt more or less extreme
        const multiplier = 10; 
        const rotateX = (0.5 - y) * multiplier;
        const rotateY = (x - 0.5) * multiplier;
        
        node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
        node.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        node.style.transition = 'transform 0.5s ease-out';
    };
    
    const handleMouseEnter = () => {
        node.style.transition = 'transform 0.1s ease-out';
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('mouseenter', handleMouseEnter);

    return {
        destroy() {
            node.removeEventListener('mousemove', handleMouseMove);
            node.removeEventListener('mouseleave', handleMouseLeave);
            node.removeEventListener('mouseenter', handleMouseEnter);
        }
    };
}