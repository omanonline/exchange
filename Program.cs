using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CurrencyDataApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            HttpClient httpClient = new HttpClient();

            try
            {
                var response = await httpClient.GetStringAsync("https://api.nobitex.ir/v2/orderbook/USDTIRT");
                var data = JsonConvert.DeserializeObject<OrderBook>(response);

                var lastTradePrice = double.Parse(data.LastTradePrice);
                var OMRPrice = lastTradePrice * 2.60;
                var roundedOMRPrice = (int)Math.Round(OMRPrice / 1000.0) * 100;

                var newData = new
                {
                    price = roundedOMRPrice,
                    datetime = DateTimeOffset.UtcNow
                };

                var dataDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "output", "data");
                var dataFilePath = Path.Combine(dataDirectory, "data.json");

                if (!Directory.Exists(dataDirectory))
                {
                    Directory.CreateDirectory(dataDirectory);
                }

                var existingData = File.Exists(dataFilePath) ? await File.ReadAllTextAsync(dataFilePath) : "[]";
                var jsonArray = SafeParseJArray(existingData);

                var newDataObject = JObject.FromObject(newData);
                jsonArray.Add(newDataObject);

                if (jsonArray.Count > 10)
                {
                    var last10Records = jsonArray.Skip(jsonArray.Count - 10).ToList();
                    jsonArray = new JArray(last10Records);
                }

                await File.WriteAllTextAsync(dataFilePath, jsonArray.ToString());

                Console.WriteLine("New data added to data.json in the output/data directory.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }

        public static JArray SafeParseJArray(string jsonData)
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

        public class OrderBook
        {
            public string LastTradePrice { get; set; }
        }
    }
}
