import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards'; 
import debounce from 'lodash.debounce';
import LineChart from './components/LineChart';
import { UtilityFunctions } from './utility';
import './styles.scss';

function App() {
  const viewportCutoffSmall = 550;
  const viewportCutoffMedium = 800;
  const chartHeight = 460;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;
  const [selectedPeriod, setSelectedPeriod] = useState('Quarterly');
  const [selectedRegion, setSelectedRegion] = useState('National');
  const [selectedDrug, setSelectedDrug] = useState('fentanyl');
  
  const [jsonData, setJsonData] = useState([]);
  const [calloutsData, setCalloutsData] = useState([]);
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

  const isSmallViewPort = width < viewportCutoffSmall;

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

  const getFootNotes = () => {

    if (!isSmallViewPort) {
      return (
            <div>
              <table style={{ width: '100%' }}>
                <tr style={{ textAlign: 'left'}}>
                  <td style={{ width: '10%' }}></td>
                  <td style={{ width: '95%' }}><small><i><sup>*</sup>
                    {selectedPeriod == 'Quarterly' ? 'Changes in drug(s) positivity across a quarter or a year may not be statistically significant. Where 95% confidence intervals for drug positivity between two quarters do not overlap, the quarters are statistically different.' : 'Changes in drug(s) positivity across a 6-month period or a year may not be statistically significant. Where the 95% confidence intervals for drug positivity between two 6-month periods do not overlap, the time periods are statistically different.'}
                  </i></small></td>
                </tr>
                <tr style={{ textAlign: 'left'}}>
                  <td style={{ width: '10%' }}></td>
                  <td style={{ width: '95%' }}><small><i><sup>†</sup>{'Scale of the figure may change based on the data selected'}</i></small></td>
                </tr>
              </table>
            </div>
      )
    }
    else
    {
      return (
       <div>
              <table style={{ width: '100%' }}>
                <tr style={{ textAlign: 'left'}}>
                  <td style={{ width: '100%' }}><small><i><sup>*</sup>
                    {selectedPeriod == 'Quarterly' ? 'Changes in drug(s) positivity across a quarter or a year may not be statistically significant. Where 95% confidence intervals for drug positivity between two quarters do not overlap, the quarters are statistically different.' : 'Changes in drug(s) positivity across a 6-month period or a year may not be statistically significant. Where the 95% confidence intervals for drug positivity between two 6-month periods do not overlap, the time periods are statistically different.'}
                  </i></small></td>
                </tr>
                <tr style={{ textAlign: 'left'}}>
                  <td style={{ width: '100%' }}><small><i><sup>†</sup>{'Scale of the figure may change based on the data selected'}</i></small></td>
                </tr>
              </table>
            </div>
      )
    }
  }

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
                  isSmallViewPort={isSmallViewPort}
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
                  isSmallViewPort={isSmallViewPort}
              />
              </div>
            </div>
          </td>
        </tr>
      </table>
    </>,
    [chartTwoData, selectedLinesTwo, showLabelsTwo, showPercentChangeTwo, drugsLineColorsTwo, width]);

    const callOutsMemo = useMemo(() =>
    <>
      <StatsCards data={calloutsData} rgn={selectedRegion} tframe={selectedPeriod} isSmallViewPort={isSmallViewPort}/>
    </>,
    [calloutsData, selectedPeriod, selectedRegion, width]);

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

    fetch(dataUrl + '/data/Millenial-Callouts.json')
      .then(res => res.json())
      .then(data => {
      setCalloutsData(data);
    });

  }, []);

  useEffect(() => {

    setChartOneData(UtilityFunctions.getChartOneData(jsonData, selectedRegion, selectedDrug, selectedPeriod));
    setChartTwoData(UtilityFunctions.getChartTwoData(jsonData, selectedRegion, selectedDrug, selectedPeriod));

  }, [selectedRegion, selectedDrug, selectedPeriod, jsonData, isSmallViewPort]);

  const loading = <div className="loading-container">
      <div className="loading-spinner"></div>
  </div>;

  if (jsonData == null || (jsonData != null && jsonData?.length == 0) || chartOneData == null || (chartOneData != null && chartOneData?.length == 0) || chartTwoData == null || (chartTwoData != null && chartTwoData?.length == 0)) {
    return loading;
  }

  if (calloutsData == null || (calloutsData != null && calloutsData?.length == 0)) {
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
        isSmallViewPort={isSmallViewPort}
      />

      {callOutsMemo}
      
      {UtilityFunctions.getDrugControls('LineChartDrugsOne', selectedDrug, kfInfoFromChartOne, setSelectedLinesOne, selectedLinesOne, chartDrugsOne, drugsLineColorsOne, selectedRegion, selectedPeriod, 1, isSmallViewPort)}
      {UtilityFunctions.getToggleControls('LineChartToggleOne', setShowPercentChangeOne, setShowLabelsOne, showPercentChangeOne, showLabelsOne, selectedPeriod, isSmallViewPort)}
      {lineChartOneMemo}
      {getFootNotes()}
      {UtilityFunctions.getDrugControls('LineChartDrugsTwo', selectedDrug, kfInfoFromChartTwo, setSelectedLinesTwo, selectedLinesTwo, chartDrugsTwo, drugsLineColorsTwo, selectedRegion, selectedPeriod, 2, isSmallViewPort)}
      {UtilityFunctions.getToggleControls('LineChartToggleTwo', setShowPercentChangeTwo, setShowLabelsTwo, showPercentChangeTwo, showLabelsTwo, selectedPeriod, isSmallViewPort)}
      {lineChartTwoMemo}
      {getFootNotes()}

    </div>
  );
}

export default App;