import React, { useState, useEffect, useRef } from 'react';

const Pecktopia = () => {
  console.log("Rendering Pecktopia main component");
  
  // Game states
  const [gameState, setGameState] = useState('start'); // start, design, playing, levelComplete, gameComplete
  const [currentLevel, setCurrentLevel] = useState(1);
  const [character, setCharacter] = useState({
    colorScheme: 0, // 0: Golden Sunset, 1: Ocean Depths, 2: Forest Haven
    pattern: 0, // 0: Regal, 1: Cosmic, 2: War Paint
    temperament: 5, // 0-10 scale
    accessory: 0, // 0: None, 1: Bow Tie, 2: Glasses
    wingStyle: 0, // 0: Classic, 1: Angel, 2: Pointy
    eyeType: 0 // 0: Round, 1: Oval, 2: Sleepy
  });
  
  // Load saved character from localStorage if available
  useEffect(() => {
    const savedCharacter = localStorage.getItem('pecktopiaCharacter');
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
    }
  }, []);
  
  // Function to save character to localStorage
  const saveCharacter = (char) => {
    localStorage.setItem('pecktopiaCharacter', JSON.stringify(char));
  };
  
  // Switch to character designer
  const startDesigner = () => {
    console.log("Starting character designer");
    setGameState('design');
  };
  
  // Start the game with current character
  const startGame = () => {
    console.log("Starting game with character:", character);
    saveCharacter(character);
    setCurrentLevel(1);
    setGameState('playing');
  };
  
  // Complete a level
  const completeLevel = () => {
    console.log(`Completing level ${currentLevel}`);
    if (currentLevel < 3) {
      setGameState('levelComplete');
    } else {
      setGameState('gameComplete');
    }
  };
  
  // Continue to next level
  const nextLevel = () => {
    const nextLevelNum = currentLevel + 1;
    console.log(`Moving to level ${nextLevelNum}`);
    setCurrentLevel(nextLevelNum);
    setGameState('playing');
  };
  
  // Restart the game
  const restartGame = () => {
    setCurrentLevel(1);
    setGameState('start');
  };
  
  // Render the appropriate game screen based on state
  const renderGameScreen = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={startDesigner} />;
      case 'design':
        return <CharacterDesigner 
          character={character} 
          setCharacter={setCharacter} 
          onStart={startGame}
        />;
      case 'playing':
        return <GamePlay 
          character={character} 
          level={currentLevel} 
          onComplete={completeLevel} 
        />;
      case 'levelComplete':
        return <LevelComplete 
          level={currentLevel} 
          onContinue={nextLevel} 
        />;
      case 'gameComplete':
        return <GameComplete onRestart={restartGame} />;
      default:
        return <StartScreen onStart={startDesigner} />;
    }
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        {renderGameScreen()}
      </div>
    </div>
  );
};

// Start Screen Component
const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-6xl font-bold mb-6 text-yellow-400">Pecktopia</h1>
      <div className="mb-8">
        <ChickenSilhouette />
      </div>
      <button 
        onClick={onStart}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-xl transition-colors"
      >
        Start Game
      </button>
    </div>
  );
};

