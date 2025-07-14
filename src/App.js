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
import { FentanylLineChartMidwest, MidwestThreeDrugsLineChart} from './components/FentanylLineChartMidwest';
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
  const chartHeight = 450;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;
  const [selectedPeriod, setSelectedPeriod] = useState('Quarterly');
  const [selectedRegion, setSelectedRegion] = useState('National');
  const [selectedDrug, setSelectedDrug] = useState('fentanyl');

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
          {selectedPeriod == 'HalfYearly' && <LineChartWithToggles period={selectedPeriod} width={width} height={chartHeight}/>}
          {selectedPeriod == 'Quarterly' && <LineChartWithToggles period={selectedPeriod} width={width} height={chartHeight}/>}
          <PositiveHeroinChart period={selectedPeriod} width={width} height={chartHeight}/>
        </>
      )}
      
      {selectedRegion === 'National' && selectedDrug === 'heroin' && (
        selectedPeriod === 'HalfYearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="National" width={width} height={chartHeight}/>
              <Heroin6Monthssecondlinechart region="National" width={width} height={chartHeight} />
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="National" period={selectedPeriod} width={width} height={chartHeight}/>
              <HeroinSecondLineChart region="National" width={width} height={chartHeight} />
            </>
          )
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'heroin' && (
        selectedPeriod === 'HalfYearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="Midwest" width={width} height={chartHeight}/>
              <Heroin6Monthssecondlinechart region="MIDWEST" width={width} height={chartHeight} />
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="Midwest" period={selectedPeriod} width={width} height={chartHeight}/>
              <HeroinSecondLineChart region="MIDWEST" width={width} height={chartHeight} />
            </>
          )
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'heroin' && (
        selectedPeriod === 'HalfYearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="West" width={width} height={chartHeight}/>
              <Heroin6Monthssecondlinechart region="WEST" width={width} height={chartHeight} />
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="West" period={selectedPeriod} width={width} height={chartHeight}/>
              <HeroinSecondLineChart region="WEST" width={width} height={chartHeight} />
            </>
          )
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'heroin' && (
        selectedPeriod === 'HalfYearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="South" width={width} height={chartHeight}/>
              <Heroin6Monthssecondlinechart region="SOUTH" width={width} height={chartHeight} />
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="South" period={selectedPeriod} width={width} height={chartHeight}/>
              <HeroinSecondLineChart region="SOUTH" width={width} height={chartHeight} />
            </>
          )
      )}
      {selectedRegion === 'NORTH' && selectedDrug === 'heroin' && (
        selectedPeriod === 'HalfYearly'
          ? (
            <>
              <HeroinLineChartRegions6months region="Northeast" width={width} height={chartHeight}/>
              <Heroin6Monthssecondlinechart region="NORTH" width={width} height={chartHeight} />
            </>
          )
          : (
            <>
              <HeroinLineChartRegions region="Northeast" period={selectedPeriod} width={width} height={chartHeight}/>
              <HeroinSecondLineChart region="NORTH" width={width} height={chartHeight} />
            </>
          )
      )}
      {selectedRegion === 'National' && selectedDrug === 'methamphetamine' && (
        <>
          <MethamphetamineLineChart period={selectedPeriod} width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'methamphetamine' && (
        <>
          <MethamphetamineLineChartWest period={selectedPeriod} width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'methamphetamine' && (
        <MethamphetamineLineChartSouth period={selectedPeriod} width={width} height={chartHeight}/>
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'methamphetamine' && (
        <MethamphetamineLineChartMidwest period={selectedPeriod} width={width} height={chartHeight}/>
      )}
      {selectedRegion === 'NORTH' && selectedDrug === 'methamphetamine' && (
        <MethamphetamineLineChartNortheast period={selectedPeriod} width={width} height={chartHeight}/>
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'fentanyl' && selectedPeriod === 'Quarterly' && (
        <FentanylLineChartWest width={width} height={chartHeight}/>
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'fentanyl' && selectedPeriod === 'Quarterly' && (
        <>
        <FentanylLineChartMidwest width={width} height={chartHeight}/>
        <MidwestThreeDrugsLineChart width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'fentanyl' && selectedPeriod === 'Quarterly' && (
        <FentanylLineChartSouth width={width} height={chartHeight}/>
      )}
     
      {selectedRegion === 'National' && selectedDrug === 'cocaine' && selectedPeriod === 'HalfYearly' && (
        <>
          <CocaineSixMonthsLineChart region="National" showMultiDrug={true} width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'cocaine' && selectedPeriod === 'HalfYearly' && (
        <>
          <CocaineSixMonthsLineChart region="West" showMultiDrug={true} width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'cocaine' && selectedPeriod === 'HalfYearly' && (
        <>
          <CocaineSixMonthsLineChart region="Midwest" showMultiDrug={true} width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'cocaine' && selectedPeriod === 'HalfYearly' && (
        <>
          <CocaineSixMonthsLineChart region="South" showMultiDrug={true} width={width} height={chartHeight}/>
        </>
      )}
      {(selectedRegion === 'NORTH') && selectedDrug === 'cocaine' && selectedPeriod === 'HalfYearly' && (
        <>
          <CocaineSixMonthsLineChart region="Northeast" showMultiDrug={true} width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'WEST' && selectedDrug === 'fentanyl' && selectedPeriod === 'HalfYearly' && (
        <>
          <FentanylLineChart6Months region="West" width={width} height={chartHeight}/>
          <NationalMultiDrugLineChart region="West" width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'MIDWEST' && selectedDrug === 'fentanyl' && selectedPeriod === 'HalfYearly' && (
        <>
          <FentanylLineChart6Months region="Midwest" width={width} height={chartHeight}/>
          <NationalMultiDrugLineChart region="Midwest" width={width} height={chartHeight}/>
        </>
      )}
      {(selectedRegion === 'NORTH') && selectedDrug === 'fentanyl' && selectedPeriod === 'HalfYearly' && (
        <>
          <FentanylLineChart6Months region="Northeast" width={width} height={chartHeight}/>
          <NationalMultiDrugLineChart region="Northeast" width={width} height={chartHeight}/>
        </>
      )}
      {selectedRegion === 'SOUTH' && selectedDrug === 'fentanyl' && selectedPeriod === 'HalfYearly' && (
        <>
          <FentanylLineChart6Months region="South" width={width} height={chartHeight}/>
          <NationalMultiDrugLineChart region="South" width={width} height={chartHeight}/>
        </>
      )}
     
      {selectedDrug === 'cocaine' && selectedPeriod === 'Quarterly' && (
        <>
          {selectedRegion === 'National' && <CocaineNationalQuarterlyChart width={width} height={chartHeight}/>}
          {selectedRegion === 'WEST' && <CocaineWestQuarterlyChart width={width} height={chartHeight}/>}
          {selectedRegion === 'MIDWEST' && <CocaineMidwestQuarterlyChart width={width} height={chartHeight}/>}
          {selectedRegion === 'SOUTH' && <CocaineSouthQuarterlyChart width={width} height={chartHeight}/>}
          {selectedRegion === 'National' && <HeroinSecondLineChartBelowCocaine region={selectedRegion} width={width} height={chartHeight} />}
          {selectedRegion === 'WEST' && <HeroinSecondLineChartBelowCocaine region={selectedRegion} width={width} height={chartHeight} />}
          {selectedRegion === 'MIDWEST' && <HeroinSecondLineChartBelowCocaine region={selectedRegion} width={width} height={chartHeight} />}
          {selectedRegion === 'SOUTH' && <HeroinSecondLineChartBelowCocaine region={selectedRegion} width={width} height={chartHeight} />}
          
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