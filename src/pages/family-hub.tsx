import * as React from "react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  Bell,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Edit,
  Heart,
  LogOut,
  MessageCircle,
  PartyPopper,
  Plus,
  Search,
  Smile,
  Star,
  ThumbsUp,
  Trash2,
  TreeDeciduous,
  Users,
  CheckCircle2,
  Save,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/contexts/theme-context";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { SafeFileUpload, SafeMediaPreview } from "@/components/SafeFileUpload";
import { SimpleDatePicker } from "@/components/ui/simple-date-picker";
import { Footer } from "@/components/Footer";

type MediaAsset =
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string; posterUrl?: string };

type ReactionType = "like" | "smile" | "heart" | "celebrate";

type Comment = {
  id: string;
  author: string;
  text: string;
  dateISO: string;
  reactions: Record<ReactionType, number>;
};

type FamilyNews = {
  id: string;
  title: string;
  dateISO: string;
  location?: string;
  kind: "Sweden" | "USA" | "Germany" | "Eritrea" | "Other" | "Birthday" | "Reunion" | "Holiday";
  notes?: string;
  media?: MediaAsset;
  reactions: Record<ReactionType, number>;
  comments: Comment[];
};


type FamilyNode = {
  id: string;
  name: string;
  imageUrl?: string;
  birthYear?: number;
  note?: string;
  fatherId?: string;
  motherId?: string;
  parentId?: string;
  gender?: "male" | "female" | "other";
  children?: FamilyNode[];
  partner?: FamilyNode;
};

type Family = {
  id: string;
  name: string;
  imageUrl?: string;
  tree: FamilyNode;
};

type GalleryItem = {
  id: string;
  type: "news";
  title: string;
  dateISO: string;
  description?: string;
  meta?: string;
  tags?: string[];
  media: MediaAsset;
};

const initialNews: FamilyNews[] = [
  {
    id: "evt_1",
    title: "Aunt Maria’s birthday dinner",
    dateISO: "2026-02-05",
    location: "Downtown Bistro",
    kind: "Birthday",
    notes: "RSVP by Jan 28",
    reactions: { like: 3, smile: 1, heart: 2, celebrate: 0 },
    comments: [
      {
        id: "c_evt_1_1",
        author: "Sam",
        text: "I’m in!",
        dateISO: "2026-01-08",
        reactions: { like: 1, smile: 0, heart: 0, celebrate: 0 },
      },
    ],
    media: {
      type: "image",
      url: "./placeholder.svg",
      alt: "Dinner table",
    },
  },
  {
    id: "evt_2",
    title: "Family reunion planning call",
    dateISO: "2026-01-20",
    location: "Video call",
    kind: "Reunion",
    notes: "Pick dates + budget",
    reactions: { like: 2, smile: 0, heart: 0, celebrate: 1 },
    comments: [],
    media: {
      type: "video",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
  },
  {
    id: "evt_3",
    title: "Spring picnic",
    dateISO: "2026-04-11",
    location: "Riverside Park",
    kind: "Other",
    reactions: { like: 0, smile: 2, heart: 0, celebrate: 0 },
    comments: [],
    media: {
      type: "image",
      url: "./placeholder.svg",
      alt: "Park picnic",
    },
  },
];


const initialTree: FamilyNode = {
  id: "p_1",
  name: "Jordan Lee",
  imageUrl: "./placeholder.svg",
  birthYear: 1954,
  note: "Family historian",
  children: [
    {
      id: "p_2",
      name: "Sam Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 1978,
      children: [
        {
          id: "p_4",
          name: "Avery Lee",
          imageUrl: "./placeholder.svg",
          birthYear: 2006,
        },
        {
          id: "p_5",
          name: "Riley Lee",
          imageUrl: "./placeholder.svg",
          birthYear: 2009,
        },
      ],
    },
    {
      id: "p_3",
      name: "Morgan Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 1981,
      children: [
        {
          id: "p_6",
          name: "Casey Lee",
          imageUrl: "./placeholder.svg",
          birthYear: 2014,
        },
      ],
    },
  ],
};

const initialFamilies: Family[] = [
  {
    id: "fam_1",
    name: "Lee Family",
    imageUrl: "./placeholder.svg",
    tree: initialTree,
  },
  {
    id: "fam_2",
    name: "Smith Family",
    imageUrl: "./placeholder.svg",
    tree: {
      id: "s_1",
      name: "John Smith",
      imageUrl: "./placeholder.svg",
      birthYear: 1960,
      children: [
        {
          id: "s_2",
          name: "Alice Smith",
          imageUrl: "./placeholder.svg",
          birthYear: 1985,
        },
      ],
    },
  },
  {
    id: "fam_3",
    name: "Johnson Family",
    imageUrl: "./placeholder.svg",
    tree: {
      id: "j_1",
      name: "Robert Johnson",
      imageUrl: "./placeholder.svg",
      birthYear: 1955,
      children: [
        {
          id: "j_2",
          name: "Emma Johnson",
          imageUrl: "./placeholder.svg",
          birthYear: 1980,
          children: [
            {
              id: "j_3",
              name: "Liam Johnson",
              imageUrl: "./placeholder.svg",
              birthYear: 2010,
            },
          ],
        },
        {
          id: "j_4",
          name: "Noah Johnson",
          imageUrl: "./placeholder.svg",
          birthYear: 1983,
        },
      ],
    },
  },
  {
    id: "fam_4",
    name: "Williams Family",
    imageUrl: "./placeholder.svg",
    tree: {
      id: "w_1",
      name: "Michael Williams",
      imageUrl: "./placeholder.svg",
      birthYear: 1950,
      children: [
        {
          id: "w_2",
          name: "Sophia Williams",
          imageUrl: "./placeholder.svg",
          birthYear: 1975,
        },
        {
          id: "w_3",
          name: "Oliver Williams",
          imageUrl: "./placeholder.svg",
          birthYear: 1978,
          children: [
            {
              id: "w_4",
              name: "Ava Williams",
              imageUrl: "./placeholder.svg",
              birthYear: 2005,
            },
            {
              id: "w_5",
              name: "Ethan Williams",
              imageUrl: "./placeholder.svg",
              birthYear: 2008,
            },
          ],
        },
      ],
    },
  },
  {
    id: "fam_5",
    name: "Brown Family",
    imageUrl: "./placeholder.svg",
    tree: {
      id: "b_1",
      name: "David Brown",
      imageUrl: "./placeholder.svg",
      birthYear: 1965,
      children: [
        {
          id: "b_2",
          name: "Isabella Brown",
          imageUrl: "./placeholder.svg",
          birthYear: 1990,
        },
      ],
    },
  },
  {
    id: "fam_6",
    name: "Davis Family",
    imageUrl: "./placeholder.svg",
    tree: {
      id: "d_1",
      name: "James Davis",
      imageUrl: "./placeholder.svg",
      birthYear: 1958,
      children: [
        {
          id: "d_2",
          name: "Mia Davis",
          imageUrl: "./placeholder.svg",
          birthYear: 1985,
          children: [
            {
              id: "d_3",
              name: "Lucas Davis",
              imageUrl: "./placeholder.svg",
              birthYear: 2012,
            },
          ],
        },
        {
          id: "d_4",
          name: "Charlotte Davis",
          imageUrl: "./placeholder.svg",
          birthYear: 1988,
        },
      ],
    },
  },
];


function kindVariant(kind: FamilyNews["kind"]) {
  if (kind === "Birthday") return "default";
  if (kind === "Reunion") return "secondary";
  if (kind === "Holiday") return "outline";
  return "outline";
}

function findNode(
  root: FamilyNode | undefined,
  id: string
): FamilyNode | undefined {
  if (!root || !root.id) return undefined;
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return undefined;
}
function flattenTree(root: FamilyNode): FamilyNode[] {
  const nodes: FamilyNode[] = [];
  function traverse(node: FamilyNode) {
    nodes.push(node);
    for (const child of node.children ?? []) {
      traverse(child);
    }
  }
  traverse(root);
  return nodes;
}

import { client, urlFor } from "../sanityClient";
import { v4 as uuidv4 } from 'uuid';

type Id<T> = string;


const useFileUpload = () => {
  const uploadFile = async (file: File): Promise<string> => {
    try {
      const type = file.type.startsWith('video') ? 'file' : 'image';
      const asset = await client.assets.upload(type, file, {
        contentType: file.type,
        filename: file.name
      });
      return asset.url;
    } catch (e) {
      console.error("Upload failed", e);
      alert("Upload failed. Check API token permissions.");
      throw e;
    }
  };

  return { uploadFile };
};

function safeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed;
}

function MediaTile({
  media,
  className,
  onClick,
}: {
  media?: MediaAsset;
  className?: string;
  onClick?: () => void;
}) {
  const clickable = typeof onClick === "function";

  if (!media?.url) {
    return (
      <div
        className={
          "bg-muted text-muted-foreground flex items-center justify-center rounded-md border " +
          (className ?? "")
        }
      >
        <div className="flex items-center gap-2 text-xs">
          <Camera className="size-4" />
          Add image/video
        </div>
      </div>
    );
  }

  const Component = clickable ? "button" : "div";

  if (media.type === "video") {
    // Prevent trying to load blob URLs that might have been saved to DB by mistake
    const isBlob = media.url.startsWith('blob:');
    if (isBlob) {
      return (
        <div className={`bg-muted text-muted-foreground flex items-center justify-center rounded-md border text-center p-4 ${className ?? ""}`}>
          <div className="flex flex-col items-center gap-2 text-xs">
            <Clapperboard className="size-6 opacity-20" />
            <span>Video preview unavailable</span>
          </div>
        </div>
      );
    }

    return (
      <Component
        type={clickable ? "button" : undefined}
        onClick={onClick}
        disabled={clickable ? undefined : undefined}
        className={
          "group relative overflow-hidden rounded-md border text-left block " +
          (clickable
            ? "hover:bg-accent/30 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            : "") +
          " " +
          (className ?? "")
        }
      >
        <video
          className={
            "absolute inset-0 w-full h-full object-cover " +
            (clickable ? "transition-transform group-hover:scale-[1.01]" : "")
          }
          src={media.url}
          poster={"posterUrl" in media ? media.posterUrl : undefined}
          controls={!clickable}
          muted
          loop={clickable}
          autoPlay={clickable}
          playsInline
          preload="auto"
          onError={(e) => {
            console.log("Video failed to load:", media.url);
            // Don't hide the video, just show controls so user can try to play it
            e.currentTarget.controls = true;
          }}
        />
        {clickable ? (
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 to-transparent z-10" />
        ) : null}
        {clickable ? (
          <div className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs text-white z-20">
            <Clapperboard className="size-3.5" />
            Play
          </div>
        ) : null}
      </Component>
    );
  }

  return (
    <Component
      type={clickable ? "button" : undefined}
      onClick={onClick}
      disabled={clickable ? undefined : undefined}
      className={
        "group relative overflow-hidden rounded-md border text-left block " +
        (clickable
          ? "hover:bg-accent/30 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
          : "") +
        " " +
        (className ?? "")
      }
    >
      <img
        src={media.url}
        alt={media.alt ?? ""}
        className={
          "absolute inset-0 w-full h-full object-cover " +
          (clickable ? "transition-transform group-hover:scale-[1.01]" : "")
        }
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      {clickable ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 to-transparent z-10" />
      ) : null}
    </Component>
  );
}

function MediaPill({ media }: { media?: MediaAsset }) {
  if (!media?.url) return null;
  return (
    <Badge variant="outline" className="gap-1.5">
      {media.type === "video" ? (
        <Clapperboard className="size-3.5" />
      ) : (
        <Camera className="size-3.5" />
      )}
      {media.type}
    </Badge>
  );
}

function ReactionButton({
  icon,
  label,
  count,
  onClick,
  isActive = false,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
  isActive?: boolean;
}) {
  const getReactionColors = (
    label: string,
    hasReactions: boolean,
    isActive: boolean
  ) => {
    const baseClasses =
      "relative overflow-hidden transition-all duration-200 active:scale-95";
    if (isActive) {
      switch (label.toLowerCase()) {
        case "like":
          return `${baseClasses} text-blue-500 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-800`;
        case "smile":
          return `${baseClasses} text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800`;
        case "heart":
          return `${baseClasses} text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 border-red-200 dark:border-red-800`;
        case "yay":
          return `${baseClasses} text-purple-500 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-200 dark:border-purple-800`;
        default:
          return `${baseClasses} bg-accent hover:bg-accent/70 border-primary`;
      }
    } else if (hasReactions) {
      switch (label.toLowerCase()) {
        case "like":
          return `${baseClasses} hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30`;
        case "smile":
          return `${baseClasses} hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30`;
        case "heart":
          return `${baseClasses} hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30`;
        case "yay":
          return `${baseClasses} hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30`;
        default:
          return `${baseClasses} hover:bg-accent/50`;
      }
    } else {
      return `${baseClasses} hover:bg-accent/50`;
    }
  };

  const hasReactions = count > 0;

  return (
    <Button
      type="button"
      variant={isActive ? "outline" : "ghost"}
      size="sm"
      className={`h-8 gap-1.5 px-2 ${getReactionColors(label, hasReactions, isActive)}`}
      onClick={(e) => {
        const button = e.currentTarget;
        button.classList.add("animate-bounce");
        const sparkle = document.createElement("div");
        sparkle.className =
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45 -translate-x-full animate-[sparkle_0.5s_ease-out]";
        button.appendChild(sparkle);
        setTimeout(() => {
          button.classList.remove("animate-bounce");
          if (button.contains(sparkle)) {
            button.removeChild(sparkle);
          }
        }, 500);
        onClick();
      }}
    >
      <span className="transition-colors duration-200">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
      <span
        className={`text-xs tabular-nums transition-colors duration-200 ${hasReactions || isActive ? "" : "text-muted-foreground"}`}
      >
        {count}
      </span>
    </Button>
  );
}

