import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DataTable } from "@/components/blocks/data-table";

export default function Dashboard() {
  const [user, _] = useLocalStorage("user", null);
  const [tableData, setTableData] = useState<any[]>([]);

  const transformData = (data: any[]) => {
    return data.map((item) => ({
      id: item.id,
      header: item.title,
      reviewer: item.author,
      type: "Cover page",
      status: "",
      target: "",
      limit: "",
    }));
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/library/user/${user.email}`
      );
      const result = await res.json();
      return setTableData(transformData(result));
    }
    fetchData();
  }, [tableData]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          header="Documents"
          title="GitHub"
          link="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
        />
        <div className="flex flex-1 flex-col px-4">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={tableData}
                caption="A list of your recent invoices."
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
