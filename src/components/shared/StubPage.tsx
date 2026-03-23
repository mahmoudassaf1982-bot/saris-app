import { Construction } from "lucide-react";

interface StubPageProps {
  title: string;
  description?: string;
}

const StubPage = ({ title, description }: StubPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-saris-full bg-saris-bg-soft flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-saris-navy" />
      </div>
      <h1 className="font-tajawal font-bold text-xl text-saris-text mb-2">{title}</h1>
      <p className="font-tajawal text-sm text-saris-text-2">
        {description || "هذه الصفحة قيد التطوير وستكون متاحة قريبًا"}
      </p>
    </div>
  );
};

export default StubPage;
