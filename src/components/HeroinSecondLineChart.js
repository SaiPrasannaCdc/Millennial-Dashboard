import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

const heroinSecondChartData = [
  // WEST
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 62.5, ciLower: 59.7, ciUpper: 65.3 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 61.9, ciLower: 59.4, ciUpper: 64.3 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 63.5, ciLower: 60.6, ciUpper: 66.4 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 60.4, ciLower: 57.3, ciUpper: 63.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 58.8, ciLower: 55.5, ciUpper: 62 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 60.2, ciLower: 57, ciUpper: 63.3 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 59.4, ciLower: 56.3, ciUpper: 62.5 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 75.7, ciLower: 73.8, ciUpper: 77.8 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 75.7, ciLower: 73.8, ciUpper: 77.8 },
  // WEST Cocaine
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 12.7, ciLower: 10.8, ciUpper: 14.7 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 14.4, ciLower: 12.3, ciUpper: 16.6 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 13.7, ciLower: 11.6, ciUpper: 15.7 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 16.8, ciLower: 14.4, ciUpper: 19.3 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 17.3, ciLower: 14.8, ciUpper: 19.9 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 18.9, ciLower: 16.1, ciUpper: 21.5 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 18.6, ciLower: 16.1, ciUpper: 21.1 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 22.9, ciLower: 20.6, ciUpper: 25 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 22.6, ciLower: 20.2, ciUpper: 24.5 },
  // WEST Methamphetamine
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 74.5, ciLower: 72, ciUpper: 77 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 70.7, ciLower: 67.3, ciUpper: 74.1 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 73.6, ciLower: 71, ciUpper: 76.3 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 71.2, ciLower: 68.3, ciUpper: 74.2 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 68.1, ciLower: 65.1, ciUpper: 71.2 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 67.2, ciLower: 64.2, ciUpper: 70.3 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 69.6, ciLower: 66.6, ciUpper: 72.5 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 79.3, ciLower: 77.3, ciUpper: 81.4 },
  { region: 'WEST', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 81.6, ciLower: 79.8, ciUpper: 83.4 },
  // WEST Heroin and Stimulants
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q4 2022', percentage: 56.2, ciLower: 53.3, ciUpper: 59 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q1 2023', percentage: 54.9, ciLower: 51.9, ciUpper: 57.9 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q2 2023', percentage: 57.4, ciLower: 54.5, ciUpper: 60.2 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q3 2023', percentage: 60, ciLower: 56.8, ciUpper: 63.2 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q4 2023', percentage: 55.7, ciLower: 52.5, ciUpper: 58.9 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q1 2024', percentage: 55.2, ciLower: 52.2, ciUpper: 58.1 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q2 2024', percentage: 70, ciLower: 67.7, ciUpper: 72.3 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q3 2024', percentage: 70, ciLower: 67.7, ciUpper: 72.3 },
  { region: 'WEST', drug: 'Heroin and Stimulants', quarter: 'Q4 2024', percentage: 71.8, ciLower: 69.7, ciUpper: 73.9 },
  // MIDWEST
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 84, ciLower: 81, ciUpper: 87 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 85.1, ciLower: 82.4, ciUpper: 87.9 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 82.2, ciLower: 79.6, ciUpper: 84.8 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 82.8, ciLower: 80.3, ciUpper: 85.3 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 86.8, ciLower: 84.6, ciUpper: 89 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 86.6, ciLower: 84.3, ciUpper: 88.9 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 86.6, ciLower: 84.3, ciUpper: 88.9 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 88.7, ciLower: 86.8, ciUpper: 90.7 },
  { region: 'MIDWEST', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 88.7, ciLower: 86.8, ciUpper: 90.7 },
  // MIDWEST Cocaine
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 36.9, ciLower: 32.9, ciUpper: 40.9 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 40.9, ciLower: 37.1, ciUpper: 44.7 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 38.7, ciLower: 35.4, ciUpper: 42 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 43.5, ciLower: 40.3, ciUpper: 46.7 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 45.2, ciLower: 42.2, ciUpper: 48.3 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 46.2, ciLower: 43, ciUpper: 49.5 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 48, ciLower: 44.7, ciUpper: 51.3 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 49.8, ciLower: 45.6, ciUpper: 54.3 },
  { region: 'MIDWEST', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 49.8, ciLower: 45.6, ciUpper: 54.3 },
  // MIDWEST Methamphetamine
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 41.8, ciLower: 37.8, ciUpper: 45.9 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 42.2, ciLower: 38.4, ciUpper: 46.1 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 42.4, ciLower: 39, ciUpper: 45.8 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 37.8, ciLower: 34.7, ciUpper: 40.9 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 33, ciLower: 29.9, ciUpper: 36.1 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 39.9, ciLower: 36, ciUpper: 42.4 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 40.8, ciLower: 37.5, ciUpper: 44.1 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 41.7, ciLower: 38.4, ciUpper: 45 },
  { region: 'MIDWEST', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 40.4, ciLower: 37.3, ciUpper: 43.6 },
  // MIDWEST Heroin and Stimulants
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q4 2022', percentage: 61, ciLower: 57, ciUpper: 64.7 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q1 2023', percentage: 64.7, ciLower: 61, ciUpper: 68.3 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q2 2023', percentage: 63.5, ciLower: 60.1, ciUpper: 66.8 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q3 2023', percentage: 65.9, ciLower: 62.4, ciUpper: 69.4 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q4 2023', percentage: 65.9, ciLower: 62.4, ciUpper: 69.4 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q1 2024', percentage: 69.2, ciLower: 66.1, ciUpper: 72.2 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q2 2024', percentage: 70.8, ciLower: 67.7, ciUpper: 73.8 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q3 2024', percentage: 68.7, ciLower: 65.7, ciUpper: 71.7 },
  { region: 'MIDWEST', drug: 'Heroin and Stimulants', quarter: 'Q4 2024', percentage: 68.7, ciLower: 65.7, ciUpper: 71.7 },
  // NATIONAL
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 69.3, ciLower: 67.5, ciUpper: 71.1 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 69.0, ciLower: 67.2, ciUpper: 70.8 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 69.7, ciLower: 67.8, ciUpper: 71.6 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 70.3, ciLower: 68.6, ciUpper: 72.1 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 69.7, ciLower: 67.9, ciUpper: 71.6 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 68.5, ciLower: 66.7, ciUpper: 70.3 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 68.5, ciLower: 66.7, ciUpper: 70.2 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 76.3, ciLower: 74.9, ciUpper: 77.7 },
  { region: 'NATIONAL', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 76.3, ciLower: 74.9, ciUpper: 77.7 },
  // NATIONAL Cocaine
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 28.7, ciLower: 26.9, ciUpper: 30.5 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 32.7, ciLower: 30.8, ciUpper: 34.6 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 31.2, ciLower: 29.4, ciUpper: 33.0 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 31.2, ciLower: 29.4, ciUpper: 33.0 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 32.1, ciLower: 30.4, ciUpper: 33.9 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 32.2, ciLower: 30.4, ciUpper: 34.0 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 33.6, ciLower: 31.8, ciUpper: 35.4 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 34.4, ciLower: 32.8, ciUpper: 36.1 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 33.4, ciLower: 31.8, ciUpper: 35.0 },
  // NATIONAL Methamphetamine
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 52.5, ciLower: 50.5, ciUpper: 54.5 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 47.3, ciLower: 45.3, ciUpper: 49.2 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 44.3, ciLower: 42.4, ciUpper: 46.2 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 44.3, ciLower: 42.4, ciUpper: 46.2 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 42.8, ciLower: 40.9, ciUpper: 44.6 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 45.1, ciLower: 43.3, ciUpper: 46.9 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 54.0, ciLower: 52.3, ciUpper: 55.7 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 57.7, ciLower: 56.1, ciUpper: 59.3 },
  { region: 'NATIONAL', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 55.4, ciLower: 53.6, ciUpper: 57.3 },
  // NATIONAL Heroin and Stimulants
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q4 2022', percentage: 54.4, ciLower: 52.4, ciUpper: 56.3 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q1 2023', percentage: 54.4, ciLower: 52.4, ciUpper: 56.3 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q2 2023', percentage: 55.5, ciLower: 53.6, ciUpper: 57.5 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q3 2023', percentage: 55.5, ciLower: 53.6, ciUpper: 57.5 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q4 2023', percentage: 53.7, ciLower: 51.7, ciUpper: 55.7 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q1 2024', percentage: 54.0, ciLower: 52.1, ciUpper: 55.9 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q2 2024', percentage: 56.1, ciLower: 54.1, ciUpper: 58.1 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q3 2024', percentage: 63.5, ciLower: 61.3, ciUpper: 65.2 },
  { region: 'NATIONAL', drug: 'Heroin and Stimulants', quarter: 'Q4 2024', percentage: 65.4, ciLower: 63.8, ciUpper: 66.9 },
  // SOUTH Fentanyl
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 75.2, ciLower: 71.9, ciUpper: 78.4 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 74.3, ciLower: 71.1, ciUpper: 77.6 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 76.2, ciLower: 73, ciUpper: 79.4 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 68.8, ciLower: 65, ciUpper: 72.5 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 72, ciLower: 68.4, ciUpper: 75.6 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 68.9, ciLower: 65.3, ciUpper: 72.6 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 70.7, ciLower: 67.3, ciUpper: 74 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 72.7, ciLower: 69.5, ciUpper: 75.8 },
  { region: 'SOUTH', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 73.1, ciLower: 70.1, ciUpper: 76.0 },
  // SOUTH Cocaine
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 37.9, ciLower: 34.2, ciUpper: 41.6 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 41.7, ciLower: 38.1, ciUpper: 45.3 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 41.7, ciLower: 39.7, ciUpper: 45.4 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 38.2, ciLower: 34.3, ciUpper: 42.1 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 38.3, ciLower: 34.4, ciUpper: 42.2 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 37.7, ciLower: 33.9, ciUpper: 41.4 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 41.3, ciLower: 38.3, ciUpper: 45.7 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 44, ciLower: 40.5, ciUpper: 47.5 },
  { region: 'SOUTH', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 44.5, ciLower: 40.8, ciUpper: 48.2 },
  // SOUTH Methamphetamine
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q4 2022', percentage: 30, ciLower: 26.5, ciUpper: 33.5 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q1 2023', percentage: 24.8, ciLower: 21.6, ciUpper: 28 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q2 2023', percentage: 25.4, ciLower: 22.1, ciUpper: 28.7 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q3 2023', percentage: 25.3, ciLower: 21.8, ciUpper: 28.8 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q4 2023', percentage: 28.7, ciLower: 25, ciUpper: 32.3 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q1 2024', percentage: 23.2, ciLower: 20, ciUpper: 26.5 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q2 2024', percentage: 27.9, ciLower: 24.6, ciUpper: 31.1 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q3 2024', percentage: 29.7, ciLower: 26.5, ciUpper: 32.9 },
  { region: 'SOUTH', drug: 'Methamphetamine', quarter: 'Q4 2024', percentage: 29.1, ciLower: 25.7, ciUpper: 32.5 },
  // SOUTH Heroin and Stimulants
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q4 2022', percentage: 53.9, ciLower: 50.1, ciUpper: 57.7 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q1 2023', percentage: 52.5, ciLower: 48.8, ciUpper: 56.2 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q2 2023', percentage: 53.9, ciLower: 50.2, ciUpper: 57.7 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q3 2023', percentage: 49.2, ciLower: 45.1, ciUpper: 53.2 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q4 2023', percentage: 50.9, ciLower: 46.9, ciUpper: 55 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q1 2024', percentage: 47.3, ciLower: 43.4, ciUpper: 51.1 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q2 2024', percentage: 51.3, ciLower: 47.6, ciUpper: 55 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q3 2024', percentage: 53.7, ciLower: 50.2, ciUpper: 57.3 },
  { region: 'SOUTH', drug: 'Heroin and Stimulants', quarter: 'Q4 2024', percentage: 54.9, ciLower: 51.2, ciUpper: 58.6 },
];
const lineColors = {
  'Fentanyl': '#e74c3c',
  'Cocaine': '#2980b9',
  'Methamphetamine': '#27ae60',
  'Heroin and Stimulants': '#8e44ad',
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
  NATIONAL: "Key finding: Fentanyl positivity increased 7.8% from 68.5% in Q2 2024 to 76.3% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders.",
  SOUTH: "Key finding: Fentanyl positivity increased 2.4% from 70.7% in Q2 2024 to 73.1% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders."
};

const HeroinSecondLineChart = ({ region = 'WEST', width = 1100, height = 450 }) => {
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
        {Object.entries(lineColors).map(([drug, color]) => (
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
                <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: color, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
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
                        showPercentChange
                          ? undefined
                          : `<div style='text-align: left;'><strong>${d.quarter}</strong><br/>${ds.label} positivity: ${d.percentage}%<br/>CI: ${d.ciLower}% - ${d.ciUpper}%</div>`
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

export default HeroinSecondLineChart;
