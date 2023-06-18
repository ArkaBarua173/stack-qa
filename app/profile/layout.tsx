import ProfileNav from "../components/ProfileNav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex">
      <aside className="w-1/5 bg-slate-300 h-[calc(100vh-theme('spacing.20'))]">
        <ProfileNav />
      </aside>
      <div>{children}</div>
    </section>
  );
}
