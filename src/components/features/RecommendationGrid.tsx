/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Static recommendation list
 * OUTPUT: Recommendation grid
 * POS: Feature Component
 * CONTRACT: Displays curated content cards for secondary engagement.
 * 职责: 推荐内容网格与二级引流。
 */
import Image from 'next/image';
import Container from '../layout/Container';
import Link from 'next/link';

const recommendations = [
  {
    id: 1,
    title: "Perfect questions to ask on a first date",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=800",
    tag: "Dating"
  },
  {
    id: 2,
    title: "How to make the first move on Globol",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800",
    tag: "App Tips"
  },
  {
    id: 3,
    title: "5 signs they're into you",
    image: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800",
    tag: "Relationships"
  },
  {
    id: 4,
    title: "Best profile bio ideas for 2026",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
    tag: "Profile"
  }
];

export default function RecommendationGrid() {
  return (
    <section className="bg-yellow-50 py-20">
      <Container>
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-gray-900">
          More from The Buzz
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((item) => (
            <Link key={item.id} href="#" className="group block">
              <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold uppercase tracking-wider text-navy-dark/60">{item.tag}</span>
                 <h3 className="font-sans font-bold text-lg leading-tight text-navy-dark group-hover:underline decoration-2 underline-offset-4">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
