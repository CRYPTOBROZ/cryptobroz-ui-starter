import { SendMoney } from '@/components/SendMoney';

export default function SendPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full px-4">
        <SendMoney />
      </div>
    </div>
  );
}
