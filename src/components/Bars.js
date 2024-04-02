import { Box } from "@mui/system"
import { BarChart } from "@mui/x-charts"
import { campCounts } from "./ElectionSelectorTransitions";

export default ({simState, electionTag, step}) => {
    const candidateColor = (i) => `var(--${simState.candidateNames[electionTag][i].toLowerCase()})`
    let colors = {};
    for(let i = 0; i < 6; i++){
        colors[`rect:nth-of-type(${i+1})`] = {
            fill: i < 3 ? candidateColor(i%3):'none',
            stroke: candidateColor(i%3),
            strokeWidth: 4
        }
    }

    let starBase = [0, 0, 0];
    let starRange = [0, 0, 0];
    if(step == 0){
        starBase = [campCounts[electionTag][1]*5, 0, 0];
        starRange = [0, 0, 0];
    }

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
                    data: starRange, stack: 'a'
                },
            ]}
            width={500}
            height={300}
            tooltip={{ trigger: 'none' }}
            layout='horizontal'
            margin={{bottom: 30, top: 30, left: 100, right: 30}}
        />
    </Box>
}