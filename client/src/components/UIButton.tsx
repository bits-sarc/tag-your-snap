export default function UIButton({ onClick, text, active }: { onClick: any, text: string, active?: boolean }) {
  return (
    <>
      <button style={active ? { backgroundColor: "rgb(255, 255, 255, 0.4)" } : {}} className="mt-4 p-2 text-center border-4 rounded-lg border-neutral-600 text-2xl font-gilmer-medium bg-neutral-100/20 w-full mx-2 hover:bg-neutral-900" onClick={onClick}>
        {text}
      </button>
    </>
  )
}

UIButton.defaultProps = {
  active: false,
}