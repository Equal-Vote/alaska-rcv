import { Box, useMediaQuery, useTheme } from "@mui/system"
import { BarChart, ResponsiveChartContainer } from "@mui/x-charts"
import { ElectionDetails } from "../Transitions";
import { useEffect, useRef, useState } from "react";

export default ({election, data}: {election: ElectionDetails, data: any}) => {
    const ref = useRef(null)
    const [width, setWidth] = useState(500);

    useEffect(() => {
        // @ts-ignore
        const updateDimensions = () =>
            // @ts-ignore
            setWidth(Math.min(500, ref.current.clientWidth));

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    })


    const candidateKeys  = ['center', 'right', 'left'];
    // @ts-ignore
    const candidateColors = candidateKeys.map(key => `var(--${election.names[key].toLowerCase()})`)
    let colors: Record<string, Object> = {};
    for(let i = 0; i < 6; i++){
        colors[`rect:nth-of-type(${i+1})`] = {
            fill: i < 3 ? candidateColors[i%3]:'none',
            stroke: candidateColors[i%3],
            strokeWidth: 4
        }
    }

    // @ts-ignore
    const starBase = data.map(range => Array.isArray(range)? range[0] : range);
    // @ts-ignore
    const starPadding = data.map(range => Array.isArray(range)? range[1] - range[0] : 0);

    return <Box ref={ref} className='bars' sx={{...colors}}>
        <BarChart
            yAxis={[
                {
                    id: 'barCategories',
                    // @ts-ignore
                    data: candidateKeys.map(key => election.names[key]),
                    scaleType: 'band',
                },
            ]}
            series={[
                { // min stars
                    data: starBase, stack: 'a'
                },
                { // addition stars
                    data: starPadding , stack: 'a'
                },
            ]}
            width={width}
            height={width*0.6}
            tooltip={{ trigger: 'none' }}
            layout='horizontal'
            margin={{bottom: 30, top: 30, left: 130, right: 30}}
        />
    </Box>
}