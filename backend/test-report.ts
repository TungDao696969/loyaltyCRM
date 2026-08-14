import { reportService } from "./src/services/report.service";

async function test() {
  try {
    const report = await reportService.getDashboardReport();
    console.log(JSON.stringify(report.stores, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
