import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from "lucide-react";

const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
};

export function Footer() {
  const { isAdmin } = useAuth();
  const socialLinks = useQuery(api.socialLinks.getSocialLinks) || [];
  const createSocialLink = useMutation(api.socialLinks.createSocialLink);
  const deleteSocialLink = useMutation(api.socialLinks.deleteSocialLink);
  
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newLink, setNewLink] = React.useState({
    name: "",
    url: "",
    icon: "facebook",
  });

  const handleAddLink = async () => {
    if (!newLink.name.trim() || !newLink.url.trim()) return;
    
    await createSocialLink({
      name: newLink.name.trim(),
      url: newLink.url.trim(),
      icon: newLink.icon,
    });
    
    setNewLink({ name: "", url: "", icon: "facebook" });
    setShowAddDialog(false);
  };

  const handleDeleteLink = async (id: Id<"socialLinks">) => {
    if (confirm("Delete this social media link?")) {
      await deleteSocialLink({ id });
    }
  };

  return (
    <footer className="bg-muted/30 border-t mt-8">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Meteabity Arkobkobay Sweden. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {socialLinks.map((link) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap] || Facebook;
              return (
                <div key={link._id} className="flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    <IconComponent className="size-5" />
                    <span className="text-sm">{link.name}</span>
                  </a>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLink(link._id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              );
            })}
            
            {isAdmin && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Social Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Social Media Link</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newLink.name}
                        onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Facebook"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        value={newLink.url}
                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Icon</label>
                      <select
                        value={newLink.icon}
                        onChange={(e) => setNewLink(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full p-2 border rounded-md text-black"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                        <option value="github">GitHub</option>
                      </select>
                    </div>
                    <Button onClick={handleAddLink} disabled={!newLink.name.trim() || !newLink.url.trim()}>
                      Add Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}