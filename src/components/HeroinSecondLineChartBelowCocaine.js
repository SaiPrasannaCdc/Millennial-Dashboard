import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

const heroinSecondChartData = [
  // National
  { region: 'National', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 49.4, ciLower: 47.8, ciUpper: 51.0 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 49.2, ciLower: 47.6, ciUpper: 50.8 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 49.7, ciLower: 48.1, ciUpper: 51.3 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 50.1, ciLower: 48.5, ciUpper: 51.7 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 49.7, ciLower: 48.1, ciUpper: 51.3 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 48.8, ciLower: 47.2, ciUpper: 50.4 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 48.8, ciLower: 47.2, ciUpper: 50.4 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 54.2, ciLower: 52.6, ciUpper: 55.8 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 54.2, ciLower: 52.6, ciUpper: 55.8 },

  { region: 'National', drug: 'Heroin', quarter: 'Q4 2022', percentage: 8.2, ciLower: 7.3, ciUpper: 9.1 },
  { region: 'National', drug: 'Heroin', quarter: 'Q1 2023', percentage: 8.7, ciLower: 7.8, ciUpper: 9.6 },
  { region: 'National', drug: 'Heroin', quarter: 'Q2 2023', percentage: 8.4, ciLower: 7.5, ciUpper: 9.3 },
  { region: 'National', drug: 'Heroin', quarter: 'Q3 2023', percentage: 8.4, ciLower: 7.5, ciUpper: 9.3 },
  { region: 'National', drug: 'Heroin', quarter: 'Q4 2023', percentage: 8.5, ciLower: 7.6, ciUpper: 9.4 },
  { region: 'National', drug: 'Heroin', quarter: 'Q1 2024', percentage: 8.5, ciLower: 7.6, ciUpper: 9.4 },
  { region: 'National', drug: 'Heroin', quarter: 'Q2 2024', percentage: 8.8, ciLower: 7.9, ciUpper: 9.7 },
  { region: 'National', drug: 'Heroin', quarter: 'Q3 2024', percentage: 9.0, ciLower: 8.1, ciUpper: 9.9 },
  { region: 'National', drug: 'Heroin', quarter: 'Q4 2024', percentage: 8.7, ciLower: 7.8, ciUpper: 9.6 },

  { region: 'National', drug: 'Opioids', quarter: 'Q4 2022', percentage: 19.7, ciLower: 18.5, ciUpper: 20.9 },
  { region: 'National', drug: 'Opioids', quarter: 'Q1 2023', percentage: 20.2, ciLower: 19.0, ciUpper: 21.4 },
  { region: 'National', drug: 'Opioids', quarter: 'Q2 2023', percentage: 19.7, ciLower: 18.5, ciUpper: 20.9 },
  { region: 'National', drug: 'Opioids', quarter: 'Q3 2023', percentage: 19.7, ciLower: 18.5, ciUpper: 20.9 },
  { region: 'National', drug: 'Opioids', quarter: 'Q4 2023', percentage: 19.9, ciLower: 18.7, ciUpper: 21.1 },
  { region: 'National', drug: 'Opioids', quarter: 'Q1 2024', percentage: 19.9, ciLower: 18.7, ciUpper: 21.1 },
  { region: 'National', drug: 'Opioids', quarter: 'Q2 2024', percentage: 20.5, ciLower: 19.3, ciUpper: 21.7 },
  { region: 'National', drug: 'Opioids', quarter: 'Q3 2024', percentage: 21.1, ciLower: 19.9, ciUpper: 22.3 },
  { region: 'National', drug: 'Opioids', quarter: 'Q4 2024', percentage: 20.7, ciLower: 19.5, ciUpper: 21.9 },

  { region: 'National', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 27.2, ciLower: 25.9, ciUpper: 28.5 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 24.7, ciLower: 23.4, ciUpper: 26.0 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 23.1, ciLower: 21.8, ciUpper: 24.4 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 23.1, ciLower: 21.8, ciUpper: 24.4 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 22.3, ciLower: 21.0, ciUpper: 23.6 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 23.5, ciLower: 22.2, ciUpper: 24.8 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 28.2, ciLower: 26.9, ciUpper: 29.5 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 30.1, ciLower: 28.8, ciUpper: 31.4 },
  { region: 'National', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 28.9, ciLower: 27.6, ciUpper: 30.2 },

  // WEST
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 44.9, ciLower: 41.8, ciUpper: 48.0 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 44.5, ciLower: 41.4, ciUpper: 47.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 45.7, ciLower: 42.6, ciUpper: 48.8 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 43.5, ciLower: 40.4, ciUpper: 46.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 42.5, ciLower: 39.4, ciUpper: 45.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 43.5, ciLower: 40.4, ciUpper: 46.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 43.0, ciLower: 39.9, ciUpper: 46.1 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 48.0, ciLower: 44.9, ciUpper: 51.1 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 48.0, ciLower: 44.9, ciUpper: 51.1 },

  { region: 'WEST', drug: 'Heroin', quarter: 'Q4 2022', percentage: 7.2, ciLower: 5.7, ciUpper: 8.7 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q1 2023', percentage: 8.2, ciLower: 6.7, ciUpper: 9.7 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q2 2023', percentage: 7.6, ciLower: 6.1, ciUpper: 9.1 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q3 2023', percentage: 8.7, ciLower: 7.2, ciUpper: 10.2 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q4 2023', percentage: 8.2, ciLower: 6.7, ciUpper: 9.7 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q1 2024', percentage: 8.2, ciLower: 6.7, ciUpper: 9.7 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q2 2024', percentage: 8.7, ciLower: 7.2, ciUpper: 10.2 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q3 2024', percentage: 9.7, ciLower: 8.2, ciUpper: 11.2 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q4 2024', percentage: 9.2, ciLower: 7.7, ciUpper: 10.7 },

  { region: 'WEST', drug: 'Opioids', quarter: 'Q4 2022', percentage: 18.5, ciLower: 16.3, ciUpper: 20.7 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q1 2023', percentage: 19.1, ciLower: 16.9, ciUpper: 21.3 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q2 2023', percentage: 18.5, ciLower: 16.3, ciUpper: 20.7 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q3 2023', percentage: 18.5, ciLower: 16.3, ciUpper: 20.7 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q4 2023', percentage: 18.7, ciLower: 16.5, ciUpper: 20.9 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q1 2024', percentage: 18.7, ciLower: 16.5, ciUpper: 20.9 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q2 2024', percentage: 19.3, ciLower: 17.1, ciUpper: 21.5 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q3 2024', percentage: 20.3, ciLower: 18.1, ciUpper: 22.5 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q4 2024', percentage: 19.8, ciLower: 17.6, ciUpper: 22.0 },

  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 38.7, ciLower: 36.1, ciUpper: 41.3 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 35.1, ciLower: 32.5, ciUpper: 37.7 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 33.1, ciLower: 30.5, ciUpper: 35.7 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 33.1, ciLower: 30.5, ciUpper: 35.7 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 32.0, ciLower: 29.4, ciUpper: 34.6 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 33.7, ciLower: 31.1, ciUpper: 36.3 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 40.5, ciLower: 37.9, ciUpper: 43.1 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 43.2, ciLower: 40.6, ciUpper: 45.8 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 41.5, ciLower: 38.9, ciUpper: 44.1 },

  // MIDWEST
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 48.8, ciLower: 46.2, ciUpper: 51.3 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 49.8, ciLower: 47.4, ciUpper: 52.2 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 49.9, ciLower: 47.5, ciUpper: 52.4 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 49.3, ciLower: 46.8, ciUpper: 51.7 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 47.1, ciLower: 44.7, ciUpper: 49.6 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 44.1, ciLower: 42.1, ciUpper: 46.2 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 41.1, ciLower: 39.1, ciUpper: 43.1 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 39.1, ciLower: 37.1, ciUpper: 41.1 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 37.1, ciLower: 35.1, ciUpper: 39.1 },

  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q4 2022', percentage: 15.4, ciLower: 13.1, ciUpper: 17.7 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q1 2023', percentage: 17.5, ciLower: 15.7, ciUpper: 19.2 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q2 2023', percentage: 21.0, ciLower: 19.2, ciUpper: 22.8 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q3 2023', percentage: 18.6, ciLower: 17.0, ciUpper: 20.2 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q4 2023', percentage: 20.1, ciLower: 18.5, ciUpper: 21.8 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q1 2024', percentage: 21.8, ciLower: 20.1, ciUpper: 23.4 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q2 2024', percentage: 21.8, ciLower: 20.1, ciUpper: 23.4 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q3 2024', percentage: 21.8, ciLower: 20.1, ciUpper: 23.4 },
  { region: 'MIDWEST', drug: 'Heroin', quarter: 'Q4 2024', percentage: 21.8, ciLower: 20.1, ciUpper: 23.4 },

  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q4 2022', percentage: 50.1, ciLower: 47.7, ciUpper: 52.5 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q1 2023', percentage: 52.0, ciLower: 49.7, ciUpper: 54.3 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q2 2023', percentage: 55.6, ciLower: 53.3, ciUpper: 57.9 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q3 2023', percentage: 52.6, ciLower: 50.3, ciUpper: 54.8 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q4 2023', percentage: 50.6, ciLower: 48.4, ciUpper: 52.8 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q1 2024', percentage: 48.3, ciLower: 46.1, ciUpper: 50.6 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q2 2024', percentage: 45.3, ciLower: 43.1, ciUpper: 47.6 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q3 2024', percentage: 41.8, ciLower: 39.7, ciUpper: 44.0 },
  { region: 'MIDWEST', drug: 'Opioids', quarter: 'Q4 2024', percentage: 39.8, ciLower: 37.8, ciUpper: 42.0 },

  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 27.0, ciLower: 24.3, ciUpper: 29.5 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 29.5, ciLower: 27.1, ciUpper: 32.0 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 25.8, ciLower: 23.3, ciUpper: 27.9 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 27.1, ciLower: 25.0, ciUpper: 28.8 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 26.9, ciLower: 25.1, ciUpper: 28.8 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 26.1, ciLower: 24.5, ciUpper: 28.8 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 26.2, ciLower: 24.4, ciUpper: 28.0 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 27.4, ciLower: 25.5, ciUpper: 29.2 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 27.4, ciLower: 25.5, ciUpper: 29.2 },

  // SOUTH
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 51.9, ciLower: 48.9, ciUpper: 54.9 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 53.3, ciLower: 50.5, ciUpper: 56.1 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 52.2, ciLower: 49.5, ciUpper: 54.9 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 51.6, ciLower: 48.9, ciUpper: 54.3 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 48.8, ciLower: 46.0, ciUpper: 51.5 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 44.1, ciLower: 41.5, ciUpper: 46.7 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 40.3, ciLower: 37.8, ciUpper: 42.8 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 40.3, ciLower: 37.8, ciUpper: 42.8 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 40.3, ciLower: 37.8, ciUpper: 42.8 },

  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q4 2022', percentage: 21.0, ciLower: 18.8, ciUpper: 23.2 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q1 2023', percentage: 18.4, ciLower: 16.3, ciUpper: 20.6 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q2 2023', percentage: 17.7, ciLower: 15.7, ciUpper: 19.8 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q3 2023', percentage: 20.4, ciLower: 18.3, ciUpper: 22.5 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q4 2023', percentage: 21.9, ciLower: 19.8, ciUpper: 24.0 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q1 2024', percentage: 20.3, ciLower: 18.3, ciUpper: 22.4 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q2 2024', percentage: 20.3, ciLower: 18.3, ciUpper: 22.4 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q3 2024', percentage: 20.3, ciLower: 18.3, ciUpper: 22.4 },
  { region: 'SOUTH', drug: 'Heroin', quarter: 'Q4 2024', percentage: 20.3, ciLower: 18.3, ciUpper: 22.4 },

  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q4 2022', percentage: 52.6, ciLower: 49.7, ciUpper: 55.4 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q1 2023', percentage: 54.2, ciLower: 51.4, ciUpper: 56.9 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q2 2023', percentage: 52.6, ciLower: 50.0, ciUpper: 55.3 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q3 2023', percentage: 50.0, ciLower: 47.5, ciUpper: 52.4 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q4 2023', percentage: 49.3, ciLower: 46.5, ciUpper: 52.0 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q1 2024', percentage: 45.4, ciLower: 42.8, ciUpper: 48.1 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q2 2024', percentage: 43.1, ciLower: 40.6, ciUpper: 45.7 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q3 2024', percentage: 41.1, ciLower: 38.6, ciUpper: 43.6 },
  { region: 'SOUTH', drug: 'Opioids', quarter: 'Q4 2024', percentage: 41.1, ciLower: 38.6, ciUpper: 43.6 },

  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 20.0, ciLower: 17.4, ciUpper: 22.1 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 20.0, ciLower: 17.8, ciUpper: 22.2 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 19.8, ciLower: 17.6, ciUpper: 22.1 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 19.8, ciLower: 17.6, ciUpper: 22.1 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 19.8, ciLower: 17.6, ciUpper: 22.1 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 19.8, ciLower: 17.6, ciUpper: 22.1 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 25.9, ciLower: 23.7, ciUpper: 28.4 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 24.3, ciLower: 22.1, ciUpper: 26.4 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 24.3, ciLower: 22.1, ciUpper: 26.4 },
];
const lineColors = {
  'Fentanyl': '#e74c3c',
  'Heroin': '#8e44ad',
  'Opioids': '#2980b9',
  'Methamphetamine': '#27ae60',
};

