import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Send, CornerDownRight, Loader2 } from "lucide-react";
import { supabase, type Comment } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

function CommentBubble({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className="flex gap-3">
      <div
        className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-primary/10 flex items-center justify-center shrink-0`}
      >
        <span className={`font-bold text-primary ${isReply ? "text-xs" : "text-sm"}`}>
          {comment.username.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={`font-semibold ${isReply ? "text-xs" : "text-sm"}`}>
            {comment.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(comment.created_at), "MMM d, yyyy")}
          </span>
        </div>
        <p className={`${isReply ? "text-xs" : "text-sm"} text-gray-700 mt-1`}>{comment.text}</p>
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  user: { id: string } | null;
  replyingToId: string | null;
  replyText: string;
  isSubmittingReply: boolean;
  onReplyClick: (id: string) => void;
  onReplyTextChange: (text: string) => void;
  onReplyCancel: () => void;
  onReplySubmit: (e: React.FormEvent, parentId: string) => void;
}

function CommentItem({
  comment,
  replies,
  user,
  replyingToId,
  replyText,
  isSubmittingReply,
  onReplyClick,
  onReplyTextChange,
  onReplyCancel,
  onReplySubmit,
}: CommentItemProps) {
  const isReplying = replyingToId === comment.id;

  return (
    <div>
      <CommentBubble comment={comment} />

      <div className="ml-14 mt-3 space-y-3">
        {replies.map((reply) => (
          <div key={reply.id} className="flex gap-2 items-start">
            <CornerDownRight className="w-3 h-3 text-muted-foreground mt-2 shrink-0" />
            <div className="flex-1">
              <CommentBubble comment={reply} isReply />
            </div>
          </div>
        ))}

        {isReplying ? (
          <form onSubmit={(e) => onReplySubmit(e, comment.id)} className="flex gap-2 mt-2">
            <Input
              autoFocus
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-accent text-sm h-9"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmittingReply || !replyText.trim()}
              className="bg-primary hover:bg-primary/90 h-9"
            >
              {isSubmittingReply ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 text-xs"
              onClick={onReplyCancel}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <button
            onClick={() => onReplyClick(comment.id)}
            className="text-xs text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}

interface CommentSectionProps {
  propertyId: string;
}

export function CommentSection({ propertyId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const loadComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: true });

    if (error) {
      toast({ title: "Failed to load comments", description: error.message, variant: "destructive" });
    } else {
      setComments((data as Comment[]) ?? []);
    }
    setLoading(false);
  }, [propertyId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleReplyClick = (id: string) => {
    if (!user) {
      toast({ title: "Please log in to comment", variant: "destructive" });
      setLocation("/login");
      return;
    }
    setReplyingToId(id);
    setReplyText("");
  };

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
        property_id: propertyId,
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
        property_id: propertyId,
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

  const mainComments = comments.filter((c) => c.parent_id === null);
  const replies = comments.filter((c) => c.parent_id !== null);

  return (
    <div className="border-t pt-8">
      <h4 className="font-display font-bold text-lg mb-6">Questions &amp; Comments</h4>

      <div className="mb-6">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading comments...
          </div>
        ) : mainComments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No comments yet. Be the first to ask a question!
          </p>
        ) : (
          <div className="space-y-6">
            {mainComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={replies.filter((r) => r.parent_id === comment.id)}
                user={user}
                replyingToId={replyingToId}
                replyText={replyText}
                isSubmittingReply={isSubmittingReply}
                onReplyClick={handleReplyClick}
                onReplyTextChange={setReplyText}
                onReplyCancel={() => { setReplyingToId(null); setReplyText(""); }}
                onReplySubmit={submitReply}
              />
            ))}
          </div>
        )}
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
    </div>
  );
}
