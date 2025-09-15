import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { use, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DataTable } from "@/components/blocks/data-table";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth-context";

export default function Dashboard() {
  const fetchWithAuth = useFetchWithAuth();
  const { accessToken } = useAuthContext();
  const [tableData, setTableData] = useState<any[]>([]);

  const navigate = useNavigate();

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
      if (!accessToken) navigate("/login");
      const res = await fetchWithAuth(`${config.apiUrl}/library/user`);
      if (!res.ok) {
        console.error("Failed to fetch data");
        return;
      }
      const result = await res.json();
      return setTableData(transformData(result));
    }
    fetchData();
  }, []);

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
          header="Books"
          title="GitHub"
          link="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
        />
        <div className="flex flex-1 flex-col px-4">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={tableData}
                caption="A list of your recent books."
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
