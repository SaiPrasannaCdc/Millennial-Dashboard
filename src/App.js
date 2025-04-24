import { useEffect, useCallback, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import FentanylPositiveChart from './components/FentanylPositiveChart.js';
import Positivefentanyl from './components/Positivefentanyl.js';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards'; // Import the StatsCards component

function App() {
  const viewportCutoffSmall = 550;
  const viewportCutoffMedium = 800;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;
  const [selectedPeriod, setSelectedPeriod] = useState('Quarterly');

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
       <Dropdowns selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
       <StatsCards />
      <div style={{ padding: '20px' }}>
        {/* Global Dropdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
       
        </div>
        <FentanylPositiveChart selectedPeriod={selectedPeriod} />
        <Positivefentanyl selectedPeriod={selectedPeriod} />
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