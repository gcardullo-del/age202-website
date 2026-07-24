type GlowBackgroundProps = {
  position?: "left" | "center" | "right";
  intensity?: "soft" | "medium" | "strong";
  grid?: boolean;
  className?: string;
};

const positionClasses = {
  left: "-left-52 top-1/2 -translate-y-1/2",
  center:
    "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  right: "-right-52 top-1/2 -translate-y-1/2",
};

const intensityClasses = {
  soft: "bg-[#C8FF00]/[0.03]",
  medium: "bg-[#C8FF00]/[0.05]",
  strong: "bg-[#C8FF00]/[0.075]",
};

export default function GlowBackground({
  position = "center",
  intensity = "soft",
  grid = false,
  className = "",
}: GlowBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "absolute h-[540px] w-[540px] rounded-full blur-[160px]",
          positionClasses[position],
          intensityClasses[intensity],
        ].join(" ")}
      />

      {grid && (
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />
      )}
    </div>
  );
}