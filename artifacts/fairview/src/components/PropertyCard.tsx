import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Maximize, Send } from "lucide-react";
import { Property } from "@/lib/mock-data";
import { useGetComments, useAddComment } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppButton } from "./WhatsAppButton";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function PropertyCard({ property }: { property: Property }) {
  const [activeImage, setActiveImage] = useState(property.mainImage);
  const [commentText, setCommentText] = useState("");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Queries
  const { data: comments, refetch } = useGetComments(property.id);
  const addCommentMutation = useAddComment({
    mutation: {
      onSuccess: () => {
        setCommentText("");
        refetch();
        toast({ title: "Comment added successfully" });
      },
      onError: (error) => {
        toast({ 
          title: "Failed to add comment", 
          description: error.error?.error || "Please try again later.",
          variant: "destructive" 
        });
      }
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login to comment", variant: "destructive" });
      setLocation("/login");
      return;
    }
    if (!commentText.trim()) return;
    
    addCommentMutation.mutate({
      propertyId: property.id,
      data: { text: commentText }
    });
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50 transition-all hover:shadow-2xl">
      {/* Media Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-gray-100">
        <div className="relative aspect-video lg:aspect-auto lg:h-[400px]">
          <img 
            src={activeImage} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-md">
            {property.price}
          </div>
        </div>
        
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[200px] lg:h-[400px]">
          {/* Video Placeholder top left */}
          <div className="relative bg-black cursor-pointer group">
            <iframe 
              src={property.videoUrl} 
              title="Property Video"
              className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-3 group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">Video Tour</div>
          </div>
          
          {/* Remaining Images */}
          {property.gallery.slice(0, 3).map((img, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(img)}
              className="relative overflow-hidden group focus:outline-none"
            >
              <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              {activeImage === img && (
                <div className="absolute inset-0 ring-4 ring-inset ring-accent"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">{property.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" /> {property.location}</span>
              <span className="flex items-center gap-1"><Maximize className="w-4 h-4 text-accent" /> {property.size}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <WhatsAppButton 
              label="Virtual Inspection" 
              variant="outline"
              message={`Hello Fairview, I would like to book a Virtual Inspection for ${property.title} located at ${property.location}`} 
            />
            <WhatsAppButton 
              label="Physical Inspection" 
              variant="accent"
              message={`Hello Fairview, I would like to book a Physical Inspection for ${property.title} located at ${property.location}`} 
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

        <div className="border-t pt-8">
          <h4 className="font-display font-bold text-lg mb-6">Questions & Comments</h4>
          
          <div className="space-y-6 mb-6">
            {comments && comments.length > 0 ? (
              comments.map(c => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">{c.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">{c.username}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">No comments yet. Be the first to ask a question!</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <Input 
              placeholder={user ? "Ask a question..." : "Login to join the conversation..."}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-accent"
              onFocus={() => {
                if (!user) setLocation("/login");
              }}
            />
            <Button 
              type="submit" 
              disabled={!user || addCommentMutation.isPending || !commentText.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {addCommentMutation.isPending ? "..." : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
