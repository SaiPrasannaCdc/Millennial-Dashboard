using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OfficeOpenXml;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ExcelToJsonConverter
{
    public class DrugData
    {
        public string Period { get; set; } = string.Empty;
        public string DrugName { get; set; } = string.Empty;
        public double Percentage { get; set; }
        public double CiLower { get; set; }
        public double CiUpper { get; set; }
        public string PeriodChange { get; set; } = string.Empty;
        public string YearChange { get; set; } = string.Empty;
    }

    public class ExcelRow
    {
        public string USRegion { get; set; } = string.Empty;
        public string Drug { get; set; } = string.Empty;
        public string Positivity { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public string SmonYr { get; set; } = string.Empty;
        public string DrugName { get; set; } = string.Empty;
        public double PercentPos { get; set; }
        public double CiLower { get; set; }
        public double CiUpper { get; set; }
        public string PeriodChange { get; set; } = string.Empty;
        public string YrChange { get; set; } = string.Empty;
    }

    class Program
    {
        private static readonly Dictionary<string, string> RegionMapping = new()
        {
            { "U.S. TOTAL", "National" },
            { "SOUTH", "South" },
            { "WEST", "West" },
            { "NORTHEAST", "North" },
            { "MIDWEST", "MidWest" }
        };

        static void Main(string[] args)
        {
            // Set EPPlus license context
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            string excelFilePath = "C:\\SourceCode\\github\\Millennial-Dashboard\\ExcelToJsonConverter\\data\\Millennium_health_download_20260127_clean.xlsx"; // Change this to your Excel file path
            string outputJsonPath = "C:\\SourceCode\\github\\Millennial-Dashboard\\ExcelToJsonConverter\\data\\Millennium_health_download_20260127_clean.json";

            if (args.Length > 0)
                excelFilePath = args[0];
            if (args.Length > 1)
                outputJsonPath = args[1];

            try
            {
                var data = ReadExcelFile(excelFilePath);
                var jsonStructure = ConvertToJsonStructure(data);
                var jsonString = JsonConvert.SerializeObject(jsonStructure, Formatting.Indented);

                File.WriteAllText(outputJsonPath, jsonString);
                Console.WriteLine($"Successfully converted Excel data to JSON: {outputJsonPath}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        static List<ExcelRow> ReadExcelFile(string filePath)
        {
            var rows = new List<ExcelRow>();

            using var package = new ExcelPackage(new FileInfo(filePath));
            var worksheet = package.Workbook.Worksheets[0]; // First worksheet

            int rowCount = worksheet.Dimension.Rows;
            int colCount = worksheet.Dimension.Columns;

            // Assume first row contains headers
            // Expected columns: USregion, Drug, Positivity, Period, smon_yr, drug_name, percent_pos, CI lower, CI upper, PeriodChange, Yr change
            for (int row = 2; row <= rowCount; row++) // Start from row 2 (skip header)
            {
                var excelRow = new ExcelRow
                {
                    USRegion = GetCellValue(worksheet, row, 1),
                    Drug = GetCellValue(worksheet, row, 2),
                    Positivity = GetCellValue(worksheet, row, 3),
                    Period = GetCellValue(worksheet, row, 4),
                    SmonYr = GetCellValue(worksheet, row, 5),
                    DrugName = GetCellValue(worksheet, row, 6),
                    PercentPos = GetNumericValue(worksheet, row, 7),
                    CiLower = GetNumericValue(worksheet, row, 8),
                    CiUpper = GetNumericValue(worksheet, row, 9),
                    PeriodChange = GetRawTextValue(worksheet, row, 10), // Column 10 for PeriodChange - read as raw text
                    YrChange = GetRawTextValue(worksheet, row, 11) // Column 11 for Yr change - read as raw text
                };

                rows.Add(excelRow);
            }

            return rows;
        }

        static string GetCellValue(ExcelWorksheet worksheet, int row, int col)
        {
            var cell = worksheet.Cells[row, col];
            return cell.Value?.ToString() ?? string.Empty;
        }

        static string GetRawTextValue(ExcelWorksheet worksheet, int row, int col)
        {
            var cell = worksheet.Cells[row, col];
            // Get the raw text value as displayed in Excel
            return cell.Text ?? string.Empty;
        }

        static double GetNumericValue(ExcelWorksheet worksheet, int row, int col)
        {
            var cell = worksheet.Cells[row, col];
            if (cell.Value != null && double.TryParse(cell.Value.ToString(), out double result))
                return result;
            return 0.0;
        }

        static JObject ConvertToJsonStructure(List<ExcelRow> data)
        {
            var result = new JObject();

            // First group by Region and Drug to handle all data for each drug together
            var regionDrugGroups = data
                .Where(row => !string.IsNullOrEmpty(row.USRegion) && !string.IsNullOrEmpty(row.Drug))
                .GroupBy(row => new
                {
                    Region = RegionMapping.ContainsKey(row.USRegion.ToUpper()) ? RegionMapping[row.USRegion.ToUpper()] : row.USRegion,
                    Drug = row.Drug
                });

            foreach (var regionGroup in regionDrugGroups.GroupBy(g => g.Key.Region))
            {
                var regionName = regionGroup.Key;
                var regionObject = new JObject();

                foreach (var drugGroup in regionGroup)
                {
                    var drugName = drugGroup.Key.Drug;
                    var drugObject = new JObject();

                    // Separate Positivity and CoPositive data
                    var positivityData = drugGroup.Where(row => row.Positivity == "Positivity").ToList();
                    var coPositiveData = drugGroup.Where(row => row.Positivity == "CoPositivity").ToList();

        

                    // Process Positivity data
                    if (positivityData.Any())
                    {
                        var positivityObject = ProcessDataGroup(positivityData);
                        drugObject["Positivity"] = positivityObject;
                    }

                    // Process CoPositive data
                    if (coPositiveData.Any())
                    {
                        var coPositiveObject = ProcessDataGroup(coPositiveData);
                        drugObject["CoPositive"] = coPositiveObject;
                    }
                    else if (positivityData.Any())
                    {
                        // Create empty CoPositive structure with same periods as Positivity
                        var positivityObject = drugObject["Positivity"] as JObject;
                        if (positivityObject != null)
                        {
                            var coPositiveObject = new JObject();
                            
                            foreach (var period in positivityObject.Properties())
                            {
                                coPositiveObject[period.Name] = new JArray();
                            }
                            
                            drugObject["CoPositive"] = coPositiveObject;
                        }
                    }

                    regionObject[drugName] = drugObject;
                }

                result[regionName] = regionObject;
            }

            return result;
        }

        static JObject ProcessDataGroup(List<ExcelRow> dataGroup)
        {
            var resultObject = new JObject();

            var periodGroups = dataGroup.GroupBy(row => row.Period);

            foreach (var periodGroup in periodGroups)
            {
                var periodName = periodGroup.Key;
                var periodArray = new JArray();

                foreach (var row in periodGroup)
                {
                    // Standardize drug name capitalization
                    var drugName = row.DrugName;
                    if (drugName == "Fentanyl without stimulants")
                    {
                        drugName = "Fentanyl without Stimulants";
                    }

                    var dataObject = new JObject
                    {
                        ["period"] = row.SmonYr,
                        ["drug_name"] = drugName,
                        ["percentage"] = row.PercentPos,
                        ["ciLower"] = row.CiLower,
                        ["ciUpper"] = row.CiUpper,
                        ["periodChange"] = string.IsNullOrEmpty(row.PeriodChange) ? "" : row.PeriodChange,
                        ["yearChange"] = string.IsNullOrEmpty(row.YrChange) ? "" : row.YrChange
                    };

                    periodArray.Add(dataObject);
                }

                resultObject[periodName] = periodArray;
            }

            return resultObject;
        }
    }
}
