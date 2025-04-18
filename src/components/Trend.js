import { useState, useEffect } from 'react';
import { LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear,scalePoint } from '@visx/scale';
import '../css/MonthChart.css';
import { max } from 'd3-array';

function TrendView(params) {
  const { data, width, height, el, accessible, metric, isPercent, value2Lable } = params;
  const [ animated, setAnimated ] = useState(false);
  const margin = {top: 10, bottom: 10, left: 0, right: 10};
  const adjustedHeight = height - margin.top - margin.bottom;
  const adjustedWidth = width - margin.left - margin.right;
//  console.log(data.map(d => d['key']))
  const maxValue = max(data, m => m.value)

  const xScale = scalePoint({
    domain: data.map(d => d['key']),
    range: [ 10, adjustedWidth -10 ],
    padding: 0
  });

  // const max = header ? maxes.quarter : maxes.month;

  const yScale = scaleLinear({
    range: [ adjustedHeight, 0 ],
    domain: [ 0, maxValue * 1.3]
  });

  const onScroll = () => {
    if(el.current && !animated && window.scrollY + window.innerHeight > el.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top){
      window.removeEventListener('scroll', onScroll);
      setAnimated(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    setTimeout(onScroll, 50); // eslint-disable-next-line
  }, []);

  return width > 0 && 
    (accessible) ? (
      <div></div>
    ) : (
      <div>
        <svg width={width} height={height}>
          <Group top={margin.top} left={margin.left}>
                {data.map(d => (
                    <Group key={`point-${d['key']}`}>
                      <circle
                        r={3}
                        cx={xScale(d['key'])}
                        cy={yScale(d.value)}
                        fill="#712177"
                      />
                      <circle
                        r={10}
                        cx={xScale(d['key'])}
                        cy={yScale(d.value)}
                        fill="transparent"
                        data-tip={`<strong>${d['key']}</strong>${value2Lable ? `<br/><span>${value2Lable}: ${Number(d.value2).toLocaleString()}</span>` : ``}<br/><span>${metric}: ${metric=='Deaths' ? Number(d.value).toLocaleString() :Number(d.value).toFixed(1).toLocaleString()}${isPercent ? '%' :''}</span><br/>`}
                      />
                    </Group>
                ))} 
                <LinePath 
                  key={`line`}
                  data={data}
                  x={d => xScale(d['key'])}
                  y={d => yScale(d.value)}
                  stroke="#712177"
                  strokeWidth="2"
                  pointerEvents="none"
                />
          </Group>
        </svg>
      </div>
    );
}

export default TrendView;
