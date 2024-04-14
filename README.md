# Real-Time Exchange Rate and Date Display

This project is a simple web application that displays the real-time exchange rate between Omani Rial (OMR) and Iranian Rial (IRR) along with the current date and time. It fetches the exchange rate data from a JSON file (`data.json`) and updates the UI accordingly.

## Features

- Displays the real-time exchange rate between OMR and IRR.
- Shows the current date and time.
- Updates the data and time every minute to keep it current.

## Usage

1. Clone or download this repository to your local machine.
2. Ensure you have a web server set up (you can use tools like `http-server` for testing locally).
3. Place the `data.json` file in the root directory of your project.
4. Open the `index.html` file in a web browser.

## File Structure

- `index.html`: HTML file containing the structure of the web page.
- `styles/output.css`: CSS file generated by Tailwind CSS.
- `scripts/script.js`: JavaScript file containing the logic to fetch data and update the UI.
- `data.json`: JSON file containing the exchange rate data.

## Dependencies

- [Tailwind CSS](https://tailwindcss.com/): Used for styling the UI.
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API): Used to fetch data from the JSON file.
- [JavaScript Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date): Used to get and manipulate the current date and time.

## Credits

This project was created by Milad Raeisi.

## License

This project is licensed under the [MIT License](LICENSE).
