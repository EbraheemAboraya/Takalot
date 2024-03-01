// Importing Socket.IO
const socketIo = require('socket.io');
const TechnicianSocketMapping = require('../module/technicalCategoryMapping');

// A map to track technician IDs to their current socket connections
let technicianIdToSocketIdMap = {};

// Initializes and configures the Socket.IO server
function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Adjust according to your security requirements
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('technicianConnected', async (technicianId) => {
      console.log(`Technician connected with ID: ${technicianId} and socket ID: ${socket.id}`);
      // Update the mapping with the latest socket ID for the technician
      technicianIdToSocketIdMap[technicianId] = socket.id;

      try {
        // Save or update the mapping in the database
        await updateTechnicianSocketMapping(technicianId, socket.id);
      } catch (error) {
        console.error('Failed to update technician socket mapping:', error);
      }
    });

    socket.on('disconnect', () => {
      // Find and remove the technician associated with the disconnected socket
      const technicianId = Object.keys(technicianIdToSocketIdMap).find(key => technicianIdToSocketIdMap[key] === socket.id);
      if (technicianId) {
        delete technicianIdToSocketIdMap[technicianId];
        console.log(`Technician ID ${technicianId} disconnected and removed from the map.`);
      }
      console.log(`Connection ${socket.id} has been disconnected`);
    });
  });

  // Function to emit events to a specific technician by their ID
  const notifyTechnicianById = async (technicianId, event, data) => {
    const socketId = technicianIdToSocketIdMap[technicianId];
    if (socketId) {
      try {
        io.to(socketId).emit(event, data);
        console.log(`Notification "${event}" sent to technician ID ${technicianId}`);
      } catch (error) {
        console.error(`Failed to send notification to technician ID ${technicianId}:`, error);
      }
    } else {
      console.log(`No active socket found for technician ID ${technicianId}`);
    }
  };

  // Expose the notifyTechnicianById function for use in other parts of the application
  return { notifyTechnicianById };
}

async function updateTechnicianSocketMapping(technicianId, socketId) {
  // Implement logic to save/update the technician's socket ID mapping in the database
  // This can either create a new entry or update an existing one based on the technicianId
  try {
    const existingMapping = await TechnicianSocketMapping.findOne({ technicianId: technicianId });
    if (existingMapping) {
      existingMapping.socketId = socketId;
      await existingMapping.save();
    } else {
      const newMapping = new TechnicianSocketMapping({ technicianId, socketId });
      await newMapping.save();
    }
    console.log('Technician socket mapping updated successfully.');
  } catch (error) {
    throw error; // Rethrow to handle logging at the caller
  }
}

module.exports = setupSocket;
