import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards'; // Import the StatsCards component
import debounce from 'lodash.debounce';
import LineChartOne from './components/LineChartOne';

import LineChartWithToggles from './components/LineChartWithToggles'; // Import the LineChartWithToggles component
import MethamphetamineLineChart from './components/MethamphetamineLineChart'; // Import the new MethamphetamineLineChart component
import PositiveHeroinChart from './components/PositiveHeroinChart'; 
import MethamphetamineLineChartWest from './components/MethamphetamineLineChartWest'; 
import MethamphetamineLineChartSouth from './components/MethamphetamineLineChartSouth'; 
import MethamphetamineLineChartMidwest from './components/MethamphetamineLineChartMidwest'; 
import MethamphetamineLineChartNortheast from './components/MethamphetamineLineChartNortheast'; 
import FentanylLineChartWest from './components/FentanylLineChartWest';
import FentanylLineChartMidwest from './components/FentanylLineChartMidwest';
import FentanylLineChartSouth from './components/FentanylLineChartSouth';
import HeroinLineChartRegions from './components/HeroinLineChartRegions'; 
import HeroinLineChartRegions6months from './components/HeroinLineChartRegions6months';
import { CocaineNationalQuarterlyChart, CocaineWestQuarterlyChart, CocaineMidwestQuarterlyChart, CocaineSouthQuarterlyChart } from './components/CocaineNationalQuarterlyChart'; // Import the new CocaineNationalQuarterlyChart component
import CocaineSixMonthsLineChart from './components/CocaineSixMonthsLineChart'; // Import the new CocaineSixMonthsLineChart component
import FentanylLineChart6Months from './components/FentanylLineChart6Months';
import HeroinSecondLineChart from './components/HeroinSecondLineChart';
import HeroinSecondLineChartBelowCocaine from './components/HeroinSecondLineChartBelowCocaine';
import { NationalMultiDrugLineChart } from './components/NationalMultiDrugLineChart';
import Heroin6Monthssecondlinechart from './components/Heroin6Monthssecondlinechart';



