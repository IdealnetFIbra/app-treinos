"use client";

import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Video } from "@/lib/database.types";

interface VideoCarouselProps {
  title: string;
  videos: Video[];
}

export function VideoCarousel({ title, videos }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/exercicio/${videoId}`);
  };

  return (
    <div className="mb-8 md:mb-12">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-12">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Videos */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video.id)}
              className="flex-shrink-0 w-[280px] md:w-[320px] group/card cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-md overflow-hidden bg-[#121212] mb-2">
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.duration} min
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                {video.title}
              </h3>
              <p className="text-gray-400 text-xs">{video.level || "Todos os níveis"}</p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
