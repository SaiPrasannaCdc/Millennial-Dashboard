const sampleData2 = [
    {
        name: "Fentanyl",
        values: [
            { quarter: "Q4 2022", percentage: "12.9%" },
            { quarter: "Q1 2023", percentage: "13.6%" },
            { quarter: "Q2 2023", percentage: "14.2%" },
            { quarter: "Q3 2023", percentage: "14.3%" },
            { quarter: "Q4 2023", percentage: "14.4%" },
            { quarter: "Q1 2024", percentage: "13.4%" },
            { quarter: "Q2 2024", percentage: "13.6%" },
            { quarter: "Q3 2024", percentage: "13.3%" },
            { quarter: "Q4 2024", percentage: "12.6%" }
        ]
    },
    {
        name: "Fentanyl with no cocaine/methamphetamine detected",
        values: [
            { quarter: "Q4 2022", percentage: "3.9%" },
            { quarter: "Q1 2023", percentage: "4.1%" },
            { quarter: "Q2 2023", percentage: "3.9%" },
            { quarter: "Q3 2023", percentage: "4.0%" },
            { quarter: "Q4 2023", percentage: "3.5%" },
            { quarter: "Q1 2024", percentage: "3.0%" },
            { quarter: "Q2 2024", percentage: "2.4%" },
            { quarter: "Q3 2024", percentage: "2.6%" },
            { quarter: "Q4 2024", percentage: "2.1%" }
        ]
    },
    {
        name: "Fentanyl with either cocaine/methamphetamine detected",
        values: [
            { quarter: "Q4 2022", percentage: "8.2%" },
            { quarter: "Q1 2023", percentage: "8.9%" },
            { quarter: "Q2 2023", percentage: "9.5%" },
            { quarter: "Q3 2023", percentage: "10.4%" },
            { quarter: "Q4 2023", percentage: "10.4%" },
            { quarter: "Q1 2024", percentage: "9.8%" },
            { quarter: "Q2 2024", percentage: "11.4%" },
            { quarter: "Q3 2024", percentage: "11.4%" },
            { quarter: "Q4 2024", percentage: "11.3%" }
        ]
    }
];

// 6-month aggregated data for the same drugs
export const sampleData2_6Months = [
    {
        name: "Fentanyl",
        values: [
            { period: "H2 2022", percentage: "12.9%" },
            { period: "H1 2023", percentage: "13.9%" },
            { period: "H2 2023", percentage: "14.4%" },
            { period: "H1 2024", percentage: "13.5%" },
            { period: "H2 2024", percentage: "12.9%" }
        ]
    },
    {
        name: "Fentanyl with no cocaine/methamphetamine detected",
        values: [
            { period: "H2 2022", percentage: "3.9%" },
            { period: "H1 2023", percentage: "4.0%" },
            { period: "H2 2023", percentage: "3.8%" },
            { period: "H1 2024", percentage: "2.7%" },
            { period: "H2 2024", percentage: "2.4%" }
        ]
    },
    {
        name: "Fentanyl with either cocaine/methamphetamine detected",
        values: [
            { period: "H2 2022", percentage: "8.2%" },
            { period: "H1 2023", percentage: "9.2%" },
            { period: "H2 2023", percentage: "10.4%" },
            { period: "H1 2024", percentage: "10.6%" },
            { period: "H2 2024", percentage: "11.4%" }
        ]
    }
];

export default sampleData2;
