
export type WishStatus = 'pending' | 'fulfilled' | 'archived';

export type Wish = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status?: WishStatus; // optional for backward compatibility
  fulfilled?: boolean;
  fulfilledBy?: string | null;
  likes?: number;
  comments?: number;
  avatarUrl?: string;
};

export type Comment = {
  id: string;
  wishId: string;
  user: string;
  text: string;
  createdAt: number;
};
