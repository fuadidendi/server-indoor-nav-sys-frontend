import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mqtt from "mqtt";

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
    // MQTT broker URL (make sure to use WebSocket if you're using a web client)
    const brokerUrl = "ws://192.168.160.173:1884"; // WebSocket port for Mosquitto
    const client = mqtt.connect(brokerUrl);
    
    // Connect to MQTT broker
    client.on("connect", () => {
      console.log("Connected to MQTT broker");

      // Subscribe to the topic where object location data is published
      client.subscribe("person/locations", (err) => {
        if (err) {
          console.error("Failed to subscribe:", err);
        } else {
          console.log("Subscribed to person/locations");
        }
      });
    });
    
    // Handle incoming messages
    client.on("message", (topic, message) => {
      if (topic === "person/locations") {
        console.log("Message received: ", message.toString());  // Log the raw message
        try {
          const locations = JSON.parse(message.toString());
          console.log("Parsed locations: ", locations);  // Log the parsed locations
          setObjectLocations(locations);  // Update object locations
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      }
    });

    client.on('error', (err) => {
      console.error("Connection error:", err);
    });

    // Cleanup the MQTT client when the component unmounts
    return () => {
      client.end();
    };

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
