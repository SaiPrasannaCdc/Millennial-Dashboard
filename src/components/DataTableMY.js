import { countCutoff, rateCutoff } from '../constants.json';

import '../css/DataTableMY.css';

function DataTableMY(params) {

  const { data, rates, cutoffData, cutoffKey, highlight, xAxisKey, suffixes, transforms, caption, customBackground, extraClasses, years, extraCols } = params;

  const labelOverrides = params.labelOverrides || {};

  const isArray = Array.isArray(data);

  const keys = (isArray ? Object.keys(data[0]) : Object.keys(data).sort((a,b) => {
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

    let keysCnt = keys.length - 1;
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

    return words.join(' ');
  };

  return (
    <>
      <div className={`table-container-MY${customBackground ? ' custom-background' : ' non-custom-background'} ${extraClasses}`} tabIndex="0">
        <table>
          <caption>{caption}</caption>
          <thead>
          <tr>
              <th scope="col" rowspan="2">{labelOverrides[xAxisKey] || formatLabel(xAxisKey)}</th>
              {getYearsArray() && getYearsArray().map(key => (
                <th key={`th-${key}`} scope="col" colspan={getColSpanCnt()} className={'centerAlign'}>{key}</th>
              ))}
             {/*  {extraCols && extraCols.map(key => (
                <th scope="col" className={'extraColsClass'} rowspan="2">{key}</th>
              ))} */}
              
            </tr>
            <tr>
              {isArray && keys.map(key => key !== xAxisKey && key != 'dummy' && (
                <th key={`th-${key}`} scope="col">{labelOverrides[key] || formatLabel(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isArray && data.map((d, i) => (
            d.dummy !== true &&
             <tr key={`tr-${d[xAxisKey]}-${i}`} className={d.background === true ? 'background' : '' + d[xAxisKey] === highlight ? ' highlight' : ''}>
                <th key={`th-${d[xAxisKey]}-${i}`} scope="row">{labelOverrides[d[xAxisKey]] || d[xAxisKey]}</th>
                {d.spacer === true && <td colSpan={d.colSpan}></td>}
                {d.spacer !== true && keys.map((key, j) => key !== xAxisKey && key !== 'dummy' && (
                  <td key={`td-${xAxisKey}-${i}-${j}`}>
                          {(transforms && transforms[key]) ? transforms[key](d[key]) : Number(d[key]).toLocaleString()}{suffixes && suffixes[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DataTableMY;