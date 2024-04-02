import { Box } from "@mui/system"
import { BarChart } from "@mui/x-charts"
import { campCounts } from "./ElectionSelectorTransitions";

export default ({simState, electionTag, data}) => {
    const candidateColor = (i) => `var(--${simState.candidateNames[electionTag][i].toLowerCase()})`
    let colors = {};
    for(let i = 0; i < 6; i++){
        colors[`rect:nth-of-type(${i+1})`] = {
            fill: i < 3 ? candidateColor(i%3):'none',
            stroke: candidateColor(i%3),
            strokeWidth: 4
        }
    }

    const starBase = data.map(range => Array.isArray(range)? range[0] : range);
    const starPadding = data.map(range => Array.isArray(range)? range[1] - range[0] : 0);

    return <Box className='bars' sx={{...colors}}>
        <BarChart
            yAxis={[
                {
                    id: 'barCategories',
                    data: simState.candidateNames[electionTag],
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
            width={500}
            height={300}
            tooltip={{ trigger: 'none' }}
            layout='horizontal'
            margin={{bottom: 30, top: 30, left: 130, right: 30}}
        />
    </Box>
}