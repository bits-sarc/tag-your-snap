export default function TextBlock() {
  return (
    <>
      <div className="pt-32 px-10 font-gilmer-medium pb-8 container mx-auto" id="about">
        <div className="border-4 p-24 rounded-3xl" style={{ backgroundColor: 'rgba(85, 85, 81, 0.4)', borderColor: '#DAC86D' }}>
          <div className="text-center font-gilmer-heavy" style={{ fontSize: '64px', color: '#DAC86D' }}>About</div>
          <div className="text-center text-neutral-400 pt-16" style={{ fontSize: "36px", lineHeight: 1.55, color: '#DFDFDF' }}>
            Batch Snaps has been an integral part of the rich BITSian heritage and counts as one of the most memorable day in any BITSian's life.
          </div>
          <div className="text-center text-neutral-400 pt-4" style={{ fontSize: "36px", lineHeight: 1.55, color: '#DFDFDF' }}>
            Spread over 2 days, Batch Snaps is conducted in the sky lawns beside the Birla Museum. On one hand, formal snaps are conducted for every department with their professors and on the other, informal snaps take place simultaneously where BITSians unleash their creative sense of attire.
          </div>
        </div>
      </div>
    </>
  )
}