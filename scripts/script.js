document.addEventListener("DOMContentLoaded", async function() {
    // Function to fetch JSON data
    async function fetchData() {
        try {
            const response = await fetch("data/data.json");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Function to update UI with the latest data and create or update the chart
    async function updateUI() {
        // Update date and time
        const currentDate = new Date();
        const dateTimeString = currentDate.toLocaleString();
        document.getElementById("datetime").innerHTML = dateTimeString;

        // Update price and datetime from JSON data
        const data = await fetchData();
        if (data && data.length > 0) {
            const prices = data.map(item => item.price);
            const datetimes = data.map(item => new Date(item.datetime));

            const times = data.map(item => {
                const datetime = new Date(item.datetime);
                const hours = datetime.getHours().toString().padStart(2, '0'); // Ensure 2-digit format
                const minutes = datetime.getMinutes().toString().padStart(2, '0'); // Ensure 2-digit format
                const seconds = datetime.getSeconds().toString().padStart(2, '0'); // Ensure 2-digit format
                return `${hours}:${minutes}:${seconds}`;
            });

            // Update price and datetime in the UI
            document.getElementById("irt").textContent = `${prices[prices.length - 1]} IRT`;
            document.getElementById("updatedate").textContent = `Last update: ${new Date(data[data.length - 1].datetime).toLocaleString()}`;

            // Create or update the chart
            createOrUpdateChart(times, prices);
        }
    }

    // Function to create or update the chart using Plotly.js
    function createOrUpdateChart(datetimes, prices) {
        const priceChart = new Chart("priceChart", {
            type: "line",
            data: {
              labels: datetimes,
              datasets: [{
                backgroundColor:"",
                borderColor: "rgba(255,255,255,0.5)",
                data: prices
              }]
            },
            options: {
                legend: {display: false}
              }
          });
         
    }

    // Call updateUI initially to load data on page load
    updateUI();

    // Call updateUI every minute (60000 milliseconds) to keep data and time updated
    setInterval(updateUI, 60000);

    // Function to update the date and time every second
    function updateDateTime() {
        const currentDate = new Date();
        const dateTimeString = currentDate.toLocaleString();
        document.getElementById("datetime").innerHTML = dateTimeString;
    }

    // Call updateDateTime initially to display the date and time immediately
    updateDateTime();

    // Call updateDateTime every second to update the date and time in real-time
    setInterval(updateDateTime, 1000);
});