const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

function alignDataToQuarters(data, quarters) {
  const drugs = [...new Set(data.map(d => d.drug))];
  return drugs.map(drug => ({
    label: drug,
    color: lineColors[drug],
    data: quarters.map(q => {
      const found = data.find(d => d.drug === drug && d.quarter === q);
      return found ? found : { quarter: q, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

const regionKeyFindings = {
  WEST: "Key finding: Fentanyl positivity decreased 1% from 20.1% in Q3 2024 to 19.1% in Q4 2024. This may indicate decreased exposure to fentanyl among people with substance use disorders.",
  MIDWEST: "Key finding: Fentanyl positivity increased 2.1% from 86.6% in Q2 2024 to 88.7% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders.",
  National: "Key finding: Fentanyl positivity increased 7.8% from 68.5% in Q2 2024 to 76.3% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders.",
  SOUTH: "Key finding: Fentanyl positivity increased 2.4% from 70.7% in Q2 2024 to 73.1% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders."
};

const HeroinSecondLineChartBelowCocaine = ({ region = 'WEST', width, height }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));
  const [showPercentChange, setShowPercentChange] = useState(false);
  const allLineKeys = Object.keys(lineColors);

  const percentChgTooltip = `
    <div style="
      text-align: center;
      padding: 16px 12px;
      color: #222;
      font-size: 15px;
      max-width: 260px;
      min-width: 220px;
      margin: 0 auto;
      border-radius: 14px;
      background: #ededed;
      box-shadow: 0 2px 12px #bbb3;
    ">
      <div style="margin-top: 8px;">
        When <b>% Chg</b> is on, hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.
      </div>
    </div>
  `;

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return datasets
      .filter(ds => selectedLines.includes(ds.label))
      .map((ds, dsIdx) => {
        const lineData = ds.data;
        const n = lineData.length;
        return lineData.map((d, i) => {
          if (i < n - 5 || d.percentage === null) return null;
          const prevPeriod = i - 1 >= 0 ? lineData[i - 1].percentage : null;
          const prevYear = i - 4 >= 0 ? lineData[i - 4].percentage : null;
          const curr = d.percentage;
          const periodChange = prevPeriod !== null && prevPeriod !== 0 ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
          const yearlyChange = prevYear !== null && prevYear !== 0 ? ((curr - prevYear) / prevYear) * 100 : null;
          const x = xScale(d.quarter) + xScale.bandwidth() / 2;
          const y = yScale(curr);
          const showYearly = i >= 4;
          const getArrow = (change) => {
            if (change === null) return '';
            const color = change > 0 ? '#6a0dad' : '#2077b4';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          return (
            <g key={`indicator-second-${ds.label}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={ds.color}
                data-tip={`<div style='text-align: left;'>
                  ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    ${getArrow(yearlyChange)}
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    ${getArrow(periodChange)}
                    <div>
                      <strong>Quarterly Change</strong><br/>
                      ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                    </div>
                  </div>
                </div>`}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        });
      });
  };

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const regionData = heroinSecondChartData.filter(d => d.region === region);
  const datasets = alignDataToQuarters(regionData, allQuarters);

  const xDomain = allQuarters;
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(...datasets.flatMap(ds => ds.data.map(d => d.percentage || 0)), 100);
  const yScale = scaleLinear({
    domain: [0, yMax > 100 ? yMax : 100],
    range: [adjustedHeight, 0],
    nice: true,
  });

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedLines, region]);

  const keyFinding = regionKeyFindings[region];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            % of people with substance use disorder who test positive for fentanyl, cocaine, methamphetamine, or heroin+stimulants: {region} Q4 2022 - Q4 2024
          </h3>
        </div>
      </div>
      {keyFinding && (
        <div style={{
          background: '#4d194d',
          color: '#fff',
          borderRadius: '24px',
          padding: '14px 24px',
          margin: '18px auto 0 auto',
          fontWeight: 700,
          fontSize: '15px',
          maxWidth: '1200px',
          boxShadow: 'none',
          border: 'none',
          lineHeight: 1.2,
          display: 'block',
          fontFamily: 'Barlow, Arial, sans-serif',
          letterSpacing: '0.01em',
        }}>
          {keyFinding}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 12px 0', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginRight: 12 }}>
          Make a selection to change the line graph
        </div>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name="selectAll"
            checked={selectedLines.length === allLineKeys.length}
            onChange={() => setSelectedLines(allLineKeys)}
            style={{ marginRight: 6 }}
          />
          Select All
        </label>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name="selectAll"
            checked={selectedLines.length === 0}
            onChange={() => setSelectedLines([])}
            style={{ marginRight: 6 }}
          />
          Clear All
        </label>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 24 }}>
          <div className="toggle-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              className="toggle-switch"
              data-tip={percentChgTooltip}
              data-for="percentChangeTooltip"
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={showPercentChange}
                onChange={() => setShowPercentChange(!showPercentChange)}
              />
              <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? '#002b36' : '#ccc' }}></span>
            </label>
            <span
              className="toggle-label"
              style={{ color: showPercentChange ? '#fff' : '#333', cursor: 'pointer' }}
              data-tip={percentChgTooltip}
              data-for="percentChangeTooltip"
            >
              % Chg {showPercentChange ? 'On' : 'Off'}
            </span>
            <ReactTooltip id="percentChangeTooltip" place="top" effect="solid" backgroundColor="#ededed" border={true} borderColor="#bbb" className="simple-tooltip" html={true} textColor="#222" />
          </div>
          <div className="toggle-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
              />
              <span className="slider label-toggle" style={{ backgroundColor: showLabels ? '#002b36' : '#ccc' }}></span>
            </label>
            <span className="toggle-label" style={{ color: showLabels ? '#fff' : '#333' }}>
              Labels {showLabels ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
        {allLineKeys.map(drug => (
          <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedLines.includes(drug)}
              onChange={() => {
                if (selectedLines.includes(drug)) {
                  setSelectedLines(selectedLines.filter(line => line !== drug));
                } else {
                  setSelectedLines([...selectedLines, drug]);
                }
              }}
              style={{ display: 'none' }}
            />
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: `2px solid #888`, background: '#fff', marginRight: 2, position: 'relative' }}>
              {selectedLines.includes(drug) && (
                <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: lineColors[drug], position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              )}
            </span>
            <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
          </label>
        ))}
      </div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <text
            x={-adjustedHeight / 2}
            y={-margin.left + 15}
            transform={`rotate(-90)`}
            textAnchor="middle"
            fontSize={15}
            fill="#222"
            fontFamily="'Segoe UI', 'Arial', 'sans-serif'"
            fontWeight="600"
            style={{ letterSpacing: '0.01em' }}
          >
            % of people with substance use disorder
            <tspan x={-adjustedHeight / 2} dy={15}>
              with drug(s) detected
            </tspan>
          </text>
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'end', dx: -6, dy: 3, fill: '#222' })} />
          <AxisBottom top={adjustedHeight} scale={xScale} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'middle', dy: 10 })} />
          {datasets.filter(ds => selectedLines.includes(ds.label)).map((ds, idx) => (
            <React.Fragment key={ds.label}>
              <LinePath
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={ds.color}
                strokeWidth={3}
                curve={null}
              />
              {ds.data.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.data.length;
                const showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.label === 'Cocaine') labelYOffset = -8;
                if (ds.label === 'Heroin and Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.label}-pt-${i}`}>
                    <Circle
                      cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={ds.color}
                      data-tip={
                        `<div style='text-align: left;'><strong>${d.quarter}</strong><br/>${ds.label} positivity: ${d.percentage}%<br/>CI: ${d.ciLower}% - ${d.ciUpper}%</div>`
                      }
                    />
                    {showLabel && (
                      <text
                        x={xScale(d.quarter) + xScale.bandwidth() / 2}
                        y={yScale(d.percentage) + labelYOffset}
                        fontSize={12}
                        textAnchor="middle"
                        fill="#333"
                      >
                        {d.percentage}%
                      </text>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <ReactTooltip html={true} />
    </div>
  );
};

export default HeroinSecondLineChartBelowCocaine;
