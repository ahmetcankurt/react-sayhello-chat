import React, { useEffect, useState } from 'react';
import './style.css';

const randomCodeSnippets = [
  "Hey, what's up?", "How's it going?", "I miss you!", "Good morning! 😊",
  "Good night! 🌙", "What are you doing?", "Let's meet soon!", "I'm on my way!",
  "Can't wait to see you!", "Did you sleep well?", "Where are you?", 
  "Let's hang out later!", "Thank you so much!", "I'm so proud of you!",
  "Take care!", "I can't believe it!", "See you soon!", "Love you! ❤️", 
  "What's for dinner?", "I'm really tired today.", "I have some good news!", 
  "It's been a long day.", "How was your day?", "Stay safe!"
];

// Optimize random position calculation
const generateRandomPosition = () => ({
  top: Math.random() * window.innerHeight,
  left: Math.random() * window.innerWidth,
});

const RandomMessages = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 8 }).map(() => ({
      text: randomCodeSnippets[Math.floor(Math.random() * randomCodeSnippets.length)],
      position: generateRandomPosition(),
      speed: {
        dx: Math.random() * 3 - 1, // Horizontal speed
        dy: Math.random() * 3 - 1, // Vertical speed
      },
    }));

    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          const newTop = particle.position.top + particle.speed.dy;
          const newLeft = particle.position.left + particle.speed.dx;

          // Bounce off walls
          const dx = (newLeft < 0 || newLeft > window.innerWidth) ? -particle.speed.dx : particle.speed.dx;
          const dy = (newTop < 0 || newTop > window.innerHeight) ? -particle.speed.dy : particle.speed.dy;

          return {
            ...particle,
            position: {
              top: Math.max(0, Math.min(window.innerHeight, newTop)),
              left: Math.max(0, Math.min(window.innerWidth, newLeft)),
            },
            speed: { dx, dy },
          };
        })
      );
    }, 30);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className='particle-container'>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="particle"
          style={{
            top: particle.position.top,
            left: particle.position.left,
            animationDuration: '25s',
            animationTimingFunction: 'linear',
          }}
        >
          {particle.text}
        </div>
      ))}
    </div>
  );
};

export default RandomMessages;
