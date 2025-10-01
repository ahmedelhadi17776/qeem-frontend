import "../globals.css";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <nav>
          <a href="/calculator">Calculator</a>
          <br />
          <a href="/market">Market</a>
          <br />
          <a href="/invoices">Invoices</a>
          <br />
          <a href="/contracts">Contracts</a>
          <br />
          <a href="/profile">Profile</a>
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
