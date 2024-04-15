document.addEventListener("DOMContentLoaded", async function() {
    // Function to fetch JSON data
    async function fetchData() {
        try {
            const cacheBuster = Date.now();
            const url = `https://ex.omanonline.org/data/data.json?cache=${cacheBuster}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Re-throw the error to propagate it to the caller
        }
    }

    // Function to update UI with the latest data and create or update the chart
    async function updateUI(data) {
        try {
            // Update date and time
            const currentDate = new Date();
            const dateTimeString = currentDate.toLocaleString();
            document.getElementById("datetime").innerHTML = dateTimeString;

            // Check if data is available
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
                document.getElementById("irt").textContent = `${prices[prices.length - 1].toLocaleString()} IRT`;
                document.getElementById("updatedate").textContent = `Last update: ${new Date(data[data.length - 1].datetime).toLocaleString()}`;

                // Create or update the chart
                createOrUpdateChart(times, prices);
            } else {
                // Handle case when data is empty
                console.error("Data is empty or invalid.");
            }
        } catch (error) {
            // Handle errors during UI update
            console.error("Error updating UI:", error);
        }
    }

    function createOrUpdateChart(datetimes, prices) {
        const priceChart = new Chart("priceChart", {
            type: "line",
            data: {
                labels: datetimes,
                datasets: [{
                    backgroundColor: "",
                    borderColor: "rgba(255,255,255,0.5)",
                    data: prices
                }]
            },
            options: {
                legend: { display: false }
            }
        });
    }

    // Function to continuously update data and UI
    async function updateDataAndUI() {
        try {
            const data = await fetchData();
            await updateUI(data);
        } catch (error) {
            // Retry after a delay if there's an error
            console.error("Retrying after error:", error);
            setTimeout(updateDataAndUI, 60000); // Retry after 1 minute
        }
    }

    // Call updateDataAndUI initially to load data on page load
    updateDataAndUI();

    // Call updateDataAndUI every minute (60000 milliseconds) to keep data and time updated
    setInterval(updateDataAndUI, 60000);

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
    document.getElementById("calculate").addEventListener("click", calculateConversion);

    // Define the calculateConversion function
    function calculateConversion() {
        var amount = parseFloat(document.getElementById("amount").value.replace(/,/g, ''));
        var conversionType = document.getElementById("conversionType").value;
        var resultElement = document.getElementById("result");
        var omrValue = 1;
        var irtValue = parseFloat(document.getElementById("irt").innerText.replace(/,/g, '').replace('IRT', ''));
        
        if (isNaN(amount)) {
            resultElement.innerText = "Please enter a valid amount.";
            return;
        }
        
        if (conversionType === "omrToIrt") {
            var result = amount * irtValue / omrValue;
            resultElement.innerText = amount.toLocaleString() + " OMR is equal to " + result.toLocaleString() + " IRT";
        } else if (conversionType === "irtToOmr") {
            var result = amount * omrValue / irtValue;
            resultElement.innerText = amount.toLocaleString() + " IRT is equal to " + result.toLocaleString() + " OMR";
        }
    }
    // Show content once the page is fully loaded
    setTimeout(function() {
        document.getElementById("loading").style.display = "none";
        document.getElementById("content").style.display = "block";
    }, 1000);
});
