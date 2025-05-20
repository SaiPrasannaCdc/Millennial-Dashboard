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
      {/* Only show two charts based on Region and Drug selection */}
      {selectedRegion === 'National' && selectedDrug === 'fentanyl' && (
        <>
          <LineChartWithToggles period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          <PositiveHeroinChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      {selectedRegion === 'National' && selectedDrug === 'cocaine' && (
        <>
          <PositiveCocaineChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          {/* Add another chart for cocaine if needed */}
        </>
      )}
      {selectedRegion === 'National' && selectedDrug === 'heroin' && (
        <>
          <PositiveHeroinChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          {/* Add another chart for heroin if needed */}
        </>
      )}
      {selectedRegion === 'National' && selectedDrug === 'methamphetamine' && (
        <>
          <MethamphetamineLineChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
          <PositiveCocaineChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
        </>
      )}
      {/* Add logic for other regions if/when data is available */}
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