const DiagramPersonCard = ({
  person,
  isSelected,
  level,
  onSelect,
  onToggle,
  isExpanded,
  hasChildren,
  childrenCount,
  showToggle = false
}: {
  person: FamilyNode;
  isSelected: boolean;
  level: number;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  isExpanded: boolean;
  hasChildren: boolean;
  childrenCount: number;
  showToggle?: boolean;
}) => {
  const getRoleLabel = () => {
    if (!person.gender) return null;
    const isMale = person.gender === "male";
    const isFemale = person.gender === "female";

    if (level === 0 || hasChildren) {
      if (isMale) return "Father";
      if (isFemale) return "Mother";
      return "Parent";
    }

    if (level > 0) {
      if (isMale) return "Son";
      if (isFemale) return "Daughter";
      return "Child";
    }
    return null;
  };

  const roleLabel = getRoleLabel();

  return (
    <div
      className={cn(
        "relative w-48 overflow-hidden rounded-2xl border transition-all duration-500 shrink-0",
        "bg-card/40 backdrop-blur-xl hover:bg-card/70 hover:shadow-2xl hover:-translate-y-1.5",
        isSelected
          ? "ring-2 ring-primary ring-offset-4 border-primary/50 bg-primary/10 shadow-primary/20"
          : "border-border/60 shadow-md"
      )}
    >
      {isSelected && (
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-primary/10 animate-pulse" />
      )}

      {/* Role Badge - Floating at top right */}
      {roleLabel && (
        <div className={cn(
          "absolute top-2 right-2 z-20 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest shadow-xs",
          person.gender === 'male' ? "bg-blue-500 text-white" :
            person.gender === 'female' ? "bg-pink-500 text-white" :
              "bg-primary text-primary-foreground"
        )}>
          {roleLabel}
        </div>
      )}

      <div className={cn(
        "h-1.5 w-full bg-linear-to-r",
        level === 0 ? "from-primary to-primary/60" :
          level === 1 ? "from-blue-500 to-indigo-400" :
            level === 2 ? "from-emerald-500 to-teal-400" : "from-muted-foreground/40 to-muted-foreground/20"
      )} />

      <button
        type="button"
        onClick={() => onSelect(person.id)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "size-14 shrink-0 overflow-hidden rounded-full border-2 p-0.5 transition-transform duration-300",
              isSelected ? "border-primary" : "border-background"
            )}>
              <img
                src={person.imageUrl || "/placeholder.svg"}
                alt={person.name}
                className="h-full w-full rounded-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-extrabold tracking-tight leading-tight">
              {person.name}
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
              <Calendar className="size-3" />
              {person.birthYear ? `Born ${person.birthYear}` : "Unknown"}
            </div>
          </div>
        </div>
      </button>

      {showToggle && (
        <div className="absolute left-2 top-2 z-20">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-6 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(person.id);
            }}
          >
            <ChevronRight className={cn(
              "size-3 transition-transform duration-300",
              isExpanded ? "rotate-90" : ""
            )} />
          </Button>
        </div>
      )}
    </div>
  );
};

