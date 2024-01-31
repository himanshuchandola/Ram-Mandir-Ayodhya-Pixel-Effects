import React, { useEffect, useRef } from "react";
import ramImage from "../images/ShreeRam.jpg";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 550;
    canvas.height = 900;

    const image = new Image();
    image.src = ramImage;
    image.onload = () => {
      imgRef.current = image;

      initEffect();
    };

    const initEffect = () => {
      const effect = createEffect(canvas);

      canvas.addEventListener("mousemove", effect.handleMouseMove);
      canvas.addEventListener("mouseleave", effect.handleMouseLeave);

      const animate = () => {
        effect.render(ctx);
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    return () => {
      canvas.removeEventListener("mousemove", effect.handleMouseMove);
      canvas.removeEventListener("mouseleave", effect.handleMouseLeave);
    };
  }, []);

  const createEffect = (canvas) => {
    let width = canvas.width;
    let height = canvas.height;
    let cellWidth = width / 25;
    let cellHeight = height / 35;
    let imageGrid = [];
    let mouse = { x: undefined, y: undefined, radius: 100 };

    const createGrid = () => {
      let index = 0;
      for (let y = 0; y < height; y += cellHeight) {
        for (let x = 0; x < width; x += cellWidth) {
          index++;
          imageGrid.unshift(
            createCell(
              { width, height, cellWidth, cellHeight, mouse },
              x,
              y,
              index
            )
          );
        }
      }
    };

    createGrid();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
      const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

      mouse.x = (e.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
      mouse.y = (e.clientY - rect.top) * scaleY; // been adjusted to be relative to element
    };

    const handleMouseLeave = () => {
      mouse.x = undefined;
      mouse.y = undefined;
      console.log("Mouse Leave"); // Debugging log
    };

    const render = (context) => {
      imageGrid.forEach((cell) => {
        cell.update();
        cell.draw(context);
      });
    };

    return { render, handleMouseMove, handleMouseLeave, mouse };
  };

  // Function to create a cell
  const createCell = (effect, x, y, index) => {
    let positionX = Math.random() * effect.width;
    let positionY = effect.height;
    let speedX, speedY;
    let width = effect.cellWidth;
    let height = effect.cellHeight;
    let image = imgRef.current;
    let slideX = 0;
    let slideY = 0;
    let vx = 0;
    let vy = 0;
    let ease = 0.01;
    let friction = 0.9;
    let randomize = Math.random() * 100 + 2;

    const start = () => {
      speedX = (x - positionX) / randomize;
      speedY = (y - positionY) / randomize;
    };

    setTimeout(start, index * 10);

    const draw = (context) => {
      context.drawImage(
        image,
        x + slideX,
        y + slideY,
        width,
        height,
        positionX,
        positionY,
        width,
        height
      );
      context.strokeRect(positionX, positionY, width, height);
    };

    const update = () => {
      if (Math.abs(speedX) > 0.02 || Math.abs(speedY) > 0.02) {
        speedX = (x - positionX) / randomize;
        speedY = (y - positionY) / randomize;
        positionX += speedX;
        positionY += speedY;
      }

      const dx = effect.mouse.x - x;
      const dy = effect.mouse.y - y;
      const distance = Math.hypot(dx, dy);
      if (distance < effect.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (effect.mouse.radius - distance) / effect.mouse.radius;
        vx = force * Math.cos(angle);
        vy = force * Math.sin(angle);
      } else {
        vx *= friction;
        vy *= friction;
      }

      slideX += (vx - slideX) * ease;
      slideY += (vy - slideY) * ease;
    };

    return { update, draw };
  };

  return (
    <>
      <canvas ref={canvasRef} className="canvas-style" />
      <img ref={imgRef} src={ramImage} className="hidden-img" alt="sample" />
    </>
  );
};

export default CanvasComponent;
