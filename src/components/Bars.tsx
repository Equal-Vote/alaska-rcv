import { Box } from "@mui/system"
import { BarChart } from "@mui/x-charts"
import { ElectionDetails } from "../Transitions";

export default ({election, data}: {election: ElectionDetails, data: any}) => {
    const candidateKeys  = ['center', 'right', 'left'];
    // @ts-ignore
    const candidateColors = candidateKeys.map(key => `var(--${election.names[candidateKeys[index]].toLowerCase()})`)
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

    return <Box className='bars' sx={{...colors}}>
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
            width={500}
            height={300}
            tooltip={{ trigger: 'none' }}
            layout='horizontal'
            margin={{bottom: 30, top: 30, left: 130, right: 30}}
        />
    </Box>
}