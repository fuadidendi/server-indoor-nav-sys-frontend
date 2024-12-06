import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false); // Reset authentication state
    navigate("/"); // Redirect to login page
  };

  // Initial object locations
  const initialObjectLocations = [
    { id: 1, name: "Person A", x: 200, y: 150 },
    { id: 2, name: "Person B", x: 450, y: 250 },
    { id: 3, name: "Person C", x: 300, y: 400 },
    { id: 4, name: "Person D", x: 100, y: 450 }
  ];

  // State to hold the updated object locations
  const [objectLocations, setObjectLocations] = useState(initialObjectLocations);

  // Function to move objects
  const moveObjects = () => {
    setObjectLocations((prevLocations) =>
      prevLocations.map((obj) => {
        // Simulate random movement: Change position by a small random amount
        const newX = obj.x + (Math.random() - 0.5) * 10; // Random movement within +/- 10px
        const newY = obj.y + (Math.random() - 0.5) * 10;

        // Ensure the object stays within the map bounds
        const maxX = 1007; // Map width
        const maxY = 497;  // Map height

        return {
          ...obj,
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        };
      })
    );
  };

  // Update object positions every second (1000ms)
  useEffect(() => {
    const interval = setInterval(moveObjects, 1000); // Move objects every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the protected Dashboard page.</p>

      {/* Static 2D Building Map */}
      <div
        style={{
          position: "relative",
          width: "1007px", // Set width as needed
          height: "497px", // Set height as needed
          margin: "0 auto",
          backgroundImage: `url('/images/image.png')`, // Path to your image in public folder
          backgroundSize: "cover", // Fit image to cover the container
          backgroundPosition: "center", // Center the image
          backgroundRepeat: "no-repeat", // Prevent repetition of the image
        }}
      >
        {/* Render objects on top of the map */}
        {objectLocations.map((obj) => (
          <div
            key={obj.id}
            style={{
              position: "absolute",
              left: `${obj.x}px`, // X coordinate
              top: `${obj.y}px`, // Y coordinate
              width: "40px",  // Adjust width
              height: "40px", // Adjust height
              backgroundImage: "url('/images/person.png')", // Path to your person icon image
              backgroundSize: "contain", // Ensure the image fits inside the div
              backgroundPosition: "center", // Center the image inside the div
              backgroundRepeat: "no-repeat", // Prevent repetition of the image
              border: "none",  // No border
            }}
          >
            <span style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              textAlign: "center",
              color: "white",
              fontSize: "10px",
            }}>
              {obj.name}
            </span>
          </div>
        ))}
      </div>

      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
