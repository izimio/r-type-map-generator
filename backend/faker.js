// Update your import statement to use dynamic import
import('node-fetch').then(async (module) => {
    const fetch = module.default;
  
    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    async function sendDataToApi(apiUrl) {
      const randomValue = getRandomFloat(0, 300);
  
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: randomValue }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        console.log(`Data sent successfully: ${randomValue}`);
      } catch (error) {
        console.error('Error sending data:', error.message);
      }
    }
  
    // Replace 'YOUR_API_URL' with the actual API endpoint
    const apiUrl = "https://dcomsuption.infra.spice-tournament.com/push-data"
  
    // Send data every 1 second
    setInterval(() => {
      sendDataToApi(apiUrl);
    }, 1000);
  });
  