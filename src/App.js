import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import Dropdowns from './dropdowns';
import StatsCards from './components/StatsCards'; 
import debounce from 'lodash.debounce';

import LineChartWithToggles from './components/LineChartWithToggles'; 
import MethamphetamineLineChart from './components/MethamphetamineLineChart'; 
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
import { CocaineNationalQuarterlyChart, CocaineWestQuarterlyChart, CocaineMidwestQuarterlyChart, CocaineSouthQuarterlyChart } from './components/CocaineNationalQuarterlyChart'; 
import CocaineSixMonthsLineChart from './components/CocaineSixMonthsLineChart'; 
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
      
      {selectedRegion.toUpperCase() === 'NATIONAL' && selectedDrug === 'heroin' && (
        selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="National" period="6 Months" />
              <Heroin6Monthssecondlinechart region="NATIONAL" width={1100} height={450} />
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
        </>
      )}
      {selectedRegion.toUpperCase() === 'WEST' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="West" showMultiDrug={true} />
        </>
      )}
      {selectedRegion.toUpperCase() === 'MIDWEST' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="Midwest" showMultiDrug={true} />
        </>
      )}
      {selectedRegion.toUpperCase() === 'SOUTH' && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="South" showMultiDrug={true} />
        </>
      )}
      {(selectedRegion.toUpperCase() === 'NORTHEAST' || selectedRegion.toUpperCase() === 'NORTH') && selectedDrug === 'cocaine' && (selectedPeriod === '6 Months' || selectedPeriod === 'Half Yearly') && (
        <>
          <CocaineSixMonthsLineChart region="Northeast" showMultiDrug={true} />
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