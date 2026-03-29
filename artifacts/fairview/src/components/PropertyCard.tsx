import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Maximize, Send, CornerDownRight, Loader2, Star, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Property, Review } from "@/lib/mock-data";
import { supabase, type Comment } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppButton } from "./WhatsAppButton";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

async function fetchUsernameFromProfiles(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not fetch username from profiles.");
  }

  return data.username as string;
}

interface PropertyCardProps {
  property: Property;
  reviews?: Review[];
  hideComments?: boolean;
}

export function PropertyCard({ property, reviews, hideComments = false }: PropertyCardProps) {
  const [activeImage, setActiveImage] = useState(property.mainImage);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const loadComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("property_id", property.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast({ title: "Failed to load comments", description: error.message, variant: "destructive" });
      return;
    }

    setComments((data as Comment[]) ?? []);
  }, [property.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Please log in to comment", variant: "destructive" });
      setLocation("/login");
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const username = await fetchUsernameFromProfiles(user.id);

      const { error } = await supabase.from("comments").insert({
        property_id: property.id,
        user_id: user.id,
        username,
        text: commentText.trim(),
        parent_id: null,
      });

      if (error) {
        toast({ title: "Failed to post comment", description: error.message, variant: "destructive" });
      } else {
        setCommentText("");
        toast({ title: "Comment posted!" });
        await loadComments();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Please log in to comment", variant: "destructive" });
      setLocation("/login");
      return;
    }

    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const username = await fetchUsernameFromProfiles(user.id);

      const { error } = await supabase.from("comments").insert({
        property_id: property.id,
        user_id: user.id,
        username,
        text: replyText.trim(),
        parent_id: parentId,
      });

      if (error) {
        toast({ title: "Failed to post reply", description: error.message, variant: "destructive" });
      } else {
        setReplyText("");
        setReplyingToId(null);
        toast({ title: "Reply posted!" });
        await loadComments();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const renderComments = () => {
    const mainComments = comments.filter((c) => c.parent_id === null);
    const replies = comments.filter((c) => c.parent_id !== null);

    if (mainComments.length === 0) {
      return (
        <p className="text-sm text-muted-foreground italic">
          No comments yet. Be the first to ask a question!
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {mainComments.map((comment) => {
          const commentReplies = replies.filter((r) => r.parent_id === comment.id);
          const isReplying = replyingToId === comment.id;

          return (
            <div key={comment.id}>
              <CommentBubble comment={comment} />

              <div className="ml-14 mt-3 space-y-3">
                {commentReplies.map((reply) => (
                  <div key={reply.id} className="flex gap-2 items-start">
                    <CornerDownRight className="w-3 h-3 text-muted-foreground mt-2 shrink-0" />
                    <div className="flex-1">
                      <CommentBubble comment={reply} isReply />
                    </div>
                  </div>
                ))}

                {isReplying ? (
                  <form onSubmit={(e) => submitReply(e, comment.id)} className="flex gap-2 mt-2">
                    <Input
                      autoFocus
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-accent text-sm h-9"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmittingReply || !replyText.trim()}
                      className="bg-primary hover:bg-primary/90 h-9"
                    >
                      {isSubmittingReply
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Send className="w-3 h-3" />}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-9 text-xs"
                      onClick={() => { setReplyingToId(null); setReplyText(""); }}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        toast({ title: "Please log in to comment", variant: "destructive" });
                        setLocation("/login");
                        return;
                      }
                      setReplyingToId(comment.id);
                      setReplyText("");
                    }}
                    className="text-xs text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50 transition-all hover:shadow-2xl">

      {/* Video — standalone full-width on top */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={property.videoUrl}
          title="Property Video Tour"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
          Video Tour
        </div>
      </div>

      {/* Image gallery row below video */}
      <div className="grid grid-cols-4 gap-1 bg-gray-100">
        <button
          onClick={() => setActiveImage(property.mainImage)}
          className="relative overflow-hidden group focus:outline-none h-32"
        >
          <img
            src={property.mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
            {property.price}
          </div>
          {activeImage === property.mainImage && (
            <div className="absolute inset-0 ring-4 ring-inset ring-accent" />
          )}
        </button>

        {property.gallery.slice(0, 3).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className="relative overflow-hidden group focus:outline-none h-32"
          >
            <img
              src={img}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {activeImage === img && (
              <div className="absolute inset-0 ring-4 ring-inset ring-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Selected image preview */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-200">
        <img
          src={activeImage}
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <Link href={`/property/${property.slug}`}>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2 hover:text-accent transition-colors cursor-pointer inline-flex items-center gap-2 group">
                {property.title}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
              </h3>
            </Link>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" /> {property.location}</span>
              <span className="flex items-center gap-1"><Maximize className="w-4 h-4 text-accent" /> {property.size}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <WhatsAppButton
              label="Virtual Inspection"
              variant="outline"
              message={`Hi,\nI would like to book an inspection\nProperty: ${property.title}\nLocation: ${property.location}\nBooking Type: Virtual Inspection`}
            />
            <WhatsAppButton
              label="Physical Inspection"
              variant="accent"
              message={`Hi,\nI would like to book an inspection\nProperty: ${property.title}\nLocation: ${property.location}\nBooking Type: Physical Inspection`}
            />
          </div>
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {property.features.map(f => (
              <span key={f} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Collapsible Tenant Reviews — shown only when reviews prop is provided */}
        {reviews && reviews.length > 0 && (
          <div className="border-t pt-6 mb-6">
            <button
              onClick={() => setReviewsOpen(prev => !prev)}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-3">
                <h4 className="font-display font-bold text-lg">Verified Tenant Reviews</h4>
                <span className="text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">
                  {reviews.length}
                </span>
              </div>
              {reviewsOpen
                ? <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                : <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            </button>

            {reviewsOpen && (
              <div className="mt-5 grid md:grid-cols-3 gap-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex gap-1 mb-3">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-4">"{rev.text}"</p>
                    <p className="font-bold text-sm text-primary">{rev.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        {!hideComments && <div className="border-t pt-8">
          <h4 className="font-display font-bold text-lg mb-6">Questions & Comments</h4>

          <div className="mb-6">
            {renderComments()}
          </div>

          {user ? (
            <form onSubmit={submitComment} className="flex gap-3">
              <Input
                placeholder="Ask a question or leave a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-accent"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-dashed border-gray-200">
              <p className="text-sm text-muted-foreground">Please log in to comment</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLocation("/login")}
                className="shrink-0"
              >
                Log in
              </Button>
            </div>
          )}
        </div>}
      </div>
    </div>
  );
}

function CommentBubble({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-primary/10 flex items-center justify-center shrink-0`}>
        <span className={`font-bold text-primary ${isReply ? "text-xs" : "text-sm"}`}>
          {comment.username.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={`font-semibold ${isReply ? "text-xs" : "text-sm"}`}>{comment.username}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(comment.created_at), "MMM d, yyyy")}
          </span>
        </div>
        <p className={`${isReply ? "text-xs" : "text-sm"} text-gray-700 mt-1`}>{comment.text}</p>
      </div>
    </div>
  );
}
