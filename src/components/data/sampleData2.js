const sampleData2 = [
    {
        name: "Fentanyl",
        values: [
            { quarter: "Q4 2022", percentage: "14.9", ciLower: "14.6", ciUpper: "15.2" },
            { quarter: "Q1 2023", percentage: "13.7", ciLower: "13.4", ciUpper: "13.9" },
            { quarter: "Q2 2023", percentage: "14.2", ciLower: "13.9", ciUpper: "14.6" },
            { quarter: "Q3 2023", percentage: "14.4", ciLower: "14.2", ciUpper: "14.7" },
            { quarter: "Q4 2023", percentage: "14.5", ciLower: "14.2", ciUpper: "14.7" },
            { quarter: "Q1 2024", percentage: "13.7", ciLower: "13.5", ciUpper: "13.8" },
            { quarter: "Q2 2024", percentage: "13.7", ciLower: "13.5", ciUpper: "15.0" },
            { quarter: "Q3 2024", percentage: "13.4", ciLower: "13.2", ciUpper: "13.7" },
            { quarter: "Q4 2024", percentage: "12.7", ciLower: "12.5", ciUpper: "13.0" }
        ]
    },
    {
        name: "Fentanyl with Stimulants",
        values: [
            { quarter: "Q4 2022", percentage: "9.7", ciLower: "9.5", ciUpper: "10" },
            { quarter: "Q1 2023", percentage: "9.2", ciLower: "8.9", ciUpper: "9.4" },
            { quarter: "Q2 2023", percentage: "9.7", ciLower: "9.5", ciUpper: "9.9" },
            { quarter: "Q3 2023", percentage: "10", ciLower: "9.8", ciUpper: "10.2" },
            { quarter: "Q4 2023", percentage: "10", ciLower: "9.8", ciUpper: "10.2" },
            { quarter: "Q1 2024", percentage: "9.5", ciLower: "9.3", ciUpper: "9.8" },
            { quarter: "Q2 2024", percentage: "10.1", ciLower: "9.9", ciUpper: "10.4" },
            { quarter: "Q3 2024", percentage: "10.3", ciLower: "10.1", ciUpper: "10.5" },
            { quarter: "Q4 2024", percentage: "10.2", ciLower: "10", ciUpper: "10.5" }
        ]
    },
    {
        name: "Fentanyl without Stimulants",
        values: [
            { quarter: "Q4 2022", percentage: "5.2", ciLower: "5", ciUpper: "5.3" },
            { quarter: "Q1 2023", percentage: "4.5", ciLower: "4.4", ciUpper: "4.7" },
            { quarter: "Q2 2023", percentage: "4.5", ciLower: "4.3", ciUpper: "4.6" },
            { quarter: "Q3 2023", percentage: "4.4", ciLower: "4.3", ciUpper: "4.6" },
            { quarter: "Q4 2023", percentage: "4.4", ciLower: "4.3", ciUpper: "4.6" },
            { quarter: "Q1 2024", percentage: "4", ciLower: "3.8", ciUpper: "4.1" },
            { quarter: "Q2 2024", percentage: "3.6", ciLower: "3.5", ciUpper: "3.7" },
            { quarter: "Q3 2024", percentage: "3.1", ciLower: "3", ciUpper: "3.3" },
            { quarter: "Q4 2024", percentage: "2.5", ciLower: "2.4", ciUpper: "2.6" }
        ]
    }
];

// 6-month aggregated data for the same drugs
export const sampleData2_6Months = [
    {
        name: "Fentanyl",
        values: [
            { period: "Jul-Dec 2022", percentage: "14.9", ciLower: "14.6", ciUpper: "15.2" },
            { period: "Jan-Jun 2023", percentage: "13.9", ciLower: "13.8", ciUpper: "14.1" },
            { period: "Jul-Dec 2023", percentage: "14.4", ciLower: "14.2", ciUpper: "14.6" },
            { period: "Jan-Jun 2024", percentage: "13.6", ciLower: "13.4", ciUpper: "13.8" },
            { period: "Jul-Dec 2024", percentage: "13.1", ciLower: "12.9", ciUpper: "13.3" }
        ]
    },
    {
        name: "Fentanyl with Stimulants",
        values: [
            { period: "Jul-Dec 2022", percentage: "9.7", ciLower: "9.5", ciUpper: "10" },
            { period: "Jan-Jun 2023", percentage: "9.4", ciLower: "9.3", ciUpper: "9.6" },
            { period: "Jul-Dec 2023", percentage: "10", ciLower: "9.8", ciUpper: "10.2" },
            { period: "Jan-Jun 2024", percentage: "9.8", ciLower: "9.7", ciUpper: "10" },
            { period: "Jul-Dec 2024", percentage: "10.1", ciLower: "10.1", ciUpper: "10.4" }
        ]
    },
    {
        name: "Fentanyl without Stimulants",
        values: [
            { period: "Jul-Dec 2022", percentage: "5.2", ciLower: "5", ciUpper: "5.3" },
            { period: "Jan-Jun 2023", percentage: "4.5", ciLower: "4.4", ciUpper: "4.6" },
            { period: "Jul-Dec 2023", percentage: "4.4", ciLower: "4.3", ciUpper: "4.5" },
            { period: "Jan-Jun 2024", percentage: "3.8", ciLower: "3.7", ciUpper: "3.9" },
            { period: "Jul-Dec 2024", percentage: "2.8", ciLower: "2.7", ciUpper: "2.9" }
        ]
    }
];

export default sampleData2;
