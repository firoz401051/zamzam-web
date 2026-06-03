"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Heart,
  Bookmark,
} from "lucide-react";
import { motion } from "motion/react";

interface SocialShareProps {
  title: string;
  url: string;
}

const SocialShare = ({ title, url }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Card className="border-zamzam-surface shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-4 h-4 text-zamzam-primary" />
          <h3 className="font-semibold text-zamzam-text-dark text-sm">
            Share Article
          </h3>
        </div>

        <div className="space-y-3">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.facebook, "_blank")}
              className="flex items-center gap-2 border-zamzam-surface hover:bg-blue-50 hover:border-blue-200"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.twitter, "_blank")}
              className="flex items-center gap-2 border-zamzam-surface hover:bg-sky-50 hover:border-sky-200"
            >
              <Twitter className="w-4 h-4 text-sky-500" />
              <span className="text-xs">Twitter</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.linkedin, "_blank")}
              className="flex items-center gap-2 border-zamzam-surface hover:bg-blue-50 hover:border-blue-200"
            >
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span className="text-xs">LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2 border-zamzam-surface hover:bg-zamzam-surface"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zamzam-text-medium" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-zamzam-surface">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                liked
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-zamzam-surface text-zamzam-text-medium hover:bg-zamzam-primary-light hover:text-zamzam-primary border border-transparent"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span>Like</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                bookmarked
                  ? "bg-zamzam-primary-light text-zamzam-primary border border-zamzam-primary/20"
                  : "bg-zamzam-surface text-zamzam-text-medium hover:bg-zamzam-primary-light hover:text-zamzam-primary border border-transparent"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
              />
              <span>Save</span>
            </motion.button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
