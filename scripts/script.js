document.addEventListener("DOMContentLoaded", function() {
    async function fetchData() {
        try {
            const response = await fetch("data/data.json");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function updateUI() {
        const currentDate = new Date();
        const dateTimeString = currentDate.toLocaleString();
        document.getElementById("datetime").innerHTML = dateTimeString;

        const data = await fetchData();
        if (data && data.length > 0) {
            const latestData = data[data.length - 1];
            const { price, datetime } = latestData;

            document.getElementById("irr").textContent = `${price} IRR`;
            document.getElementById("updatedate").textContent = `Last update: ${new Date(datetime).toLocaleString()}`;
        }
    }

    updateUI();

    setInterval(updateUI, 60000);

    function updateDateTime() {
        const currentDate = new Date();
        const dateTimeString = currentDate.toLocaleString();
        document.getElementById("datetime").innerHTML = dateTimeString;
    }

    updateDateTime();

    setInterval(updateDateTime, 1000);
});
