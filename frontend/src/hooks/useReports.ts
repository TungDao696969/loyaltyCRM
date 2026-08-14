import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';

export function useReports() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['dashboard-report'],
    queryFn: () => reportService.getDashboardReport(),
  });

  return { report, isLoading };
}
