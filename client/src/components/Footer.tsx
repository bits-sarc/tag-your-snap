import footerBg from "/footer.svg"
import sarcLogo from "/sarc-logo.svg"

export default function Footer() {
  return (
    <div style={{ backgroundImage: "url(footer.svg)", backgroundSize: "cover" }} className="mt-48 min-h-[300px] py-16 font-gilmer-medium">
      <div className="container mx-auto flex flex-row">
        <div className="basis-5/12">
          <span style={{ color: "#DAC86D", fontSize: "32px" }}>Email Us</span>
          <div style={{ fontSize: "30px" }}>
            <a href="mailto:alumnicell@pilani.bits-pilani.ac.in">alumnicell@pilani.bits-pilani.ac.in</a>
          </div>
          <div className="mt-10"></div>
          <span style={{ color: "#DAC86D", fontSize: "32px" }}>Socials</span>
        </div>
        <div className="basis-3/12">
          <span style={{ color: "#DAC86D", fontSize: "32px" }}>About SARC</span>
          <div style={{ fontSize: "30px" }}>
            <a href="https://open.spotify.com/show/3z8808lf1AB9NspMNufPqr?si=cd20f854d98a42b2">BITS and Beyond</a>
          </div>
          <div style={{ fontSize: "30px" }}>
            <a href="https://bits-sarc.in/">Initiatives</a>
          </div>
          <div style={{ fontSize: "30px" }}>
            <a href="https://bits-sarc.in/#portfolio">Gallery</a>
          </div>
          <div style={{ fontSize: "30px" }}>
            <a href="https://www.bitsaa.in/page/publications/bits-echo">Echo</a>
          </div>
        </div>
        <div className="basis-4/12">
          <span className="pb-5 font-arial font-bold flex flex-row">
            <img src={sarcLogo} alt="" />
            <div className="pl-4" style={{ fontSize: "64px" }}>SARC</div>
          </span>
          <div className="" style={{ fontSize: "20px" }}>
            Student Alumni Relations Cell is a student body of BITS Pilani, Pilani Campus working under the aegis of the Dean of Alumni Relations Divison.
          </div>
        </div>
      </div>
    </div>
  );
}
