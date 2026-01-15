import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import './DataTable508.css';
import { Group } from '@visx/group';


function DataTable508(params) {

  const { data, dataTip1, dataTip2,  highlight, xAxisKey, colSpan, isSmallViewport, noSort, chartNum, currentDrug, showPercentChange, suppressed, extraClasses, caption, hdr, colSpan2, supScript, years, width, customBackground } = params;

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (data == null || data === undefined || Object.keys(data).length == 0)
    return;

  if (dataTip1 == null || dataTip1 === undefined || Object.keys(dataTip1).length == 0)
    return;

  if (dataTip2 == null || dataTip2 === undefined || Object.keys(dataTip2).length == 0)
    return;

  const labelOverrides = params.labelOverrides || {};

  const isArray = Array.isArray(data);

  const keys = (isArray ? Object.keys(data[0]) : noSort ? Object.keys(data) : Object.keys(data).sort((a,b) => {
    if(a === 'Overall') return -1;
    if(b === 'Overall') return 1;
    return a < b ? -1 : 1;
  }));

  const capitalize = (key) => {
    return key.charAt(0).toUpperCase() + key.substring(1);
  };

  const getYearsArray = () => {

    let myArray = [];
    
    let yr = parseInt(years['yearFrom'].yearFrom);
    myArray.push(yr);
    while (yr < parseInt(years['yearTo'].yearTo))
    {
      yr = yr + 1;
      myArray.push(yr);
    }
    return myArray;
  };

  const getColSpanCnt = () => {
    let keysCnt = keys.filter(d => d != 'dummy' && !d.includes('extraCol')).length - 1;
    let yearCnt = getYearsArray().length;
    return keysCnt < yearCnt ? 1 : keysCnt/yearCnt;
  };

  const formatLabel = (key) => {

    if(!key) return 'Jurisdiction';

    let words = [];

    let start = 0;
    for(let i = 1; i < key.length; i++){
      if(key[i] === key[i].toUpperCase()){
        words.push(key.substring(start, i));
        start = i;
      }
    }

    words.push(key.substring(start));
    words = words.map(word => capitalize(word));

    return words.join('');
  };

  const getHeader = () => {
    var txt = chartNum == 1 ? '% of specimens testing positive for ' +  currentDrug.toLowerCase() + ' or ' + currentDrug.toLowerCase() + ' drug combinations' : '% of specimens with drug(s) detected among ' + currentDrug.toLowerCase() + ' positive specimens';
    return txt;
  }

  const getTooltip = (data, yr, col) => {
    return data[yr][col];
  }

  const cleanUp = (val, yr, col) => {

    var ret = val;

    if (String(val) != 'PH' && String(val).indexOf('Data suppressed') >= 0)
      ret = '*';

    if (String(val) != 'PH' && String(val).indexOf('Data not available') >= 0)
      ret = String(yr).includes('2024') ? '§' : '†';

    if (String(val) == 'PH')
      ret = '†';

    if (val === undefined)
      ret = String(yr).includes('2024') ? (String(val).indexOf('state') ? '†' : '§') : '†';

    return ret;
  }

  

  return (
    <>
      <div style={{'width': width * 0.985}} className={`table-container-MY${customBackground ? ' custom-background' : ' non-custom-background'} ${extraClasses}`} tabIndex="0">
        {!suppressed && colSpan > 0 &&
        <table >
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th className={'keepSticky'} scope="col" rowspan="2">{labelOverrides[xAxisKey] || formatLabel(xAxisKey)}</th>
              {colSpan != null && <th key={'abcd'} scope="col" colspan={colSpan} className={'centerAlign'}>{hdr != null ? hdr : getHeader()}</th>}
              {colSpan2 != null && <th key={'abcde'} scope="col" colspan={colSpan2} className={'centerAlign'}>{hdr != null ? hdr : 'Count'}</th>}
            </tr>
            <tr>
              {!isArray && [data].map((d, index) => 
                Object.keys(d[keys[0]]).map(rowKey => (
                  <th key={`th-${rowKey}`} scope="col" className={'rightAlign'}>{labelOverrides[rowKey] || formatLabel(rowKey)}{labelOverrides[rowKey]?.endsWith('visits per 100,000 persons') ? <sup>5</sup> : (supScript !=  null ? <sup>{supScript}</sup> : '')}</th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {!isArray && keys.map((rowKey, rowIndex) => (
                <tr key={`tr-${rowKey}-${rowIndex}`} className={rowKey === highlight ? 'highlight' : ''}>
                  <th key={`th-${rowKey}-${rowIndex}`} scope="row">{labelOverrides[rowKey] || rowKey.split('_')[0]}</th>
                  {[data].map((d, i) => 
                    Object.keys(d[keys[0]]).map((colKey, colIndex) => (
                      <td key={`td-${d[rowKey][colKey]}-${rowIndex}-${colIndex}`}><svg style={{position: 'inherit', right: '0', top: '0'}} width={'auto'} height={20}><Group><rect x={0} y={0} width={'73%'} height={20} style={{outline: 'none', backgroundColor: 'yellow'}} fill='transparent'></rect><text x={'95%'} y={'75%'} width={'12%'} height={16} text-anchor="end" fontSize={18} stroke={'#1C1D1F'} fill={'#1C1D1F'} data-tip={showPercentChange ? getTooltip(dataTip2, rowKey, colKey) : getTooltip(dataTip1, rowKey, colKey)}>{cleanUp(d[rowKey][colKey], rowKey, colKey)}</text></Group></svg></td>
                    ))
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
        
        }
        { suppressed &&
          <div>Data not reported due to low number of positive tests. Select “6 Months” Time Frame to view available data.</div>
        }
        
      </div>
      <ReactTooltip html={true} type="light" arrowColor="rgba(0,0,0,0)" className="tooltip" textColor="#222" border={true}/>
    </>
    
  );
}

export default DataTable508;