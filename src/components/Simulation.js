import { useContext, useEffect, useRef, useState } from "react";
import { SimContext } from '../SimContext';
import Voter from "./Voter";

const Simulation = () => {
    let [bool, setBool] = useState(false);
    let animID = useRef(null);
    let simRef = useRef(null);

    const {simState} = useContext(SimContext);

    const gameLoop = (timestamp) => {
        let objs = simState.objects;


        // update
        objs.forEach(o => o.update(simState));

        // move
        objs.forEach(o => o.applyVelocity());

        // collisions
        // TODO: figure out cthener way to iterate over all pair
        // TODO: we might do more passes to get more accurate results, but this is fine for now
        let anyCollision = true;
        let n = 0;
        let max_steps = 15;
        let voters = objs.filter(o => o instanceof Voter);

        // update grid
        let getGrid = () => {
            let grid = new Array(120).fill().map(_ => {
                return new Array(120).fill().map(_ => [])
            });
            
            voters.forEach(o => {
                let c = o.cell();
                grid[c.y][c.x].push(o);
            })

            return grid;
        }
        let grid = getGrid();

        while(anyCollision && n < max_steps){
            anyCollision = false;

            let checkCells = (c1_i, c1_j, c2_i, c2_j) => {
                let c1 = grid[c1_i][c1_j];
                let c2 = grid[c2_i][c2_j];
                let a = false;
                for(let i = 0; i < c1.length; i++){
                    for(var j = (c1 == c2)? i+1 : 0; j < c2.length; j++){
                        a = c1[i].tryCollision(c2[j]) || a;
                    }
                }
                return a;
            }

            for(let i = 1; i < grid.length-1; i++){
              for(let j = 1; j < grid[i].length-1; j++){
                for(let di = -1; di <= 1; di++){
                    for(let dj = -1; dj <= 1; dj++){
                        anyCollision = checkCells(i, j, i+di, j+dj) || anyCollision;
                    }
                }
                //anyCollision = checkCells(i, j, i, j) || anyCollision;
                //anyCollision = checkCells(i, j, i, j+1) || anyCollision;
                //anyCollision = checkCells(i, j, i+1, j+1) || anyCollision;
                //anyCollision = checkCells(i, j, i+1, j) || anyCollision;
                //if(j > 0) anyCollision = checkCells(i, j, i+1, j-1) || anyCollision;

                let cell = grid[i][j];
                for(let k = 0; k < cell.length; k++){
                    anyCollision = cell[k].tryCollision(simState.begich) || anyCollision;
                    anyCollision = cell[k].tryCollision(simState.palin) || anyCollision;
                    anyCollision = cell[k].tryCollision(simState.peltola) || anyCollision;
                    if(cell[k].camp != undefined)
                        anyCollision = cell[k].tryCollision(cell[k].camp) || anyCollision;
                }
              }
            }

            //for(var i = 0; i < phyObjs.length; i++){
            //    for(var j = i+1; j < phyObjs.length; j++){
            //        anyCollision = phyObjs[i].tryCollision(phyObjs[j]) || anyCollision;
            //    }
            //}

            n++;
        }

        // refresh
        setBool(bool => !bool);
        animID.current = requestAnimationFrame(gameLoop);
    }

    useEffect(() => {
        animID.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animID.current);
    }, [])

    return (
        <div ref={simRef} className='simulation'>
            {simState.objects.map(o => o.asComponent(simState, simRef.current == null ? 800 : simRef.current.clientHeight))}
        </div>
    )
}

export default Simulation
