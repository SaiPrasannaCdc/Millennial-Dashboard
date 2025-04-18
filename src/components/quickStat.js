import ChangeIndicator from './ChangeIndicator';

function QuickStat(params) {

  const { colorScale, defaultValueIfEmpty, value1, value2, text1, text2, label, show, suppressed } = params;

  return (
    <div className='stats-container-section'>
      {
        show && <div className="row stats-container col-md-10">
          <div id="" className="stats-item indicator" >
            <ChangeIndicator
              width={110}
              height={100}
              colorScale={colorScale}
              defaultValueIfEmpty={defaultValueIfEmpty}
              percentValue={value1}
              label={label}
              defaultLabelIfEmpty={'All'}
            ></ChangeIndicator>
          </div>
          <div className="stats-item indicator-text">
            {text1}
          </div>
          <div id="" className="stats-item indicator" >
            <ChangeIndicator
              width={110}
              height={100}
              colorScale={colorScale}
              defaultValueIfEmpty={defaultValueIfEmpty}
              percentValue={value2}
              label={label}
              defaultLabelIfEmpty={'All'}
            ></ChangeIndicator>
          </div>
          <div className="stats-item indicator-text">{text2}</div>
        </div>
      }
      <div className='stats-note'>
        {suppressed && label ? `Statistics for ${label} are suppressed for the years selected` : ''}
      </div>
      <div className='stats-note'>
        Click a line on the chart below to the { show ? 'change' : 'show'} statistics above.
      </div>
      
    </div>
  );
}

export default QuickStat;