export function DragDropIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <g fill="none" strokeLinecap="round" strokeWidth="4">
        <path
          fill="#2F88FF"
          stroke="#000"
          strokeLinejoin="round"
          d="M4 6H44V36H29L24 41L19 36H4V6Z"
        ></path>
        <path stroke="#fff" d="M16 18H32"></path>
        <path stroke="#fff" d="M16 26H24"></path>
        <path stroke="#fff" d="M12 34H36" strokeLinecap="butt"></path>
      </g>
    </svg>
  );
}
