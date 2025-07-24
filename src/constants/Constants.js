  
export const dataUrl = window.location.origin.includes('localhost') ? '/' : '/overdose-prevention/data-dashboards/sudors-dashboard/';

export const colorScaleLighter = {
    'Male': '#e7d7e7',
    'Female': '#c0d7c8',
    'Race': '#BBA1EA',
    'RaceAccent': '#5C2E79',
    'Month': '#325D7D',
    'Intervention': '#712177',
    'Combination': '#712177',
    'Opioids and stimulants': '#dbe0ea', //rgb(219 224 234)
    'Opioids and no stimulants': '#d6e1e9',  //rgb(214, 225, 233),
    'Stimulants and no opioids': '#d7e5e4', //rgb(215, 229, 228),
    'Neither opioids nor stimulants': '#d4e2df',// rgb(212, 226, 223),
    'All': '#d1dfea', // rgb(209, 223, 234),
    'Any opioids': '#d3d6ea',// rgb(211, 214, 234),
    'Opioid': '#d3d6ea',// rgb(211, 214, 234),
    'Methamphetamine': '#e2dcea',// rgb(226, 220, 234),
    'Heroin': '#e1ecf1',// rgb(225, 236, 241),
    'Prescription opioids': '#dbedef', // rgb(219, 237, 239),
    'Any stimulants': '#e7d7e7',
    'Stimulant': '#e7d7e7',
    'Cocaine': '#e6deed', // rgb(230, 222, 237),
    'Illegally-made fentanyls': '#d8ddea',// rgb(216, 221, 234),
    'Any non-opioid sedatives': '#e4d9dd', // rgb(228, 217, 221),
    'Benzodiazepines': '#ead7dd', //rgb(234, 215, 221)
    'AI/AN, non-Hispanic': '#d1dfea',
    'Asian, non-Hispanic': '#d3d6ea',
    'Black, non-Hispanic': '#e2dcea',
    'Hispanic': '#e1ecf1',
    'Multi-race, non-Hispanic': '#d1dfea',
    'NH/PI, non-Hispanic': '#e4d9dd',
    'White, non-Hispanic': '#d8ddea',
    '15–24': '#d1dfea',
    '65+': '#d3d6ea',
    '25–34': '#e4d9dd',
    '55–64': '#e1ecf1',
    '45–54': '#dbedef',
    '35–44': '#e4d9dd',
    '<15': '#d8ddea'
};

export const colorScaleLighterClasses = {
    'Male': 'anystimulants-lighter',
    'Female': 'female-lighter',
    'Race': '#BBA1EA',
    'RaceAccent': '#5C2E79',
    'Month': '#325D7D',
    'Intervention': '#712177',
    'Combination': '#712177',
    'Opioids and stimulants': 'opioidsandstimulants-lighter', //rgb(219 224 234)
    'Opioids and no stimulants': 'opioidsandnostimulants-lighter',  //rgb(214, 225, 233),
    'Stimulants and no opioids': 'stimulantsandnoopioids-lighter' , //rgb(215, 229, 228),
    'Neither opioids nor stimulants': 'neitheropioidsnorstimulants-lighter',// rgb(212, 226, 223),
    'All': 'all-lighter', // rgb(209, 223, 234),
    'Any opioids': 'anyopioids-lighter',// rgb(211, 214, 234),
    'Opioid': 'opioid-lighter',// rgb(211, 214, 234),
    'Methamphetamine': 'methamphetamine-lighter',// rgb(226, 220, 234),
    'Heroin': 'heroin-lighter',// rgb(225, 236, 241),
    'Prescription opioids': 'prescriptionopioids-lighter', // rgb(219, 237, 239),
    'Any stimulants': 'anystimulants-lighter',
    'Stimulant': 'stimulant-lighter',
    'Cocaine': 'cocaine-ligher', // rgb(230, 222, 237),
    'Illegally-made fentanyls': 'illegally-made-fentanyls-lighter',// rgb(216, 221, 234),
    'Any non-opioid sedatives': 'any-non-opioid-sedatives-lighter', // rgb(228, 217, 221),
    'Benzodiazepines': 'benzodiazepines-lighter', //rgb(234, 215, 221)
    'AI/AN, non-Hispanic': 'all-lighter',
    'Asian, non-Hispanic': 'anyopioids-lighter',
    'Black, non-Hispanic': 'methamphetamine-lighter',
    'Hispanic': 'heroin-lighter',
    'Multi-race, non-Hispanic': 'all-lighter',
    'NH/PI, non-Hispanic': 'any-non-opioid-sedatives-lighter',
    'White, non-Hispanic': 'illegally-made-fentanyls-lighter',
    '15–24': 'all-lighter',
    '65+': 'anyopioids-lighter',
    '25–34': 'anystimulants-lighter',
    '55–64': 'heroin-lighter',
    '45–54': 'prescriptionopioids-lighter',
    '35–44': 'any-non-opioid-sedatives-lighter',
    '<15': 'illegally-made-fentanyls-lighter'
};

export const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

export const allPeriods6M = [
  'Jul-Dec 2022', 'Jan-Jun 2023', 'Jul-Dec 2023', 'Jan-Jun 2024', 'Jul-Dec 2024'
];
















