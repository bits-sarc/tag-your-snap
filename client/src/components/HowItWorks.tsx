import { Link } from "react-router-dom";
import hiw from "/hiw.png";
import hiwdash from "/hiwdash.svg";

export default function HowItWorks() {
  return (
    <div className="container mx-auto flex flex-row mt-64">
      <div className="basis-1/4 font-gilmer-bold" style={{ fontSize: "70px" }}>
        <div>How</div>
        <div style={{ color: "#9b9b9b" }}>It</div>
        <div>Works</div>
        <img src={hiwdash} alt="" />
      </div>
      <div className="container max-w-[900px] basis-3/4 relative ml-auto">
        <Link to="https://youtube.com" target="_blank">
          <img src={hiw} alt="Video Instructions" />
        </Link>
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" style={{ color: "#fff" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            fill="currentColor"
            className="bi bi-play-fill"
            viewBox="0 0 16 16"
          >
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
          </svg>
        </div>
      </div>
    </div>
  );
}
