import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import { UtilityFunctions } from '../utility';

/* const cocaineSixMonthsData = {
  National: [
    { period: 'Jan-Jun 2022', percentage: 6.4, ciLower: 6.2, ciUpper: 6.6 },
    { period: 'Jul-Dec 2022', percentage: 6.6, ciLower: 6.5, ciUpper: 6.8 },
    { period: 'Jan-Jun 2023', percentage: 7.3, ciLower: 7.2, ciUpper: 7.5 },
    { period: 'Jul-Dec 2023', percentage: 7.6, ciLower: 7.4, ciUpper: 7.7 },
    { period: 'Jan-Jun 2024', percentage: 8.3, ciLower: 8.2, ciUpper: 8.5 },
  ],
  "Cocaine with Opioids": [
    { period: 'Jan-Jun 2022', percentage: 3.2, ciLower: 3.1, ciUpper: 3.4 },
    { period: 'Jul-Dec 2022', percentage: 3.4, ciLower: 3.3, ciUpper: 3.5 },
    { period: 'Jan-Jun 2023', percentage: 3.7, ciLower: 3.6, ciUpper: 3.8 },
    { period: 'Jul-Dec 2023', percentage: 3.9, ciLower: 3.8, ciUpper: 4.0 },
    { period: 'Jan-Jun 2024', percentage: 4.1, ciLower: 4.0, ciUpper: 4.2 },
  ],
  "Cocaine without Opioids": [
    { period: 'Jan-Jun 2022', percentage: 3.1, ciLower: 3.0, ciUpper: 3.3 },
    { period: 'Jul-Dec 2022', percentage: 3.2, ciLower: 3.1, ciUpper: 3.3 },
    { period: 'Jan-Jun 2023', percentage: 3.6, ciLower: 3.5, ciUpper: 3.7 },
    { period: 'Jul-Dec 2023', percentage: 3.9, ciLower: 3.8, ciUpper: 4.0 },
    { period: 'Jan-Jun 2024', percentage: 4.4, ciLower: 4.3, ciUpper: 4.5 },
  ],
  West: [
    { period: 'Jul-Dec 2022', percentage: 3.9, ciLower: 3.7, ciUpper: 4.2 },
    { period: 'Jan-Jun 2023', percentage: 4.0, ciLower: 3.8, ciUpper: 4.2 },
    { period: 'Jul-Dec 2023', percentage: 4.5, ciLower: 4.4, ciUpper: 4.7 },
    { period: 'Jan-Jun 2024', percentage: 5.3, ciLower: 5.1, ciUpper: 5.5 },
    { period: 'Jul-Dec 2024', percentage: 6.5, ciLower: 6.3, ciUpper: 6.7 },
  ],
  "West Cocaine with Opioids": [
    { period: 'Jul-Dec 2022', percentage: 2.2, ciLower: 2.0, ciUpper: 2.4 },
    { period: 'Jan-Jun 2023', percentage: 2.2, ciLower: 2.1, ciUpper: 2.3 },
    { period: 'Jul-Dec 2023', percentage: 2.5, ciLower: 2.4, ciUpper: 2.7 },
    { period: 'Jan-Jun 2024', percentage: 3.2, ciLower: 3.0, ciUpper: 3.3 },
    { period: 'Jul-Dec 2024', percentage: 4.0, ciLower: 3.9, ciUpper: 4.2 },
  ],
  "West Cocaine without Opioids": [
    { period: 'Jul-Dec 2022', percentage: 1.7, ciLower: 1.5, ciUpper: 1.8 },
    { period: 'Jan-Jun 2023', percentage: 1.8, ciLower: 1.7, ciUpper: 1.9 },
    { period: 'Jul-Dec 2023', percentage: 2.0, ciLower: 1.9, ciUpper: 2.1 },
    { period: 'Jan-Jun 2024', percentage: 2.1, ciLower: 2.0, ciUpper: 2.2 },
    { period: 'Jul-Dec 2024', percentage: 2.4, ciLower: 2.3, ciUpper: 2.6 },
  ],
  Midwest: [
    { period: 'Jul-Dec 2022', percentage: 7.8, ciLower: 7.4, ciUpper: 8.1 },
    { period: 'Jan-Jun 2023', percentage: 7.9, ciLower: 7.7, ciUpper: 8.2 },
    { period: 'Jul-Dec 2023', percentage: 9.4, ciLower: 8.9, ciUpper: 9.8 },
    { period: 'Jan-Jun 2024', percentage: 9.4, ciLower: 9.1, ciUpper: 9.6 },
    { period: 'Jul-Dec 2024', percentage: 9.5, ciLower: 9.2, ciUpper: 9.7 },
  ],
  "Midwest Cocaine with Opioids": [
    { period: 'Jul-Dec 2022', percentage: 4.0, ciLower: 3.8, ciUpper: 4.2 },
    { period: 'Jan-Jun 2023', percentage: 4.7, ciLower: 4.4, ciUpper: 4.9 },
    { period: 'Jul-Dec 2023', percentage: 4.3, ciLower: 4.1, ciUpper: 4.5 },
    { period: 'Jan-Jun 2024', percentage: 3.9, ciLower: 3.7, ciUpper: 4.2 },
    { period: 'Jul-Dec 2024', percentage: 4.3, ciLower: 4.1, ciUpper: 4.5 },
  ],
  "Midwest Cocaine without Opioids": [
    { period: 'Jul-Dec 2022', percentage: 3.9, ciLower: 3.7, ciUpper: 4.2 },
    { period: 'Jan-Jun 2023', percentage: 4.1, ciLower: 3.9, ciUpper: 4.2 },
    { period: 'Jul-Dec 2023', percentage: 5.4, ciLower: 4.6, ciUpper: 5.8 },
    { period: 'Jan-Jun 2024', percentage: 5.3, ciLower: 5.0, ciUpper: 5.3 },
    { period: 'Jul-Dec 2024', percentage: 5.6, ciLower: 5.4, ciUpper: 5.8 },
  ],
  South: [
    { period: 'Jul-Dec 2022', percentage: 8.7, ciLower: 8.2, ciUpper: 9.2 },
    { period: 'Jan-Jun 2023', percentage: 9.5, ciLower: 9.1, ciUpper: 9.8 },
    { period: 'Jul-Dec 2023', percentage: 9.4, ciLower: 9.0, ciUpper: 9.8 },
    { period: 'Jan-Jun 2024', percentage: 8.8, ciLower: 8.5, ciUpper: 9.0 },
    { period: 'Jul-Dec 2024', percentage: 10.3, ciLower: 9.9, ciUpper: 10.6 },
  ],
  "South Cocaine with Opioids": [
    { period: 'Jul-Dec 2022', percentage: 4.6, ciLower: 4.3, ciUpper: 4.9 },
    { period: 'Jan-Jun 2023', percentage: 5.1, ciLower: 4.8, ciUpper: 5.3 },
    { period: 'Jul-Dec 2023', percentage: 4.3, ciLower: 4.1, ciUpper: 4.5 },
    { period: 'Jan-Jun 2024', percentage: 4.1, ciLower: 4.0, ciUpper: 4.2 },
    { period: 'Jul-Dec 2024', percentage: 4.7, ciLower: 4.5, ciUpper: 4.9 },
  ],
  "South Cocaine without Opioids": [
    { period: 'Jul-Dec 2022', percentage: 4.1, ciLower: 3.9, ciUpper: 4.2 },
    { period: 'Jan-Jun 2023', percentage: 4.4, ciLower: 4.2, ciUpper: 4.5 },
    { period: 'Jul-Dec 2023', percentage: 5.1, ciLower: 4.6, ciUpper: 5.2 },
    { period: 'Jan-Jun 2024', percentage: 5.9, ciLower: 5.6, ciUpper: 6.2 },
    { period: 'Jul-Dec 2024', percentage: 5.9, ciLower: 5.6, ciUpper: 6.2 },
  ],
  Northeast: [
    { period: 'Jul-Dec 2022', percentage: 2.6, ciLower: 2.2, ciUpper: 3.0 },
    { period: 'Jan-Jun 2023', percentage: 2.7, ciLower: 2.3, ciUpper: 3.1 },
    { period: 'Jul-Dec 2023', percentage: 2.9, ciLower: 2.5, ciUpper: 3.3 },
    { period: 'Jan-Jun 2024', percentage: 3.1, ciLower: 2.7, ciUpper: 3.5 },
    { period: 'Jul-Dec 2024', percentage: 3.2, ciLower: 2.8, ciUpper: 3.6 },
  ],
  "Northeast Cocaine with Opioids": [
    { period: 'Jul-Dec 2022', percentage: 1.3, ciLower: 1.1, ciUpper: 1.5 },
    { period: 'Jan-Jun 2023', percentage: 1.3, ciLower: 1.1, ciUpper: 1.5 },
    { period: 'Jul-Dec 2023', percentage: 1.4, ciLower: 1.2, ciUpper: 1.6 },
    { period: 'Jan-Jun 2024', percentage: 1.5, ciLower: 1.3, ciUpper: 1.7 },
    { period: 'Jul-Dec 2024', percentage: 1.6, ciLower: 1.4, ciUpper: 1.8 },
  ],
  "Northeast Cocaine without Opioids": [
    { period: 'Jul-Dec 2022', percentage: 1.3, ciLower: 1.1, ciUpper: 1.5 },
    { period: 'Jan-Jun 2023', percentage: 1.4, ciLower: 1.2, ciUpper: 1.6 },
    { period: 'Jul-Dec 2023', percentage: 1.5, ciLower: 1.3, ciUpper: 1.7 },
    { period: 'Jan-Jun 2024', percentage: 1.6, ciLower: 1.4, ciUpper: 1.8 },
    { period: 'Jul-Dec 2024', percentage: 1.6, ciLower: 1.4, ciUpper: 1.8 },
  ],
}; */

