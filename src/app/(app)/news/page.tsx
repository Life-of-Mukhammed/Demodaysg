import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { Newspaper, ExternalLink, Sparkles } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import Image from 'next/image';

export default async function NewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const items = await prisma.newsItem.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  });

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <PageHeader
        eyebrow="News"
        icon={<Newspaper />}
        title="Yangiliklar va e'lonlar"
        subtitle="Platforma yangiliklari, startup ekotizimi va sanoat trendlari"
      />

      {items.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5">
              <Newspaper className="w-9 h-9 text-primary" />
            </div>
            <h3 className="font-display text-2xl tracking-tight">Hozircha yangilik yo'q</h3>
            <p className="text-sm text-muted-foreground mt-2">Tezda paydo bo'ladi</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <Card className="soft-shadow overflow-hidden group hover:elevated-shadow transition">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 overflow-hidden">
                  {featured.imageUrl ? (
                    <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-20 h-20 text-white/40" />
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="gradient" className="text-[10px]">Featured</Badge>
                    <Badge variant="outline" className="text-[10px]">{featured.source}</Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(featured.publishedAt)}</span>
                  </div>
                  <h2 className="font-display text-3xl tracking-tight mb-3 group-hover:text-primary transition">
                    {featured.url ? (
                      <a href={featured.url} target="_blank" className="inline-flex items-center gap-2">
                        {featured.title} <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    ) : featured.title}
                  </h2>
                  {featured.summary && <p className="text-sm text-muted-foreground leading-relaxed">{featured.summary}</p>}
                </div>
              </div>
            </Card>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((n) => (
              <Card key={n.id} className="soft-shadow group hover:elevated-shadow hover:-translate-y-0.5 transition cursor-pointer">
                <CardContent className="p-0">
                  {n.imageUrl && (
                    <div className="relative h-44 overflow-hidden rounded-t-xl">
                      <Image src={n.imageUrl} alt={n.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px]">{n.source}</Badge>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(n.publishedAt)}</span>
                    </div>
                    <h3 className="font-display text-xl tracking-tight group-hover:text-primary transition leading-tight">
                      {n.url ? (
                        <a href={n.url} target="_blank" className="inline-flex items-center gap-1.5">
                          {n.title} <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      ) : n.title}
                    </h3>
                    {n.summary && <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{n.summary}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
