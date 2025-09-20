import React from "react";
import OperatorLogo from "./OperatorLogo";
import { Wifi, User, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultCard({ item, onSelect }: any) {
  return (
    <article className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center gap-4 flex-1">
        <OperatorLogo name={item.operator} size={56} />
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold text-black">{item.depart}</div>
              <div className="text-sm text-slate-500">{item.from || ""}</div>
            </div>
            <div className="mx-2 text-sm text-slate-400">→</div>
            <div>
              <div className="text-2xl font-bold text-black">{item.arrive}</div>
              <div className="text-sm text-slate-500">{item.to || ""}</div>
            </div>
            <div className="ml-4 text-sm text-slate-600">
              {item.operator}{" "}
              <span className="text-yellow-500 ml-2 inline-flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {item.rating}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {item.duration}
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />{" "}
              {item.features.includes("wifi") ? "Wi-Fi" : ""}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" /> {item.seats} koltuk
            </div>
            {item.features.includes("power") && (
              <div className="px-2 py-1 text-xs border rounded">Priz</div>
            )}
            {item.features.includes("toilet") && (
              <div className="px-2 py-1 text-xs border rounded">Tuvalet</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-0 md:ml-4 flex items-center gap-4 md:flex-col">
        <div className="text-xl font-bold text-red-600 md:text-2xl">
          {item.price}₺
        </div>
        <div className="text-sm text-slate-500">Kişi başı</div>
        <Button
          className="bg-black text-white"
          onClick={() => onSelect && onSelect(item)}
        >
          Seç
        </Button>
      </div>
    </article>
  );
}
