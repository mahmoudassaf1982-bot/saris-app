import { LucideIcon, Globe, FileText, Dna, AlertTriangle, FileBarChart } from "lucide-react";

interface StubProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const AdminStub = ({ title, description, icon: Icon }: StubProps) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 rounded-2xl bg-saris-navy/10 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-saris-navy" />
    </div>
    <h1 className="font-tajawal font-black text-2xl text-saris-text mb-1">{title}</h1>
    <p className="font-tajawal text-sm text-saris-text-2 text-center max-w-sm">{description}</p>
    <p className="font-tajawal text-xs text-saris-text-3 mt-4">🚧 قيد التطوير</p>
  </div>
);

export const AdminCountries = () => <AdminStub title="إدارة الدول" description="إضافة وتعديل الدول والاختبارات المتاحة لكل دولة" icon={Globe} />;
export const AdminContent = () => <AdminStub title="إدارة المحتوى" description="إدارة المحتوى التعليمي والشروحات" icon={FileText} />;
export const AdminExamProfiles = () => <AdminStub title="ملفات الاختبارات" description="إعدادات ملفات الاختبارات النفسية والتعليمية" icon={Dna} />;
export const AdminGenerationAlerts = () => <AdminStub title="تنبيهات التوليد" description="تنبيهات حول مشاكل وأخطاء في عملية توليد الأسئلة" icon={AlertTriangle} />;
export const AdminGenerationReport = () => <AdminStub title="تقرير التوليد" description="تقارير تفصيلية عن عمليات توليد الأسئلة بالذكاء الاصطناعي" icon={FileBarChart} />;
export const AdminDNABuilder = () => <AdminStub title="بناء DNA الاختبار" description="بناء وتعديل الملفات النفسية للاختبارات — المزيج المعرفي، كثافة الأفخاخ، عمق الاستدلال" icon={Dna} />;
