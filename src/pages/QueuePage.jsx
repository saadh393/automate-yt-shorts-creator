import PageBreadcumb from "@/components/page-breadcumb";
import PageHeader from "@/components/page-header";
import QueuePageManager from "@/components/pages/queue-page-manager";

export default function QueuePage() {
  return (
    <div>
      <PageBreadcumb page="Queue" />
      <div className="py-6 max-w-2xl mx-auto">
        <PageHeader title="Queue" />
        <QueuePageManager />
      </div>
    </div>
  );
}
