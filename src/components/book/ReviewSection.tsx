import { Review } from '@/types';
import { ReviewCard } from './ReviewCard';

export const ReviewSection = ({ reviews }: { reviews: Review[] }) => {
  return (
    <section className="w-full flex flex-col gap-[20px]">
      <h2 className="text-[36px] font-bold text-[#0A0D12]">Review</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};