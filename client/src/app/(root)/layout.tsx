// "use client"
export default function HomeLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <main className="w-full h-screen scrollbar-none flex overflow-hidden ">
      {sidebar}
      <main className="w-full overflow-hidden">{children}</main>
    </main>
  );
}
