// Test file to verify region mapping and data processing
import { 
  mapRegionToDataKey, 
  mapRegionToUSRegion, 
  processMillenialData 
} from '../shared/chartUtils';

// Test data structure similar to actual data
const testData = {
  "North": {
    "Fentanyl": {
      "Positivity": {
        "Quarterly": [],  // Empty for North region
        "HalfYearly": [
          {
            "USregion": "NORTH",
            "period": "2022 Jul-Dec",
            "drug_name": "Fentanyl",
            "percentage": 11.6,
            "ciLower": 11.0,
            "ciUpper": 12.1
          }
        ]
      }
    }
  },
  "MidWest": {
    "Fentanyl": {
      "Positivity": {
        "Quarterly": [
          {
            "USregion": "MIDWEST",
            "period": "Q4 2022",
            "drug_name": "Fentanyl",
            "percentage": 10.9,
            "ciLower": 10.5,
            "ciUpper": 11.4
          }
        ]
      }
    }
  }
};

// Test the mapping functions
console.log('Testing region mapping:');
console.log('NORTH -> dataKey:', mapRegionToDataKey('NORTH'));  // Should be 'North'
console.log('NORTH -> USRegion:', mapRegionToUSRegion('North')); // Should be 'NORTH'
console.log('MIDWEST -> dataKey:', mapRegionToDataKey('MIDWEST')); // Should be 'MidWest'
console.log('MIDWEST -> USRegion:', mapRegionToUSRegion('MidWest')); // Should be 'MIDWEST'

// Test data processing
console.log('\nTesting data processing:');
console.log('North Fentanyl Quarterly:', processMillenialData(testData, 'NORTH', 'Fentanyl', 'Quarterly'));
console.log('North Fentanyl HalfYearly:', processMillenialData(testData, 'NORTH', 'Fentanyl', 'Half Yearly'));
console.log('MidWest Fentanyl Quarterly:', processMillenialData(testData, 'MIDWEST', 'Fentanyl', 'Quarterly'));

export { testData };
