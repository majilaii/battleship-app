import React from "react";
import Header from "../../../components/Header";

export default function SinglePlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-screen">
      <Header className="flex-1" />
      <div className="flex-[3]">{children}</div>
    </section>
  );
}
