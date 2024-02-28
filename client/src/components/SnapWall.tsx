import Marquee from "react-fast-marquee";
import SnapOne from "/snap1.png";

export default function SnapWall() {
  return (
    <>
      <article className="wrapper mt-20">
        <Marquee autoFill={true} gradient={true} gradientColor="#000" gradientWidth={400}>
          <div>
            <img src={SnapOne} alt="Snap" width={611} className="ml-12" />
          </div>
        </Marquee>
        <Marquee className="mt-12" autoFill={true} gradient={true} gradientColor="#000" direction={"right"} gradientWidth={400}>
          <div>
            <img src={SnapOne} alt="Snap" width={611} className="ml-12" />
          </div>
        </Marquee>
      </article>
    </>
  );
}
