document.addEventListener("DOMContentLoaded", function() {
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

    // Function to update UI with the latest data
    async function updateUI() {
        // Update date and time
        var currentDate = new Date();
        var dateTimeString = currentDate.toLocaleString();
        document.getElementById("datetime").innerHTML = dateTimeString;

        // Update price and datetime from JSON data
        const data = await fetchData();
        if (data && data.length > 0) {
            const latestData = data[data.length - 1];
            const { price, datetime } = latestData;

            // Update price and datetime in the UI
            document.getElementById("irr").textContent = price + " IRR";
            document.getElementById("updatedate").textContent = "Last update: " + new Date(datetime).toLocaleString();
        }
    }

    // Call updateUI initially to load data on page load
    updateUI();

    // Call updateUI every minute (60000 milliseconds) to keep data and time updated
    setInterval(updateUI, 60000);

    function updateDateTime() {
        // Get the current date and time
        var currentDate = new Date();
        
        // Format the date and time
        var dateTimeString = currentDate.toLocaleString();
        
        // Display the date and time in the div with id="datetime"
        document.getElementById("datetime").innerHTML = dateTimeString;
    }
    
    // Call the function once to display the date and time immediately
    updateDateTime();
    
    // Call the function every second to update the date and time in real-time
    setInterval(updateDateTime, 1000);
    
});
