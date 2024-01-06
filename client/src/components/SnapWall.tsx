import SnapOne from '/snap1.png';

export default function SnapWall() {
  return (
    <>
      <article className="wrapper">
        <div className="">
          <div className="overflow-hidden">
            <div className="flex gap-12 justify-around">
              <img src={SnapOne} alt="Snap" width={611} />
              <img src={SnapOne} alt="Snap" width={611} />
              <img src={SnapOne} alt="Snap" width={611} />
            </div>
            <div className="flex gap-12 justify-around mt-8" style={{ transform: `translate(-305.5px)` }}>
              <img src={SnapOne} alt="Snap" width={611} />
              <img src={SnapOne} alt="Snap" width={611} />
              <img src={SnapOne} alt="Snap" width={611} />
              <img src={SnapOne} alt="Snap" width={611} />
              <img src={SnapOne} alt="Snap" width={611} />
            </div>
          </div>

        </div>

        {/* <div className="marquee marquee--reverse">
          <div className="marquee__group">
            <svg>
              <use xlink:href="#hulu" />
            </svg>
            <svg>
              <use xlink:href="#notion" />
            </svg>
            <svg>
              <use xlink:href="#honda" />
            </svg>
            <svg>
              <use xlink:href="#burger-king" />
            </svg>
            <svg>
              <use xlink:href="#spotify" />
            </svg>
            <svg>
              <use xlink:href="#aws" />
            </svg>
            <svg>
              <use xlink:href="#jordan" />
            </svg>
            <svg>
              <use xlink:href="#mcdonalds" />
            </svg>
          </div>

        </div> */}
      </article>
    </>
  )
}