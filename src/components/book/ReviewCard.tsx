import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => (
  <div className="p-4 bg-white border shadow-sm rounded-2xl">
    <p className="font-bold">{review.user.name}</p>
    <p className="text-sm text-gray-500">
      {new Date(review.createdAt).toLocaleDateString()}
    </p>
    <div className="mt-2 text-yellow-500">{"★".repeat(review.star)}</div>
    <p className="mt-2">{review.comment}</p>
  </div>
);