const getKeyFinding = (data) => {
  if (!data || data.length < 2) return null;
  const lastIdx = data.length - 1;
  const prevIdx = data.length - 2;
  const last = data[lastIdx];
  const prev = data[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return {
    direction,
    absChange: Math.abs(absChange),
    prev: prev.percentage,
    prevLabel: prev.period,
    last: last.percentage,
    lastLabel: last.period,
  };
};

const lineColors = {
  National: '#1f77b4',
  "Cocaine with Opioids": '#e377c2',
  "Cocaine without Opioids": '#ff7f0e',
  West: '#1f77b4',
  "West Cocaine with Opioids": '#e377c2',
  "West Cocaine without Opioids": '#ff7f0e',
  Midwest: '#1f77b4',
  "Midwest Cocaine with Opioids": '#e377c2',
  "Midwest Cocaine without Opioids": '#ff7f0e',
  South: '#1f77b4',
  "South Cocaine with Opioids": '#e377c2',
  "South Cocaine without Opioids": '#ff7f0e',
  Northeast: '#1f77b4',
  "Northeast Cocaine with Opioids": '#e377c2',
  "Northeast Cocaine without Opioids": '#ff7f0e',
};

const getNationalDrugs = () => [
  { key: 'National', label: 'Cocaine' },
  { key: 'Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getWestDrugs = () => [
  { key: 'West', label: 'Cocaine' },
  { key: 'West Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'West Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getMidwestDrugs = () => [
  { key: 'Midwest', label: 'Cocaine' },
  { key: 'Midwest Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'Midwest Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getSouthDrugs = () => [
  { key: 'South', label: 'Cocaine' },
  { key: 'South Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'South Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getNortheastDrugs = () => [
  { key: 'Northeast', label: 'Cocaine' },
  { key: 'Northeast Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'Northeast Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const newNationalLineColors = {
  // National
  Fentanyl: '#1f77b4',
  Heroin: '#d62728',
  Opioids: '#ff7f0e',
  Methamphetamine: '#2ca02c',
  // West
  "West Fentanyl": '#9467bd',
  "West Heroin": '#8c564b',
  "West Opioids": '#e377c2',
  "West Methamphetamine": '#17becf',
  // Midwest
  "Midwest Fentanyl": '#bcbd22',
  "Midwest Heroin": '#7f7f7f',
  "Midwest Opioids": '#aec7e8',
  "Midwest Methamphetamine": '#ffbb78',
  // South
  "South Fentanyl": '#e41a1c',
  "South Heroin": '#377eb8',
  "South Opioids": '#4daf4a',
  "South Methamphetamine": '#984ea3',
  // Northeast
  "Northeast Fentanyl": '#ff7f00',
  "Northeast Heroin": '#a65628',
  "Northeast Opioids": '#f781bf',
  "Northeast Methamphetamine": '#999999',
};

const getNewNationalDrugs = (region = "National") => {
  if (region === "West") {
    return [
      { key: "West Fentanyl", label: "Fentanyl" },
      { key: "West Heroin", label: "Heroin" },
      { key: "West Opioids", label: "Opioids" },
      { key: "West Methamphetamine", label: "Methamphetamine" },
    ];
  }
  if (region === "Midwest") {
    return [
      { key: "Midwest Fentanyl", label: "Fentanyl" },
      { key: "Midwest Heroin", label: "Heroin" },
      { key: "Midwest Opioids", label: "Opioids" },
      { key: "Midwest Methamphetamine", label: "Methamphetamine" },
    ];
  }
  if (region === "South") {
    return [
      { key: "South Fentanyl", label: "Fentanyl" },
      { key: "South Heroin", label: "Heroin" },
      { key: "South Opioids", label: "Opioids" },
      { key: "South Methamphetamine", label: "Methamphetamine" },
    ];
  }
  if (region === "Northeast") {
    return [
      { key: "Northeast Fentanyl", label: "Fentanyl" },
      { key: "Northeast Heroin", label: "Heroin" },
      { key: "Northeast Opioids", label: "Opioids" },
      { key: "Northeast Methamphetamine", label: "Methamphetamine" },
    ];
  }
  // Default to National
  return [
    { key: 'Fentanyl', label: 'Fentanyl' },
    { key: 'Heroin', label: 'Heroin' },
    { key: 'Opioids', label: 'Opioids' },
    { key: 'Methamphetamine', label: 'Methamphetamine' },
  ];
};

const newNationalDrugsData = {
  Fentanyl: [
    { period: 'Jul-Dec 2022', percentage: 49.4, ciLower: 47.8, ciUpper: 51 },
    { period: 'Jan-Jun 2023', percentage: 49.8, ciLower: 48.7, ciUpper: 50.9 },
    { period: 'Jul-Dec 2023', percentage: 49.0, ciLower: 48, ciUpper: 50 },
    { period: 'Jan-Jun 2024', percentage: 47.3, ciLower: 46.3, ciUpper: 48.2 },
    { period: 'Jul-Dec 2024', percentage: 45.6, ciLower: 44.6, ciUpper: 46.5 },
  ],
  Heroin: [
    { period: 'Jul-Dec 2022', percentage: 16.7, ciLower: 15.6, ciUpper: 17.9 },
    { period: 'Jan-Jun 2023', percentage: 17.3, ciLower: 16.5, ciUpper: 18.1 },
    { period: 'Jul-Dec 2023', percentage: 17.4, ciLower: 16.6, ciUpper: 18.1 },
    { period: 'Jan-Jun 2024', percentage: 16.7, ciLower: 16, ciUpper: 17.4 },
    { period: 'Jul-Dec 2024', percentage: 19.2, ciLower: 18.5, ciUpper: 19.9 },
  ],
  Opioids: [
    { period: 'Jul-Dec 2022', percentage: 50.8, ciLower: 49.2, ciUpper: 52.4 },
    { period: 'Jan-Jun 2023', percentage: 51.1, ciLower: 50.1, ciUpper: 52.2 },
    { period: 'Jul-Dec 2023', percentage: 50.3, ciLower: 49.3, ciUpper: 51.3 },
    { period: 'Jan-Jun 2024', percentage: 48.5, ciLower: 47.4, ciUpper: 49.5 },
    { period: 'Jul-Dec 2024', percentage: 47.0, ciLower: 46.1, ciUpper: 47.9 },
  ],
  Methamphetamine: [
    { period: 'Jul-Dec 2022', percentage: 29.3, ciLower: 27.7, ciUpper: 30.8 },
    { period: 'Jan-Jun 2023', percentage: 30.7, ciLower: 29.7, ciUpper: 31.6 },
    { period: 'Jul-Dec 2023', percentage: 29.9, ciLower: 29, ciUpper: 30.8 },
    { period: 'Jan-Jun 2024', percentage: 33.7, ciLower: 32.8, ciUpper: 34.5 },
    { period: 'Jul-Dec 2024', percentage: 37.6, ciLower: 36.7, ciUpper: 38.5 },
  ],

  // --- WEST DATA ---
  "West Fentanyl": [
    { period: 'Jul-Dec 2022', percentage: 52.8, ciLower: 49.5, ciUpper: 56.1 },
    { period: 'Jan-Jun 2023', percentage: 51, ciLower: 48.4, ciUpper: 53.2 },
    { period: 'Jul-Dec 2023', percentage: 52.5, ciLower: 50.4, ciUpper: 54.6 },
    { period: 'Jan-Jun 2024', percentage: 57.4, ciLower: 55.5, ciUpper: 59.2 },
    { period: 'Jul-Dec 2024', percentage: 59.6, ciLower: 58, ciUpper: 61.1 },
  ],
  "West Heroin": [
    { period: 'Jul-Dec 2022', percentage: 16.7, ciLower: 14.2, ciUpper: 19.2 },
    { period: 'Jan-Jun 2023', percentage: 14.8, ciLower: 13.3, ciUpper: 16.4 },
    { period: 'Jul-Dec 2023', percentage: 13.7, ciLower: 12.3, ciUpper: 15.1 },
    { period: 'Jan-Jun 2024', percentage: 13.4, ciLower: 12.0, ciUpper: 13.4 },
    { period: 'Jul-Dec 2024', percentage: 19.8, ciLower: 18.5, ciUpper: 21.1 },
  ],
  "West Opioids": [
    { period: 'Jul-Dec 2022', percentage: 57.3, ciLower: 54.1, ciUpper: 60.6 },
    { period: 'Jan-Jun 2023', percentage: 57.2, ciLower: 54.2, ciUpper: 57.2 },
    { period: 'Jul-Dec 2023', percentage: 58.1, ciLower: 54, ciUpper: 58.1 },
    { period: 'Jan-Jun 2024', percentage: 60.3, ciLower: 58.5, ciUpper: 62.1 },
    { period: 'Jul-Dec 2024', percentage: 62.3, ciLower: 60.8, ciUpper: 63.9 },
  ],
  "West Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 54, ciLower: 50.7, ciUpper: 57.2 },
    { period: 'Jan-Jun 2023', percentage: 54.3, ciLower: 52.1, ciUpper: 56.5 },
    { period: 'Jul-Dec 2023', percentage: 53.3, ciLower: 51.5, ciUpper: 55.6 },
    { period: 'Jan-Jun 2024', percentage: 59.2, ciLower: 57.4, ciUpper: 61 },
    { period: 'Jul-Dec 2024', percentage: 64.4, ciLower: 62.9, ciUpper: 65.9 },
  ],

  // --- MIDWEST DATA ---
  "Midwest Fentanyl": [
    { period: 'Jul-Dec 2022', percentage: 48.8, ciLower: 46.2, ciUpper: 51.3 },
    { period: 'Jan-Jun 2023', percentage: 49.8, ciLower: 48.2, ciUpper: 51.5 },
    { period: 'Jul-Dec 2023', percentage: 51.1, ciLower: 49.5, ciUpper: 52.6 },
    { period: 'Jan-Jun 2024', percentage: 45.6, ciLower: 44.1, ciUpper: 47 },
    { period: 'Jul-Dec 2024', percentage: 40.1, ciLower: 38.7, ciUpper: 41.6 },
  ],
  "Midwest Heroin": [
    { period: 'Jul-Dec 2022', percentage: 13.8, ciLower: 12, ciUpper: 15.5 },
    { period: 'Jan-Jun 2023', percentage: 16.7, ciLower: 15.5, ciUpper: 18 },
    { period: 'Jul-Dec 2023', percentage: 20.3, ciLower: 19.1, ciUpper: 21.5 },
    { period: 'Jan-Jun 2024', percentage: 19.4, ciLower: 18.2, ciUpper: 20.6 },
    { period: 'Jul-Dec 2024', percentage: 19.3, ciLower: 18.2, ciUpper: 20.4 },
  ],
  "Midwest Opioids": [
    { period: 'Jul-Dec 2022', percentage: 48.9, ciLower: 46.4, ciUpper: 51.4 },
    { period: 'Jan-Jun 2023', percentage: 50.2, ciLower: 48.5, ciUpper: 51.8 },
    { period: 'Jul-Dec 2023', percentage: 51.6, ciLower: 50.1, ciUpper: 53.2 },
    { period: 'Jan-Jun 2024', percentage: 45.8, ciLower: 44.3, ciUpper: 47.3 },
    { period: 'Jul-Dec 2024', percentage: 40.7, ciLower: 39.3, ciUpper: 42.1 },
  ],
  "Midwest Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 24.3, ciLower: 22.2, ciUpper: 26.5 },
    { period: 'Jan-Jun 2023', percentage: 27.7, ciLower: 26.2, ciUpper: 29.2 },
    { period: 'Jul-Dec 2023', percentage: 25.7, ciLower: 24.4, ciUpper: 27 },
    { period: 'Jan-Jun 2024', percentage: 27, ciLower: 25.7, ciUpper: 28.3 },
    { period: 'Jul-Dec 2024', percentage: 26.8, ciLower: 25.5, ciUpper: 28.1 },
  ],
  // --- SOUTH DATA ---
  "South Fentanyl": [
    { period: 'Jul-Dec 2022', percentage: 51.9, ciLower: 48.9, ciUpper: 54.9 },
    { period: 'Jan-Jun 2023', percentage: 52.7, ciLower: 50.8, ciUpper: 54.7 },
    { period: 'Jul-Dec 2023', percentage: 48.8, ciLower: 46.9, ciUpper: 50.8 },
    { period: 'Jan-Jun 2024', percentage: 45.8, ciLower: 43.9, ciUpper: 47.7 },
    { period: 'Jul-Dec 2024', percentage: 41.6, ciLower: 39.8, ciUpper: 43.3 },
  ],
  "South Heroin": [
    { period: 'Jul-Dec 2022', percentage: 23.1, ciLower: 20.6, ciUpper: 25.6 },
    { period: 'Jan-Jun 2023', percentage: 22.2, ciLower: 18.1, ciUpper: 26.4 },
    { period: 'Jul-Dec 2023', percentage: 18.1, ciLower: 16.6, ciUpper: 19.6 },
    { period: 'Jan-Jun 2024', percentage: 19.9, ciLower: 18.3, ciUpper: 21.6 },
    { period: 'Jul-Dec 2024', percentage: 21.2, ciLower: 19.7, ciUpper: 22.6 },
  ],
  "South Opioids": [
    { period: 'Jul-Dec 2022', percentage: 53.4, ciLower: 51.5, ciUpper: 55.3 },
    { period: 'Jan-Jun 2023', percentage: 49.4, ciLower: 47.4, ciUpper: 51.4 },
    { period: 'Jul-Dec 2023', percentage: 46.8, ciLower: 44.9, ciUpper: 48.7 },
    { period: 'Jan-Jun 2024', percentage: 42.5, ciLower: 40.8, ciUpper: 44.1 },
    { period: 'Jul-Dec 2024', percentage: 41.2, ciLower: 39.5, ciUpper: 42.9 },
  ],
  "South Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 19.8, ciLower: 17.4, ciUpper: 22.1 },
    { period: 'Jan-Jun 2023', percentage: 19.7, ciLower: 18.2, ciUpper: 21.2 },
    { period: 'Jul-Dec 2023', percentage: 20.1, ciLower: 18.5, ciUpper: 21.7 },
    { period: 'Jan-Jun 2024', percentage: 21.3, ciLower: 19.7, ciUpper: 22.9 },
    { period: 'Jul-Dec 2024', percentage: 25.1, ciLower: 23.5, ciUpper: 26.6 },
  ],

  // --- NORTHEAST DATA ---
  "Northeast Fentanyl": [
    { period: 'Jul-Dec 2022', percentage: 29.3, ciLower: 23.6, ciUpper: 35.1 },
    { period: 'Jan-Jun 2023', percentage: 31.1, ciLower: 27.2, ciUpper: 35.0 },
    { period: 'Jul-Dec 2023', percentage: 22.9, ciLower: 19.6, ciUpper: 26.3 },
    { period: 'Jan-Jun 2024', percentage: 22.5, ciLower: 19.4, ciUpper: 25.5 },
    { period: 'Jul-Dec 2024', percentage: 23.5, ciLower: 20.3, ciUpper: 26.6 },
  ],
  "Northeast Heroin": [
    { period: 'Jul-Dec 2022', percentage: 6.6, ciLower: 3.5, ciUpper: 9.7 },
    { period: 'Jan-Jun 2023', percentage: 8.3, ciLower: 6.1, ciUpper: 10.4 },
    { period: 'Jul-Dec 2023', percentage: 7.3, ciLower: 5.4, ciUpper: 9.3 },
    { period: 'Jan-Jun 2024', percentage: 7.2, ciLower: 5.3, ciUpper: 9.2 },
    { period: 'Jul-Dec 2024', percentage: 7.1, ciLower: 5.2, ciUpper: 9.1 },
  ],
  "Northeast Opioids": [
    { period: 'Jul-Dec 2022', percentage: 30.2, ciLower: 24.4, ciUpper: 35.9 },
    { period: 'Jan-Jun 2023', percentage: 32.5, ciLower: 28.6, ciUpper: 36.5 },
    { period: 'Jul-Dec 2023', percentage: 24.4, ciLower: 21.0, ciUpper: 28.0 },
    { period: 'Jan-Jun 2024', percentage: 24.3, ciLower: 21.1, ciUpper: 27.5 },
    { period: 'Jul-Dec 2024', percentage: 24.8, ciLower: 21.5, ciUpper: 28.0 },
  ],
  "Northeast Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 13.2, ciLower: 9, ciUpper: 17.5 },
    { period: 'Jan-Jun 2023', percentage: 15, ciLower: 12, ciUpper: 18 },
    { period: 'Jul-Dec 2023', percentage: 9.5, ciLower: 7.4, ciUpper: 14.6 },
    { period: 'Jan-Jun 2024', percentage: 17.5, ciLower: 14.7, ciUpper: 20.3 },
    { period: 'Jul-Dec 2024', percentage: 17.6, ciLower: 14.7, ciUpper: 20.4 },
  ],
};


const getKeyFindingNew = (data) => {
  if (!data || data.length < 2) return null;
  const lastIdx = data.length - 1;
  const prevIdx = data.length - 2;
  const last = data[lastIdx];
  const prev = data[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return {
    direction,
    absChange: Math.abs(absChange),
    prev: prev.percentage,
    prevLabel: prev.period,
    last: last.percentage,
    lastLabel: last.period,
  };
};

const CocaineSixMonthsLineChart = ({ region, width, height, showMultiDrug = false }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [cocaineSixMonthsData, setCocaineSixMonthsData] = useState([]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, region]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
      .then(res => res.json())
      .then(data => {

        const nData = UtilityFunctions.getGroupedData(data, 'National', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'])
        const wData = UtilityFunctions.getGroupedData(data, 'West', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'])
        const mwData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'])
        const sData = UtilityFunctions.getGroupedData(data, 'South', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'])
        const neData =  UtilityFunctions.getGroupedData(data, 'North', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'])

        var sixMData = {};
        sixMData['National'] = nData[0].data;
        sixMData['Cocaine with Opioids'] = nData[1].data;
        sixMData['Cocaine without Opioids'] = nData[2].data;

        sixMData['West'] = wData[0].data;
        sixMData['West Cocaine with Opioids'] = wData[1].data;
        sixMData['West Cocaine without Opioids'] = wData[2].data;

        sixMData['Midwest'] = mwData[0].data;
        sixMData['Midwest Cocaine with Opioids'] = mwData[1].data;
        sixMData['Midwest Cocaine without Opioids'] = mwData[2].data;

        sixMData['South'] = sData[0].data;
        sixMData['South Cocaine with Opioids'] = sData[1].data;
        sixMData['South Cocaine without Opioids'] = sData[2].data;

        sixMData['Northeast'] = neData[0].data;
        sixMData['Northeast Cocaine with Opioids'] = neData[1].data;
        sixMData['Northeast Cocaine without Opioids'] = neData[2].data;
        
        setCocaineSixMonthsData(sixMData);
      });
  }, []);

  const isNational = region === 'National';
  const isWest = region === 'West';
  const isMidwest = region === 'Midwest';
  const isSouth = region === 'South';
  const isNortheast = region === 'Northeast';
  const drugsToShow = isNational
    ? getNationalDrugs()
    : isWest
      ? getWestDrugs()
      : isMidwest
        ? getMidwestDrugs()
        : isSouth
          ? getSouthDrugs()
          : isNortheast
            ? getNortheastDrugs()
            : [{ key: region, label: region }];
  const dataSets = drugsToShow.map(drug => ({
    key: drug.key,
    label: drug.label,
    data: cocaineSixMonthsData[drug.key] || [],
  }));

  const xDomain = Array.from(
    new Set(dataSets.flatMap(ds => ds.data.map(d => d.period)))
  );
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(...dataSets.flatMap(ds => ds.data.map(d => d.percentage)));
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const getshowLabels = (len, i) =>
  {
    let showLabel = false;
    showLabel = showLabels || (
      i === 0 || i === len - 1 || i === len - 2 || i === Math.floor((len - 1) / 2)
    );
    return showLabel;
  }

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    // Show for all datasets if National, else just one
    return dataSets.map(ds =>
      ds.data.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = i > 0 ? ds.data[i - 1].percentage : null;
        const prevYear = i >= 2 ? ds.data[i - 2].percentage : null;
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.period) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const getArrowColor = (change) => {
          if (change === null) return lineColors[ds.key] || '#6a0dad';
          return change > 0 ? lineColors[ds.key] || '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-${ds.key}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={lineColors[ds.key] || '#0073e6'}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${i >= 2 ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>6 Months Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                  </div>
                </div>
              </div>`}
            />
          </g>
        );
      })
    );
  };

  // For key finding, use the first dataset (Cocaine) as before
  const keyFinding = getKeyFinding(dataSets[0].data);

  // --- Render cocaineSixMonthsData chart always ---
  // --- Render newNationalDrugsData chart second if showMultiDrug is true ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* CocaineSixMonthsData chart (always first) */}
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for cocaine on urine drug tests: {region} Census Region Jan 2023 - Dec 2024 (6 Months). Millennium Health, {region} Census Region Jan 2023 - Dec 2024
          </h3>
        </div>
      </div>
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
        {keyFinding ? (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Cocaine positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to cocaine among people with substance use disorders.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      
      {UtilityFunctions.getToggleControls('CocaineSixMonthsLineChartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} 
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'end',
              dx: -6,
              dy: 3,
              fill: '#222',
            })}
          />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'middle',
              dy: 10,
            })}
          />
          {dataSets.map(ds => (
            <React.Fragment key={ds.key}>
              <LinePath
                data={ds.data}
                x={d => xScale(d.period) + xScale.bandwidth() / 2}
                y={d => yScale(d.percentage)}
                stroke={lineColors[ds.key] || '#1f77b4'}
                strokeWidth={2}
                curve={null}
              />
              {ds.data.map((d, i) => (
                <React.Fragment key={i}>
                  <Circle
                    cx={xScale(d.period) + xScale.bandwidth() / 2}
                    cy={yScale(d.percentage)}
                    r={4}
                    fill={lineColors[ds.key] || '#1f77b4'}
                    data-tip={`<div style='text-align: left;'>
                      <strong>${d.period}</strong><br/>
                      ${ds.label} positivity: ${d.percentage}%<br/>
                      Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                    </div>`}
                  />
                  {getshowLabels(ds.data.length, i) && (
                    <text
                      x={xScale(d.period) + xScale.bandwidth() / 2}
                      y={yScale(d.percentage) - 14}
                      fontSize={12}
                      textAnchor="middle"
                      fill="#333"
                    >
                      {d.percentage}%
                    </text>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {dataSets.map(ds => (
          <div key={ds.key} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[ds.key] || '#1f77b4', marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{ds.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />

      {/* Render newNationalDrugsData chart second if showMultiDrug is true */}
      {showMultiDrug && (
        <div style={{ marginTop: 40 }}>
          <NationalMultiDrugLineChart region={region} width={width} height={height} />
        </div>
      )}
    </div>
  );
};

// Add this function back above the export default if it was removed.
// This is required for <NationalMultiDrugLineChart ... /> to work.

const NationalMultiDrugLineChart = ({ region = "National", width, height }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  const drugsToShow = getNewNationalDrugs(region);
  const dataSets = drugsToShow.map(drug => ({
    key: drug.key,
    label: drug.label,
    data: newNationalDrugsData[drug.key] || [],
  }));

  // --- Add state for selected lines ---
  const regionLineKeys = drugsToShow.map(d => d.key);
  const [selectedLines, setSelectedLines] = useState(regionLineKeys);

  const xDomain = Array.from(
    new Set(dataSets.flatMap(ds => ds.data.map(d => d.period)))
  );
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(...dataSets.flatMap(ds => ds.data.map(d => d.percentage)));
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);


  const getshowLabels = (len, i) =>
  {
    let showLabel = false;
    showLabel = showLabels || (
      i === 0 || i === len - 1 || i === len - 2 || i === Math.floor((len - 1) / 2)
    );
    return showLabel;
  }

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return dataSets.map(ds =>
      ds.data.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = i > 0 ? ds.data[i - 1].percentage : null;
        const prevYear = i >= 2 ? ds.data[i - 2].percentage : null;
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.period) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const getArrowColor = (change) => {
          if (change === null) return newNationalLineColors[ds.key] || '#6a0dad';
          return change > 0 ? newNationalLineColors[ds.key] || '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-new-${ds.key}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={newNationalLineColors[ds.key] || '#0073e6'}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${i >= 2 ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>6 Months Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                  </div>
                </div>
              </div>`}
            />
          </g>
        );
      })
    );
  };


  const keyFinding = getKeyFindingNew(dataSets[0].data);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl, heroin, opioids, and methamphetamine on urine drug tests: National Jan 2023 - Dec 2024 (6 Months). Millennium Health, National Jan 2023 - Dec 2024
          </h3>
        </div>
      </div>
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
        {keyFinding ? (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> {keyFinding.absChange}% {keyFinding.direction} from {keyFinding.prev}% in {keyFinding.prevLabel} to {keyFinding.last}% in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to {keyFinding.lastLabel} among people with substance use disorders.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      {/* Add selection controls below Keyfinding */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '18px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-heroin"
                checked={selectedLines.length === drugsToShow.length && drugsToShow.every(line => selectedLines.includes(line.key))}
                onChange={() => {
                  if (selectedLines.length === drugsToShow.length && drugsToShow.every(line => selectedLines.includes(line.key))) {
                    setSelectedLines([]);
                  } else {
                    setSelectedLines(drugsToShow.map(line => line.key));
                  }
                }}
                style={{ accentColor: selectedLines.length === drugsToShow.length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-heroin"
                checked={selectedLines.length === 0}
                onChange={() => setSelectedLines([])}
                style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
          {drugsToShow.map(drug => (
            <label key={drug.key} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLines.includes(drug.key)}
                onChange={() => {
                  if (selectedLines.includes(drug.key)) {
                    setSelectedLines(selectedLines.filter(line => line !== drug.key));
                  } else {
                    setSelectedLines([...selectedLines, drug.key]);
                  }
                }}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid #888`,
                  background: '#fff',
                  marginRight: 2,
                  position: 'relative',
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                {selectedLines.includes(drug.key) && (
                  <span
                    style={{
                      display: 'block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: newNationalLineColors[drug.key] || lineColors[drug.key] || '#1f77b4',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: '14px', color: '#222' }}>{drug.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {UtilityFunctions.getToggleControls('CocaineSixMonthsLineChartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} 
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'end',
              dx: -6,
              dy: 3,
              fill: '#222',
            })}
          />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'middle',
              dy: 10,
            })}
          />
          {dataSets.map(ds => (
            <React.Fragment key={ds.key}>
              <LinePath
                data={ds.data}
                x={d => xScale(d.period) + xScale.bandwidth() / 2}
                y={d => yScale(d.percentage)}
                stroke={lineColors[ds.key] || '#1f77b4'}
                strokeWidth={2}
                curve={null}
              />
              {ds.data.map((d, i) => (
                <React.Fragment key={i}>
                  <Circle
                    cx={xScale(d.period) + xScale.bandwidth() / 2}
                    cy={yScale(d.percentage)}
                    r={4}
                    fill={lineColors[ds.key] || '#1f77b4'}
                    data-tip={`<div style='text-align: left;'>
                      <strong>${d.period}</strong><br/>
                      ${ds.label} positivity: ${d.percentage}%<br/>
                      Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                    </div>`}
                  />
                  {getshowLabels(ds.data.length, i) && (
                    <text
                      x={xScale(d.period) + xScale.bandwidth() / 2}
                      y={yScale(d.percentage) - 14}
                      fontSize={12}
                      textAnchor="middle"
                      fill="#333"
                    >
                      {d.percentage}%
                    </text>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {dataSets.map(ds => (
          <div key={ds.key} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[ds.key] || '#1f77b4', marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{ds.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default CocaineSixMonthsLineChart;