function DiagramTreeNode({
  node,
  expanded,
  selectedId,
  onToggle,
  onSelect,
  level,
}: {
  node: FamilyNode;
  expanded: Record<string, boolean>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  level: number;
}) {
  const isExpanded = expanded[node.id] ?? level < 2;
  const hasChildren = (node.children?.length ?? 0) > 0;
  const children = node.children ?? [];

  return (
    <div className="flex flex-col w-full px-0 mx-0 items-start sm:items-stretch">
      {/* Parent Row (Father + Mother) */}
      <div className="relative flex flex-col sm:flex-row w-full items-stretch justify-start sm:justify-center gap-0 sm:gap-12 mb-6 sm:mb-12">
        {/* Connection Line DOWN from Parents */}
        {hasChildren && isExpanded && (
          <div className={cn(
            "hidden md:block absolute left-1/2 -translate-x-1/2 w-1 bg-muted-foreground/20 z-0",
            node.partner ? "top-1/2 h-12" : "top-full h-8"
          )} />
        )}

        {/* Marriage Bridge */}
        {node.partner && (
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-muted-foreground/30 z-0" />
        )}

        <DiagramPersonCard
          person={node}
          isSelected={selectedId === node.id}
          level={level}
          onSelect={onSelect}
          onToggle={onToggle}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          childrenCount={children.length}
          showToggle={hasChildren}
        />

        {node.partner && (
          <DiagramPersonCard
            person={node.partner}
            isSelected={selectedId === node.partner.id}
            level={level}
            onSelect={onSelect}
            onToggle={onToggle}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            childrenCount={children.length}
            showToggle={false}
          />
        )}
      </div>

      {/* Children Section */}
      {hasChildren && isExpanded ? (
        <div className="relative flex flex-col sm:flex-wrap w-full items-stretch justify-start sm:justify-center gap-0 sm:gap-x-8 sm:gap-y-12">
          {children.map((child, idx) => (
            <div key={child.id} className="relative">
              {/* Horizontal sibling connector bar */}
              {children.length > 1 && (
                <div className={cn(
                  "hidden md:block absolute -top-12 h-1 bg-muted-foreground/20",
                  idx === 0 ? "left-1/2 right-0" :
                    idx === children.length - 1 ? "left-0 right-1/2" :
                      "left-0 right-0"
                )} />
              )}
              {/* Vertical line from bar to child node */}
              <div className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-12 bg-muted-foreground/20" />

              <DiagramTreeNode
                node={child}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={onToggle}
                onSelect={onSelect}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NewsListItem({
  news,
  onClick,
}: {
  news: any;
  onClick: () => void;
}) {
  return (
    <div
      className="rounded-lg border p-3 transition-colors hover:bg-accent/30 cursor-pointer whitespace-nowrap flex-shrink-0 lg:whitespace-normal lg:flex-shrink w-48 lg:w-full"
      onClick={onClick}
    >
      <div className="grid gap-2">
        <MediaTile media={news.media} className="aspect-video w-full" />
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">{news.title}</div>
          <div className="text-muted-foreground text-xs">
            {format(parseISO(news.dateISO), "MMM d")}
          </div>
          <Badge variant={kindVariant(news.kind)} className="mt-1">
            {news.kind}
          </Badge>
        </div>
      </div>
    </div>
  );
}


export default function FamilyHubPage() {
  const { isAdmin, logout } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();
  const { uploadFile } = useFileUpload();
  const [tab, setTab] = React.useState<"sweden" | "usa" | "germany" | "eritrea" | "tree">("sweden");
  const [addMode, setAddMode] = React.useState<"news" | "person" | "social" | "family" | "settings">(
    "news"
  );
  const [editingNewsItem, setEditingNewsItem] = React.useState<Id<"news"> | null>(
    null
  );
  const [editingPerson, setEditingPerson] = React.useState<string | null>(null);
  const [editingFamily, setEditingFamily] = React.useState<Id<"families"> | null>(
    null
  );
  const [query, setQuery] = React.useState("");

  // Sanity State
  const [newsList, setNewsList] = React.useState<any[]>([]);
  const [families, setFamilies] = React.useState<any[]>([]);
  const [userReactions, setUserReactions] = React.useState<any[]>([]);
  const [allNodes, setAllNodes] = React.useState<any[]>([]);

  const mapDoc = (doc: any) => {
    const mapped = { ...doc, id: doc._id };

    // Sanitize blob URLs from database data
    if (mapped.media?.url && mapped.media.url.startsWith('blob:')) {
      console.warn("Filtered out blob URL from media:", mapped.id);
      mapped.media.url = ""; // Clear invalid URL
    }
    if (mapped.imageUrl && mapped.imageUrl.startsWith('blob:')) {
      console.warn("Filtered out blob URL from imageUrl:", mapped.id);
      mapped.imageUrl = ""; // Clear invalid URL
    }

    // Handle legacy 'person' type field mapping
    if (doc._type === "person") {
      mapped.name = doc.fullName || doc.name;
      if (doc.photo?.asset) {
        try {
          // If it's a Sanity image reference
          mapped.imageUrl = urlFor(doc.photo).url();
        } catch (e) {
          mapped.imageUrl = doc.imageUrl;
        }
      }
      if (doc.birthDate && !mapped.birthYear) {
        mapped.birthYear = parseInt(doc.birthDate.split("-")[0]);
      }
    }
    return mapped;
  };

  const fetchData = React.useCallback(async () => {
    try {
      const [sw, us, ge, er, f, ur, fn] = await Promise.all([
        client.fetch(`*[_type == "swedenNews"]`),
        client.fetch(`*[_type == "usaNews"]`),
        client.fetch(`*[_type == "germanyNews"]`),
        client.fetch(`*[_type == "eritreaNews"]`),
        client.fetch(`*[_type == "family"]`),
        client.fetch(`*[_type == "userReaction"]`),
        client.fetch(`*[_type in ["familyNode", "person"]]`)
      ]);
      setNewsList([...sw, ...us, ...ge, ...er].map(mapDoc));
      setFamilies(f.map(mapDoc));
      setUserReactions(ur.map(mapDoc));
      setAllNodes(fn.map(mapDoc));
      // We'll handle familyNodes separately or inside families if structured that way. 
      // NOTE: existing app expects families to contain 'tree' or fetch nodes.
      // We will assume families have a reference or we fetch nodes.
      // Actually, the app fetches families, then fetches familyNodes separately below (line 1123).
      // So we don't need to set familyNodes to state here, just families.
    } catch (err) {
      console.error("fetch failed", err);
    }
  }, []);

  React.useEffect(() => {
    fetchData();

    const subscription = client.listen(`*[_type in ["swedenNews", "usaNews", "germanyNews", "eritreaNews", "family", "userReaction", "familyNode", "comment"]]`)
      .subscribe((update) => {
        console.log("Real-time update received", update);
        fetchData();
      });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  // Mutations
  const createNews = async (args: any) => {
    try {
      const { type, ...rest } = args;
      const doc = await client.create({ _type: type, ...rest });
      setNewsList(prev => [...prev, mapDoc(doc)]);
    } catch (e) { console.error(e); alert("Error creating news"); }
  };
  const updateNews = async (args: any) => {
    try {
      const { id, type, ...rest } = args;
      // Sanity update requires _type if we're doing certain patches or if it's unclear, 
      // but usually patch(id) is enough. However, we should ensure type is used if needed.
      await client.patch(id).set(rest).commit();
      await fetchData();
    } catch (e) { console.error(e); alert("Error updating news"); }
  };
  const deleteNews = async ({ id }: { id: string }) => {
    try {
      const fixedId = id.replace('drafts.', '');
      // 1. Find all comments for this news
      const comments = await client.fetch(`*[_type == "comment" && item._ref == $id]._id`, { id: fixedId });
      // 2. Find all reactions for this news
      const reactions = await client.fetch(`*[_type == "userReaction" && (item._ref == $id || itemId == $id)]._id`, { id: fixedId });
      // 3. Find all reactions for these comments
      const commentReactions = comments.length > 0
        ? await client.fetch(`*[_type == "userReaction" && item._ref in $ids]._id`, { ids: comments })
        : [];

      const tx = client.transaction();
      commentReactions.forEach(rid => tx.delete(rid));
      comments.forEach(cid => tx.delete(cid));
      reactions.forEach(rid => tx.delete(rid));
      tx.delete(fixedId);

      await tx.commit();
      await fetchData();
    } catch (e) {
      console.error(e);
      alert("Error deleting news. There might be persistent references.");
    }
  };

  const addNewsReaction = async ({ newsId, reaction, userId }: any) => {
    try {
      const fixedId = newsId.replace('drafts.', '');

      // Optimistic update for newsList
      setNewsList(prev => prev.map(n => {
        if (n._id === fixedId) {
          const reactions = n.reactions ? { ...n.reactions } : { like: 0, smile: 0, heart: 0, celebrate: 0 };
          reactions[reaction] = (reactions[reaction] || 0) + 1;
          return { ...n, reactions };
        }
        return n;
      }));

      // Check for existing reaction by this user on this event
      const existingReaction = userReactions.find(
        (ur) => ur.item?._ref === fixedId && ur.userId === userId
      );

      if (existingReaction) {
        if (existingReaction.reactionType === reaction) {
          console.log("Already reacted with this type");
          return;
        } else {
          // Decrement old
          setNewsList(prev => prev.map(n => {
            if (n._id === fixedId) {
              const reactions = { ...n.reactions };
              reactions[existingReaction.reactionType] = Math.max(0, (reactions[existingReaction.reactionType] || 0) - 1);
              return { ...n, reactions };
            }
            return n;
          }));
          await client.patch(fixedId).dec({ [`reactions.${existingReaction.reactionType}`]: 1 }).commit();
          await client.delete(existingReaction._id);
        }
      }

      await client
        .patch(fixedId)
        .setIfMissing({ reactions: { like: 0, smile: 0, heart: 0, celebrate: 0 } })
        .inc({ [`reactions.${reaction}`]: 1 })
        .commit();

      await client.create({ _type: 'userReaction', userId, reactionType: reaction, item: { _type: 'reference', _ref: fixedId } });
      // No need for fetchData() here as we updated locally and listener will catch it eventually
    } catch (e) { console.error(e); }
  };


  const addComment = async ({ text, author, itemId, itemType }: any) => {
    try {
      const fixedItemId = itemId.replace('drafts.', '');
      const newComment = await client.create({
        _type: 'comment',
        text,
        author,
        dateISO: new Date().toISOString(),
        item: { _type: 'reference', _ref: fixedItemId }, // Strong reference to match schema
        // Keeping these to avoid "Unknown field" errors if schema hasn't deployed or if we want to be safe
        itemId: fixedItemId,
        itemType
      });
      // immediate UI update
      const mappedComment = mapDoc(newComment);
      if (fixedItemId === selectedNewsId) {
        setSelectedNewsComments(prev => [mappedComment, ...prev]);
      } else if (activeGalleryItem && fixedItemId === activeGalleryItem.id) {
        setActiveGalleryComments(prev => [mappedComment, ...prev]);
      }
    } catch (e) { console.error(e); }
  };
  const deleteComment = async ({ commentId }: any) => {
    try {
      const fixedId = commentId.replace('drafts.', '');
      // Find associated reactions
      const reactions = await client.fetch(`*[_type == "userReaction" && item._ref == $id]._id`, { id: fixedId });

      const tx = client.transaction();
      reactions.forEach(rid => tx.delete(rid));
      tx.delete(fixedId);

      await tx.commit();
      await fetchData();
    } catch (e) { console.error(e); }
  };
  const addCommentReaction = async ({ commentId, reaction, userId }: any) => {
    try {
      const fixedId = commentId.replace('drafts.', '');

      // Check for existing reaction by this user on this comment
      const existingReaction = userReactions.find(
        (ur) => ur.item?._ref === fixedId && ur.userId === userId
      );

      // Local update helper
      const updateCommentsLocally = (targetId: string, type: string, amount: number) => {
        const updater = (prev: any[]) => prev.map(c => {
          if (c._id === targetId) {
            const reactions = c.reactions ? { ...c.reactions } : { like: 0, smile: 0, heart: 0, celebrate: 0 };
            reactions[type as ReactionType] = Math.max(0, (reactions[type as ReactionType] || 0) + amount);
            return { ...c, reactions };
          }
          return c;
        });
        setSelectedNewsComments(prev => updater(prev));
        setActiveGalleryComments(prev => updater(prev));
      };

      if (existingReaction) {
        if (existingReaction.reactionType === reaction) {
          console.log("Already reacted with this type");
          return;
        } else {
          // Decrement old locally
          updateCommentsLocally(fixedId, existingReaction.reactionType, -1);
          // Patch Sanity
          await client.patch(fixedId).dec({ [`reactions.${existingReaction.reactionType}`]: 1 }).commit();
          await client.delete(existingReaction._id);
        }
      }

      // Optimistic increment locally
      updateCommentsLocally(fixedId, reaction, 1);

      await client
        .patch(fixedId)
        .setIfMissing({ reactions: { like: 0, smile: 0, heart: 0, celebrate: 0 } })
        .inc({ [`reactions.${reaction}`]: 1 })
        .commit();
      await client.create({
        _type: 'userReaction',
        userId,
        reactionType: reaction,
        item: { _type: 'reference', _ref: fixedId }
      });
    } catch (e) { console.error(e); }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const createFamily = async (args: any) => {
    try {
      const { name, imageUrl, slug: passedSlug, ...rest } = args;
      const slug = passedSlug || generateSlug(name);

      const docData: any = {
        _type: 'family',
        name,
        slug: { _type: 'slug', current: slug },
        ...rest
      };

      if (imageUrl) docData.imageUrl = imageUrl;

      await client.create(docData);
      await fetchData();
    } catch (e) { console.error(e); alert("Error creating family"); }
  };
  const updateFamily = async (args: any) => {
    try {
      const { id, name, imageUrl, slug: passedSlug, ...rest } = args;
      const patch: any = { ...rest };

      if (name) {
        patch.name = name;
        patch.slug = { _type: 'slug', current: passedSlug || generateSlug(name) };
      }
      if (imageUrl) patch.imageUrl = imageUrl;

      await client.patch(id).set(patch).commit();
      await fetchData();
    } catch (e) { console.error(e); alert("Error updating family"); }
  };
  const deleteFamily = async ({ id, name }: any) => {
    try {
      // 1. Fetch EVERYTHING that references this family for a full cascading delete
      const referringDocs = await client.fetch(`*[references($id)]`, { id });

      const confirmMessage = referringDocs.length > 0
        ? `DANGER: This will delete the family hub "${name}" and ALL its ${referringDocs.length} associated records (members, legacy data, etc.). This action cannot be undone. Continue?`
        : `Are you sure you want to delete the family hub "${name}"?`;

      if (!confirm(confirmMessage)) return;

      const transaction = client.transaction();

      // 2. Delete all referring documents
      referringDocs.forEach((doc: any) => {
        transaction.delete(doc._id);
      });

      // 3. Delete the family document itself
      transaction.delete(id);

      await transaction.commit();

      // 4. Handle UI state: if deleted family was selected, switch to another
      if (selectedFamilyId === id) {
        const remaining = families.filter(f => f._id !== id);
        if (remaining.length > 0) {
          setSelectedFamilyId(remaining[0]._id);
        } else {
          setSelectedFamilyId(null);
        }
      }

      await fetchData();
    } catch (e) {
      console.error(e);
      alert("Error deleting family hub. Please check your permissions or network.");
    }
  };

  // Complex Family Node Logic Helpers
  const updateFamilyMemberV2 = async (args: any) => {
    try {
      const { id, familyId, fatherId, motherId, parentId, ...rest } = args;
      const patch: any = { ...rest };
      if (familyId) patch.family = { _type: 'reference', _ref: familyId };
      if (fatherId) patch.father = { _type: 'reference', _ref: fatherId };
      if (motherId) patch.mother = { _type: 'reference', _ref: motherId };
      if (parentId) patch.parent = { _type: 'reference', _ref: parentId };

      await client.patch(id).set(patch).commit();
      await fetchData();
    } catch (e) { console.error(e); }
  };
  const deleteFamilyMember = async ({ id }: any) => {
    try { await client.delete(id); await fetchData(); } catch (e) { console.error(e); }
  };
  const addFamilyMemberV2 = async (args: any) => {
    try {
      const { familyId, fatherId, motherId, parentId, ...rest } = args;
      const docData: any = { _type: 'familyNode', ...rest };
      if (familyId) docData.family = { _type: 'reference', _ref: familyId };
      if (fatherId) docData.father = { _type: 'reference', _ref: fatherId };
      if (motherId) docData.mother = { _type: 'reference', _ref: motherId };
      if (parentId) docData.parent = { _type: 'reference', _ref: parentId };

      const doc = await client.create(docData);
      await fetchData();
      return doc._id;
    } catch (e) { console.error(e); }
  };

  const createSocialLink = async (args: any) => {
    try { await client.create({ _type: 'socialLink', ...args }); } catch (e) { console.error(e); }
  };
  const deleteSocialLink = async ({ id }: any) => {
    try { await client.delete(id); await fetchData(); } catch (e) { console.error(e); }
  };

  const [newNewsItem, setNewNewsItem] = React.useState<{
    title: string;
    dateISO: string;
    location: string;
    country: "sweden" | "usa" | "germany" | "eritrea";
    kind: FamilyNews["kind"];
    notes: string;
    mediaType: MediaAsset["type"];
    mediaUrl: string;
    mediaFile?: File;
    isUploading?: boolean;
  }>({
    title: "",
    dateISO: "",
    location: "",
    country: "sweden",
    kind: "Other",
    notes: "",
    mediaType: "image",
    mediaUrl: "",
  });


  const [newPerson, setNewPerson] = React.useState<{
    name: string;
    birthYear: string;
    note: string;
    imageUrl: string;
    familyId: string;
    parentId: string;
    fatherId: string;
    motherId: string;
    gender: string;
    imageFile?: File;
    isUploading?: boolean;
  }>({
    name: "",
    birthYear: "",
    note: "",
    imageUrl: "",
    familyId: "",
    parentId: "",
    fatherId: "",
    motherId: "",
    gender: "",
  });

  const [newSocial, setNewSocial] = React.useState({
    name: "",
    url: "",
    icon: "facebook",
  });

  const [newFamily, setNewFamily] = React.useState<{
    name: string;
    slug: string;
    imageUrl: string;
    imageFile?: File;
    isUploading?: boolean;
  }>({
    name: "",
    slug: "",
    imageUrl: "",
  });

  const [selectedFamilyId, setSelectedFamilyId] =
    React.useState<Id<"families"> | null>(null);
  const [selectedNewsId, setSelectedNewsId] =
    React.useState<Id<"news"> | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const selectedFamily =
    families.find((f: any) => f.id === selectedFamilyId) || families[0];

  const familyNodes = React.useMemo(() => {
    if (!selectedFamilyId) return [];
    return allNodes.filter(n => n.family?._ref === selectedFamilyId);
  }, [allNodes, selectedFamilyId]);

  const addPersonFamilyNodes = React.useMemo(() => {
    if (!newPerson.familyId) return [];
    return allNodes.filter(n => n.family?._ref === newPerson.familyId);
  }, [allNodes, newPerson.familyId]);

  // Admin Settings Logic
  const [adminCredentials, setAdminCredentials] = React.useState({
    email: "",
    password: "",
    id: ""
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSavingSettings, setIsSavingSettings] = React.useState(false);

  React.useEffect(() => {
    if (isAdmin && addMode === "settings") {
      client.fetch('*[_type == "adminSettings"][0]').then((doc) => {
        if (doc) {
          setAdminCredentials({
            email: doc.email || "",
            password: doc.password || "",
            id: doc._id
          });
        } else {
          setAdminCredentials({
            email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@family.com',
            password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
            id: ""
          });
        }
      });
    }
  }, [isAdmin, addMode]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      if (adminCredentials.id) {
        await client.patch(adminCredentials.id).set({
          email: adminCredentials.email,
          password: adminCredentials.password
        }).commit();
      } else {
        const newDoc = await client.create({
          _type: 'adminSettings',
          email: adminCredentials.email,
          password: adminCredentials.password
        });
        setAdminCredentials(prev => ({ ...prev, id: newDoc._id }));
      }
      alert("Admin credentials updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Build tree structure from flat nodes
  const familyTree = React.useMemo(() => {
    if (!familyNodes.length) return null;

    // Find root node (no parentId)
    const rootNode = familyNodes.find((node) => !node.parentId && !node.fatherId && !node.motherId) || familyNodes[0];
    if (!rootNode) return null;

    // Build tree recursively
    const buildTree = (nodeId: string, visited: Set<string> = new Set()): FamilyNode => {
      const node = familyNodes.find((n) => n._id === nodeId);
      if (!node) throw new Error(`Node ${nodeId} not found`);

      visited.add(nodeId);

      // Find potential partner (someone who shares children with this node)
      const childrenOfThisNode = familyNodes.filter(
        (n) => n.fatherId === nodeId || n.motherId === nodeId
      );

      let partnerNode: FamilyNode | undefined = undefined;
      const partnerId = childrenOfThisNode
        .map((c) => (c.fatherId === nodeId ? c.motherId : c.fatherId))
        .find((pId) => pId && !visited.has(pId));

      if (partnerId) {
        const p = familyNodes.find((n) => n._id === partnerId);
        if (p) {
          visited.add(partnerId);
          partnerNode = {
            id: p._id,
            name: p.name,
            imageUrl: p.imageUrl,
            birthYear: p.birthYear,
            note: p.note,
            gender: p.gender,
            fatherId: p.fatherId,
            motherId: p.motherId,
            parentId: p.parentId,
          };
        }
      }

      const children = familyNodes
        .filter(
          (n) =>
            (n.parentId === nodeId ||
              n.fatherId === nodeId ||
              n.motherId === nodeId ||
              (partnerId && (n.fatherId === partnerId || n.motherId === partnerId))) &&
            !visited.has(n._id)
        )
        .map((child) => buildTree(child._id, new Set(visited)));

      return {
        id: node._id,
        name: node.name,
        imageUrl: node.imageUrl,
        birthYear: node.birthYear,
        note: node.note,
        fatherId: node.fatherId,
        motherId: node.motherId,
        parentId: node.parentId,
        gender: node.gender,
        partner: partnerNode,
        children: children.length > 0 ? children : undefined,
      };
    };

    return buildTree(rootNode._id);
  }, [familyNodes]);

  // Get comments for selected items
  const [selectedNewsComments, setSelectedNewsComments] = React.useState<any[]>([]);

  React.useEffect(() => {
    let sub: any;
    if (selectedNewsId) {
      // Fetch initially
      const fetchComments = () => {
        client.fetch(`*[_type == "comment" && item._ref == $id] | order(dateISO desc)`, { id: selectedNewsId })
          .then(c => setSelectedNewsComments(c.map(mapDoc)));
      };
      fetchComments();

      // Listen for updates
      sub = client.listen(`*[_type == "comment" && item._ref == $id]`, { id: selectedNewsId })
        .subscribe(() => fetchComments());
    } else { setSelectedNewsComments([]); }
    return () => sub?.unsubscribe();
  }, [selectedNewsId]);

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [selectedPersonId, setSelectedPersonId] = React.useState<string | null>(
    "p_1"
  );

  const [galleryOpen, setGalleryOpen] = React.useState(false);
  const [galleryItems, setGalleryItems] = React.useState<GalleryItem[]>([]);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  const [glanceSelectedNewsId, setGlanceSelectedNewsId] = React.useState<
    string | null
  >(null);

  const [commentDrafts, setCommentDrafts] = React.useState<
    Record<string, string>
  >({});
  const [replyingTo, setReplyingTo] = React.useState<
    Record<string, { commentId: string; author: string } | null>
  >({});

  const activeGalleryItem = galleryItems[galleryIndex];

  const [activeGalleryComments, setActiveGalleryComments] = React.useState<any[]>([]);
  React.useEffect(() => {
    let sub: any;
    if (activeGalleryItem) {
      const fetchComments = () => {
        client.fetch(`*[_type == "comment" && item._ref == $id] | order(dateISO desc)`, { id: activeGalleryItem.id })
          .then(c => setActiveGalleryComments(c.map(mapDoc)));
      };
      fetchComments();

      sub = client.listen(`*[_type == "comment" && item._ref == $id]`, { id: activeGalleryItem.id })
        .subscribe(() => fetchComments());
    } else { setActiveGalleryComments([]); }
    return () => sub?.unsubscribe();
  }, [activeGalleryItem]);

  const activeGalleryPost = React.useMemo(() => {
    if (!activeGalleryItem) return undefined;
    if (activeGalleryItem.type === "news") {
      return newsList.find((n) => n._id === activeGalleryItem.id);
    }
    return undefined;
  }, [activeGalleryItem, newsList]);

  const selectedNews = newsList.find((n) => n._id === selectedNewsId);

  const selectedPerson = React.useMemo(() => {
    if (!selectedPersonId) return undefined;
    const node = familyNodes.find((n) => n._id === selectedPersonId);
    if (!node) return undefined;

    const parents = familyNodes.filter(n => n._id === node.fatherId || n._id === node.motherId || n._id === node.parentId);
    const children = familyNodes.filter(n => n.fatherId === node._id || n.motherId === node._id || n.parentId === node._id);
    const siblings = familyNodes.filter(n =>
      n._id !== node._id &&
      ((n.fatherId && n.fatherId === node.fatherId) ||
        (n.motherId && n.motherId === node.motherId) ||
        (n.parentId && n.parentId === node.parentId))
    );

    // Find spouse/partner (people who share children)
    const spouseIds = new Set(children.map(c => c.fatherId === node._id ? c.motherId : c.fatherId).filter(Boolean));
    const spouses = familyNodes.filter(n => spouseIds.has(n._id));

    return {
      id: node._id,
      name: node.name,
      imageUrl: node.imageUrl,
      birthYear: node.birthYear,
      note: node.note,
      fatherId: node.fatherId,
      motherId: node.motherId,
      parentId: node.parentId,
      gender: node.gender,
      parents,
      children,
      siblings,
      spouses
    };
  }, [selectedPersonId, familyNodes]);

  const glanceMediaNews = React.useMemo(() => {
    return newsList
      .filter((n) => !!n.media?.url)
      .slice()
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
      .slice(0, 8);
  }, [newsList]);


  const glanceSelectedNews = React.useMemo(() => {
    const fallbackId = glanceMediaNews[0]?._id;
    const id = glanceSelectedNewsId ?? fallbackId;
    if (!id) return undefined;
    return newsList.find((n) => n._id === id);
  }, [newsList, glanceMediaNews, glanceSelectedNewsId]);


  const filteredNewsList = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return newsList;
    return newsList.filter((n) => {
      const haystack = [n.title, n.location, n.kind, n.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [newsList, query]);


  const filteredPeople = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return familyNodes;
    return familyNodes.filter((p) => {
      const haystack = [p.name, p.note, p.birthYear?.toString(), p.gender]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [familyNodes, query]);

  const addNewsDisabled =
    newNewsItem.title.trim().length === 0 || newNewsItem.dateISO.trim().length === 0 || newNewsItem.isUploading;


  const addPersonDisabled = newPerson.name.trim().length === 0 || !newPerson.familyId || newPerson.isUploading;

  const addSocialDisabled = newSocial.name.trim().length === 0 || newSocial.url.trim().length === 0;

  const addFamilyDisabled = newFamily.name.trim().length === 0 || newFamily.isUploading;

  const addChildToTree = React.useCallback(
    (root: FamilyNode, parentId: string, child: FamilyNode): FamilyNode => {
      if (root.id === parentId) {
        return {
          ...root,
          children: [...(root.children ?? []), child],
        };
      }

      const children = root.children ?? [];
      return {
        ...root,
        children: children.map((c) => addChildToTree(c, parentId, child)),
      };
    },
    []
  );

  const openGallery = React.useCallback(
    (items: GalleryItem[], startIndex: number) => {
      if (items.length === 0) return;
      const safeIndex = Math.min(Math.max(startIndex, 0), items.length - 1);
      setGalleryItems(items);
      setGalleryIndex(safeIndex);
      setGalleryOpen(true);
    },
    []
  );

  const galleryPrev = React.useCallback(() => {
    setGalleryIndex(
      (prev) => (prev - 1 + galleryItems.length) % galleryItems.length
    );
  }, [galleryItems.length]);

  const galleryNext = React.useCallback(() => {
    setGalleryIndex((prev) => (prev + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const renderCommentText = React.useCallback((text: string) => {
    // Split by space, keeping delimiters to preserve spaces if needed, 
    // but simpler is to split by whitespace and reconstruct, or just match tokens.
    // User wants "@Name " to be blue.
    // Regex: Match @ followed by non-whitespace.
    const parts = text.split(/(@\S+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return <span key={index} className="text-blue-500 font-medium">{part}</span>;
      }
      return <span key={index} className="text-foreground">{part}</span>;
    });
  }, []);

  const applyReaction = React.useCallback(
    async (
      type: "news",
      id: Id<"news">,
      reaction: ReactionType
    ) => {
      if (type === "news") {
        await addNewsReaction({
          newsId: id as Id<"news">,
          reaction,
          userId: "current-user",
        });
      }
    },
    [addNewsReaction]
  );

  const applyCommentReaction = React.useCallback(
    async (commentId: Id<"comments">, reaction: ReactionType) => {
      await addCommentReaction({ commentId, reaction, userId: "current-user" });
    },
    [addCommentReaction]
  );

  const getUserReaction = React.useCallback(
    (itemId: string, itemType: "news" | "comment") => {
      return userReactions.find(
        (r) => r.itemId === itemId && r.itemType === itemType
      )?.reactionType;
    },
    [userReactions]
  );

  const [activeCommentInput, setActiveCommentInput] = React.useState<string | null>(null);
  const [commentAuthor, setCommentAuthor] = React.useState("");

  const handleAddComment = React.useCallback(
    async (type: "news", id: Id<"news">) => {
      const key = `${type}:${id}`;
      const text = (commentDrafts[key] ?? "").trim();
      const author = commentAuthor.trim();

      if (!text || !author) return;

      await addComment({
        itemId: id,
        itemType: type,
        author: author,
        text,
      });

      setCommentDrafts((prev) => ({ ...prev, [key]: "" }));
      setActiveCommentInput(null);
    },
    [commentDrafts, commentAuthor, addComment]
  );

  React.useEffect(() => {
    if (!galleryOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (galleryItems.length > 1) galleryPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (galleryItems.length > 1) galleryNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryItems.length, galleryNext, galleryOpen, galleryPrev]);
  React.useEffect(() => {
    if (["sweden", "usa", "germany", "eritrea"].includes(tab)) {
      setNewNewsItem(prev => ({ ...prev, country: tab as any }));
    }
  }, [tab]);
  React.useEffect(() => {
    if (!selectedFamilyId && families.length > 0) {
      setSelectedFamilyId(families[0]._id);
    }
  }, [families, selectedFamilyId]);

  React.useEffect(() => {
    if (!selectedNewsId && newsList.length > 0) {
      setSelectedNewsId(newsList[0]._id);
    }
  }, [newsList, selectedNewsId]);


  React.useEffect(() => {
    if (familyTree && !selectedPersonId) {
      setSelectedPersonId(familyTree.id);
    }
  }, [familyTree, selectedPersonId]);

  React.useEffect(() => {
    if (addMode === "person") {
      if (!newPerson.familyId && selectedFamilyId) {
        setNewPerson(prev => ({ ...prev, familyId: selectedFamilyId }));
      }
      if (!newPerson.parentId && selectedPersonId && newPerson.familyId === selectedFamilyId) {
        setNewPerson(prev => ({ ...prev, parentId: selectedPersonId }));
      }
    }
  }, [addMode, selectedFamilyId, selectedPersonId, newPerson.familyId, newPerson.parentId]);

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex w-full  flex-col gap-4 p-4 md:p-8">
        <Dialog
          open={galleryOpen}
          onOpenChange={(open) => {
            setGalleryOpen(open);
            if (!open) {
              setGalleryItems([]);
              setGalleryIndex(0);
            }
          }}
        >
          <DialogContent className="max-w-5xl w-[calc(100vw-1rem)] md:w-[calc(100vw-4rem)] max-h-[95dvh] overflow-hidden rounded-3xl border-none p-0 bg-transparent shadow-none [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full">
            <div className="bg-card/95 backdrop-blur-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col h-full max-h-[95dvh]">
              {activeGalleryItem ? (
                <div className="grid gap-4 md:grid-cols-[1.6fr_.9fr] overflow-hidden flex-1">
                  <div className="grid gap-3 p-4 overflow-y-auto custom-scrollbar">
                    <div className="relative overflow-hidden rounded-2xl border bg-zinc-900 aspect-video flex items-center justify-center">
                      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/85">
                          {galleryIndex + 1} / {galleryItems.length}
                        </Badge>
                        <MediaPill media={activeGalleryItem.media} />
                      </div>

                      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="rounded-full bg-black/20 hover:bg-black/40 border-none text-white backdrop-blur-md"
                          onClick={galleryPrev}
                          disabled={galleryItems.length < 2}
                          aria-label="Previous"
                        >
                          <ChevronLeft />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="rounded-full bg-black/20 hover:bg-black/40 border-none text-white backdrop-blur-md"
                          onClick={galleryNext}
                          disabled={galleryItems.length < 2}
                          aria-label="Next"
                        >
                          <ChevronRight />
                        </Button>
                      </div>

                      {activeGalleryItem.media.type === "video" ? (
                        <video
                          className="w-full h-full object-contain"
                          src={activeGalleryItem.media.url}
                          poster={
                            "posterUrl" in activeGalleryItem.media
                              ? activeGalleryItem.media.posterUrl
                              : undefined
                          }
                          controls
                          autoPlay
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={activeGalleryItem.media.url}
                          alt={
                            "alt" in activeGalleryItem.media
                              ? (activeGalleryItem.media.alt ?? "")
                              : ""
                          }
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      )}
                    </div>

                    <ScrollArea className="h-20 rounded-lg border sm:h-24">
                      <div className="flex gap-2 p-2">
                        {galleryItems.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setGalleryIndex(idx)}
                            className={cn(
                              "relative aspect-video w-32 shrink-0 overflow-hidden rounded-md border transition-all hover:scale-105 ",
                              idx === galleryIndex
                                ? "border-primary ring-2 ring-primary ring-offset-1"
                                : "border-border opacity-70 hover:opacity-100"
                            )}
                          >
                            {item.media.type === "video" ? (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Clapperboard className="text-muted-foreground size-6" />
                              </div>
                            ) : (
                              <img
                                src={item.media.url}
                                alt={
                                  "alt" in item.media
                                    ? (item.media.alt ?? "")
                                    : ""
                                }
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="p-6 bg-muted/50 border-l overflow-y-auto custom-scrollbar flex flex-col h-full gap-4">

                    <div className="rounded-lg border p-4">
                      <div className="text-muted-foreground text-xs">
                        News
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {activeGalleryItem.title}
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        {format(
                          parseISO(activeGalleryItem.dateISO),
                          "MMM d, yyyy"
                        )}
                      </div>
                      {activeGalleryItem.tags &&
                        activeGalleryItem.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activeGalleryItem.tags.map((t) => (
                            <Badge key={t} variant="outline">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {activeGalleryItem.meta ? (
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground text-xs">
                          Details
                        </div>
                        <div className="mt-1 text-sm">
                          {activeGalleryItem.meta}
                        </div>
                      </div>
                    ) : null}

                    {activeGalleryItem.description ? (
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground text-xs">
                          Description
                        </div>
                        <div className="mt-1 text-sm">
                          {activeGalleryItem.description}
                        </div>
                      </div>
                    ) : null}

                    {activeGalleryPost ? (
                      <div className="rounded-lg border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-muted-foreground text-xs">
                            Reactions
                          </div>
                          <div className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                            <MessageCircle className="size-3.5" />0
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          <ReactionButton
                            icon={<ThumbsUp className="size-4" />}
                            label="Like"
                            count={activeGalleryPost.reactions?.like || 0}
                            onClick={() =>
                              applyReaction(
                                activeGalleryItem.type,
                                activeGalleryItem.id as Id<"news">,
                                "like"
                              )
                            }
                          />
                          <ReactionButton
                            icon={<Smile className="size-4" />}
                            label="Smile"
                            count={activeGalleryPost.reactions?.smile || 0}
                            onClick={() =>
                              applyReaction(
                                activeGalleryItem.type,
                                activeGalleryItem.id as Id<"news">,
                                "smile"
                              )
                            }
                          />
                          <ReactionButton
                            icon={<Heart className="size-4" />}
                            label="Heart"
                            count={activeGalleryPost.reactions?.heart || 0}
                            onClick={() =>
                              applyReaction(
                                activeGalleryItem.type,
                                activeGalleryItem.id as Id<"news">,
                                "heart"
                              )
                            }
                          />
                          <ReactionButton
                            icon={<PartyPopper className="size-4" />}
                            label="Yay"
                            count={activeGalleryPost.reactions?.celebrate || 0}
                            onClick={() =>
                              applyReaction(
                                activeGalleryItem.type,
                                activeGalleryItem.id as Id<"news">,
                                "celebrate"
                              )
                            }
                          />
                        </div>

                        <Separator className="my-3" />

                        <div className="grid gap-2">
                          <div className="text-muted-foreground text-xs">
                            Comments
                          </div>
                          {activeGalleryComments.length > 0 ? (
                            <div className="grid gap-2">
                              {activeGalleryComments.slice(-3).map((c) => (
                                <div key={c._id} className="rounded-md border p-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-medium">
                                      {c.author}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-muted-foreground text-[11px]">
                                        {format(parseISO(c.dateISO), "MMM d")}
                                      </div>
                                      {isAdmin && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                          onClick={() => {
                                            if (confirm("Delete this comment?")) {
                                              deleteComment({ commentId: c._id as Id<"comments"> });
                                            }
                                          }}
                                        >
                                          <Trash2 className="size-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-muted-foreground mt-1 text-sm">
                                    {renderCommentText(c.text)}
                                  </div>
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    <ReactionButton
                                      icon={<ThumbsUp className="size-3" />}
                                      label="Like"
                                      count={c.reactions?.like || 0}
                                      isActive={getUserReaction(c._id, "comment") === "like"}
                                      onClick={() => applyCommentReaction(c._id as Id<"comments">, "like")}
                                    />
                                    <ReactionButton
                                      icon={<Smile className="size-3" />}
                                      label="Smile"
                                      count={c.reactions?.smile || 0}
                                      isActive={getUserReaction(c._id, "comment") === "smile"}
                                      onClick={() => applyCommentReaction(c._id as Id<"comments">, "smile")}
                                    />
                                    <ReactionButton
                                      icon={<Heart className="size-3" />}
                                      label="Heart"
                                      count={c.reactions?.heart || 0}
                                      isActive={getUserReaction(c._id, "comment") === "heart"}
                                      onClick={() => applyCommentReaction(c._id as Id<"comments">, "heart")}
                                    />
                                    <ReactionButton
                                      icon={<PartyPopper className="size-3" />}
                                      label="Yay"
                                      count={c.reactions?.celebrate || 0}
                                      isActive={getUserReaction(c._id, "comment") === "celebrate"}
                                      onClick={() => applyCommentReaction(c._id as Id<"comments">, "celebrate")}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-xs hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                      onClick={() => {
                                        const key = `${activeGalleryItem.type}:${activeGalleryItem.id}`;
                                        setCommentDrafts(prev => ({
                                          ...prev,
                                          [key]: `@${c.author} `
                                        }));
                                        setActiveCommentInput(key);
                                      }}
                                    >
                                      <MessageCircle className="size-3 mr-1" />
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-sm">
                              No comments yet.
                            </div>
                          )}

                          <div className="mt-1">
                            {activeCommentInput === `${activeGalleryItem.type}:${activeGalleryItem.id}` ? (
                              <div className="grid gap-2 p-3 bg-muted/20 rounded-lg border">
                                <div className="text-xs font-medium text-muted-foreground mb-1">New Comment</div>
                                <Input
                                  value={commentAuthor}
                                  onChange={(e) => setCommentAuthor(e.target.value)}
                                  placeholder="Your full name"
                                  className="bg-background"
                                />
                                <Input
                                  value={
                                    commentDrafts[
                                    `${activeGalleryItem.type}:${activeGalleryItem.id}`
                                    ] ?? ""
                                  }
                                  onChange={(e) =>
                                    setCommentDrafts((prev) => ({
                                      ...prev,
                                      [`${activeGalleryItem.type}:${activeGalleryItem.id}`]:
                                        e.target.value,
                                    }))
                                  }
                                  placeholder="Write a comment…"
                                  className="bg-background"
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveCommentInput(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    disabled={!commentAuthor.trim() || !(commentDrafts[`${activeGalleryItem.type}:${activeGalleryItem.id}`] ?? "").trim()}
                                    onClick={() =>
                                      handleAddComment(
                                        activeGalleryItem.type,
                                        activeGalleryItem.id as
                                        | Id<"news">
                                        | Id<"news">
                                      )
                                    }
                                  >
                                    <MessageCircle className="mr-1.5 size-4" />
                                    Post
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={() => {
                                  setActiveCommentInput(`${activeGalleryItem.type}:${activeGalleryItem.id}`);
                                  // Use previous author name if available (simple enhancement)
                                }}
                              >
                                <MessageCircle className="mr-2 size-4" />
                                Add a comment
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="text-muted-foreground text-xs">
                      Tip: Use left/right arrow keys to move between items.
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editingNewsItem !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingNewsItem(null);
              setNewNewsItem(prev => ({ ...prev, mediaUrl: "" }));
            }
          }}
        >
          <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto rounded-2xl border-none p-0 bg-transparent shadow-none [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full [&>button]:transition-all">
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-full max-h-[90dvh]">
              <div className="p-6 pb-4 bg-linear-to-br from-primary/10 via-transparent to-transparent">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">Edit News</DialogTitle>
                  <DialogDescription className="text-muted-foreground/80">Update news information.</DialogDescription>
                </DialogHeader>
              </div>
              <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid gap-4 mt-2">
                  <div className="grid gap-3">
                    <div>
                      <div className="text-sm font-medium">Title</div>
                      <Input
                        value={newNewsItem.title}
                        onChange={(e) =>
                          setNewNewsItem((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g., Cousins brunch"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <div className="text-sm font-medium">Type</div>
                        <Select
                          value={newNewsItem.kind}
                          onValueChange={(v) =>
                            setNewNewsItem((prev) => ({
                              ...prev,
                              kind: v as FamilyNews["kind"],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Birthday">Birthday</SelectItem>
                            <SelectItem value="Reunion">Reunion</SelectItem>
                            <SelectItem value="Holiday">Holiday</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Date</div>
                        <SimpleDatePicker
                          value={newNewsItem.dateISO}
                          onChange={(value) =>
                            setNewNewsItem((prev) => ({
                              ...prev,
                              dateISO: value,
                            }))
                          }
                          placeholder="Select event date"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Location</div>
                        <Input
                          value={newNewsItem.location}
                          onChange={(e) =>
                            setNewNewsItem((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Notes</div>
                      <Textarea
                        value={newNewsItem.notes}
                        onChange={(e) =>
                          setNewNewsItem((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Optional"
                      />
                    </div>
                    <Separator />
                    <div className="grid gap-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium">Media type</div>
                          <Select
                            value={newNewsItem.mediaType}
                            onValueChange={(v) =>
                              setNewNewsItem((prev) => ({
                                ...prev,
                                mediaType: v as MediaAsset["type"],
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose…" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {newNewsItem.mediaType === "video" ? (
                            <Clapperboard className="w-8 h-8 mb-2 text-muted-foreground" />
                          ) : (
                            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                          )}
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or
                            drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {newNewsItem.mediaType === "video"
                              ? "MP4, MOV, AVI"
                              : "PNG, JPG, GIF"}
                          </p>
                        </div>
                        <Input
                          type="file"
                          className="hidden"
                          accept={
                            newNewsItem.mediaType === "video" ? "video/*" : "image/*"
                          }
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const blobUrl = URL.createObjectURL(file);
                              setNewNewsItem((prev) => ({ ...prev, mediaUrl: blobUrl }));
                              try {
                                const url = await uploadFile(file);
                                setNewNewsItem((prev) => ({ ...prev, mediaUrl: url }));
                              } catch (error) {
                                console.error("Upload failed:", error);
                                alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                setNewNewsItem((prev) => ({ ...prev, mediaUrl: "" }));
                              }
                            }
                          }}
                        />
                      </label>
                      <MediaTile
                        media={
                          newNewsItem.mediaUrl.trim()
                            ? ({
                              type: newNewsItem.mediaType,
                              url: safeUrl(newNewsItem.mediaUrl),
                              alt: newNewsItem.title.trim() || "",
                            } as MediaAsset)
                            : undefined
                        }
                        className="aspect-video"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6 bg-muted/30 flex flex-row items-center justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditingNewsItem(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingNewsItem) return;
                    const mediaUrl = safeUrl(newNewsItem.mediaUrl);
                    await updateNews({
                      id: editingNewsItem,
                      type: selectedNews?._type, // Keep the same type when updating
                      title: newNewsItem.title.trim(),
                      dateISO: newNewsItem.dateISO,
                      location: newNewsItem.location.trim() || undefined,
                      kind: newNewsItem.kind,
                      notes: newNewsItem.notes.trim() || undefined,
                      media: mediaUrl
                        ? ({
                          type: newNewsItem.mediaType,
                          url: mediaUrl,
                          alt:
                            newNewsItem.mediaType === "image"
                              ? newNewsItem.title.trim()
                              : undefined,
                        } as MediaAsset)
                        : undefined,
                    });
                    setEditingNewsItem(null);
                  }}
                >
                  Update
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>


        <Dialog
          open={editingPerson !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingPerson(null);
              setNewPerson(prev => ({ ...prev, imageUrl: "" }));
            }
          }}
        >
          <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto rounded-2xl border-none p-0 bg-transparent shadow-none [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full [&>button]:transition-all">
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-full max-h-[90dvh]">
              <div className="p-6 pb-4 bg-linear-to-br from-primary/10 via-transparent to-transparent">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">Edit Family Member</DialogTitle>
                  <DialogDescription className="text-muted-foreground/80">
                    Update family member information and relationships.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid gap-4 mt-2">
                  <div className="grid gap-3">
                    <div>
                      <div className="text-sm font-medium">Name</div>
                      <Input
                        value={newPerson.name}
                        onChange={(e) =>
                          setNewPerson((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Taylor Lee"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Person image</div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or
                            drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF
                          </p>
                        </div>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const blobUrl = URL.createObjectURL(file);
                              setNewPerson((prev) => ({ ...prev, imageUrl: blobUrl }));
                              try {
                                const url = await uploadFile(file);
                                setNewPerson((prev) => ({ ...prev, imageUrl: url }));
                              } catch (error) {
                                console.error("Upload failed:", error);
                                alert("Upload failed. Please try again.");
                                setNewPerson((prev) => ({ ...prev, imageUrl: "" }));
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium">Birth year</div>
                        <Input
                          type="number"
                          value={newPerson.birthYear}
                          onChange={(e) =>
                            setNewPerson((prev) => ({
                              ...prev,
                              birthYear: e.target.value,
                            }))
                          }
                          placeholder="e.g., 1990"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Notes</div>
                      <Textarea
                        value={newPerson.note}
                        onChange={(e) =>
                          setNewPerson((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }))
                        }
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Gender</div>
                      <Select
                        value={newPerson.gender}
                        onValueChange={(val) =>
                          setNewPerson((prev) => ({
                            ...prev,
                            gender: val,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium mb-1">Father (Optional)</div>
                          <Select
                            value={newPerson.fatherId}
                            onValueChange={(val) =>
                              setNewPerson((prev) => ({
                                ...prev,
                                fatherId: val === "root" ? "" : val,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Unknown" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="root">Unknown</SelectItem>
                              {familyNodes.map((n) => (
                                <SelectItem key={n._id} value={n._id}>
                                  {n.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-1">Mother (Optional)</div>
                          <Select
                            value={newPerson.motherId}
                            onValueChange={(val) =>
                              setNewPerson((prev) => ({
                                ...prev,
                                motherId: val === "root" ? "" : val,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Unknown" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="root">Unknown</SelectItem>
                              {familyNodes.map((n) => (
                                <SelectItem key={n._id} value={n._id}>
                                  {n.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6 bg-muted/30 flex flex-row items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingPerson(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={async () => {
                    if (!editingPerson) return;
                    const node = familyNodes.find((n) => n._id === editingPerson);
                    if (node) {
                      const birthYear = Number.parseInt(
                        newPerson.birthYear.trim(),
                        10
                      );
                      await updateFamilyMemberV2({
                        id: node._id,
                        name: newPerson.name.trim(),
                        imageUrl: safeUrl(newPerson.imageUrl) || undefined,
                        birthYear: Number.isFinite(birthYear)
                          ? birthYear
                          : undefined,
                        note: newPerson.note.trim() || undefined,
                        fatherId: (newPerson.fatherId as Id<"familyNodes">) || undefined,
                        motherId: (newPerson.motherId as Id<"familyNodes">) || undefined,
                        gender: (newPerson.gender as any) || undefined,
                      });
                      setEditingPerson(null);
                    }
                  }}
                >
                  Update
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editingFamily !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingFamily(null);
              setNewFamily(prev => ({ ...prev, imageUrl: "" }));
            }
          }}
        >
          <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto rounded-2xl border-none p-0 bg-transparent shadow-none [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full [&>button]:transition-all">
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-full max-h-[90dvh]">
              <div className="p-6 pb-4 bg-linear-to-br from-primary/10 via-transparent to-transparent">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">Edit Family</DialogTitle>
                  <DialogDescription className="text-muted-foreground/80">Update family name and image.</DialogDescription>
                </DialogHeader>
              </div>
              <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid gap-4 mt-2">
                  <div className="grid gap-3">
                    <div>
                      <div className="text-sm font-medium">Family Name</div>
                      <Input
                        value={newFamily.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setNewFamily((prev) => ({
                            ...prev,
                            name,
                            slug: generateSlug(name)
                          }));
                        }}
                        placeholder="e.g. The Smiths"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Slug</div>
                      <Input
                        value={newFamily.slug}
                        onChange={(e) =>
                          setNewFamily((prev) => ({
                            ...prev,
                            slug: generateSlug(e.target.value),
                          }))
                        }
                        placeholder="slug"
                        className="bg-muted/30"
                      />
                    </div>
                    <div>
                      <SafeFileUpload
                        onFileSelect={async (blobUrl, file) => {
                          setNewFamily((prev) => ({ ...prev, imageUrl: blobUrl, isUploading: true }));
                          if (file) {
                            try {
                              const url = await uploadFile(file);
                              setNewFamily((prev) => ({ ...prev, imageUrl: url, isUploading: false }));
                            } catch (error) {
                              console.error("Upload failed:", error);
                              alert("Upload failed. Please try again.");
                              setNewFamily((prev) => ({ ...prev, imageUrl: "", isUploading: false }));
                            }
                          }
                        }}
                        accept="image/*"
                        mediaType="image"
                      />
                      <SafeMediaPreview
                        url={newFamily.imageUrl}
                        type="image"
                        alt={newFamily.name}
                        className="aspect-video mt-2"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="p-6 bg-muted/30 flex flex-row items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingFamily(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={addFamilyDisabled}
                    onClick={async () => {
                      if (!editingFamily) return;
                      await updateFamily({
                        id: editingFamily,
                        name: newFamily.name.trim(),
                        slug: newFamily.slug,
                        imageUrl: newFamily.imageUrl.startsWith('blob:') ? undefined : newFamily.imageUrl,
                      });
                      setEditingFamily(null);
                    }}
                  >
                    {newFamily.isUploading ? "Uploading..." : "Update"}
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-center mb-6 mt-2">
          <img
            src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"}
            alt="Logo"
            className="w-80 h-24 object-contain"
            onError={(e) => {
              console.log("Logo failed to load:", e.currentTarget.src);
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        <Card className="border-2 rounded-xl shadow-lg">
          <CardHeader className="pb-2 pt-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-2 w-full">
                {/* Search and theme toggle row */}
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground pointer-events-none absolute top-3 left-4 size-5" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        tab === "tree"
                          ? "Search people…"
                          : "Search news…"
                      }
                      className="pl-12 h-12 text-base rounded-lg border-2"
                    />
                  </div>
                  {/* Theme toggle - hidden on sm for admin, always visible for non-admin */}
                  <div className={isAdmin ? "hidden md:block" : "block"}>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Admin buttons row - responsive layout */}
                {isAdmin && (
                  <div className="flex gap-3 items-center justify-center">
                    {/* Admin buttons - stacked on sm, inline on md+ */}
                    <div className="flex gap-3 flex-1 md:flex-none justify-center">
                      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                          // Clear media states to prevent revoked blob URL errors
                          setNewNewsItem(prev => ({ ...prev, mediaUrl: "" }));
                          setNewPerson(prev => ({ ...prev, imageUrl: "" }));
                          setNewFamily(prev => ({ ...prev, imageUrl: "" }));
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 sm:h-9 px-2 sm:px-3 text-[10px] sm:text-sm rounded-lg flex-1 md:flex-none"
                          >
                            <Plus className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Add Content</span>
                            <span className="sm:hidden font-bold">Add</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto rounded-2xl border-none p-0 bg-transparent shadow-none [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full [&>button]:transition-all">
                          <div className="bg-card/95 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-full max-h-[90dvh]">
                            <div className="p-6 pb-4 bg-linear-to-br from-primary/10 via-transparent to-transparent">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">Add to family hub</DialogTitle>
                                <DialogDescription className="text-muted-foreground/80">
                                  Add news or a family member.
                                </DialogDescription>
                              </DialogHeader>
                            </div>

                            <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">

                              <Tabs
                                value={addMode}
                                onValueChange={(v) =>
                                  setAddMode(v as "news" | "person" | "social" | "family" | "settings")
                                }
                                className="mt-2"
                              >
                                <TabsList className="flex w-full h-auto overflow-x-auto scrollbar-hide whitespace-nowrap justify-start gap-1 p-1 bg-muted/40 mb-4 items-center">
                                  <TabsTrigger value="news" className="px-3 h-8 text-xs sm:text-sm">News</TabsTrigger>

                                  <TabsTrigger value="person" className="px-3 h-8 text-xs sm:text-sm">
                                    Member
                                  </TabsTrigger>
                                  <TabsTrigger value="social" className="px-3 h-8 text-xs sm:text-sm">
                                    Social
                                  </TabsTrigger>
                                  <TabsTrigger value="family" className="px-3 h-8 text-xs sm:text-sm">
                                    Family
                                  </TabsTrigger>
                                  <TabsTrigger value="settings" className="px-3 h-8 text-xs sm:text-sm">
                                    Settings
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="news" className="mt-3">
                                  <div className="grid gap-3">
                                    <div>
                                      <div className="text-sm font-medium">
                                        Title
                                      </div>
                                      <Input
                                        value={newNewsItem.title}
                                        onChange={(e) =>
                                          setNewNewsItem((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                          }))
                                        }
                                        placeholder="e.g., Cousins brunch"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium">Country</div>
                                        <Select
                                          value={newNewsItem.country}
                                          onValueChange={(v) =>
                                            setNewNewsItem((prev) => ({
                                              ...prev,
                                              country: v as any,
                                            }))
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="sweden">🇸🇪 Sweden</SelectItem>
                                            <SelectItem value="usa">🇺🇸 USA</SelectItem>
                                            <SelectItem value="germany">🇩🇪 Germany</SelectItem>
                                            <SelectItem value="eritrea">🇪🇷 Eritrea</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">Type</div>
                                        <Select
                                          value={newNewsItem.kind}
                                          onValueChange={(v) =>
                                            setNewNewsItem((prev) => ({
                                              ...prev,
                                              kind: v as FamilyNews["kind"],
                                            }))
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Birthday">
                                              Birthday
                                            </SelectItem>
                                            <SelectItem value="Reunion">
                                              Reunion
                                            </SelectItem>
                                            <SelectItem value="Holiday">
                                              Holiday
                                            </SelectItem>
                                            <SelectItem value="Other">
                                              Other
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">
                                          Date
                                        </div>
                                        <SimpleDatePicker
                                          value={newNewsItem.dateISO}
                                          onChange={(value) =>
                                            setNewNewsItem((prev) => ({
                                              ...prev,
                                              dateISO: value,
                                            }))
                                          }
                                          placeholder="Select event date"
                                        />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">
                                          Location
                                        </div>
                                        <Input
                                          value={newNewsItem.location}
                                          onChange={(e) =>
                                            setNewNewsItem((prev) => ({
                                              ...prev,
                                              location: e.target.value,
                                            }))
                                          }
                                          placeholder="Optional"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium">
                                        Notes
                                      </div>
                                      <Textarea
                                        value={newNewsItem.notes}
                                        onChange={(e) =>
                                          setNewNewsItem((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                          }))
                                        }
                                        placeholder="Optional"
                                      />
                                    </div>

                                    <Separator />

                                    <div className="grid gap-3">
                                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                          <div className="text-sm font-medium">
                                            Media type
                                          </div>
                                          <Select
                                            value={newNewsItem.mediaType}
                                            onValueChange={(v) =>
                                              setNewNewsItem((prev) => ({
                                                ...prev,
                                                mediaType:
                                                  v as MediaAsset["type"],
                                              }))
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Choose…" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="image">
                                                Image
                                              </SelectItem>
                                              <SelectItem value="video">
                                                Video
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div></div>
                                      </div>
                                      <Separator />
                                      <SafeFileUpload
                                        onFileSelect={async (url, file) => {
                                          if (file) {
                                            // Set preview immediately and mark as uploading
                                            setNewNewsItem(prev => ({ ...prev, mediaUrl: url, isUploading: true }));
                                            try {
                                              const uploadedUrl = await uploadFile(file);
                                              setNewNewsItem(prev => ({ ...prev, mediaUrl: uploadedUrl, isUploading: false }));
                                            } catch (error) {
                                              console.error("Upload failed:", error);
                                              alert("Media upload failed. Please try again.");
                                              setNewNewsItem(prev => ({ ...prev, mediaUrl: "", isUploading: false }));
                                            }
                                          }
                                        }}
                                        accept={newNewsItem.mediaType === "video" ? "video/*" : "image/*"}
                                        mediaType={newNewsItem.mediaType}
                                      />

                                      <SafeMediaPreview
                                        url={newNewsItem.mediaUrl}
                                        type={newNewsItem.mediaType}
                                        alt={newNewsItem.title}
                                        className="aspect-video"
                                      />
                                    </div>
                                  </div>
                                </TabsContent>


                                <TabsContent value="person" className="mt-3">
                                  <div className="grid gap-3">
                                    <div>
                                      <div className="text-sm font-medium mb-1">
                                        Family
                                      </div>
                                      <Select
                                        value={newPerson.familyId}
                                        onValueChange={(val) =>
                                          setNewPerson((prev) => ({
                                            ...prev,
                                            familyId: val,
                                            parentId: "", // Reset parent when family changes
                                          }))
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select family" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {families.map((f) => (
                                            <SelectItem key={f._id} value={f._id}>
                                              {f.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium mb-1">
                                          Father (Optional)
                                        </div>
                                        <Select
                                          value={newPerson.fatherId}
                                          onValueChange={(val) =>
                                            setNewPerson((prev) => ({
                                              ...prev,
                                              fatherId: val === "root" ? "" : val,
                                            }))
                                          }
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Unknown" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="root">
                                              Unknown
                                            </SelectItem>
                                            {addPersonFamilyNodes.map((n) => (
                                              <SelectItem key={n._id} value={n._id}>
                                                {n.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <div className="text-sm font-medium mb-1">
                                          Mother (Optional)
                                        </div>
                                        <Select
                                          value={newPerson.motherId}
                                          onValueChange={(val) =>
                                            setNewPerson((prev) => ({
                                              ...prev,
                                              motherId: val === "root" ? "" : val,
                                            }))
                                          }
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Unknown" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="root">
                                              Unknown
                                            </SelectItem>
                                            {addPersonFamilyNodes.map((n) => (
                                              <SelectItem key={n._id} value={n._id}>
                                                {n.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium mb-1">Gender</div>
                                        <Select
                                          value={newPerson.gender}
                                          onValueChange={(val) =>
                                            setNewPerson((prev) => ({
                                              ...prev,
                                              gender: val,
                                            }))
                                          }
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select gender" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium">
                                        Name
                                      </div>
                                      <Input
                                        value={newPerson.name}
                                        onChange={(e) =>
                                          setNewPerson((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                          }))
                                        }
                                        placeholder="e.g., Taylor Lee"
                                      />
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium mb-2">
                                        Person image
                                      </div>
                                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                                          <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">
                                              Click to upload
                                            </span>{" "}
                                            or drag and drop
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            PNG, JPG, GIF
                                          </p>
                                        </div>
                                        <Input
                                          type="file"
                                          className="hidden"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const blobUrl = URL.createObjectURL(file);
                                              setNewPerson((prev) => ({ ...prev, imageUrl: blobUrl, isUploading: true }));
                                              try {
                                                const url = await uploadFile(file);
                                                setNewPerson((prev) => ({ ...prev, imageUrl: url, isUploading: false }));
                                              } catch (error) {
                                                console.error("Upload failed:", error);
                                                alert("Upload failed. Please try again.");
                                                setNewPerson((prev) => ({ ...prev, imageUrl: "", isUploading: false }));
                                              }
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium">
                                          Birth year
                                        </div>
                                        <Input
                                          type="number"
                                          value={newPerson.birthYear}
                                          onChange={(e) =>
                                            setNewPerson((prev) => ({
                                              ...prev,
                                              birthYear: e.target.value,
                                            }))
                                          }
                                          placeholder="e.g., 1990"
                                          min="1900"
                                          max={new Date().getFullYear()}
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium">
                                        Notes
                                      </div>
                                      <Textarea
                                        value={newPerson.note}
                                        onChange={(e) =>
                                          setNewPerson((prev) => ({
                                            ...prev,
                                            note: e.target.value,
                                          }))
                                        }
                                        placeholder="Optional"
                                      />
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                      <div className="bg-muted size-10 overflow-hidden rounded-full border">
                                        <img
                                          src={
                                            safeUrl(newPerson.imageUrl) ||
                                            "/placeholder.svg"
                                          }
                                          alt={
                                            newPerson.name.trim() ||
                                            "New family member"
                                          }
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                          onError={(e) => {
                                            e.currentTarget.src = "/placeholder.svg";
                                          }}
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-muted-foreground text-xs">
                                          Preview
                                        </div>
                                        <div className="truncate text-sm font-medium">
                                          {newPerson.name.trim() || "Name"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="social" className="mt-3">
                                  <div className="grid gap-3">
                                    <div>
                                      <div className="text-sm font-medium">
                                        Name
                                      </div>
                                      <Input
                                        value={newSocial.name}
                                        onChange={(e) =>
                                          setNewSocial((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                          }))
                                        }
                                        placeholder="e.g., Facebook"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium">
                                        URL
                                      </div>
                                      <Input
                                        value={newSocial.url}
                                        onChange={(e) =>
                                          setNewSocial((prev) => ({
                                            ...prev,
                                            url: e.target.value,
                                          }))
                                        }
                                        placeholder="https://facebook.com/yourpage"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium">
                                        Icon
                                      </div>
                                      <Select
                                        value={newSocial.icon}
                                        onValueChange={(v) =>
                                          setNewSocial((prev) => ({
                                            ...prev,
                                            icon: v,
                                          }))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="facebook">Facebook</SelectItem>
                                          <SelectItem value="twitter">Twitter</SelectItem>
                                          <SelectItem value="instagram">Instagram</SelectItem>
                                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                                          <SelectItem value="youtube">YouTube</SelectItem>
                                          <SelectItem value="github">GitHub</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="family" className="mt-3">
                                  <div className="grid gap-3">
                                    <div>
                                      <div className="text-sm font-medium">Family Name</div>
                                      <Input
                                        value={newFamily.name}
                                        onChange={(e) => {
                                          const name = e.target.value;
                                          setNewFamily((prev) => ({
                                            ...prev,
                                            name,
                                            slug: generateSlug(name)
                                          }));
                                        }}
                                        placeholder="e.g. The Smiths"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium">Slug</div>
                                      <Input
                                        value={newFamily.slug}
                                        onChange={(e) =>
                                          setNewFamily((prev) => ({
                                            ...prev,
                                            slug: generateSlug(e.target.value),
                                          }))
                                        }
                                        placeholder="slug"
                                        className="bg-muted/30"
                                      />
                                    </div>
                                    <div>
                                      <SafeFileUpload
                                        onFileSelect={async (blobUrl, file) => {
                                          setNewFamily((prev) => ({ ...prev, imageUrl: blobUrl, isUploading: true }));
                                          if (file) {
                                            try {
                                              const url = await uploadFile(file);
                                              setNewFamily((prev) => ({ ...prev, imageUrl: url, isUploading: false }));
                                            } catch (error) {
                                              console.error("Upload failed:", error);
                                              alert("Upload failed. Please try again.");
                                              setNewFamily((prev) => ({ ...prev, imageUrl: "", isUploading: false }));
                                            }
                                          }
                                        }}
                                        accept="image/*"
                                        mediaType="image"
                                      />
                                      <SafeMediaPreview
                                        url={newFamily.imageUrl}
                                        type="image"
                                        alt={newFamily.name}
                                        className="aspect-video mt-2"
                                      />
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="settings" className="mt-3">
                                  <div className="flex flex-col gap-4">
                                    <div className="p-4 rounded-xl border bg-card/50 shadow-xs">
                                      <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                                          <Shield className="size-5" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm">Admin Access</h3>
                                          <p className="text-xs text-muted-foreground">Manage login credentials</p>
                                        </div>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
                                          <Input
                                            value={adminCredentials.email}
                                            onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="admin@example.com"
                                            className="bg-background/50"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
                                          <div className="relative">
                                            <Input
                                              type={showPassword ? "text" : "password"}
                                              value={adminCredentials.password}
                                              onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                                              placeholder="••••••"
                                              className="pr-10 bg-background/50"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => setShowPassword(!showPassword)}
                                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                            >
                                              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                          </div>
                                        </div>

                                        <div className="pt-2">
                                          <Button
                                            onClick={handleSaveSettings}
                                            disabled={isSavingSettings}
                                            className="w-full"
                                          >
                                            {isSavingSettings ? (
                                              "Saving..."
                                            ) : (
                                              <>
                                                <Save className="size-4 mr-2" />
                                                Update Credentials
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                            <DialogFooter className="p-6 bg-muted/30 flex flex-row items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  setNewNewsItem({
                                    title: "",
                                    dateISO: "",
                                    location: "",
                                    country: "sweden",
                                    kind: "Other",
                                    notes: "",
                                    mediaType: "image",
                                    mediaUrl: "",
                                  });
                                  setNewPerson({
                                    name: "",
                                    birthYear: "",
                                    note: "",
                                    imageUrl: "",
                                    familyId: "",
                                    parentId: "",
                                    fatherId: "",
                                    motherId: "",
                                    gender: "",
                                  });
                                  setNewSocial({
                                    name: "",
                                    url: "",
                                    icon: "facebook",
                                  });
                                  setNewFamily({
                                    name: "",
                                    slug: "",
                                    imageUrl: "",
                                  });
                                }}
                              >
                                Reset
                              </Button>
                              <Button
                                type="button"
                                disabled={
                                  addMode === "person"
                                    ? addPersonDisabled
                                    : addMode === "social"
                                      ? addSocialDisabled
                                      : addMode === "family"
                                        ? addFamilyDisabled
                                        : addNewsDisabled
                                }
                                onClick={async () => {
                                  if (addMode === "social") {
                                    if (addSocialDisabled) return;
                                    await createSocialLink({
                                      name: newSocial.name.trim(),
                                      url: newSocial.url.trim(),
                                      icon: newSocial.icon,
                                    });
                                    setNewSocial({
                                      name: "",
                                      url: "",
                                      icon: "facebook",
                                    });
                                    return;
                                  }


                                  if (addMode === "person") {
                                    if (addPersonDisabled) return;

                                    const birthYear = Number.parseInt(
                                      newPerson.birthYear.trim(),
                                      10
                                    );

                                    const parentIdStr = newPerson.parentId && newPerson.parentId !== "root"
                                      ? newPerson.parentId
                                      : undefined;

                                    const newNodeId = await addFamilyMemberV2({
                                      familyId: newPerson.familyId as Id<"families">,
                                      name: newPerson.name.trim(),
                                      imageUrl:
                                        (newPerson.imageUrl.startsWith('blob:') ? undefined : safeUrl(newPerson.imageUrl)) ||
                                        "/placeholder.svg",
                                      birthYear: Number.isFinite(birthYear)
                                        ? birthYear
                                        : undefined,
                                      note: newPerson.note.trim() || undefined,
                                      fatherId: (newPerson.fatherId as Id<"familyNodes">) || undefined,
                                      motherId: (newPerson.motherId as Id<"familyNodes">) || undefined,
                                      gender: (newPerson.gender as any) || undefined,
                                    });

                                    if (newPerson.fatherId) {
                                      setExpanded((prev) => ({
                                        ...prev,
                                        [newPerson.fatherId]: true,
                                      }));
                                    }
                                    if (newPerson.motherId) {
                                      setExpanded((prev) => ({
                                        ...prev,
                                        [newPerson.motherId]: true,
                                      }));
                                    }

                                    setSelectedFamilyId(newPerson.familyId as Id<"families">);
                                    setSelectedPersonId(newNodeId);
                                    setTab("tree");

                                    setNewPerson({
                                      name: "",
                                      birthYear: "",
                                      note: "",
                                      imageUrl: "",
                                      familyId: selectedFamilyId || "",
                                      parentId: "",
                                      fatherId: "",
                                      motherId: "",
                                      gender: "",
                                    });

                                    return;
                                  }

                                  if (addMode === "family") {
                                    if (addFamilyDisabled) return;
                                    await createFamily({
                                      name: newFamily.name.trim(),
                                      slug: newFamily.slug,
                                      imageUrl: newFamily.imageUrl.startsWith('blob:') ? undefined : newFamily.imageUrl,
                                    });
                                    setNewFamily({
                                      name: "",
                                      slug: "",
                                      imageUrl: "",
                                    });
                                    return;
                                  }

                                  if (addNewsDisabled) return;
                                  const mediaUrl = safeUrl(newNewsItem.mediaUrl);
                                  const targetType = `${newNewsItem.country}News`;
                                  await createNews({
                                    type: targetType,
                                    title: newNewsItem.title.trim(),
                                    dateISO: newNewsItem.dateISO,
                                    location:
                                      newNewsItem.location.trim() || undefined,
                                    kind: newNewsItem.kind,
                                    notes: newNewsItem.notes.trim() || undefined,
                                    media: (mediaUrl && !mediaUrl.startsWith('blob:'))
                                      ? ({
                                        type: newNewsItem.mediaType,
                                        url: mediaUrl,
                                        alt:
                                          newNewsItem.mediaType === "image"
                                            ? newNewsItem.title.trim()
                                            : undefined,
                                      } as MediaAsset)
                                      : undefined,
                                  });
                                  setNewNewsItem({
                                    title: "",
                                    dateISO: "",
                                    location: "",
                                    country: "sweden",
                                    kind: "Other",
                                    notes: "",
                                    mediaType: "image",
                                    mediaUrl: "",
                                  });
                                }}
                              >
                                <Plus />
                                <Plus />
                                {newFamily.isUploading || newPerson.isUploading || newNewsItem.isUploading ? "Uploading..." : "Add"}
                              </Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="h-8 sm:h-9 px-2 sm:px-3 text-[10px] sm:text-sm rounded-lg flex-1 md:flex-none"
                      >
                        <LogOut className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                        <span className="sm:hidden font-bold">Exit</span>
                      </Button>
                    </div>
                    {/* Theme toggle for admin on sm screens */}
                    <div className="md:hidden">
                      <ThemeToggle />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="flex w-full overflow-x-auto scrollbar-hide whitespace-nowrap justify-start gap-1 p-1 bg-muted/20 border mb-2 items-center">
            <TabsTrigger
              value="sweden"
              className="text-[10px] sm:text-sm data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              🇸🇪 Sweden
            </TabsTrigger>
            <TabsTrigger
              value="usa"
              className="text-[10px] sm:text-sm data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              🇺🇸 USA
            </TabsTrigger>
            <TabsTrigger
              value="germany"
              className="text-[10px] sm:text-sm data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              🇩🇪 Germany
            </TabsTrigger>
            <TabsTrigger
              value="eritrea"
              className="text-[10px] sm:text-sm data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              🇪🇷 Eritrea
            </TabsTrigger>
            <TabsTrigger
              value="tree"
              className="text-[10px] sm:text-sm data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              <TreeDeciduous className="mr-1 sm:mr-2 size-3 sm:size-4" />
              Family tree
            </TabsTrigger>
          </TabsList>

          {["sweden", "usa", "germany", "eritrea"].map((countryKey) => {
            const countryName = countryKey === "usa" ? "USA" : countryKey.charAt(0).toUpperCase() + countryKey.slice(1);
            const targetType = `${countryKey}News`;
            const countryNews = filteredNewsList.filter(e => e._type === targetType);

            return (
              <TabsContent key={countryKey} value={countryKey} className="mt-4">
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-[0.8fr_1.4fr_0.8fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>{countryName} News</CardTitle>
                      <CardDescription>Click to view</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex lg:hidden overflow-x-auto pb-4 gap-3">
                        {countryNews.map((e) => (
                          <NewsListItem
                            key={e._id}
                            news={e}
                            onClick={() => setSelectedNewsId(e._id)}
                          />
                        ))}
                        {countryNews.length === 0 && (
                          <div className="w-full text-muted-foreground rounded-lg border p-6 text-center text-sm">
                            No {countryName} posts found.
                          </div>
                        )}
                      </div>

                      <div className="hidden lg:block">
                        <ScrollArea className="h-[700px] pr-3">
                          <div className="grid gap-3">
                            {countryNews.map((e) => (
                              <NewsListItem
                                key={e._id}
                                news={e}
                                onClick={() => setSelectedNewsId(e._id)}
                              />
                            ))}
                            {countryNews.length === 0 && (
                              <div className="text-muted-foreground rounded-lg border p-6 text-center text-sm">
                                No {countryName} posts found.
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>News Details</CardTitle>
                      <CardDescription>Selected news information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedNews && countryNews.some(e => e._id === selectedNewsId) ? (
                        <div className="grid gap-4">
                          <div className="rounded-lg border overflow-hidden">
                            <MediaTile
                              media={selectedNews.media}
                              className="aspect-video w-full h-96"
                            />
                          </div>
                          <div className="grid gap-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-lg font-semibold">
                                  {selectedNews.title}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {format(
                                    parseISO(selectedNews.dateISO),
                                    "MMM d, yyyy"
                                  )}
                                  {selectedNews.location
                                    ? ` • ${selectedNews.location}`
                                    : ""}
                                </div>
                              </div>
                              {isAdmin && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingNewsItem(selectedNews._id);
                                      setNewNewsItem({
                                        title: selectedNews.title,
                                        dateISO: selectedNews.dateISO,
                                        location: selectedNews.location || "",
                                        country: selectedNews._type.replace('News', '') as any,
                                        kind: selectedNews.kind,
                                        notes: selectedNews.notes || "",
                                        mediaType:
                                          selectedNews.media?.type || "image",
                                        mediaUrl: selectedNews.media?.url || "",
                                      });
                                    }}
                                  >
                                    <Edit className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                      if (confirm("Delete this news?")) {
                                        await deleteNews({
                                          id: selectedNews._id,
                                        });
                                        setSelectedNewsId(null);
                                      }
                                    }}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {selectedNews.notes && (
                              <div className="text-muted-foreground text-sm">
                                {selectedNews.notes}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
                              <ReactionButton
                                icon={<ThumbsUp className="size-4" />}
                                label="Like"
                                count={selectedNews.reactions?.like || 0}
                                isActive={
                                  getUserReaction(selectedNews._id, "news") ===
                                  "like"
                                }
                                onClick={() =>
                                  applyReaction("news", selectedNews._id, "like")
                                }
                              />
                              <ReactionButton
                                icon={<Smile className="size-4" />}
                                label="Smile"
                                count={selectedNews.reactions?.smile || 0}
                                isActive={
                                  getUserReaction(selectedNews._id, "news") ===
                                  "smile"
                                }
                                onClick={() =>
                                  applyReaction("news", selectedNews._id, "smile")
                                }
                              />
                              <ReactionButton
                                icon={<Heart className="size-4" />}
                                label="Heart"
                                count={selectedNews.reactions?.heart || 0}
                                isActive={
                                  getUserReaction(selectedNews._id, "news") ===
                                  "heart"
                                }
                                onClick={() =>
                                  applyReaction("news", selectedNews._id, "heart")
                                }
                              />
                              <ReactionButton
                                icon={<PartyPopper className="size-4" />}
                                label="Yay"
                                count={selectedNews.reactions?.celebrate || 0}
                                isActive={
                                  getUserReaction(selectedNews._id, "news") ===
                                  "celebrate"
                                }
                                onClick={() =>
                                  applyReaction(
                                    "news",
                                    selectedNews._id,
                                    "celebrate"
                                  )
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              {replyingTo[`news:${selectedNews._id}`] && (
                                <div className="flex items-center justify-between bg-muted/50 border rounded-md p-2 text-sm">
                                  <span className="text-muted-foreground">
                                    Replying to{" "}
                                    <span className="font-medium">
                                      {
                                        replyingTo[`news:${selectedNews._id}`]
                                          ?.author
                                      }
                                    </span>
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      setReplyingTo((prev) => ({
                                        ...prev,
                                        [`news:${selectedNews._id}`]: null,
                                      }));
                                      setCommentDrafts((prev) => ({
                                        ...prev,
                                        [`news:${selectedNews._id}`]: "",
                                      }));
                                    }}
                                  >
                                    ×
                                  </Button>
                                </div>
                              )}
                              {activeCommentInput === `news:${selectedNews._id}` || replyingTo[`news:${selectedNews._id}`] ? (
                                <div className="grid gap-2 p-3 bg-muted/20 rounded-lg border">
                                  {!replyingTo[`news:${selectedNews._id}`] && (
                                    <div className="text-xs font-medium text-muted-foreground mb-1">New Comment</div>
                                  )}
                                  <Input
                                    value={commentAuthor}
                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                    placeholder="Your full name"
                                    className="bg-background"
                                  />
                                  <Input
                                    value={
                                      commentDrafts[`news:${selectedNews._id}`] ?? ""
                                    }
                                    onChange={(e) =>
                                      setCommentDrafts((prev) => ({
                                        ...prev,
                                        [`news:${selectedNews._id}`]: e.target.value,
                                      }))
                                    }
                                    placeholder={
                                      replyingTo[`news:${selectedNews._id}`]
                                        ? `Reply to ${replyingTo[`news:${selectedNews._id}`]?.author}...`
                                        : "Add a comment…"
                                    }
                                    className="bg-background"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setActiveCommentInput(null);
                                        setReplyingTo((prev) => ({
                                          ...prev,
                                          [`news:${selectedNews._id}`]: null,
                                        }));
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      disabled={!commentAuthor.trim() || !(commentDrafts[`news:${selectedNews._id}`] ?? "").trim()}
                                      onClick={() => {
                                        handleAddComment("news", selectedNews._id);
                                        setReplyingTo((prev) => ({
                                          ...prev,
                                          [`news:${selectedNews._id}`]: null,
                                        }));
                                      }}
                                    >
                                      <MessageCircle className="mr-1.5 size-4" />
                                      {replyingTo[`news:${selectedNews._id}`]
                                        ? "Reply"
                                        : "Post"}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                  onClick={() => setActiveCommentInput(`news:${selectedNews._id}`)}
                                >
                                  <MessageCircle className="mr-2 size-4" />
                                  Add a comment
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground rounded-lg border p-6 text-center text-sm flex flex-col items-center justify-center h-64">
                          <Camera className="size-12 mb-2 opacity-50" />
                          <div>Click on a post from {countryName} to see details.</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Comments</CardTitle>
                      <CardDescription>Discussion thread</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedNews && countryNews.some(e => e._id === selectedNewsId) ? (
                        <ScrollArea className="h-96 lg:h-[700px] pr-3">
                          <div className="grid gap-3">
                            {selectedNewsComments.map((c) => (
                              <div key={c._id}>
                                <div className="rounded-md border p-3">
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="text-sm font-medium">
                                      {c.author}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-muted-foreground text-xs">
                                        {format(parseISO(c.dateISO), "MMM d")}
                                      </div>
                                      {isAdmin && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                          onClick={() => {
                                            if (confirm("Delete this comment?")) {
                                              deleteComment({ commentId: c._id });
                                            }
                                          }}
                                        >
                                          <Trash2 className="size-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-sm mb-2">{renderCommentText(c.text)}</div>
                                  <div className="flex gap-1 flex-wrap">
                                    <ReactionButton
                                      icon={<ThumbsUp className="size-3" />}
                                      label="Like"
                                      count={c.reactions?.like || 0}
                                      isActive={getUserReaction(c._id, "comment") === "like"}
                                      onClick={() => applyCommentReaction(c._id, "like")}
                                    />
                                    <ReactionButton
                                      icon={<Smile className="size-3" />}
                                      label="Smile"
                                      count={c.reactions?.smile || 0}
                                      isActive={getUserReaction(c._id, "comment") === "smile"}
                                      onClick={() => applyCommentReaction(c._id, "smile")}
                                    />
                                    <ReactionButton
                                      icon={<Heart className="size-3" />}
                                      label="Heart"
                                      count={c.reactions?.heart || 0}
                                      isActive={getUserReaction(c._id, "comment") === "heart"}
                                      onClick={() => applyCommentReaction(c._id, "heart")}
                                    />
                                    <ReactionButton
                                      icon={<PartyPopper className="size-3" />}
                                      label="Yay"
                                      count={c.reactions?.celebrate || 0}
                                      isActive={getUserReaction(c._id, "comment") === "celebrate"}
                                      onClick={() => applyCommentReaction(c._id, "celebrate")}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-xs hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                      onClick={() => {
                                        const replyText = `@${c.author} `;
                                        setCommentDrafts((prev) => ({
                                          ...prev,
                                          [`news:${selectedNews._id}`]: replyText,
                                        }));
                                        setReplyingTo((prev) => ({
                                          ...prev,
                                          [`news:${selectedNews._id}`]: {
                                            commentId: c._id,
                                            author: c.author,
                                          },
                                        }));
                                        setActiveCommentInput(`news:${selectedNews._id}`);
                                      }}
                                    >
                                      <MessageCircle className="size-3 mr-1" />
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {selectedNewsComments.length === 0 && (
                              <div className="text-muted-foreground text-sm text-center py-8">
                                No comments yet
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-muted-foreground rounded-lg border p-6 text-center text-sm flex flex-col items-center justify-center h-64">
                          <Camera className="size-12 mb-2 opacity-50" />
                          <div>Click on a post from {countryName} to see comments.</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}



          <TabsContent value="tree" className="mt-4 outline-hidden">
            <div className="mb-6 space-y-6">
              {/* Premium Family Switcher */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select Family Hub</h3>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAddMode("family");
                        setIsAddDialogOpen(true);
                      }}
                      className="h-7 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Plus className="size-3 mr-1" />
                      New Family
                    </Button>
                  )}
                </div>

                {families.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-muted/20 text-center">
                    <Users className="size-12 mb-3 text-muted-foreground/30" />
                    <h4 className="text-lg font-bold mb-1">No Families Yet</h4>
                    <p className="text-sm text-muted-foreground mb-4 max-w-xs">Create your first family hub to start building your ancestry and sharing news.</p>
                    {isAdmin && (
                      <Button onClick={() => { setAddMode("family"); setIsAddDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Family
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {families.map((family) => (
                      <div
                        key={family._id}
                        onClick={() => setSelectedFamilyId(family._id)}
                        className={cn(
                          "flex-none w-48 group relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-lg",
                          selectedFamilyId === family._id
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                            : "border-transparent bg-card hover:border-border"
                        )}
                      >
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="relative">
                            <div className={cn(
                              "size-16 overflow-hidden rounded-full border-2 transition-transform duration-500 group-hover:scale-110 shadow-md",
                              selectedFamilyId === family._id ? "border-primary" : "border-muted"
                            )}>
                              <img
                                src={family.imageUrl || "/placeholder.svg"}
                                alt={family.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            {selectedFamilyId === family._id && (
                              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg border-2 border-background">
                                <CheckCircle2 className="size-3" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="font-extrabold text-sm truncate w-full px-2">{family.name}</div>
                            <div className="text-[10px] font-bold text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                              {familyNodes.length > 0 && selectedFamilyId === family._id ? `${familyNodes.length} members` : "Hub"}
                            </div>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-7 w-7 rounded-full shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingFamily(family._id);
                                setNewFamily({
                                  name: family.name,
                                  slug: family.slug?.current || "",
                                  imageUrl: family.imageUrl || "",
                                });
                              }}
                            >
                              <Edit className="size-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-7 w-7 rounded-full shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`DANGER: This will delete the family "${family.name}". All its members will also be removed. Continue?`)) {
                                  deleteFamily({ id: family._id, name: family.name });
                                }
                              }}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-[7fr_3fr] lg:grid-cols-[7fr_3fr] min-h-[calc(100vh-300px)]">
              <Card className="flex flex-col overflow-hidden">
                <CardHeader>
                  <CardTitle>{query.trim() ? "Search Results" : "Family Tree Diagram"}</CardTitle>
                  <CardDescription>
                    {query.trim()
                      ? `Found ${filteredPeople.length} people match "${query}"`
                      : "Interactive family tree with expandable nodes"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full w-full">
                    {query.trim() ? (
                      <div className="grid gap-2 pr-3">
                        {filteredPeople.map((p) => (
                          <div
                            key={p._id}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors shadow-sm",
                              selectedPersonId === p._id
                                ? "bg-primary/10 border-primary ring-1 ring-primary/20"
                                : "hover:bg-accent/50 border-border"
                            )}
                            onClick={() => setSelectedPersonId(p._id)}
                          >
                            <div className="size-10 overflow-hidden rounded-full border bg-muted shadow-inner">
                              <img
                                src={p.imageUrl || "/placeholder.svg"}
                                alt={p.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold truncate text-sm">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                {p.birthYear && (
                                  <>
                                    <span>Born {p.birthYear}</span>
                                    {p.gender && <span className="text-muted-foreground/30">•</span>}
                                  </>
                                )}
                                {p.gender && (
                                  <span className="capitalize">{p.gender}</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "size-4 text-muted-foreground/30",
                              selectedPersonId === p._id && "text-primary"
                            )} />
                          </div>
                        ))}
                        {filteredPeople.length === 0 && (
                          <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-muted">
                            <Search className="size-8 mx-auto mb-3 text-muted-foreground/20" />
                            <p className="text-base font-medium text-muted-foreground">
                              No people match "{query}"
                            </p>
                            <p className="text-sm text-muted-foreground/60 mt-1">
                              Try a different name or detail.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full overflow-x-auto pb-4 flex justify-center">
                        <div className="min-w-fit scale-[0.8] xs:scale-[0.9] sm:scale-100 origin-center pl-4 pr-8">
                          {familyTree ? (
                            <DiagramTreeNode
                              node={familyTree}
                              expanded={expanded}
                              selectedId={selectedPersonId}
                              onToggle={(id) =>
                                setExpanded((prev) => ({
                                  ...prev,
                                  [id]: !prev[id],
                                }))
                              }
                              onSelect={setSelectedPersonId}
                              level={0}
                            />
                          ) : (
                            <div className="text-muted-foreground text-center py-8">
                              {familyNodes.length === 0
                                ? "Loading family tree..."
                                : "No family tree data available"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Person details</CardTitle>
                  <CardDescription>
                    Select a person node to see details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {selectedPerson ? (
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <div className="bg-muted size-12 overflow-hidden rounded-full border">
                          <img
                            src={selectedPerson.imageUrl || "/placeholder.svg"}
                            alt={selectedPerson.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-muted-foreground text-xs">
                            Selected Member
                          </div>
                          <div className="truncate text-base font-bold">
                            {selectedPerson.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            {selectedPerson.birthYear && (
                              <span className="flex items-center gap-1">
                                <Calendar className="size-2.5" />
                                Born {selectedPerson.birthYear}
                              </span>
                            )}
                            {selectedPerson.gender && (
                              <>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="capitalize">{selectedPerson.gender}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingPerson(selectedPerson.id);
                                const node = familyNodes.find(
                                  (n) => n._id === selectedPerson.id
                                );
                                if (node) {
                                  setNewPerson({
                                    name: node.name,
                                    birthYear: node.birthYear?.toString() || "",
                                    note: node.note || "",
                                    imageUrl: node.imageUrl || "",
                                    familyId: node.familyId,
                                    parentId: node.parentId || "",
                                    fatherId: node.fatherId || "",
                                    motherId: node.motherId || "",
                                    gender: node.gender || "",
                                  });
                                }
                              }}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                if (confirm("Delete this family member?")) {
                                  const node = familyNodes.find(
                                    (n) => n._id === selectedPerson.id
                                  );
                                  if (node) {
                                    await deleteFamilyMember({ id: node._id });
                                    setSelectedPersonId(null);
                                  }
                                }
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-3 border-b pb-2">
                          Relationships
                        </div>
                        <div className="grid gap-4">
                          {/* Parents */}
                          {selectedPerson.parents.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Parents</div>
                              <div className="grid gap-2">
                                {selectedPerson.parents.map((p: any) => (
                                  <button
                                    key={p._id}
                                    onClick={() => setSelectedPersonId(p._id)}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border group"
                                  >
                                    <div className="size-8 rounded-full overflow-hidden border bg-muted">
                                      <img
                                        src={p.imageUrl || "/placeholder.svg"}
                                        alt={p.name}
                                        className="size-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg";
                                        }}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-sm font-medium group-hover:text-primary transition-colors">{p.name}</div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {p.gender === 'male' ? 'Father' : p.gender === 'female' ? 'Mother' : 'Parent'}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Spouses/Partners */}
                          {selectedPerson.spouses.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Spouse / Partner</div>
                              <div className="grid gap-2">
                                {selectedPerson.spouses.map((p: any) => (
                                  <button
                                    key={p._id}
                                    onClick={() => setSelectedPersonId(p._id)}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border group"
                                  >
                                    <div className="size-8 rounded-full overflow-hidden border bg-muted">
                                      <img
                                        src={p.imageUrl || "/placeholder.svg"}
                                        alt={p.name}
                                        className="size-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg";
                                        }}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-sm font-medium group-hover:text-primary transition-colors">{p.name}</div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {p.gender === 'male' ? 'Husband' : p.gender === 'female' ? 'Wife' : 'Partner'}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Siblings */}
                          {selectedPerson.siblings.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Siblings</div>
                              <div className="grid gap-2">
                                {selectedPerson.siblings.map((p: any) => (
                                  <button
                                    key={p._id}
                                    onClick={() => setSelectedPersonId(p._id)}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border group"
                                  >
                                    <div className="size-8 rounded-full overflow-hidden border bg-muted">
                                      <img
                                        src={p.imageUrl || "/placeholder.svg"}
                                        alt={p.name}
                                        className="size-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg";
                                        }}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-sm font-medium group-hover:text-primary transition-colors">{p.name}</div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {p.gender === 'male' ? 'Brother' : p.gender === 'female' ? 'Sister' : 'Sibling'}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Children */}
                          {selectedPerson.children.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Children</div>
                              <div className="grid gap-2">
                                {selectedPerson.children.map((p: any) => (
                                  <button
                                    key={p._id}
                                    onClick={() => setSelectedPersonId(p._id)}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border group"
                                  >
                                    <div className="size-8 rounded-full overflow-hidden border bg-muted">
                                      <img
                                        src={p.imageUrl || "/placeholder.svg"}
                                        alt={p.name}
                                        className="size-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg";
                                        }}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-sm font-medium group-hover:text-primary transition-colors">{p.name}</div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {p.gender === 'male' ? 'Son' : p.gender === 'female' ? 'Daughter' : 'Child'}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground text-xs">
                          Notes
                        </div>
                        <div className="mt-1 text-sm">
                          {selectedPerson.note ?? "—"}
                        </div>
                      </div>

                      <Separator />

                      <div className="text-muted-foreground text-xs">
                        Tip: Click on any family member above to jump to their details.
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground rounded-lg border p-6 text-center text-sm">
                      Select a person from the tree.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div >
      {
        tab !== "tree" && (
          <div className="pb-4">
            <Footer />
          </div>
        )
      }
    </div >
  );
}