// Simple Chicken Silhouette Component
const ChickenSilhouette = () => {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M50,20 C60,15 75,25 75,35 C75,45 70,50 80,55 C70,60 65,55 65,65 C65,75 60,85 50,85 C40,85 35,75 35,65 C35,55 30,60 20,55 C30,50 25,45 25,35 C25,25 40,15 50,20 Z" 
          fill="#333" 
          stroke="#666" 
          strokeWidth="2"
        />
        <circle cx="42" cy="35" r="3" fill="#999" />
        <path d="M45,45 C48,48 52,48 55,45" stroke="#999" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

// Character Designer Component
const CharacterDesigner = ({ character, setCharacter, onStart }) => {
  // Color schemes (updated with more contrasting palettes)
  const colorSchemes = [
    { 
      name: "Golden Sunset", 
      primary: "#E17055", // Rich terracotta
      secondary: "#FDCB6E", // Golden yellow 
      tertiary: "#6C3483"  // Deep purple (more contrast)
    },
    { 
      name: "Ocean Depths", 
      primary: "#0984E3", // Bright blue
      secondary: "#F39C12", // Vibrant orange (more contrast)
      tertiary: "#6C5CE7"  // Soft purple
    },
    { 
      name: "Forest Haven", 
      primary: "#2ECC71", // Brighter emerald green
      secondary: "#E74C3C", // Vibrant red (more contrast)
      tertiary: "#F1C40F"  // Brighter yellow
    }
  ];
  
  // Patterns
  const patterns = ["Regal", "Cosmic", "War Paint"];
  
  // Wing styles
  const wingStyles = ["Classic", "Angel", "Pointy"];
  
  // Eye types
  const eyeTypes = ["Round", "Oval", "Sleepy"];
  
  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Design Your Chicken</h2>
        
        {/* Color Selection */}
        <div className="mb-6">
          <h3 className="text-xl mb-2">Colors</h3>
          <div className="flex gap-4">
            {colorSchemes.map((scheme, index) => (
              <button
                key={index}
                className={`w-16 h-16 rounded-lg border-4 flex items-center justify-center ${character.colorScheme === index ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: scheme.primary }}
                onClick={() => setCharacter({...character, colorScheme: index})}
              >
                <div className="w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg, ${scheme.secondary}, ${scheme.tertiary})` }}></div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400">{colorSchemes[character.colorScheme].name}</p>
        </div>
        
        {/* Pattern Selection - Updated with descriptions */}
        <div className="mb-6">
          <h3 className="text-xl mb-2">Pattern</h3>
          <div className="flex gap-2 flex-wrap">
            {patterns.map((pattern, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded ${character.pattern === index ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
                onClick={() => setCharacter({...character, pattern: index})}
              >
                {pattern}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {character.pattern === 0 && "Elegant gradient flowing from head to tail"}
            {character.pattern === 1 && "Magical star-like patterns scattered across the body"}
            {character.pattern === 2 && "Bold, asymmetrical markings for a fierce look"}
          </p>
        </div>
        
        {/* Wing Style Selection - NEW */}
        <div className="mb-6">
          <h3 className="text-xl mb-2">Wing Style</h3>
          <div className="flex gap-2 flex-wrap">
            {wingStyles.map((style, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded ${character.wingStyle === index ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
                onClick={() => setCharacter({...character, wingStyle: index})}
              >
                {style}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {character.wingStyle === 0 && "Traditional rounded wings"}
            {character.wingStyle === 1 && "Elegant, longer wings with a heavenly look"}
            {character.wingStyle === 2 && "Sharp, angular wings for a more dynamic appearance"}
          </p>
        </div>
        
        {/* Eye Type Selection - NEW */}
        <div className="mb-6">
          <h3 className="text-xl mb-2">Eye Type</h3>
          <div className="flex gap-2 flex-wrap">
            {eyeTypes.map((type, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded ${character.eyeType === index ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
                onClick={() => setCharacter({...character, eyeType: index})}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {character.eyeType === 0 && "Classic circular eyes"}
            {character.eyeType === 1 && "Elongated oval eyes for a sophisticated look"}
            {character.eyeType === 2 && "Half-lidded eyes for a relaxed, cool appearance"}
          </p>
        </div>
        
        {/* Accessories Selection */}
        <div className="mb-6">
          <h3 className="text-xl mb-2">Accessories</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`py-2 px-4 rounded ${character.accessory === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
              onClick={() => setCharacter({...character, accessory: 0})}
            >
              None
            </button>
            <button
              className={`py-2 px-4 rounded ${character.accessory === 1 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
              onClick={() => setCharacter({...character, accessory: 1})}
            >
              Bow Tie
            </button>
            <button
              className={`py-2 px-4 rounded ${character.accessory === 2 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
              onClick={() => setCharacter({...character, accessory: 2})}
            >
              Glasses
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {character.accessory === 0 && "No accessories - the natural look"}
            {character.accessory === 1 && "A dapper red bow tie for formal occasions"}
            {character.accessory === 2 && "Scholarly glasses for the intellectual chicken"}
          </p>
        </div>
        
        {/* Temperament Slider - Updated with visual indicator */}
        <div className="mb-8">
          <h3 className="text-xl mb-2">Temperament</h3>
          <div className="flex items-center gap-2">
            <span className="text-blue-300">Calm</span>
            <input
              type="range"
              min="0"
              max="10"
              value={character.temperament}
              onChange={(e) => setCharacter({...character, temperament: parseInt(e.target.value)})}
              className="w-full"
            />
            <span className="text-red-300">Excitable</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
            <div 
              className="h-2 rounded-full" 
              style={{
                width: `${character.temperament * 10}%`,
                background: `linear-gradient(to right, #3498db, #e74c3c)`
              }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {character.temperament < 3 && "A peaceful chicken that stays cool under pressure"}
            {character.temperament >= 3 && character.temperament < 7 && "A balanced temperament, neither too calm nor too excitable"}
            {character.temperament >= 7 && "An energetic chicken that's always on high alert"}
          </p>
        </div>
        
        <button
          onClick={onStart}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Play Game
        </button>
      </div>
      
      <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg flex items-center justify-center">
        <ChickenRenderer character={character} animated={true} />
      </div>
    </div>
  );
};

// Chicken Renderer Component
const ChickenRenderer = ({ character, animated = false, size = 'large' }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [angle, setAngle] = useState(0);
  
  const colorSchemes = [
    { 
      primary: "#E17055", // Rich terracotta
      secondary: "#FDCB6E", // Golden yellow 
      tertiary: "#6C3483"  // Deep purple (more contrast)
    },
    { 
      primary: "#0984E3", // Bright blue
      secondary: "#F39C12", // Vibrant orange (more contrast)
      tertiary: "#6C5CE7"  // Soft purple
    },
    { 
      primary: "#2ECC71", // Brighter emerald green
      secondary: "#E74C3C", // Vibrant red (more contrast)
      tertiary: "#F1C40F"  // Brighter yellow
    }
  ];
  
  // Size configurations
  const sizes = {
    small: { width: 50, height: 50 },
    medium: { width: 100, height: 100 },
    large: { width: 200, height: 200 }
  };
  
  const { width, height } = sizes[size] || sizes.large;
  
  // Animation based on temperament
  useEffect(() => {
    if (!animated) return;
    
    // Calculate animation speed based on temperament (0-10)
    // Higher temperament = faster animation
    const animSpeed = 0.05 + (character.temperament / 10) * 0.2;
    
    const animate = () => {
      setAngle(prev => (prev + animSpeed) % (Math.PI * 2));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    
    animFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animated, character.temperament]);
  
  // Render chicken to canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, width, height);
    
    // Get current color scheme
    const colors = colorSchemes[character.colorScheme];
    
    // Draw chicken base
    ctx.save();
    ctx.translate(width / 2, height / 2);
    
    // Apply bobbing animation if animated
    if (animated) {
      const bobAmount = Math.sin(angle) * 5;
      ctx.translate(0, bobAmount);
    }
    
    // Body
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(0, 10, 30, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Apply pattern
    drawPattern(ctx, character.pattern, colors, animated ? angle : 0);
    
    // Head
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(0, -30, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes based on selected eye type
    drawEyes(ctx, character.eyeType, animated ? angle : 0);
    
    // Beak
    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    ctx.moveTo(-5, -25);
    ctx.lineTo(5, -25);
    ctx.lineTo(0, -15);
    ctx.closePath();
    ctx.fill();
    
    // Comb/Crest
    ctx.fillStyle = "#F44336"; // Red comb
    ctx.beginPath();
    ctx.moveTo(-5, -45);
    ctx.lineTo(0, -55);
    ctx.lineTo(5, -45);
    ctx.lineTo(10, -55);
    ctx.lineTo(15, -45);
    ctx.fill();
    
    // Feet
    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    ctx.rect(-20, 40, 10, 5);
    ctx.rect(10, 40, 10, 5);
    ctx.fill();
    
    // Draw wings based on wing style
    drawWings(ctx, character.wingStyle, colors);
    
    // Draw accessories
    drawAccessory(ctx, character.accessory, colors, animated ? angle : 0);
    
    ctx.restore();
    
  }, [character, width, height, angle, animated]);
  
  // Function to draw wings based on style
  const drawWings = (ctx, wingStyle, colors) => {
    const darkColor = modifyColor(colors.primary, -20); // Darker than body
    
    switch(wingStyle) {
      case 1: // Angel wings
        ctx.fillStyle = darkColor;
        // Left wing
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.quadraticCurveTo(-35, -10, -40, 20);
        ctx.quadraticCurveTo(-30, 25, -20, 15);
        ctx.closePath();
        ctx.fill();
        
        // Right wing
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.quadraticCurveTo(35, -10, 40, 20);
        ctx.quadraticCurveTo(30, 25, 20, 15);
        ctx.closePath();
        ctx.fill();
        
        // Wing highlights
        ctx.fillStyle = colors.secondary;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(-30, 5, 5, 15, Math.PI/4, 0, Math.PI * 2);
        ctx.ellipse(30, 5, 5, 15, -Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
        
      case 2: // Pointy wings
        ctx.fillStyle = darkColor;
        // Left wing
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-40, -10);
        ctx.lineTo(-35, 20);
        ctx.closePath();
        ctx.fill();
        
        // Right wing
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(40, -10);
        ctx.lineTo(35, 20);
        ctx.closePath();
        ctx.fill();
        break;
        
      default: // Classic wings
        ctx.fillStyle = darkColor;
        ctx.beginPath();
        ctx.ellipse(-25, 10, 8, 20, Math.PI/4, 0, Math.PI * 2);
        ctx.ellipse(25, 10, 8, 20, -Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  };
  
  // Function to draw eyes based on type
  const drawEyes = (ctx, eyeType, angle) => {
    switch(eyeType) {
      case 1: // Oval eyes
        // Eye whites
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(-8, -30, 6, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(8, -30, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = "#000";
        const eyeMovement = angle ? Math.sin(angle) * 1.5 : 0;
        ctx.beginPath();
        ctx.ellipse(-8 + eyeMovement, -30, 2.5, 1.5, 0, 0, Math.PI * 2);
        ctx.ellipse(8 + eyeMovement, -30, 2.5, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 2: // Sleepy eyes
        // Eye whites
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(-8, -30, 5, 3, 0, Math.PI, 0);
        ctx.ellipse(8, -30, 5, 3, 0, Math.PI, 0);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(-8, -30, 2, 1.5, 0, Math.PI, 0);
        ctx.ellipse(8, -30, 2, 1.5, 0, Math.PI, 0);
        ctx.fill();
        
        // Eyelids
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-13, -30);
        ctx.quadraticCurveTo(-8, -34, -3, -30);
        ctx.moveTo(13, -30);
        ctx.quadraticCurveTo(8, -34, 3, -30);
        ctx.stroke();
        break;
        
      default: // Round eyes
        // Eye whites
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(-8, -30, 5, 0, Math.PI * 2);
        ctx.arc(8, -30, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = "#000";
        const eyeMov = angle ? Math.sin(angle) * 1.5 : 0;
        ctx.beginPath();
        ctx.arc(-8 + eyeMov, -30, 2, 0, Math.PI * 2);
        ctx.arc(8 + eyeMov, -30, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  };
  
  // Function to draw accessories
  const drawAccessory = (ctx, accessoryType, colors, angle) => {
    switch (accessoryType) {
      case 1: // Bow Tie
        ctx.fillStyle = "#E53E3E"; // Red bow tie
        
        // Left side of bow
        ctx.beginPath();
        ctx.moveTo(-2, -10);
        ctx.lineTo(-8, -15);
        ctx.lineTo(-8, -5);
        ctx.closePath();
        ctx.fill();
        
        // Right side of bow
        ctx.beginPath();
        ctx.moveTo(2, -10);
        ctx.lineTo(8, -15);
        ctx.lineTo(8, -5);
        ctx.closePath();
        ctx.fill();
        
        // Center knot
        ctx.fillStyle = "#C53030"; // Darker red for the knot
        ctx.beginPath();
        ctx.ellipse(0, -10, 2, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 2: // Glasses
        ctx.strokeStyle = "#2D3748"; // Dark frame
        ctx.lineWidth = 1.5;
        
        // Left lens
        ctx.beginPath();
        ctx.ellipse(-8, -30, 6, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Right lens
        ctx.beginPath();
        ctx.ellipse(8, -30, 6, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Bridge
        ctx.beginPath();
        ctx.moveTo(-2, -30);
        ctx.lineTo(2, -30);
        ctx.stroke();
        
        // Temple arms
        ctx.beginPath();
        ctx.moveTo(-14, -30);
        ctx.lineTo(-18, -28);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(14, -30);
        ctx.lineTo(18, -28);
        ctx.stroke();
        break;
        
      default:
        // No accessory
        break;
    }
  };
  
  // Function to draw different patterns
  const drawPattern = (ctx, patternType, colors, angle) => {
    switch (patternType) {
      case 0: // Regal
        ctx.fillStyle = colors.tertiary;
        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.bezierCurveTo(-20, 0, -15, 20, -5, 30);
        ctx.bezierCurveTo(5, 20, 10, 0, 5, -10);
        ctx.closePath();
        ctx.fill();
        break;
      case 1: // Cosmic
        // Draw little stars/dots
        ctx.fillStyle = colors.tertiary;
        for (let i = 0; i < 15; i++) {
          const x = Math.cos(i * 0.7 + angle) * 25;
          const y = Math.sin(i * 0.8 + angle) * 30;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 2: // War Paint
        ctx.fillStyle = colors.secondary;
        // Diagonal stripe across face
        ctx.beginPath();
        ctx.moveTo(-15, -40);
        ctx.lineTo(-5, -20);
        ctx.lineTo(5, -20);
        ctx.lineTo(15, -40);
        ctx.closePath();
        ctx.fill();
        
        // Body markings
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-10, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fill();
        break;
      default:
        break;
    }
  };
  
  // Helper to modify color brightness
  const modifyColor = (color, amount) => {
    const hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border-4 border-gray-700 rounded-lg bg-gray-600"
      />
    </div>
  );
};

// Game Play Component
const GamePlay = ({ character, level, onComplete }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({
    started: false,
    collected: [],
    message: "",
    playerPosition: { x: 50, y: 50 }
  });
  
  // Create a placeholder canvas for testing and start the game when ready
  useEffect(() => {
    if (gameState.started) {
      console.log("Game started, checking canvas");
      
      // Allow time for the canvas to be available in the DOM
      const checkCanvasAndRun = () => {
        console.log("Canvas reference:", canvasRef.current);
        
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          console.log("Canvas context:", ctx);
          
          // Draw a test rectangle to confirm canvas is working
          if (ctx) {
            ctx.fillStyle = 'red';
            ctx.fillRect(10, 10, 50, 50);
            console.log("Test rectangle drawn");
            
            // Canvas is confirmed working, run the game
            runGame();
          } else {
            setGameState(prev => ({
              ...prev,
              message: "Error: Could not get canvas context"
            }));
          }
        } else {
          // If canvas still not available, try again after a short delay
          setTimeout(checkCanvasAndRun, 100);
        }
      };
      
      // Start checking for canvas
      setTimeout(checkCanvasAndRun, 100);
    }
  }, [gameState.started]);
  
  // This function is called after we confirm canvas is ready
  const runGame = () => {
    // This will be called once we confirm the canvas is ready
    console.log("Running game with canvas:", canvasRef.current);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas still not available");
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Initialize the game with the now-confirmed canvas
      setTimeout(() => {
        initializeGame(canvas, character, level, onComplete);
      }, 100); // Small delay to ensure rendering is complete
      
    } catch (error) {
      console.error("Error initializing game:", error);
      setGameState(prev => ({ 
        ...prev, 
        message: `Error: ${error.message}` 
      }));
    }
  };
  
  // Start button handler - now just sets state, canvas check happens in useEffect
  const startGame = () => {
    console.log("Start game button clicked");
    setGameState(prev => ({ 
      ...prev, 
      started: true
    }));
    
    // We'll start the actual game in the useEffect after confirming canvas exists
  };
  
      // Simplified version of the game logic
  const initializeGame = (canvas, character, level, onComplete) => {
    console.log("Initializing game with canvas:", canvas);
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let running = true;
    let frameId = null;
    let lastTime = performance.now();
    
    // Physics
    const gravity = 0.5;
    
    // Player state - start higher up to prevent immediate floor collisions
    const player = {
      x: 50,
      y: 50, // Start higher in the level
      width: 40,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      speed: 5,
      jumpStrength: 10,
      grounded: false,
      direction: 1, // 1 = right, -1 = left
      moveLeft: false,
      moveRight: false
    };
    
    // Generate level elements
    const platforms = generateLevel(level, canvas.width, canvas.height);
    const collectibles = generateCollectibles(level, canvas.width, canvas.height);
    
    // Key controls
    const keyDownHandler = (e) => {
      // Prevent default browser scrolling with arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      
      switch (e.code) {
        case 'ArrowLeft':
          player.moveLeft = true;
          break;
        case 'ArrowRight':
          player.moveRight = true;
          break;
        case 'Space':
        case 'ArrowUp':
          if (player.grounded) {
            player.velocityY = -player.jumpStrength;
            player.grounded = false;
          }
          break;
        default:
          break;
      }
    };
    
    const keyUpHandler = (e) => {
      // Prevent default browser scrolling with arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      
      switch (e.code) {
        case 'ArrowLeft':
          player.moveLeft = false;
          break;
        case 'ArrowRight':
          player.moveRight = false;
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    
    // Setup is complete
    console.log("Game setup complete, starting game loop");
    
    // Start the game loop
    const gameLoop = (timestamp) => {
      if (!running) return;
      
      const now = timestamp || performance.now();
      const deltaTime = Math.min((now - lastTime) / 16, 5);
      lastTime = now;
      
      // Update game state
      updateGame(deltaTime);
      
      // Render frame
      renderGame();
      
      // Continue loop
      frameId = requestAnimationFrame(gameLoop);
    };
    
    // Update game state
    const updateGame = (deltaTime) => {
      // Apply movement
      if (player.moveLeft) {
        player.velocityX = -player.speed;
        player.direction = -1;
      } else if (player.moveRight) {
        player.velocityX = player.speed;
        player.direction = 1;
      } else {
        player.velocityX = 0;
      }
      
      // Apply gravity
      player.velocityY += gravity * deltaTime;
      
      // Update player position
      player.x += player.velocityX * deltaTime;
      player.y += player.velocityY * deltaTime;
      
      // Debugging player position
      console.log(`Player position: ${Math.round(player.x)},${Math.round(player.y)}, VelocityY: ${player.velocityY.toFixed(2)}, Grounded: ${player.grounded}`);
      
      // Check boundary collision
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
      
      // Prevent falling through bottom of screen
      if (player.y > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.grounded = true;
      }
      
      // Check platform collision - more robust version
      player.grounded = false;
      
      for (const platform of platforms) {
        // Draw collision box in red for debugging
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        if (checkCollision(player, platform)) {
          console.log("Collision detected with platform");
          
          // Calculate overlap
          const overlapLeft = (player.x + player.width) - platform.x;
          const overlapRight = (platform.x + platform.width) - player.x;
          const overlapTop = (player.y + player.height) - platform.y;
          const overlapBottom = (platform.y + platform.height) - player.y;
          
          // Find smallest overlap
          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
          
          // Resolve collision based on smallest overlap
          if (minOverlap === overlapTop && player.velocityY >= 0) {
            // Top collision (landing on platform)
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
            console.log("Top collision - landing on platform");
          } else if (minOverlap === overlapBottom && player.velocityY <= 0) {
            // Bottom collision (hitting head)
            player.y = platform.y + platform.height;
            player.velocityY = 0;
            console.log("Bottom collision - hitting head");
          } else if (minOverlap === overlapLeft && player.velocityX > 0) {
            // Left collision (moving right into platform)
            player.x = platform.x - player.width;
            player.velocityX = 0;
            console.log("Left collision - hitting side");
          } else if (minOverlap === overlapRight && player.velocityX < 0) {
            // Right collision (moving left into platform)
            player.x = platform.x + platform.width;
            player.velocityX = 0;
            console.log("Right collision - hitting side");
          }
        }
      }
      
      // Check collectible collision
      for (const item of collectibles) {
        if (!item.collected && checkCollision(player, item)) {
          item.collected = true;
          
          // Update UI
          setGameState(prev => ({
            ...prev,
            collected: [...prev.collected, item]
          }));
          
          // Check if level complete
          if (collectibles.every(c => c.collected)) {
            setTimeout(() => {
              stopGame();
              onComplete();
            }, 1000);
          }
        }
      }
      
      // Update position in state for UI
      setGameState(prev => ({
        ...prev,
        playerPosition: { x: player.x, y: player.y }
      }));
    };
    
    // Render game objects
    const renderGame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      drawBackground(ctx, level, canvas.width, canvas.height);
      
      // Draw platforms
      ctx.fillStyle = '#8B4513'; // Brown wooden platforms
      for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw platform outline only when debug mode is enabled
        if (false) { // Set to true to enable debug visualization
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 1;
          ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        }
      }
      
      // Draw collectibles
      for (const item of collectibles) {
        if (!item.collected) {
          drawCollectible(ctx, item);
        }
      }
      
      // Draw player (chicken)
      drawPlayer(ctx, player, character);
      
      // Debug visualization - disabled in the final game
      const debugMode = false; // Set to true to enable debug visualization
      
      if (debugMode) {
        // Draw player hitbox for debugging
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
        
        // Draw debug info
        ctx.fillStyle = 'black';
        ctx.font = '12px monospace';
        ctx.fillText(`Player: (${Math.round(player.x)},${Math.round(player.y)})`, 10, 20);
        ctx.fillText(`Velocity: (${player.velocityX.toFixed(1)},${player.velocityY.toFixed(1)})`, 10, 40);
        ctx.fillText(`Grounded: ${player.grounded ? 'Yes' : 'No'}`, 10, 60);
      }
    };
    
    // Stop game function for cleanup
    const stopGame = () => {
      running = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      
      console.log("Game stopped");
    };
    
    // Make mobile control handlers work
    window.mobileControlHandlers = {
      left: () => { player.moveLeft = true; },
      stopLeft: () => { player.moveLeft = false; },
      right: () => { player.moveRight = true; },
      stopRight: () => { player.moveRight = false; },
      jump: () => {
        if (player.grounded) {
          player.velocityY = -player.jumpStrength;
          player.grounded = false;
        }
      }
    };
    
    // Start game loop
    gameLoop();
    
    // Return cleanup function for react useEffect
    return stopGame;
  };
  
  // Helper functions that would normally be in the GameEngine class
  
  // Check collision between two rectangles - more robust version
  const checkCollision = (a, b) => {
    // Check if there's no collision first (early return)
    if (a.x >= b.x + b.width || 
        a.x + a.width <= b.x || 
        a.y >= b.y + b.height || 
        a.y + a.height <= b.y) {
      return false;
    }
    
    // If we got here, there is a collision
    return true;
  };
  
  // Generate platforms based on level
  const generateLevel = (level, width, height) => {
    const platforms = [];
    
    // Common ground platform - make sure this spans the entire width
    platforms.push({
      x: 0,
      y: height - 20,
      width: width,
      height: 20
    });
    
    console.log(`Created ground platform at y=${height - 20} with width=${width}`);
    
    switch (level) {
      case 1: // Chicken Coop - Simple layout
        platforms.push(
          { x: 200, y: 300, width: 150, height: 20 },
          { x: 400, y: 250, width: 150, height: 20 },
          { x: 600, y: 200, width: 150, height: 20 }
        );
        break;
      case 2: // Farmyard - Medium complexity
        platforms.push(
          { x: 120, y: 320, width: 100, height: 20 },
          { x: 280, y: 280, width: 100, height: 20 },
          { x: 440, y: 240, width: 100, height: 20 },
          { x: 600, y: 200, width: 100, height: 20 },
          { x: 300, y: 160, width: 100, height: 20 },
          { x: 100, y: 200, width: 80, height: 20 }
        );
        break;
      case 3: // Chicken Temple - Most complex
        platforms.push(
          { x: 100, y: 320, width: 80, height: 20 },
          { x: 250, y: 300, width: 80, height: 20 },
          { x: 400, y: 280, width: 80, height: 20 },
          { x: 550, y: 260, width: 80, height: 20 },
          { x: 700, y: 240, width: 80, height: 20 },
          { x: 550, y: 200, width: 80, height: 20 },
          { x: 400, y: 160, width: 80, height: 20 },
          { x: 250, y: 120, width: 80, height: 20 },
          { x: 100, y: 80, width: 80, height: 20 }
        );
        break;
      default:
        break;
    }
    
    return platforms;
  };
  
  // Generate collectibles based on level
  const generateCollectibles = (level, width, height) => {
    switch (level) {
      case 1:
        return [
          { x: 600, y: 170, width: 30, height: 30, name: "Golden Feather", collected: false }
        ];
      case 2:
        return [
          { x: 300, y: 130, width: 30, height: 30, name: "Silver Egg", collected: false }
        ];
      case 3:
        return [
          { x: 100, y: 50, width: 30, height: 30, name: "Holy Hat", collected: false }
        ];
      default:
        return [];
    }
  };
  
  // Draw background based on level
  const drawBackground = (ctx, level, width, height) => {
    switch (level) {
      case 1: // Chicken Coop
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        // Coop walls
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, width, 60);
        ctx.fillRect(0, 0, 20, height);
        ctx.fillRect(width - 20, 0, 20, height);
        
        // Straw
        ctx.fillStyle = '#F0E68C';
        ctx.fillRect(0, height - 20, width, 20);
        break;
      case 2: // Farmyard
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        // Hills
        ctx.fillStyle = '#7CFC00';
        ctx.beginPath();
        ctx.ellipse(200, 420, 300, 100, 0, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(600, 420, 250, 80, 0, Math.PI, 0);
        ctx.fill();
        
        // Barn in distance
        ctx.fillStyle = '#A52A2A';
        ctx.fillRect(width - 150, height - 180, 100, 80);
        ctx.beginPath();
        ctx.moveTo(width - 150, height - 180);
        ctx.lineTo(width - 100, height - 220);
        ctx.lineTo(width - 50, height - 180);
        ctx.closePath();
        ctx.fill();
        break;
      case 3: // Chicken Temple
        // Sky
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#000044');
        gradient.addColorStop(1, '#660066');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height * 0.8;
          const size = Math.random() * 2 + 1;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Temple columns
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(50, height - 300, 30, 300);
        ctx.fillRect(width - 80, height - 300, 30, 300);
        
        // Temple top
        ctx.fillRect(20, height - 300, width - 40, 20);
        break;
      default:
        // Default sky background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        break;
    }
  };
  
  // Draw collectibles
  const drawCollectible = (ctx, item) => {
    switch (item.name) {
      case "Golden Feather":
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(item.x, item.y);
        ctx.bezierCurveTo(
          item.x, item.y + item.height * 0.7,
          item.x + item.width, item.y + item.height * 0.5,
          item.x + item.width * 0.8, item.y + item.height
        );
        ctx.bezierCurveTo(
          item.x + item.width * 0.6, item.y + item.height * 0.8,
          item.x + item.width * 0.4, item.y + item.height * 0.6,
          item.x, item.y
        );
        ctx.fill();
        break;
      case "Silver Egg":
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width/2, 
          item.y + item.height/2, 
          item.width/2,
          item.height/2,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        // Add some shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width*0.7, 
          item.y + item.height*0.3, 
          item.width/6,
          item.height/6,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        break;
      case "Holy Hat":
        // Draw a wizard/holy hat
        ctx.fillStyle = '#4B0082'; // Indigo
        ctx.beginPath();
        ctx.moveTo(item.x, item.y + item.height);
        ctx.lineTo(item.x + item.width/2, item.y);
        ctx.lineTo(item.x + item.width, item.y + item.height);
        ctx.closePath();
        ctx.fill();
        
        // Hat brim
        ctx.fillStyle = '#9370DB'; // Medium purple
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width/2, 
          item.y + item.height*0.9, 
          item.width*0.7,
          item.height*0.1,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Stars on hat
        ctx.fillStyle = '#FFD700'; // Gold
        for (let i = 0; i < 3; i++) {
          const starX = item.x + item.width * (0.3 + i * 0.2);
          const starY = item.y + item.height * (0.3 + i * 0.2);
          const starSize = item.width * 0.1;
          
          ctx.beginPath();
          ctx.moveTo(starX, starY - starSize);
          for (let j = 0; j < 5; j++) {
            const angle = j * Math.PI * 0.4 - Math.PI * 0.5;
            const length = (j % 2 === 0) ? starSize : starSize * 0.5;
            ctx.lineTo(
              starX + Math.cos(angle) * length,
              starY + Math.sin(angle) * length
            );
          }
          ctx.closePath();
          ctx.fill();
        }
        break;
      default:
        // Default collectible
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(item.x, item.y, item.width, item.height);
        break;
    }
  };
  
  // Draw player (chicken)
  const drawPlayer = (ctx, player, character) => {
    // Get color scheme based on character
    const colorSchemes = [
      { primary: "#FF9800", secondary: "#F44336", tertiary: "#FFEB3B" },
      { primary: "#2196F3", secondary: "#3F51B5", tertiary: "#03A9F4" },
      { primary: "#4CAF50", secondary: "#8BC34A", tertiary: "#CDDC39" }
    ];
    
    const colors = colorSchemes[character.colorScheme];
    
    ctx.save();
    ctx.translate(
      player.x + player.width/2, 
      player.y + player.height/2
    );
    
    // Flip horizontally if moving left
    if (player.direction === -1) {
      ctx.scale(-1, 1);
    }
    
    // Calculate scale to fit the player box
    const scale = player.width / 80;
    ctx.scale(scale, scale);
    
    // Body
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(0, 10, 30, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Apply pattern
    drawPattern(ctx, character.pattern, colors);
    
    // Head
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(0, -30, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-8, -30, 5, 0, Math.PI * 2);
    ctx.arc(8, -30, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-8, -30, 2, 0, Math.PI * 2);
    ctx.arc(8, -30, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    ctx.moveTo(-5, -25);
    ctx.lineTo(5, -25);
    ctx.lineTo(0, -15);
    ctx.closePath();
    ctx.fill();
    
    // Comb/Crest
    ctx.fillStyle = "#F44336"; // Red comb
    ctx.beginPath();
    ctx.moveTo(-5, -45);
    ctx.lineTo(0, -55);
    ctx.lineTo(5, -45);
    ctx.lineTo(10, -55);
    ctx.lineTo(15, -45);
    ctx.fill();
    
    // Feet
    const legOffset = player.velocityX !== 0 ? Math.sin(performance.now() / 100) * 5 : 0;
    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    ctx.rect(-20, 40 + legOffset, 10, 5);
    ctx.rect(10, 40 - legOffset, 10, 5);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = modifyColor(colors.primary, -20); // Darker than body
    ctx.beginPath();
    ctx.ellipse(-25, 10, 8, 20, Math.PI/4, 0, Math.PI * 2);
    ctx.ellipse(25, 10, 8, 20, -Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };
  
  // Draw pattern on chicken
  const drawPattern = (ctx, patternType, colors) => {
    switch (patternType) {
      case 0: // Regal
        ctx.fillStyle = colors.tertiary;
        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.bezierCurveTo(-20, 0, -15, 20, -5, 30);
        ctx.bezierCurveTo(5, 20, 10, 0, 5, -10);
        ctx.closePath();
        ctx.fill();
        break;
      case 1: // Cosmic
        // Draw little stars/dots
        ctx.fillStyle = colors.tertiary;
        for (let i = 0; i < 15; i++) {
          const x = Math.cos(i * 0.7) * 25;
          const y = Math.sin(i * 0.8) * 30;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 2: // War Paint
        ctx.fillStyle = colors.secondary;
        // Diagonal stripe across face
        ctx.beginPath();
        ctx.moveTo(-15, -40);
        ctx.lineTo(-5, -20);
        ctx.lineTo(5, -20);
        ctx.lineTo(15, -40);
        ctx.closePath();
        ctx.fill();
        
        // Body markings
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-10, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fill();
        break;
      default:
        break;
    }
  };
  
  // Draw debug information
  const drawDebugInfo = (ctx, player, platforms, collectibles) => {
    // Add debug text at the top
    ctx.fillStyle = 'black';
    ctx.font = '12px monospace';
    ctx.fillText(`Player: (${Math.round(player.x)},${Math.round(player.y)})`, 10, 20);
    ctx.fillText(`Velocity: (${player.velocityX.toFixed(2)},${player.velocityY.toFixed(2)})`, 10, 40);
    ctx.fillText(`Grounded: ${player.grounded ? 'Yes' : 'No'}`, 10, 60);
    
    // Draw player hitbox
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      player.x, 
      player.y, 
      player.width, 
      player.height
    );
    
    // Draw collectible hitboxes
    ctx.strokeStyle = 'green';
    for (const item of collectibles) {
      if (!item.collected) {
        ctx.strokeRect(item.x, item.y, item.width, item.height);
      }
    }
  };
  
  // Helper function to modify color brightness
  const modifyColor = (color, amount) => {
    const hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // Mobile control handlers
  const handleMobileLeft = () => {
    if (window.mobileControlHandlers) {
      window.mobileControlHandlers.left();
    }
  };
  
  const handleMobileStopLeft = () => {
    if (window.mobileControlHandlers) {
      window.mobileControlHandlers.stopLeft();
    }
  };
  
  const handleMobileRight = () => {
    if (window.mobileControlHandlers) {
      window.mobileControlHandlers.right();
    }
  };
  
  const handleMobileStopRight = () => {
    if (window.mobileControlHandlers) {
      window.mobileControlHandlers.stopRight();
    }
  };
  
  const handleMobileJump = () => {
    if (window.mobileControlHandlers) {
      window.mobileControlHandlers.jump();
    }
  };
  
  return (
    <div className="w-full">
      {!gameState.started ? (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Level {level}</h2>
          <p className="mb-6">
            {level === 1 && "Welcome to the Chicken Coop! Collect the Golden Feather."}
            {level === 2 && "Welcome to the Farmyard! Find the Silver Egg."}
            {level === 3 && "Welcome to the Chicken Temple! Seek the Holy Hat."}
          </p>
          <button
            onClick={startGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Start Level
          </button>
          
          {gameState.message && (
            <p className="mt-4 text-red-500">{gameState.message}</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-between p-2 bg-gray-800 mb-2 rounded-t-lg">
            <div>Level: {level}</div>
            <div>
              Collected: {gameState.collected.map(item => item.name).join(', ') || 'Nothing yet'}
            </div>
          </div>
          
          {/* Canvas with key to force re-render */}
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border-4 border-gray-700 rounded-b-lg bg-sky-300"
            style={{ display: 'block' }}
            key={`canvas-level-${level}`}
          />
          
          {/* Mobile controls */}
          <div className="md:hidden flex justify-between mt-4">
            <div className="flex gap-2">
              <button
                className="bg-gray-700 p-4 rounded-lg"
                onTouchStart={handleMobileLeft}
                onTouchEnd={handleMobileStopLeft}
              >
                ←
              </button>
              <button
                className="bg-gray-700 p-4 rounded-lg"
                onTouchStart={handleMobileRight}
                onTouchEnd={handleMobileStopRight}
              >
                →
              </button>
            </div>
            <button
              className="bg-gray-700 p-4 rounded-lg"
              onTouchStart={handleMobileJump}
            >
              Jump
            </button>
          </div>
          
          {gameState.message && (
            <p className="mt-4 text-red-500">{gameState.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Game Engine Class
class GameEngine {
  constructor(canvas, character, level) {
    if (!canvas) {
      throw new Error("Canvas is required for GameEngine");
    }
    
    console.log(`Creating game engine for level ${level} with canvas dimensions: ${canvas.width}x${canvas.height}`);
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
    
    this.character = character;
    this.level = level;
    this.running = false;
    this.frameId = null;
    this.debug = true; // Enable debug mode
    
    // Player state
    this.player = {
      x: 50,
      y: 50,
      width: 40,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      speed: 5,
      jumpStrength: 10,
      grounded: false,
      direction: 1, // 1 = right, -1 = left
      moveLeft: false,
      moveRight: false
    };
    
    // Physics
    this.gravity = 0.5;
    
    // Level elements
    this.platforms = this.generateLevel(level);
    this.collectibles = this.generateCollectibles(level);
    
    // Callbacks
    this.onCollect = () => {};
    this.onLevelComplete = () => {};
    this.onPositionUpdate = () => {};
    
    // Initial render to ensure everything is working
    this.render();
    
    console.log("Game engine initialized with:", {
      platforms: this.platforms.length,
      collectibles: this.collectibles.length,
      playerPos: `${this.player.x},${this.player.y}`
    });
  }
  
  generateLevel(level) {
    // Generate platforms based on level
    const platforms = [];
    
    // Common ground platform
    platforms.push({
      x: 0,
      y: 380,
      width: 800,
      height: 20
    });
    
    switch (level) {
      case 1: // Chicken Coop - Simple layout
        platforms.push(
          { x: 200, y: 300, width: 150, height: 20 },
          { x: 400, y: 250, width: 150, height: 20 },
          { x: 600, y: 200, width: 150, height: 20 }
        );
        break;
      case 2: // Farmyard - Medium complexity
        platforms.push(
          { x: 120, y: 320, width: 100, height: 20 },
          { x: 280, y: 280, width: 100, height: 20 },
          { x: 440, y: 240, width: 100, height: 20 },
          { x: 600, y: 200, width: 100, height: 20 },
          { x: 300, y: 160, width: 100, height: 20 },
          { x: 100, y: 200, width: 80, height: 20 }
        );
        break;
      case 3: // Chicken Temple - Most complex
        platforms.push(
          { x: 100, y: 320, width: 80, height: 20 },
          { x: 250, y: 300, width: 80, height: 20 },
          { x: 400, y: 280, width: 80, height: 20 },
          { x: 550, y: 260, width: 80, height: 20 },
          { x: 700, y: 240, width: 80, height: 20 },
          { x: 550, y: 200, width: 80, height: 20 },
          { x: 400, y: 160, width: 80, height: 20 },
          { x: 250, y: 120, width: 80, height: 20 },
          { x: 100, y: 80, width: 80, height: 20 }
        );
        break;
      default:
        break;
    }
    
    return platforms;
  }
  
  generateCollectibles(level) {
    // Generate collectibles based on level
    switch (level) {
      case 1:
        return [
          { x: 600, y: 170, width: 30, height: 30, name: "Golden Feather", collected: false }
        ];
      case 2:
        return [
          { x: 300, y: 130, width: 30, height: 30, name: "Silver Egg", collected: false }
        ];
      case 3:
        return [
          { x: 100, y: 50, width: 30, height: 30, name: "Holy Hat", collected: false }
        ];
      default:
        return [];
    }
  }
  
  start() {
    if (this.running) return;
    console.log("Starting game loop");
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    console.log("Game engine stopped");
  }
  
  gameLoop() {
    if (!this.running) {
      console.log("Game loop stopped");
      return;
    }
    
    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 16, 5); // Normalize to ~60fps, cap at 5x to prevent huge jumps
    this.lastTime = now;
    
    try {
      this.update(deltaTime);
      this.render();
      
      // Debug info
      if (this.debug) {
        this.drawDebugInfo();
      }
      
      this.frameId = requestAnimationFrame(() => this.gameLoop());
    } catch (error) {
      console.error("Error in game loop:", error);
      this.stop();
    }
  }
  
  drawDebugInfo() {
    const ctx = this.ctx;
    ctx.save();
    
    // Add debug text at the top
    ctx.fillStyle = 'black';
    ctx.font = '12px monospace';
    ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - this.lastTime))}`, 10, 20);
    ctx.fillText(`Player: (${Math.round(this.player.x)},${Math.round(this.player.y)})`, 10, 40);
    ctx.fillText(`Velocity: (${this.player.velocityX.toFixed(2)},${this.player.velocityY.toFixed(2)})`, 10, 60);
    ctx.fillText(`Grounded: ${this.player.grounded ? 'Yes' : 'No'}`, 10, 80);
    
    // Draw player hitbox
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.player.x, 
      this.player.y, 
      this.player.width, 
      this.player.height
    );
    
    // Draw collectible hitboxes
    ctx.strokeStyle = 'green';
    for (const item of this.collectibles) {
      if (!item.collected) {
        ctx.strokeRect(item.x, item.y, item.width, item.height);
      }
    }
    
    ctx.restore();
  }
  
  update(deltaTime) {
    // Apply movement
    if (this.player.moveLeft) {
      this.player.velocityX = -this.player.speed;
      this.player.direction = -1;
    } else if (this.player.moveRight) {
      this.player.velocityX = this.player.speed;
      this.player.direction = 1;
    } else {
      this.player.velocityX = 0;
    }
    
    // Apply gravity
    this.player.velocityY += this.gravity * deltaTime;
    
    // Update player position
    this.player.x += this.player.velocityX * deltaTime;
    this.player.y += this.player.velocityY * deltaTime;
    
    // Check boundary collision
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.width;
    }
    
    // Check platform collision
    this.player.grounded = false;
    for (const platform of this.platforms) {
      if (this.checkCollision(this.player, platform)) {
        // Check if landing on top of platform
        if (this.player.velocityY > 0 && 
            this.player.y + this.player.height - this.player.velocityY <= platform.y) {
          this.player.y = platform.y - this.player.height;
          this.player.velocityY = 0;
          this.player.grounded = true;
        }
        // Left side collision
        else if (this.player.velocityX > 0) {
          this.player.x = platform.x - this.player.width;
        }
        // Right side collision
        else if (this.player.velocityX < 0) {
          this.player.x = platform.x + platform.width;
        }
        // Bottom collision
        else if (this.player.velocityY < 0) {
          this.player.y = platform.y + platform.height;
          this.player.velocityY = 0;
        }
      }
    }
    
    // Check collectible collision
    for (const item of this.collectibles) {
      if (!item.collected && this.checkCollision(this.player, item)) {
        item.collected = true;
        this.onCollect(item);
        
        // Check if level complete
        if (this.collectibles.every(c => c.collected)) {
          this.onLevelComplete();
        }
      }
    }
    
    // Update position for UI
    this.onPositionUpdate({ x: this.player.x, y: this.player.y });
  }
  
  checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw platforms
    this.ctx.fillStyle = '#8B4513'; // Brown wooden platforms
    for (const platform of this.platforms) {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw collectibles
    for (const item of this.collectibles) {
      if (!item.collected) {
        this.drawCollectible(item);
      }
    }
    
    // Draw player (chicken)
    this.drawPlayer();
  }
  
  drawBackground() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    switch (this.level) {
      case 1: // Chicken Coop
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        // Coop walls
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, width, 60);
        ctx.fillRect(0, 0, 20, height);
        ctx.fillRect(width - 20, 0, 20, height);
        
        // Straw
        ctx.fillStyle = '#F0E68C';
        ctx.fillRect(0, height - 20, width, 20);
        break;
      case 2: // Farmyard
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        // Hills
        ctx.fillStyle = '#7CFC00';
        ctx.beginPath();
        ctx.ellipse(200, 420, 300, 100, 0, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(600, 420, 250, 80, 0, Math.PI, 0);
        ctx.fill();
        
        // Barn in distance
        ctx.fillStyle = '#A52A2A';
        ctx.fillRect(width - 150, height - 180, 100, 80);
        ctx.beginPath();
        ctx.moveTo(width - 150, height - 180);
        ctx.lineTo(width - 100, height - 220);
        ctx.lineTo(width - 50, height - 180);
        ctx.closePath();
        ctx.fill();
        break;
      case 3: // Chicken Temple
        // Sky
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#000044');
        gradient.addColorStop(1, '#660066');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height * 0.8;
          const size = Math.random() * 2 + 1;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Temple columns
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(50, height - 300, 30, 300);
        ctx.fillRect(width - 80, height - 300, 30, 300);
        
        // Temple top
        ctx.fillRect(20, height - 300, width - 40, 20);
        break;
      default:
        // Default sky background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        break;
    }
  }
  
  drawCollectible(item) {
    const ctx = this.ctx;
    
    switch (item.name) {
      case "Golden Feather":
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(item.x, item.y);
        ctx.bezierCurveTo(
          item.x, item.y + item.height * 0.7,
          item.x + item.width, item.y + item.height * 0.5,
          item.x + item.width * 0.8, item.y + item.height
        );
        ctx.bezierCurveTo(
          item.x + item.width * 0.6, item.y + item.height * 0.8,
          item.x + item.width * 0.4, item.y + item.height * 0.6,
          item.x, item.y
        );
        ctx.fill();
        break;
      case "Silver Egg":
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width/2, 
          item.y + item.height/2, 
          item.width/2,
          item.height/2,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        // Add some shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width*0.7, 
          item.y + item.height*0.3, 
          item.width/6,
          item.height/6,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        break;
      case "Holy Hat":
        // Draw a wizard/holy hat
        ctx.fillStyle = '#4B0082'; // Indigo
        ctx.beginPath();
        ctx.moveTo(item.x, item.y + item.height);
        ctx.lineTo(item.x + item.width/2, item.y);
        ctx.lineTo(item.x + item.width, item.y + item.height);
        ctx.closePath();
        ctx.fill();
        
        // Hat brim
        ctx.fillStyle = '#9370DB'; // Medium purple
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width/2, 
          item.y + item.height*0.9, 
          item.width*0.7,
          item.height*0.1,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Stars on hat
        ctx.fillStyle = '#FFD700'; // Gold
        for (let i = 0; i < 3; i++) {
          const starX = item.x + item.width * (0.3 + i * 0.2);
          const starY = item.y + item.height * (0.3 + i * 0.2);
          const starSize = item.width * 0.1;
          
          ctx.beginPath();
          ctx.moveTo(starX, starY - starSize);
          for (let j = 0; j < 5; j++) {
            const angle = j * Math.PI * 0.4 - Math.PI * 0.5;
            const length = (j % 2 === 0) ? starSize : starSize * 0.5;
            ctx.lineTo(
              starX + Math.cos(angle) * length,
              starY + Math.sin(angle) * length
            );
          }
          ctx.closePath();
          ctx.fill();
        }
        break;
      default:
        // Default collectible
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(item.x, item.y, item.width, item.height);
        break;
    }
  }
  
  drawPlayer() {
    const ctx = this.ctx;
    
    // Get color scheme based on character
    const colorSchemes = [
      { primary: "#FF9800", secondary: "#F44336", tertiary: "#FFEB3B" },
      { primary: "#2196F3", secondary: "#3F51B5", tertiary: "#03A9F4" },
      { primary: "#4CAF50", secondary: "#8BC34A", tertiary: "#CDDC39" }
    ];
    
    const colors = colorSchemes[this.character.colorScheme];
    
    ctx.save();
    ctx.translate(
      this.player.x + this.player.width/2, 
      this.player.y + this.player.height/2
    );
    
    // Flip horizontally if moving left
    if (this.player.direction === -1) {
      ctx.scale(-1, 1);
    }
    
    // Calculate scale to fit the player box
    const scale = this.player.width / 80;
    ctx.scale(scale, scale);
    
    // Body
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(0, 10, 30, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Apply pattern
    this.drawPattern(ctx, this.character.pattern, colors);
    
    // Head
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(0, -30, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-8, -30, 5, 0, Math.PI * 2);
    ctx.arc(8, -30, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-8, -30, 2, 0, Math.PI * 2);
    ctx.arc(8, -30, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    ctx.moveTo(-5, -25);
    ctx.lineTo(5, -25);
    ctx.lineTo(0, -15);
    ctx.closePath();
    ctx.fill();
    
    // Comb/Crest
    ctx.fillStyle = "#F44336"; // Red comb
    ctx.beginPath();
    ctx.moveTo(-5, -45);
    ctx.lineTo(0, -55);
    ctx.lineTo(5, -45);
    ctx.lineTo(10, -55);
    ctx.lineTo(15, -45);
    ctx.fill();
    
    // Feet
    const legOffset = this.player.velocityX !== 0 ? Math.sin(performance.now() / 100) * 5 : 0;
    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    ctx.rect(-20, 40 + legOffset, 10, 5);
    ctx.rect(10, 40 - legOffset, 10, 5);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = this.modifyColor(colors.primary, -20); // Darker than body
    ctx.beginPath();
    ctx.ellipse(-25, 10, 8, 20, Math.PI/4, 0, Math.PI * 2);
    ctx.ellipse(25, 10, 8, 20, -Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  drawPattern(ctx, patternType, colors) {
    switch (patternType) {
      case 0: // Regal
        ctx.fillStyle = colors.tertiary;
        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.bezierCurveTo(-20, 0, -15, 20, -5, 30);
        ctx.bezierCurveTo(5, 20, 10, 0, 5, -10);
        ctx.closePath();
        ctx.fill();
        break;
      case 1: // Cosmic
        // Draw little stars/dots
        ctx.fillStyle = colors.tertiary;
        for (let i = 0; i < 15; i++) {
          const x = Math.cos(i * 0.7) * 25;
          const y = Math.sin(i * 0.8) * 30;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 2: // War Paint
        ctx.fillStyle = colors.secondary;
        // Diagonal stripe across face
        ctx.beginPath();
        ctx.moveTo(-15, -40);
        ctx.lineTo(-5, -20);
        ctx.lineTo(5, -20);
        ctx.lineTo(15, -40);
        ctx.closePath();
        ctx.fill();
        
        // Body markings
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-10, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fill();
        break;
      default:
        break;
    }
  }
  
  modifyColor(color, amount) {
    const hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  moveLeft() {
    this.player.moveLeft = true;
  }
  
  moveRight() {
    this.player.moveRight = true;
  }
  
  stopLeft() {
    this.player.moveLeft = false;
  }
  
  stopRight() {
    this.player.moveRight = false;
  }
  
  jump() {
    if (this.player.grounded) {
      this.player.velocityY = -this.player.jumpStrength;
      this.player.grounded = false;
    }
  }
}

// Level Complete Component
const LevelComplete = ({ level, onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">Level {level} Complete!</h1>
      <div className="mb-8">
        <p className="text-xl">
          {level === 1 && "You found the Golden Feather!"}
          {level === 2 && "You found the Silver Egg!"}
        </p>
      </div>
      <button 
        onClick={onContinue}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-xl transition-colors"
      >
        Continue to Level {level + 1}
      </button>
    </div>
  );
};

// Game Complete Component
const GameComplete = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl font-bold mb-6 text-yellow-400">Holy Hat Obtained!</h1>
      <div className="mb-8">
        <p className="text-2xl mb-4">Congratulations! You've completed Pecktopia!</p>
        <p className="text-xl">Your chicken is now the most legendary chicken in all the land.</p>
      </div>
      <div className="mb-8">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M20,80 L50,20 L80,80 Z" fill="#4B0082" />
          <ellipse cx="50" cy="80" rx="35" ry="5" fill="#9370DB" />
          <circle cx="35" cy="50" r="5" fill="#FFD700" />
          <circle cx="50" cy="40" r="5" fill="#FFD700" />
          <circle cx="65" cy="50" r="5" fill="#FFD700" />
        </svg>
      </div>
      <button 
        onClick={onRestart}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-xl transition-colors"
      >
        Play Again
      </button>
    </div>
  );
};

export default Pecktopia;
