# R-Type Map Generator 🚀

A collection of tools for the R-Type project, designed to streamline sprite cropping, map creation, and real-time server traffic monitoring using WebSockets.

## Tools Included:

### 1. Map Generator 🗺️

Create intricate maps for your R-Type project using the Map Generator. Define the layout, spawn points, and other parameters to generate visually appealing and functional game maps.

### 2. Sprite Cropper 🎮

Easily crop sprites for your R-Type game with the Sprite Cropper tool. Simply upload your sprite sheet, define the cropping parameters, and let the tool generate individual sprite images.

### 3. WebSocket Traffic Monitor 🌐

Monitor the traffic of your own server in real-time using the WebSocket Traffic Monitor. Gain insights into the communication between the client and server, helping in debugging and optimization.


Certainly! Let's add some emojis and clarify the usage instructions:

```markdown
## How to Use 🚀

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/r-type-map-generator.git
   ```

2. **Launch with Docker:**

   Each tool has its own Dockerfile for easy deployment. Follow these steps to run them:

   - **Map Generator 🗺️** and  **Sprite Cropper 🎮:**
     ```bash
     cd frontend
     docker build -t frontend .
     docker run -p 8080:80 frontend
     ```

   - **WebSocket Traffic Monitor 🌐:**
     ```bash
     cd backend
     docker build -tbackend .
     docker run -p 8082:80 backend
     ```

   Adjust the port numbers (`8080`, `8081`, `8082`, etc.) as needed to avoid conflicts.

> Make sure Docker is installed on your system before running these commands.

## Screenshots 📸

Include actual screenshots or images of each tool in action:

![Map Generator](https://camo.githubusercontent.com/c8b1999bd153eddb11cf459f3880bc7f1677cf3baf8d51ab81add110d276818a/68747470733a2f2f696d6764622e6e65742f73746f726167652f75706c6f6164732f383734306161323661613833626563323134303762303034663765623966363961303538626330643362653637613130373134346231323033643134363564312e706e67)

![Sprite Cropper](https://camo.githubusercontent.com/7a2ea36273e3cedb8f11ddbabd3ba143c41951d84977caf226292c8a53c790d0/68747470733a2f2f696d6764622e6e65742f73746f726167652f75706c6f6164732f643130643935633231303933366262616163313763663436356135333164353962356339326237366530363536383166316334346234643034353832313830372e706e67)

![WebSocket Traffic Monitor](https://camo.githubusercontent.com/df34c3c978c5720f313a72ba0651c1341e0379db6309a98d342fff9d2ec6c62c/68747470733a2f2f696d6764622e6e65742f73746f726167652f75706c6f6164732f326162393234623233663430393837313464333430386261343930313966396431623138653933623733373832663563366533636632663265663264303632302e706e67)


