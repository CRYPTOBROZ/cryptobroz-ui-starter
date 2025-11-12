import { Portfolio } from '@/components/Portfolio';

export default function PortfolioPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full px-4">
        <Portfolio />
      </div>
    </div>
  );
}
