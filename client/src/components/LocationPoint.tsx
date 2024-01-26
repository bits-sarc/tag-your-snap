import { LocationData } from "../types/api";

export default function LocationPoint({ location, currentRow, id, onClick }: { location: LocationData, currentRow: number, id: any, onClick: Function }) {
    const percentX = location.x;
    const percentY = location.y;

    let color = ["bg-amber-300", "bg-lime-300", "bg-teal-300", "bg-indigo-300", "bg-rose-300"]

    if (currentRow !== location.row) {
        color = ["bg-slate-300", "bg-slate-300", "bg-slate-300", "bg-slate-300", "bg-slate-300"]
    }

    return (
        <div id={id} className={`${color[Math.min(location.row, 4)]} ` + "absolute p-1 border-2 border-neutral-900 rounded-full font-gilmer-bold -translate-x-1/2 -translate-y-1/2 float-left hover:scale-125"} style={{ left: `${percentX}%`, top: `${percentY}%` }} onClick={(e) => onClick(e)}></div>
    )
}