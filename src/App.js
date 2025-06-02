import { useEffect, useCallback, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import FentanylPositiveChart from './components/FentanylPositiveChart.js';
import Positivefentanyl from './components/Positivefentanyl.js';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards'; // Import the StatsCards component
import LineChartWithToggles from './components/LineChartWithToggles'; // Import the LineChartWithToggles component
import MethamphetamineLineChart from './components/MethamphetamineLineChart'; // Import the new MethamphetamineLineChart component
import PositiveCocaineChart from './components/PositiveCocaineChart'; // Import the PositiveCocaineChart component
import PositiveHeroinChart from './components/PositiveHeroinChart'; // Import the PositiveHeroinChart component
import MethamphetamineLineChartWest from './components/MethamphetamineLineChartWest'; // Import the MethamphetamineLineChartWest component
import MethamphetamineLineChartSouth from './components/MethamphetamineLineChartSouth'; // Import the MethamphetamineLineChartSouth component
import MethamphetamineLineChartMidwest from './components/MethamphetamineLineChartMidwest'; // Import the Midwest chart
import MethamphetamineLineChartNortheast from './components/MethamphetamineLineChartNortheast'; // Import the MethamphetamineLineChartNortheast component
import FentanylLineChartWest from './components/FentanylLineChartWest';
import FentanylLineChartMidwest from './components/FentanylLineChartMidwest';
import FentanylLineChartSouth from './components/FentanylLineChartSouth';
import HeroinLineChartRegions from './components/HeroinLineChartRegions'; // Import the HeroinLineChartRegions component
import { CocaineNationalQuarterlyChart, CocaineWestQuarterlyChart, CocaineMidwestQuarterlyChart, CocaineSouthQuarterlyChart } from './components/CocaineNationalQuarterlyChart'; // Import the new CocaineNationalQuarterlyChart component
import CocaineSixMonthsLineChart from './components/CocaineSixMonthsLineChart'; // Import the new CocaineSixMonthsLineChart component
import FentanylLineChart6Months from './components/FentanylLineChart6Months';

function App() {
  const viewportCutoffSmall = 550;
  const viewportCutoffMedium = 800;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;
  const [selectedPeriod, setSelectedPeriod] = useState('Quarterly');
  const [selectedRegion, setSelectedRegion] = useState('National');
  const [selectedDrug, setSelectedDrug] = useState('fentanyl');

  const resizeObserver = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;

    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height });
    }
  });

  const outerContainerRef = useCallback(node => {
    if (node !== null) {
      resizeObserver.observe(node);
    }
  }, []);

  console.log('Selected Region:', selectedRegion);
  console.log('Selected Drug:', selectedDrug);
  console.log('Selected Period:', selectedPeriod);

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
      {selectedRegion === 'National' && selectedDrug === 'fentanyl' && (
        <>
          <LineChartWithToggles period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          <PositiveHeroinChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      {selectedRegion === 'National' && selectedDrug === 'cocaine' && selectedPeriod === 'Quarterly' && (
        <CocaineNationalQuarterlyChart />
      )}
      {selectedRegion.toUpperCase() === 'NATIONAL' && selectedDrug === 'heroin' && (selectedPeriod === 'Quarterly' || selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <HeroinLineChartRegions region="National" period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'heroin' && (selectedPeriod === 'Quarterly' || selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <HeroinLineChartRegions region="Midwest" period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'heroin' && (selectedPeriod === 'Quarterly' || selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <HeroinLineChartRegions region="West" period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'heroin' && (selectedPeriod === 'Quarterly' || selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <HeroinLineChartRegions region="South" period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion.toUpperCase() === 'NORTH' && selectedDrug === 'heroin' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <HeroinLineChartRegions region="Northeast" period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
      )}
      {selectedRegion === 'National' && selectedDrug === 'methamphetamine' && (
        <>
          <MethamphetamineLineChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          <PositiveCocaineChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'methamphetamine' && (
        <MethamphetamineLineChartWest period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
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
      {selectedRegion === 'WEST' && selectedDrug === 'cocaine' && selectedPeriod === 'Quarterly' && (
        <CocaineWestQuarterlyChart />
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'cocaine' && selectedPeriod === 'Quarterly' && (
        <CocaineMidwestQuarterlyChart />
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'cocaine' && selectedPeriod === 'Quarterly' && (
        <CocaineSouthQuarterlyChart />
      )}
      {selectedRegion.toUpperCase() === 'NATIONAL' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <CocaineSixMonthsLineChart region="National" />
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <CocaineSixMonthsLineChart region="West" />
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <CocaineSixMonthsLineChart region="Midwest" />
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <CocaineSixMonthsLineChart region="South" />
      )}
      {selectedRegion.toUpperCase() === 'NORTH' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <CocaineSixMonthsLineChart region="Northeast" />
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <FentanylLineChart6Months region="West" />
          {console.log('Rendering FentanylLineChart6Months:', selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'))}
          {console.log('Props passed to FentanylLineChart6Months:', { region: 'West' })}
        </>
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <FentanylLineChart6Months region="Midwest" />
      )}
      {(selectedRegion.toUpperCase() === 'NORTHEAST' || selectedRegion.toUpperCase() === 'NORTH') && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <FentanylLineChart6Months region="Northeast" />
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'fentanyl' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <FentanylLineChart6Months region="South" />
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