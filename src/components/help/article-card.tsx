"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  isNew?: boolean;
}

export const ArticleCard = ({ title, description, href, icon, isNew = false }: ArticleCardProps) => {
  return (
    <Link href={href} className="block">
      <motion.div
        className="group h-full rounded-lg border bg-card/60 p-6 transition-all hover:bg-card/80 hover:border-primary/20"
        whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <h3 className="mb-2 font-medium group-hover:text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {isNew && (
          <span className="mt-2 inline-flex items-center rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
            New
          </span>
        )}
      </motion.div>
    </Link>
  );
};