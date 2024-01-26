export default function UIButton({ onClick, text, active }: { onClick: any, text: string, active?: boolean }) {
  return (
    <div className="gradient-box">
      <button style={active ? { backgroundColor: "rgb(255, 255, 255, 0.4)" } : {}} className="z-10 text-center rounded-lg text-2xl font-gilmer-medium bg-neutral-100/20 w-full p-2 hover:bg-neutral-900" onClick={onClick}>
        {text}
      </button>
    </div>
  )
}

UIButton.defaultProps = {
  active: false,
}