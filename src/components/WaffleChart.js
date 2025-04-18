import { Group } from '@visx/group';
import { Circle } from '@visx/shape';

import '../css/WaffleChart.css';

function WaffleChart(params) {

  const { data, width, height, header, accessible, colorScale, toFixed, isFinal } = params;

  const numDots = header ? 4 : 10;
  const rowValue = 100 / numDots;
  const colValue = 100 / Math.pow(numDots, 2);

  let margin = {top: header ? (height - width > 0 ? (height - width) / 2 : 0) : 0, bottom: 0, left: 0, right: 0, dot: 3};
  const adjustedWidth = (width - margin.left - margin.right);
  const adjustedHeight = header ? height - margin.top - margin.bottom : adjustedWidth;
  if(header && width > adjustedHeight){
    margin.left = (width - adjustedWidth) / 2;
  }
  const dotWidth = (adjustedWidth - (margin.dot * (numDots + 1))) / numDots;
  const dotRadius = dotWidth / 2;
  let rowList = [];
  let colList = [];
  for(let i = numDots - 1; i >= 0; i--){
    rowList.push(i);
  }
  for(let i = 1; i <= numDots; i++){
    colList.push(i);
  }

  return width > 0 && !accessible && (
    <svg
      id="waffle-chart" 
      width={width} 
      height={header ? height : adjustedHeight}
      data-tip={header ? undefined : `Number of deaths: ${Number(data.deaths).toLocaleString()}<br/>Percent${isFinal ? '' : ' (95% CI)'}: ${toFixed(data.percent)}% ${isFinal ? '' : `(${toFixed(data.low_ci)}%, ${toFixed(data.high_ci)}%)`}`}>
      <Group top={margin.top} left={margin.left}>
        {rowList.map(rowIndex => {
          return colList.map(colIndex => {
            const value = (rowIndex * rowValue) + (colIndex * colValue);
            const active = value > data.percent;
            const fill = active ? 'white' : (header ? '#712177' : colorScale.Intervention);
            const stroke = !active ? 'none' : (header ? '#b890bb' : colorScale.Intervention);

            return (
              <Circle 
                key={`waffle-point-${rowIndex}-${colIndex}`}
                r={dotRadius}
                cx={adjustedWidth - (colIndex * (dotWidth + margin.dot) - dotRadius)}
                cy={adjustedHeight - ((rowIndex + 1) * (dotWidth + margin.dot) - dotRadius) - margin.top}
                fill={fill}
                stroke={stroke}
                strokeWidth={active ? 2 : 0}
              />
            );
          })
        })}
      </Group>
    </svg>
  )
}

export default WaffleChart;
