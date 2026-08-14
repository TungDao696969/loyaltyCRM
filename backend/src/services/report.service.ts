import prisma from "../prisma";

export class ReportService {
  async getDashboardReport() {
    // 1. Customer Analytics
    const totalCustomers = await prisma.customer.count({
      where: { is_deleted: false }
    });

    const activeCustomers = await prisma.customer.count({
      where: { is_deleted: false, status: 'active' }
    });

    const tiersData = await prisma.customer.groupBy({
      by: ['current_tier_id'],
      _count: {
        customer_id: true,
      },
    });

    const allTiers = await prisma.customerTier.findMany();
    const tierDistribution = tiersData.map(t => {
      const tierInfo = allTiers.find(tier => tier.tier_id === t.current_tier_id);
      return {
        name: tierInfo ? tierInfo.tier_name : 'No Tier',
        value: t._count.customer_id
      };
    });

    // 2. Points Analytics
    const pointTransactions = await prisma.pointTransaction.findMany();
    let totalEarned = 0;
    let totalRedeemed = 0;

    pointTransactions.forEach(tx => {
      if (tx.transaction_type === 'EARN') {
        totalEarned += Number(tx.points);
      } else if (tx.transaction_type === 'REDEEM') {
        totalRedeemed += Number(tx.points);
      }
    });

    // 3. Campaign Reports
    const totalCampaigns = await prisma.campaign.count();
    const sentCampaigns = await prisma.campaign.count({
      where: { status: 'sent' }
    });

    // 4. Store Performance (Top 5 by Transaction count)
    const storeTransactions = await prisma.pointTransaction.groupBy({
      by: ['store_id'],
      where: {
        store_id: { not: null },
        transaction_type: 'EARN'
      },
      _count: {
        transaction_id: true
      },
      _sum: {
        order_amount: true
      },
      orderBy: {
        _sum: {
          order_amount: 'desc'
        }
      },
      take: 5
    });

    const allStores = await prisma.store.findMany();
    const storePerformance = storeTransactions.map(st => {
      const storeInfo = allStores.find(s => s.id === st.store_id);
      return {
        store_name: storeInfo ? storeInfo.storeName : 'Unknown Store',
        transaction_count: st._count.transaction_id,
        total_revenue: Number(st._sum.order_amount || 0)
      };
    });

    return {
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        tier_distribution: tierDistribution
      },
      points: {
        total_earned: totalEarned,
        total_redeemed: totalRedeemed,
        outstanding: totalEarned - totalRedeemed
      },
      campaigns: {
        total: totalCampaigns,
        sent: sentCampaigns
      },
      stores: {
        top_performers: storePerformance
      }
    };
  }
}

export const reportService = new ReportService();
