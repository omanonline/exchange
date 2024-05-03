using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Telegram.Bot;

namespace CurrencyDataApp
{
    class Program
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private static TelegramBotClient botClient;
        private static string apiUrl;
        private static string telegramChannelId;
        private const double OMRConversionRateMain = 2.60;
        private const double OMRConversionRateTelegram = 2.61;
        private const double RoundingBase = 1000.0;
        private const int DataRetentionLimit = 10;

        static async Task Main(string[] args)
        {
            InitializeSettings(args);
            if (botClient != null && !string.IsNullOrEmpty(apiUrl) && !string.IsNullOrEmpty(telegramChannelId))
            {
                bool isDataUpdated = await ProcessCurrencyDataAsync();
                if (isDataUpdated)
                {
                    await SendMessageAsync();
                }
            }
            else
            {
                Console.WriteLine("Initialization failed. Please check the provided command-line arguments.");
            }
        }

        private static void InitializeSettings(string[] args)
        {
            string token = ExtractArgument(args, "-t");
            apiUrl = ExtractArgument(args, "-api");
            string channelArg = ExtractArgument(args, "-channel");
            telegramChannelId = "@" + channelArg.TrimStart('@');

            if (!string.IsNullOrEmpty(token))
            {
                botClient = new TelegramBotClient(token);
                Console.WriteLine("Telegram bot initialized successfully.");
            }
            else
            {
                Console.WriteLine("Telegram bot token not provided.");
            }

            if (string.IsNullOrEmpty(apiUrl))
            {
                Console.WriteLine("API URL not provided.");
            }

            if (string.IsNullOrEmpty(telegramChannelId))
            {
                Console.WriteLine("Telegram channel ID not provided.");
            }
        }

        private static string? ExtractArgument(string[] args, string key)
        {
            int index = Array.IndexOf(args, key);
            return index >= 0 && index + 1 < args.Length ? args[index + 1] : null;
        }

        private static async Task<bool> ProcessCurrencyDataAsync()
        {
            try
            {
                string response = await httpClient.GetStringAsync(apiUrl);
                var orderBook = JsonConvert.DeserializeObject<OrderBook>(response);

                int roundedOMRPrice = CalculateOMRPrice(orderBook.LastTradePrice, OMRConversionRateMain);

                var newData = new
                {
                    price = roundedOMRPrice,
                    datetime = DateTimeOffset.UtcNow
                };

                string dataFilePath = EnsureDataFilePath();
                return await AppendDataToFileAsync(dataFilePath, newData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while processing data: {ex.Message}");
                return false;
            }
        }

        private static int CalculateOMRPrice(string lastTradePrice, double conversionRate)
        {
            double lastPrice = double.Parse(lastTradePrice);
            double omrPrice = lastPrice * conversionRate;
            return (int)Math.Round(omrPrice / RoundingBase) * 100;
        }

        private static string EnsureDataFilePath()
        {
            string dataDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "output", "data");
            Directory.CreateDirectory(dataDirectory); // Creates directory if it does not exist
            return Path.Combine(dataDirectory, "data.json");
        }

        private static async Task<bool> AppendDataToFileAsync(string filePath, object newData)
        {
            try
            {
                var existingData = File.Exists(filePath) ? await File.ReadAllTextAsync(filePath) : "[]";
                JArray jsonArray = SafeParseJArray(existingData);
                jsonArray.Add(JObject.FromObject(newData));

                if (jsonArray.Count > DataRetentionLimit)
                {
                    jsonArray = new JArray(jsonArray.Skip(jsonArray.Count - DataRetentionLimit));
                }

                await File.WriteAllTextAsync(filePath, jsonArray.ToString());
                Console.WriteLine("Data file updated successfully.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to update data file: {ex.Message}");
                return false;
            }
        }

        private static JArray SafeParseJArray(string jsonData)
        {
            try
            {
                return JArray.Parse(jsonData);
            }
            catch
            {
                return new JArray();  // Return a new, empty JSON array if parsing fails
            }
        }

        private static async Task SendMessageAsync()
        {
            try
            {
                string response = await httpClient.GetStringAsync(apiUrl);
                var orderBook = JsonConvert.DeserializeObject<OrderBook>(response);

                int roundedOMRPrice = CalculateOMRPrice(orderBook.LastTradePrice, OMRConversionRateTelegram);

                var sentMessage = await botClient.SendTextMessageAsync(
                    chatId: telegramChannelId,
                    text: $"1 OMR = {roundedOMRPrice:n0} IRT");
                Console.WriteLine("Message successfully sent to Telegram channel.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in sending message to Telegram: {ex.Message}");
            }
        }

        public class OrderBook
        {
            public string LastTradePrice { get; set; }
        }
    }
}
