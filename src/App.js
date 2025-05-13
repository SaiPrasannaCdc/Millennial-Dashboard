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
      <Dropdowns selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      <StatsCards />
      <div style={{ padding: '20px' }}>
        {/* Global Dropdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
        </div>
        
        
      </div>
      <LineChartWithToggles />

      <div style={{ padding: '20px' }}>
        {/* Methamphetamine Line Chart */}
        <MethamphetamineLineChart />
      </div>
      <div style={{ padding: '20px' }}>
        {/* Cocaine Positive Chart */}
        <PositiveCocaineChart />
      </div>
      <div style={{ padding: '20px' }}>
        {/* Heroin Positive Chart */}
        <PositiveHeroinChart />
      </div>
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