import { LocationData } from "../types/api";

export default function LocationPointDetail({ location, id, onClick }: { location: LocationData, id: any, onClick: Function }) {
  const percentX = location.x;
  const percentY = location.y;

  const color = location.tag == undefined ? "#907e1c" : "#EF5D60"

  return (
    <div className="absolute item-hints font-gilmer-bold" style={{ left: `${percentX}%`, top: `${percentY}%`, zIndex: 100 }}>
      <div id={`hint-${location.id}`} className="relative hint" data-position="4">
        <div id={id} className={"p-1 border border-neutral-100 rounded-full font-gilmer-bold -translate-x-1/2 -translate-y-1/2 float-left hover:scale-125"} style={{ backgroundColor: color }} onClick={(e) => onClick(e)}></div>
        <div className="hint-content do--split-children flex flex-row justify-around px-3 gap-2">
          <div className="text-nowrap">{location.tag != undefined ? location.tag.name : "Untagged"}</div>
          {location.locked && (
            <div className="text-xl font-gilmer-bold text-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-1">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}