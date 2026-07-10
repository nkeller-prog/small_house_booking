export default function CloudBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: "url(/window-pattern.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "350px auto",
      }}
    />
  );
}
