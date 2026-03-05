import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-[4/5] w-full bg-secondary" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-secondary rounded" />
        <div className="h-4 w-full bg-secondary rounded" />
        <div className="h-4 w-2/3 bg-secondary rounded" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-secondary rounded" />
          <div className="h-3 w-24 bg-secondary rounded" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-10 w-full bg-secondary rounded-md" />
      </CardFooter>
    </Card>
  );
}
