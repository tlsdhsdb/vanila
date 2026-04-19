import Link from "next/link";

import { gameRoutes } from "@/features/game/routes";

export function GameNavigation() {
  return (
    <nav className="game-navigation" aria-label="Game routes">
      {gameRoutes.map((route) => (
        <Link key={route.href} className="nav-link" href={route.href}>
          <span>{route.label}</span>
          <small>{route.description}</small>
        </Link>
      ))}
    </nav>
  );
}