function App() {
  const viewportCutoffSmall = 550;
  const viewportCutoffMedium = 800;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;
  const [selectedPeriod, setSelectedPeriod] = useState('Quarterly');
  const [selectedRegion, setSelectedRegion] = useState('National');
  const [selectedDrug, setSelectedDrug] = useState('fentanyl');

  const [width, setWidth] = useState(0);

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

  const getRegionDesc = (reg) => {
    var desc = ''
    switch (reg) {
            case 'National':
              desc = 'United States Region'
              break;
            case 'NORTH':
              desc = 'Northeast Census Region'
              break; 
            case 'MIDWEST':
              desc = 'Midwest Census Region'
              break; 
            case 'SOUTH':
              desc = 'Southern Census Region'
              break; 
            case 'WEST':
              desc = 'Western Census Region'
              break; 
            default:
              desc = '';
        }

    return desc;
  };

  const lineChartMemo = useMemo(() =>
  <>
    <table style={{width: '100%'}}>
      <tr>
        <td>
          <div class="containerLC">
            <div class={"chartDivAll"} ref={lineChartRef}>
              <LineChartOne 
              data={''}
              currentDrug={selectedDrug}
              region={selectedRegion}
              width={width}
              height={450}
              el={lineChartRef}
              period={selectedPeriod}
              />
            </div>
          </div>
        </td>
      </tr>
    
    </table>
  </>,
  [selectedDrug, width, selectedRegion, selectedPeriod]);


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

      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for {selectedDrug} on urine drug tests:
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#ffffff' }}>
            Millennium Health, {getRegionDesc(selectedRegion)} {selectedPeriod == 'Quarterly' ? 'Q4 2022 - Q4 2024' : 'Jan 2023 - Dec 2024 (6 Months)'}
          </p>
        </div>
      </div>

      {lineChartMemo}

      {selectedRegion === 'National' && selectedDrug === 'fentanyl' && (
        <>
          <LineChartWithToggles period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          <PositiveHeroinChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      
      {selectedRegion.toUpperCase() === 'NATIONAL' && selectedDrug === 'heroin' && (
        selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="National" period="6 Months" />
              {/* Render the new multi-drug chart below the current line chart */}
              <Heroin6Monthssecondlinechart region="NATIONAL" width={1100} height={450} />
              {/* <HeroinSecondLineChart region="NATIONAL" width={1100} height={450} /> */}
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="National" period={selectedPeriod} />
              <HeroinSecondLineChart region="NATIONAL" width={1100} height={450} />
            </>
          )
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'heroin' && (
        selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="Midwest" period="6 Months" />
              <Heroin6Monthssecondlinechart region="MIDWEST" width={1100} height={450} />
              {/* <HeroinSecondLineChart region="MIDWEST" width={1100} height={450} /> */}
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="Midwest" period={selectedPeriod} />
              <HeroinSecondLineChart region="MIDWEST" width={1100} height={450} />
            </>
          )
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'heroin' && (
        selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="West" period="6 Months" />
              <Heroin6Monthssecondlinechart region="WEST" width={1100} height={450} />
              {/* <HeroinSecondLineChart region="WEST" width={1100} height={450} /> */}
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="West" period={selectedPeriod} />
              <HeroinSecondLineChart region="WEST" width={1100} height={450} />
            </>
          )
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'heroin' && (
        selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="South" period="6 Months" />
              <Heroin6Monthssecondlinechart region="SOUTH" width={1100} height={450} />
              {/* <HeroinSecondLineChart region="SOUTH" width={1100} height={450} /> */}
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="South" period={selectedPeriod} />
              <HeroinSecondLineChart region="SOUTH" width={1100} height={450} />
            </>
          )
      )}
      {selectedRegion.toUpperCase() === 'NORTHEAST' && selectedDrug === 'heroin' && (
        selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="Northeast" period="6 Months" />
              <Heroin6Monthssecondlinechart region="NORTHEAST" width={1100} height={450} />
              {/* <HeroinSecondLineChart region="NORTHEAST" width={1100} height={450} /> */}
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="Northeast" period={selectedPeriod} />
              <HeroinSecondLineChart region="NORTHEAST" width={1100} height={450} />
            </>
          )
      )}
      {selectedRegion === 'National' && selectedDrug === 'methamphetamine' && (
        <>
          <MethamphetamineLineChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'methamphetamine' && (
        <>
          <MethamphetamineLineChartWest period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'methamphetamine' && (
        <MethamphetamineLineChartSouth period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'methamphetamine' && (
        <MethamphetamineLineChartMidwest period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion === 'NORTH' && selectedDrug === 'methamphetamine' && (selectedPeriod === 'Half Yearly' || selectedPeriod === '6 Months') && (
        <MethamphetamineLineChartNortheast />
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'fentanyl' && selectedPeriod === 'Quarterly' && (
        <FentanylLineChartWest />
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'fentanyl' && selectedPeriod === 'Quarterly' && (
        <FentanylLineChartMidwest />
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'fentanyl' && selectedPeriod === 'Quarterly' && (
        <FentanylLineChartSouth />
      )}
     
      {selectedRegion.toUpperCase() === 'NATIONAL' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="National" showMultiDrug={true} />
          {/* <NationalMultiDrugLineChart region="National" /> */}
        </>
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="West" showMultiDrug={true} />
          {/* <NationalMultiDrugLineChart region="West" /> */}
        </>
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="Midwest" showMultiDrug={true} />
          {/* <NationalMultiDrugLineChart region="Midwest" /> */}
        </>
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="South" showMultiDrug={true} />
          {/* <NationalMultiDrugLineChart region="South" /> */}
        </>
      )}
      {(selectedRegion.toUpperCase() === 'NORTHEAST' || selectedRegion.toUpperCase() === 'NORTH') && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="Northeast" showMultiDrug={true} />
          {/* <NationalMultiDrugLineChart region="Northeast" /> */}
        </>
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <FentanylLineChart6Months region="West" />
          <NationalMultiDrugLineChart region="West" />
          {console.log('Rendering FentanylLineChart6Months:', selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'))}
          {console.log('Props passed to FentanylLineChart6Months:', { region: 'West' })}
        </>
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <FentanylLineChart6Months region="Midwest" />
          <NationalMultiDrugLineChart region="Midwest" />
        </>
      )}
      {(selectedRegion.toUpperCase() === 'NORTHEAST' || selectedRegion.toUpperCase() === 'NORTH') && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <FentanylLineChart6Months region="Northeast" />
          <NationalMultiDrugLineChart region="Northeast" />
        </>
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <FentanylLineChart6Months region="South" />
          <NationalMultiDrugLineChart region="South" />
        </>
      )}
     
      {selectedDrug === 'cocaine' && selectedPeriod === 'Quarterly' && (
        <>
          {selectedRegion === 'National' && <CocaineNationalQuarterlyChart />}
          {selectedRegion === 'WEST' && <CocaineWestQuarterlyChart />}
          {selectedRegion === 'MIDWEST' && <CocaineMidwestQuarterlyChart />}
          {selectedRegion === 'SOUTH' && <CocaineSouthQuarterlyChart />}
          <HeroinSecondLineChartBelowCocaine region={selectedRegion.toUpperCase()} width={1100} height={450} />
        </>
      )}
      <ReactTooltip
        html={true}
        type="light"
        arrowColor="rgb(0, 0, 0)"
        place="top"
        effect="solid"
        className={`tooltip`}
      />
    </div>
  );
}

export default App;