import { useEffect, useCallback, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
function App(params) {

  const viewportCutoffSmall = 550;
  const viewportCutoffMedium = 800;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const accessible = false;

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
    <div className={`App${dimensions.width < viewportCutoffSmall ? ' small-vp' : ''}${dimensions.width < viewportCutoffMedium ? ' medium-vp' : ''}${accessible ? ' accessible' : ''}`}
      ref={outerContainerRef}>
      <h1>To Do</h1>
      <ReactTooltip html={true}
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