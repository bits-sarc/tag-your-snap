import { LocationData } from "../types/api";

export default function LocationPointDetail({ location, currentRow, id, onClick }: { location: LocationData, currentRow: number, id: any, onClick: Function }) {
  const percentX = location.x;
  const percentY = location.y;

  const color = location.tag == undefined ? "#907e1c" : "#3f901c"

  return (
    <div className="absolute item-hints font-gilmer-bold" style={{ left: `${percentX}%`, top: `${percentY}%` }}>
      <div id={`hint-${location.id}`} className="relative hint" data-position="4">
        <div id={id} className={(currentRow === location.row ? "" : "hidden ") + "p-1 border border-neutral-100 rounded-full font-gilmer-bold -translate-x-1/2 -translate-y-1/2 float-left hover:scale-125"} style={{ backgroundColor: color }} onClick={(e) => onClick(e)}></div>
        {currentRow == location.row && (<div className="hint-content do--split-children">{ location.tag != undefined ? location.tag.name : "Untagged" }</div>)}
      </div>
    </div>
  )
}