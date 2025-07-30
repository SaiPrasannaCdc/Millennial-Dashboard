import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards'; 
import debounce from 'lodash.debounce';
import LineChart from './components/LineChart';
import { UtilityFunctions } from './utility';

function App() {
  const viewportCutoffSmall = 550;
  const viewportCutoffMedium = 800;
  const chartHeight = 450;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;
  const [selectedPeriod, setSelectedPeriod] = useState('Quarterly');
  const [selectedRegion, setSelectedRegion] = useState('National');
  const [selectedDrug, setSelectedDrug] = useState('fentanyl');
  const [jsonData, setJsonData] = useState([]);
  const [chartOneData, setChartOneDataInState] = useState([]);
  const [chartTwoData, setChartTwoDataInState] = useState([]);

  const [chartDrugsOne, setChartDrugsOne] = useState([]);
  const [chartDrugsTwo, setChartDrugsTwo] = useState([]);
  const [selectedLinesOne, setSelectedLinesOne] = useState([]);
  const [selectedLinesTwo, setSelectedLinesTwo] = useState([]);
  const [drugsLineColorsOne, setDrugsLineColorsOne] = useState([]);
  const [drugsLineColorsTwo, setDrugsLineColorsTwo] = useState([]);
  const [showLabelsOne, setShowLabelsOne] = useState(false);
  const [showPercentChangeOne, setShowPercentChangeOne] = useState(false);
  const [showLabelsTwo, setShowLabelsTwo] = useState(false);
  const [showPercentChangeTwo, setShowPercentChangeTwo] = useState(false);
  const [kfInfoFromChartOne, setDataFromChartOne] = useState('');
  const [kfInfoFromChartTwo, setDataFromChartTwo] = useState('');

  const dataUrl = window.location.origin.includes('localhost') ? '' : '/overdose-prevention/data-dashboards/clinical-urine-dashboard';

  const [width, setWidth] = useState(1100);

  const isSmallViewport = width < 500;

  const lineChartRef = useRef();

  const debouncedSetWidth = useMemo(
    () => debounce(setWidth, 300)
    , []);

  const resizeObserver = new ResizeObserver(entries => {
    const { width: newWidth } = entries[0].contentRect;

    if (newWidth !== width) {
      debouncedSetWidth(newWidth);
    }
  });

  const outerContainerRef = useCallback(node => {
    if (node !== null) {
      resizeObserver.observe(node);
    } // eslint-disable-next-line
  }, []);

  const handleDataOne = (forKeyFinding) => {
    setDataFromChartOne(forKeyFinding);
  };

  const handleDataTwo = (forKeyFinding) => {
    setDataFromChartTwo(forKeyFinding);
  };

  const lineChartOneMemo = useMemo(() =>
    <>
      <table style={{width: '100%'}}>
        <tr>
          <td>
            <div class="containerLC">
              <div class={"chartDivAll"}>
                <LineChart 
                  data={chartOneData[0]}
                  region={selectedRegion}
                  currentDrug={selectedDrug.charAt(0).toUpperCase() + selectedDrug.slice(1).toLowerCase()}
                  period={selectedPeriod}
                  width={width}
                  height={chartHeight}
                  selectedDrugs={selectedLinesOne}
                  showLabels={showLabelsOne}
                  showPercentChange={showPercentChangeOne}
                  lineColors={drugsLineColorsOne}
                  onData={handleDataOne}
                  chartNum={1}
              />
              </div>
            </div>
          </td>
        </tr>
      </table>
    </>,
    [chartOneData, selectedLinesOne, showLabelsOne, showPercentChangeOne, drugsLineColorsOne, width]);

    const lineChartTwoMemo = useMemo(() =>
    <>
      <table style={{width: '100%'}}>
        <tr>
          <td>
            <div class="containerLC">
              <div class={"chartDivAll"}>
                <LineChart 
                  data={chartTwoData[0]}
                  region={selectedRegion}
                  currentDrug={selectedDrug.charAt(0).toUpperCase() + selectedDrug.slice(1).toLowerCase()}
                  period={selectedPeriod}
                  width={width}
                  height={chartHeight}
                  selectedDrugs={selectedLinesTwo}
                  showLabels={showLabelsTwo}
                  showPercentChange={showPercentChangeTwo}
                  lineColors={drugsLineColorsTwo}
                  onData={handleDataTwo}
                  chartNum={2}
              />
              </div>
            </div>
          </td>
        </tr>
      </table>
    </>,
    [chartTwoData, selectedLinesTwo, showLabelsTwo, showPercentChangeTwo, drugsLineColorsTwo, width]);

  const setChartOneData = (data) => {
    if (data[0] != null && data[0][0].values.length > 0) {
      setChartOneDataInState(data);
      setChartDrugsOne(data[1]);
      setSelectedLinesOne(data[1]);
      setDrugsLineColorsOne(data[2]);
    }
  }

  const setChartTwoData = (data) => {
    if (data != null && data[0][0].values.length > 0) {
      setChartTwoDataInState(data);
      setChartDrugsTwo(data[1]);
      setSelectedLinesTwo(data[1]);
      setDrugsLineColorsTwo(data[2]);
    }
  }
  
  useEffect(() => {

    fetch(dataUrl + '/data/Millenial-Format.normalized.json')
      .then(res => res.json())
      .then(data => {
      setJsonData(data);
    });

  }, []);

  useEffect(() => {

    setChartOneData(UtilityFunctions.getChartOneData(jsonData, selectedRegion, selectedDrug, selectedPeriod));
    setChartTwoData(UtilityFunctions.getChartTwoData(jsonData, selectedRegion, selectedDrug, selectedPeriod));

  }, [selectedRegion, selectedDrug, selectedPeriod, jsonData]);

  const loading = <div className="loading-container">
      <div className="loading-spinner"></div>
  </div>;

  if (jsonData == null || (jsonData != null && jsonData?.length == 0) || chartOneData == null || (chartOneData != null && chartOneData?.length == 0) || chartTwoData == null || (chartTwoData != null && chartTwoData?.length == 0)) {
    return loading;
  }

  return (
    <div
      className={`App${dimensions.width < viewportCutoffSmall ? ' small-vp' : ''}${dimensions.width < viewportCutoffMedium ? ' medium-vp' : ''}${accessible ? ' accessible' : ''}`}
      ref={outerContainerRef}
    >
      <Dropdowns 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
        selectedRegion={selectedRegion} 
        onRegionChange={setSelectedRegion}
        selectedDrug={selectedDrug}
        onDrugChange={setSelectedDrug}
      />

      <StatsCards />

      {UtilityFunctions.getDrugControls('LineChartDrugsOne', selectedDrug, kfInfoFromChartOne, setSelectedLinesOne, selectedLinesOne, chartDrugsOne, drugsLineColorsOne, selectedRegion, selectedPeriod, 1)}
      {UtilityFunctions.getToggleControls('LineChartToggleOne', setShowPercentChangeOne, setShowLabelsOne, showPercentChangeOne, showLabelsOne)}
      {lineChartOneMemo}
      {UtilityFunctions.getDrugControls('LineChartDrugsTwo', selectedDrug, kfInfoFromChartTwo, setSelectedLinesTwo, selectedLinesTwo, chartDrugsTwo, drugsLineColorsTwo, selectedRegion, selectedPeriod, 2)}
      {UtilityFunctions.getToggleControls('LineChartToggleTwo', setShowPercentChangeTwo, setShowLabelsTwo, showPercentChangeTwo, showLabelsTwo)}
      {lineChartTwoMemo}

    </div>
  );
}

export default App;