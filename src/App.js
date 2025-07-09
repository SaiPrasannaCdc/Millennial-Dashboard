import { useEffect, useCallback, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards';
import UnifiedDrugChart from './components/shared/UnifiedDrugChart';
import { DRUG_TYPES, REGIONS, PERIODS } from './components/shared/chartUtils';
// Keep legacy imports for charts that still need specific implementation
import LineChartWithToggles from './components/LineChartWithToggles';
import PositiveHeroinChart from './components/PositiveHeroinChart'; 
import MethamphetamineLineChartNortheast from './components/MethamphetamineLineChartNortheast'; 
import { CocaineNationalQuarterlyChart, CocaineWestQuarterlyChart, CocaineMidwestQuarterlyChart, CocaineSouthQuarterlyChart } from './components/CocaineNationalQuarterlyChart';
import CocaineSixMonthsLineChart from './components/CocaineSixMonthsLineChart';
import HeroinSecondLineChart from './components/HeroinSecondLineChart';
import HeroinSecondLineChartBelowCocaine from './components/HeroinSecondLineChartBelowCocaine';
import { NationalMultiDrugLineChart } from './components/Fentanyl6monthsecondlinechart';
import Heroin6Monthssecondlinechart from './components/Heroin6Monthssecondlinechart';

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
      
      {/* Heroin Charts - Unified across all regions */}
      {selectedDrug === 'heroin' && (
        <>
          <UnifiedDrugChart 
            drug={DRUG_TYPES.HEROIN}
            region={selectedRegion.toUpperCase()}
            period={selectedPeriod}
          />
          {selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly' ? (
            <Heroin6Monthssecondlinechart region={selectedRegion.toUpperCase()} width={1100} height={450} />
          ) : (
            <HeroinSecondLineChart region={selectedRegion.toUpperCase()} width={1100} height={450} />
          )}
        </>
      )}
      {/* Methamphetamine Charts - Unified across all regions */}
      {selectedDrug === 'methamphetamine' && (
        <>
          {selectedRegion === 'NORTH' && (selectedPeriod === 'Half Yearly' || selectedPeriod === '6 Months') ? (
            <MethamphetamineLineChartNortheast />
          ) : (
            <UnifiedDrugChart 
              drug={DRUG_TYPES.METHAMPHETAMINE}
              region={selectedRegion}
              period={selectedPeriod}
            />
          )}
        </>
      )}
      {/* Fentanyl Charts */}
      {selectedDrug === 'fentanyl' && (
        <>
          {selectedRegion === 'National' ? (
            <>
              <LineChartWithToggles period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
              <PositiveHeroinChart period={selectedPeriod === 'Half Yearly' ? '6 Months' : selectedPeriod} />
            </>
          ) : (
            <>
              {selectedPeriod === 'Quarterly' ? (
                <UnifiedDrugChart 
                  drug={DRUG_TYPES.FENTANYL}
                  region={selectedRegion}
                  period={selectedPeriod}
                />
              ) : (
                <>
                  <UnifiedDrugChart 
                    drug={DRUG_TYPES.FENTANYL}
                    region={selectedRegion}
                    period={selectedPeriod}
                  />
                  <NationalMultiDrugLineChart region={selectedRegion} />
                </>
              )}
            </>
          )}
        </>
      )}
      {/* Cocaine Charts */}
      {selectedDrug === 'cocaine' && (
        <>
          {selectedPeriod === 'Quarterly' ? (
            <>
              {selectedRegion === 'National' && <CocaineNationalQuarterlyChart />}
              {selectedRegion === 'WEST' && <CocaineWestQuarterlyChart />}
              {selectedRegion === 'MIDWEST' && <CocaineMidwestQuarterlyChart />}
              {selectedRegion === 'SOUTH' && <CocaineSouthQuarterlyChart />}
              <HeroinSecondLineChartBelowCocaine region={selectedRegion.toUpperCase()} width={1100} height={450} />
            </>
          ) : (
            <CocaineSixMonthsLineChart 
              region={selectedRegion === 'NORTHEAST' || selectedRegion === 'NORTH' ? 'Northeast' : selectedRegion} 
              showMultiDrug={true} 
            />
          )}
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